import {IParserAutoElon, IPostAutomobile} from "../interfaces/libs/Parser";
import {parse as parseHTMLElement, HTMLElement} from 'node-html-parser';
import {IAutoElonRepo} from "../interfaces/repositories/AutoElon";
import {parseName, parsePosition, rewritePrice} from "../helper/ParseText";
import {IKeyToPostAutoElon, IPathToPostAutoElon} from "../interfaces/Constants";
import {PathToSpecificationAutomobile} from "../constants/html-paths";

export default class Parser implements IParserAutoElon {
    private regexpChevrolet: RegExp = /chevrolet/ig

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

        return {
            transmission: specificationAutomobile[this.keyToPostAutoElon.transmission],
            mileage: specificationAutomobile[this.keyToPostAutoElon.mileage],
            address: specificationAutomobile[this.keyToPostAutoElon.address],
            color: specificationAutomobile[this.keyToPostAutoElon.color],
            year: specificationAutomobile[this.keyToPostAutoElon.year],
            body: specificationAutomobile[this.keyToPostAutoElon.body],
            driverUnit: this.getDriverUnit(specificationAutomobile[this.keyToPostAutoElon.driverUnit]),
            engineSize: this.getEngineSize(specificationAutomobile[this.keyToPostAutoElon.engineSize]),
            fuelType: this.getFuelType(specificationAutomobile[this.keyToPostAutoElon.fuelType]),
            condition: this.getConditionFromHtml(),
            position: this.getPositionFromHtml(html),
            price: this.getPriceFromHtml(html),
            name: this.getNameFromHtml(html),
            description: this.getDescriptionFromHtml(html),
            images: this.getImagesURL(html),
            hashTags: this.getHashTags(html).join(" "),
            phoneNumber: ["+998"]
        }
    }

    private getHashTags(html: HTMLElement): string[] {
        let hashTags = []
        hashTags.push(this.getHashTagNameAutomobile(html))
        hashTags.push("#avtobrokeruz")
        return hashTags
    }

    private getHashTagNameAutomobile(html: HTMLElement): string {
        let name = this.getNameFromHtml(html)

        if (!this.isChevrolet(name))
            return ""

        let hashTags = [
            this.getNameOfAutomobileChevroletOnlyWithoutTextChevrolet(name),
            this.getOtherTagsWithNameAutomobile(name),
            this.getNameOfAutomobileChevrolet(name)
        ]

        return hashTags.join(" ")
    }

    private getNameOfAutomobileChevrolet(str: string) {
        let hashTagWithUnderLine = "#" + str.replace(/\d/g, "").trim().replace(/\s/g, "_").toLowerCase()
        let hasTagWithoutUnderLine = hashTagWithUnderLine.replace("_", "")

        return [...new Set([hashTagWithUnderLine, hasTagWithoutUnderLine])].join(" ")
    }

    private getNameOfAutomobileChevroletOnlyWithoutTextChevrolet(str: string) {
        let hashTagWithUnderLine = "#" + str.replace(this.regexpChevrolet, " ").trim().replace(" ", "_").toLowerCase()
        let hasTagWithoutUnderLine = hashTagWithUnderLine.replace("_", "").toLowerCase()
        let hasTagWithoutNumber = hashTagWithUnderLine.replace("_", "").replace(/\d/g, "").toLowerCase()

        return [...new Set([hasTagWithoutUnderLine, hashTagWithUnderLine, hasTagWithoutNumber])].join(" ")
    }

    private getOtherTagsWithNameAutomobile(name: string): string {
        let hashTagWithUnderLine = "#" + name
            .replace(this.regexpChevrolet, " ")
            .replace(/\d/g, "")
            .trim()
            .replace(" ", "_")
            .toLowerCase()

        let hasTagWithClub = `${hashTagWithUnderLine}_club`
        let hasTagWithClubWithoutUnderline = `${hashTagWithUnderLine}club`

        let hasTagWithPriceOf = `${hashTagWithUnderLine}_narxi`


        return [hasTagWithPriceOf, hasTagWithClubWithoutUnderline, hasTagWithClub].join(" ");
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

    private getDescriptionFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(this.pathToDataPostAutoElon.description, html)
    }

    private getPositionFromHtml(html: HTMLElement): string {
        let position = this.getDataFromHtml(this.pathToDataPostAutoElon.position, html)

        return parsePosition(position)
    }

    private getEngineSize(engineSize?: string): string {
        if (typeof engineSize !== "string") return ""

        return engineSize.replace(/[^0-9.]+/, "")
    }

    private getFuelType(fuelType?: string): string {
        if (typeof fuelType !== "string") return ""

        return fuelType.replace(/[0-9.\\]+/g, "")
    }

    private getDriverUnit(driverUnit?: string): string {
        if (typeof driverUnit !== "string") return ""

        return driverUnit.replace(/To&#039;liq/g, "Orqa va oldi")
    }

    private getConditionFromHtml(): string {
        return "Yaxshi"
    }

    private getPriceFromHtml(html: HTMLElement): string {
        let price = this.getDataFromHtml(this.pathToDataPostAutoElon.price, html)

        return rewritePrice(price)
    }

    private getImagesURL(html: HTMLElement): string[] {
        let imagesHTMLElement = html.querySelectorAll(this.pathToDataPostAutoElon.images)
        let imagesURL = imagesHTMLElement.map(elem => elem.getAttribute("href") || "").filter(url => !!url)

        if (!imagesURL.length)
            imagesURL = this.getImageURL(html)

        return imagesURL
    }

    private getImageURL(html: HTMLElement) {
        let imageURL = ""
        let imageHTMLElement = html.querySelector(this.pathToDataPostAutoElon.image)

        if (imageHTMLElement)
            imageURL = imageHTMLElement.getAttribute("href") || ""

        return imageURL ? [imageURL] : []
    }

    private async getPhoneNumberHolderAutomobile(url: string): Promise<string[]> {
        let id = url.split("/").at(-1)

        if (typeof id !== "string") return ["+998"]

        let phoneNumbers = await this.autoElonRepo.getPhoneNumberHolderAutomobile(id)

        return phoneNumbers.split(",")
    }

    private isChevrolet(string: string) {
        return this.regexpChevrolet.test(string)
    }

}