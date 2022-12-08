import {ITelegramClient} from "../interfaces/clients/Telegram";
import fetch from "node-fetch";
import {IRequestDataTelegram} from "../interfaces/libs/Telegram";
import {ITelegramBot} from "../interfaces/Constants";

export default class TelegramClient implements ITelegramClient {
    constructor(
        private telegramBotData: ITelegramBot
    ) {
    }

    sendDocumentsWithCaption(requestData: IRequestDataTelegram): Promise<any> {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "chat_id": this.telegramBotData.chat_id,
                ...requestData
            })
        };

        return fetch(`https://api.telegram.org/bot${this.telegramBotData.token}/sendMediaGroup`, requestOptions).then(async (response) => {
            if(response.status >= 400) {
                let data = await response.json()
                console.log("TB - FAILED", data);
                
            }

            return 
        })
    }
}