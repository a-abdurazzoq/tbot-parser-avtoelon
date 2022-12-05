import Parser from "./libs/Parser";
import AutoElonRepo from "./repositories/AutoElon";
import {KeyToDataPostAutoElon, PathToDataPostAutoElon} from "./constants/html-paths";
import Telegram from "./libs/Telegram";
import TelegramClient from "./clients/Telegram";
import {keySpecificationAutomobile, TelegramBot} from "./constants/telegram-data";
import getUrlsFromTxt from "./helper/GetUrlFromTxt";
import {IPostAutomobile} from "./interfaces/libs/Parser";


(async () => {
    let urls = getUrlsFromTxt()

    let autoElonRepo = new AutoElonRepo()
    let telegramClient = new TelegramClient(TelegramBot)
    let parser = new Parser(autoElonRepo, PathToDataPostAutoElon, KeyToDataPostAutoElon);
    let telegram = new Telegram(telegramClient, keySpecificationAutomobile)

    for (let i = 0; i < urls.length; i++) {
        try {
            let data: IPostAutomobile = await parser.getDescriptionAutomobileObject(urls[i]);

            await telegram.sendDataAboutAutomobile(data)

            console.log(i + 1, data.name, data.position, data.price)
        } catch (e) {
            console.log(i, e)
        }


    }
})()