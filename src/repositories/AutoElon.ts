import fetch from 'node-fetch';
import {IAutoElonRepo, IResponseDataPhoneNumber} from "../interfaces/repositories/AutoElon";

export default class AutoElonRepo implements IAutoElonRepo {
    async getHtmlPageAboutAutomobile(url: string): Promise<string> {
        let responseHtmlPageAboutAutomobile = await fetch(url, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uz;q=0.6",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "_ym_uid=16484073381025157216; _ym_d=1661076207; ssaid=7e02c820-adff-11ec-aa49-5d68147725ca; _gid=GA1.2.1260718621.1670268360; _gcl_au=1.1.1567596598.1670268360; _ym_isad=1; user-currency=1; site-language=uz; uzssid=q8mpekurm2isr5uiubouhipggd; kluz_cdn_host=//alaps-kz.kcdn.online; uzk=T5R1sdEDZA8zHir5afbn1s7oIgStVlP4zsT2%2Bml%2BIAQPCV5AI%2BCBeJeW7gQ%2BdkVmWawWZnBRnjwpqgOtblBAtWJKdAOOLI6vkrFsIADlNawp%2BqkL5voPaTQ2wZy3Xnif; ssid=q8mpekurm2isr5uiubouhipggd; is_returning=1; _ym_visorc=w; _ga_6QV3MG8FYM=GS1.1.1670276955.5.1.1670277120.40.0.0; __tld__=null; _ga=GA1.2.1354171625.1661076207",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        });

        if (responseHtmlPageAboutAutomobile.status >= 400)
            return ""

        return responseHtmlPageAboutAutomobile.text()
    }

    async getPhoneNumberHolderAutomobile(id: string): Promise<string> {
        let phoneNumber = ""

        let responsePhoneNumber = await fetch(`https://avtoelon.uz/uz/a/ajaxPhones/?id=2813324`, {
            "headers": {
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