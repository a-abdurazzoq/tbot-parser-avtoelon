import fetch from 'node-fetch';
import {IAutoElonRepo, IResponseDataPhoneNumber} from "../interfaces/repositories/AutoElon";

export default class AutoElonRepo implements IAutoElonRepo {
    async getHtmlPageAboutAutomobile(url: string): Promise<string> {
        let responseHtmlPageAboutAutomobile = await fetch(url);

        if (responseHtmlPageAboutAutomobile.status >= 400)
            return ""

        return responseHtmlPageAboutAutomobile.text()
    }

    async getPhoneNumberHolderAutomobile(id: string): Promise<string> {
        let phoneNumber = ""

        let responsePhoneNumber = await fetch(`https://avtoelon.uz/uz/a/ajaxPhones/?id=${id}`, {
            headers: {
                "x-requested-with": "XMLHttpRequest"
            }
        })

        if (responsePhoneNumber.status >= 400)
            return phoneNumber

        let dataPhoneNumber: IResponseDataPhoneNumber = await responsePhoneNumber.json()

        if (!this.isDataPhoneNumber(dataPhoneNumber))
            return phoneNumber

        return dataPhoneNumber.data.model.phone
    }

    isDataPhoneNumber(responseData: any): responseData is IResponseDataPhoneNumber {
        return typeof responseData?.data?.model?.phone === "string"
    }
};