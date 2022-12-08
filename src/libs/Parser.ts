import {IParserAutoElon, IPostAutomobile} from "../interfaces/libs/Parser";
import {parse as parseHTMLElement, HTMLElement} from 'node-html-parser';
import {IAutoElonRepo} from "../interfaces/repositories/AutoElon";
import {parseName, parsePosition, rewritePrice} from "../helper/ParseText";
import {IKeyToPostAutoElon, IPathToPostAutoElon} from "../interfaces/Constants";
import {PathToSpecificationAutomobile} from "../constants/html-paths";

export default class Parser implements IParserAutoElon {
    constructor(
        private autoElonRepo: IAutoElonRepo,
        private pathToDataPostAutoElon: IPathToPostAutoElon,
        private keyToPostAutoElon: IKeyToPostAutoElon
    ) {
    }

    public async getDescriptionAutomobileObject(url: string): Promise<IPostAutomobile> {
        let htmlString = await this.getHtml(url)
        let html = this.parseHtml(htmlString)
        let dataAutomobile = this.getDataAutomobileFromHtml(html)

        dataAutomobile.phoneNumber = await this.getPhoneNumberHolderAutomobile(url)

        return dataAutomobile;
    }

    private getHtml(url: string): Promise<string> {
        return this.autoElonRepo.getHtmlPageAboutAutomobile(url)
    }

    private parseHtml(stringHTML: string): HTMLElement {
        return parseHTMLElement(stringHTML)
    }

    public getDataAutomobileFromHtml(html: HTMLElement): IPostAutomobile {
        let specificationAutomobile = this.getSpecificationAutomobile(html)

        let dataAboutAutomobile: IPostAutomobile = {
            transmission: specificationAutomobile[this.keyToPostAutoElon.transmission],
            mileage: specificationAutomobile[this.keyToPostAutoElon.mileage],
            address: specificationAutomobile[this.keyToPostAutoElon.address],
            color: specificationAutomobile[this.keyToPostAutoElon.color],
            year: specificationAutomobile[this.keyToPostAutoElon.year],
            body: specificationAutomobile[this.keyToPostAutoElon.body],
            driverUnit: this.getDriverUnit(specificationAutomobile[this.keyToPostAutoElon.driverUnit]),
            engineSize: this.getEngineSize(specificationAutomobile[this.keyToPostAutoElon.engineSize]),
            fuelType: this.getFuelType(specificationAutomobile[this.keyToPostAutoElon.fuelType]),
            condition: this.getConditionFromHtml(html),
            position: this.getPositionFromHtml(html),
            price: this.getPriceFromHtml(html),
            name: this.getNameFromHtml(html),
            images: this.getImagesURL(html),
            phoneNumber: ""
        }

        return dataAboutAutomobile
    }

    private getSpecificationAutomobile(html: HTMLElement) {
        const htmlSpecification = html.querySelector(PathToSpecificationAutomobile)

        return this.parseSpecificationAutomobile(htmlSpecification)
    }

    private parseSpecificationAutomobile(htmlSpecification: HTMLElement | null): { [key: string]: string } {
        const specification: { [key: string]: string } = {}

        if (!htmlSpecification) return specification

        let childNodes = htmlSpecification.querySelectorAll("dt, dd")

        for (let i = 0; i < childNodes.length; i += 2) {
            let keyHtmlEl = childNodes[i]
            let valueHtmlEl = childNodes[i + 1]
            specification[keyHtmlEl.innerText.trim()] = valueHtmlEl.innerText.trim()
        }

        return specification
    }

    private getDataFromHtml(path: string, html: HTMLElement): string {
        let data = html.querySelector(path)?.innerText

        if (typeof data !== "string" && !data)
            data = ""

        return data.trim()
    }

    private getNameFromHtml(html: HTMLElement): string {
        let name = this.getDataFromHtml(this.pathToDataPostAutoElon.name, html)

        return parseName(name)
    }

    private getPositionFromHtml(html: HTMLElement): string {
        let position = this.getDataFromHtml(this.pathToDataPostAutoElon.position, html)

        return parsePosition(position)
    }

    private getEngineSize(engineSize: string) {
        if (typeof engineSize !== "string") return ""

        return engineSize.replace(/[^0-9.]+/, "")
    }

    private getFuelType(fuelType: string) {
        if (typeof fuelType !== "string") return ""

        return fuelType.replace(/[0-9.\(\)]+/g, "")
    }

    private getDriverUnit(driverUnit: string) {
        if (typeof driverUnit !== "string") return ""

        return driverUnit.replace(/To&#039;liq/g, "Orqa va oldi")
    }

    private getConditionFromHtml(html: HTMLElement): string {
        return "Yaxshi"
    }

    private getPriceFromHtml(html: HTMLElement): string {
        let price = this.getDataFromHtml(this.pathToDataPostAutoElon.price, html)

        return rewritePrice(price)
    }

    private getImagesURL(html: HTMLElement): string[] {
        let imagesHTMLElement = html.querySelectorAll(this.pathToDataPostAutoElon.images)
        let imagesURL = imagesHTMLElement.map(elem => elem.getAttribute("href") || "").filter(url => !!url)
        
        if(!imagesURL.length)
            imagesURL = this.getImageURL(html)
        
        return imagesURL
    }

    private getImageURL(html: HTMLElement) {
        let imageURL = ""
        let imageHTMLElement = html.querySelector(this.pathToDataPostAutoElon.image)
        
        if(imageHTMLElement)
            imageURL = imageHTMLElement.getAttribute("href") || ""

        return imageURL ? [imageURL] : []
    }

    private async getPhoneNumberHolderAutomobile(url: string): Promise<string> {
        let id = url.split("/").at(-1)

        if (typeof id !== "string") return ""

        return this.autoElonRepo.getPhoneNumberHolderAutomobile(id)
    }
}