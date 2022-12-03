import {IParserAutoElon, IPostAutomobile} from "../interfaces/Parser";
import {parse as parseHTMLElement, HTMLElement} from 'node-html-parser';
import {PathToDataPostAutoElon} from "../constants/html-paths";
import {IAutoElonRepo} from "../interfaces/repositories/AutoElon";
import {parseName, parsePosition, rewritePrice} from "../helper/ParseText";

export default class Parser implements IParserAutoElon{
    constructor(
       private autoElonRepo: IAutoElonRepo
    ) {}


    public getDescriptionAutomobileText(url: string): string {

        return "";
    }
    public async getDescriptionAutomobileObject(url: string): Promise<IPostAutomobile> {
        let htmlString = await this.getHtml(url)
        let html = this.parseHtml(htmlString)
        let dataAutomobile = this.getDataAutomobileFromHtml(html)

        return dataAutomobile;
    }

    private convertToText() {

    }

    private getHtml(url: string): Promise<string> {
        return this.autoElonRepo.getHtmlPageAboutAutomobile(url)
    }

    private parseHtml(stringHTML: string): HTMLElement {
        return parseHTMLElement(stringHTML)
    }

    public getDataAutomobileFromHtml(html: HTMLElement): IPostAutomobile {
        let dataAboutAutomobile: IPostAutomobile = {
            name: this.getNameFromHtml(html),
            year: this.getYearFromHtml(html),
            position: this.getPositionFromHtml(html),
            mileage: this.getMileageFromHtml(html),
            condition: this.getConditionFromHtml(html),
            color: this.getColorFromHtml(html),
            engineSize: this.getEngineSizeFromHtml(html),
            fuelType: this.getFuelTypeFromHtml(html),
            price: this.getPriceFromHtml(html),
            phoneNumber: this.getPositionFromHtml(html),
            address: this.getAddressFromHtml(html)
        }

        return dataAboutAutomobile
    }

    private getDataFromHtml(path: string, html: HTMLElement): string {
        let data = html.querySelector(path)?.innerText

        if(typeof data !== "string" && !data)
            data = ""

        return data.trim()
    }

    private getNameFromHtml(html: HTMLElement): string {
        let name = this.getDataFromHtml(PathToDataPostAutoElon.name, html)

        return parseName(name)
    }

    private getAddressFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(PathToDataPostAutoElon.address, html)
    }

    private getYearFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(PathToDataPostAutoElon.year, html)
    }

    private getPositionFromHtml(html: HTMLElement): string {
        let position = this.getDataFromHtml(PathToDataPostAutoElon.position, html)
        return parsePosition(position)

    }

    private getMileageFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(PathToDataPostAutoElon.mileage, html)
    }

    private getConditionFromHtml(html: HTMLElement): string {
        return "Yaxshi"
    }

    private getColorFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(PathToDataPostAutoElon.color, html)
    }

    private getEngineSizeFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(PathToDataPostAutoElon.engineSize, html)
    }

    private getFuelTypeFromHtml(html: HTMLElement): string {
        return this.getDataFromHtml(PathToDataPostAutoElon.fuelType, html)
    }

    private getPriceFromHtml(html: HTMLElement): string {
        let price = this.getDataFromHtml(PathToDataPostAutoElon.price, html)

        return rewritePrice(price)
    }
}