import {IRequestDataTelegram} from "../libs/Telegram";

export interface ITelegramClient {
    sendDocumentsWithCaption(requestData: IRequestDataTelegram): Promise<any>
}