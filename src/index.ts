import Parser from "./libs/Parser";
import AutoElonRepo from "./repositories/AutoElon";
import {KeyToDataPostAutoElon, PathToDataPostAutoElon} from "./constants/html-paths";
import Telegram from "./libs/Telegram";
import TelegramClient from "./clients/Telegram";
import {keySpecificationAutomobile, TelegramBot} from "./constants/telegram-data";
import getUrlsFromTxt from "./helper/GetUrlFromTxt";
import {IPostAutomobile} from "./interfaces/libs/Parser";
import IsArray from "./helper/IsArray";


(async () => {
    let urls = getUrlsFromTxt()

    let autoElonRepo = new AutoElonRepo()
    let telegramClient = new TelegramClient(TelegramBot)
    let parser = new Parser(autoElonRepo, PathToDataPostAutoElon, KeyToDataPostAutoElon);
    let telegram = new Telegram(telegramClient, keySpecificationAutomobile, IsArray)

    let length = (new Array(urls.length)).fill(1).map((a,i)=>i)

    for await (let i of length) {
        try {
            
            console.log(i + 1, "START")

            let data: IPostAutomobile = await parser.getDescriptionAutomobileObject(urls[i]);

            console.log(i+1, data.name, data.position, data.price, "-", "RECEIVED")
            
            await telegram.sendDataAboutAutomobile(data)

            console.log(i+1, data.name, data.position, data.price, "-", "END")
            
        } catch (e) {
            console.log(i + 1, e)
        }


    }
})()