import {IRequestDataTelegram, ITelegram} from "../interfaces/libs/Telegram";
import {IPostAutomobile} from "../interfaces/libs/Parser";
import {ITelegramClient} from "../interfaces/clients/Telegram";
import {IKeySpecificationAutomobile} from "../interfaces/Constants";

export default class Telegram implements ITelegram {
    private text: string = ""

    constructor(
        private telegramClient: ITelegramClient,
        private keySpecificationAutomobile: any
    ) {
    }

    public async sendDataAboutAutomobile(dataAutomobile: IPostAutomobile): Promise<void> {
        this.setTextAboutAutomobile(dataAutomobile)

        const requestsData = this.getGroupedByImagesForRequestData(dataAutomobile)

        for await (let requestData of requestsData) {
            await this.telegramClient.sendDocumentsWithCaption(requestData)
        }

        return
    }

    private setTextAboutAutomobile(dataAutomobile: IPostAutomobile) {
        this.text = this.formulateTheText(dataAutomobile)
    }

    private formulateTheText(dataAutomobile: any) {
        let text = `${dataAutomobile.name}\n\nMoshinangizni sotishga yordam beramiz bizga murojat qiling\n\nEgasi bilib qoysin\nYaxshi narx bolsa + belgisini\nQimat narx bolsa - belgisini\nkamentga yozib qoldiring\n\n`

        for (const key in this.keySpecificationAutomobile) {
            let value = this.keySpecificationAutomobile[key]
            if (dataAutomobile[value]) {
                text += `${key}: ${dataAutomobile[value]}\n`
            }
        }

        return text
    }

    private getGroupedByImagesForRequestData(dataAutomobile: IPostAutomobile): IRequestDataTelegram[] {
        const requestData: IRequestDataTelegram[] = [{
            media: []
        }];

        for (let i = 0; i < dataAutomobile.images.length; i++) {
            requestData[requestData.length - 1].media.push({
                type: "document",
                media: dataAutomobile.images[i],
                caption: i === dataAutomobile.images.length - 1 ? this.text : ""
            })

            if (!(i % 10) && i)
                requestData.push({
                    media: []
                })
        }
        return requestData
    }
}