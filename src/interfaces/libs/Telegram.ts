import {IPostAutomobile} from "./Parser";

export interface ITelegram {
    sendDataAboutAutomobile(dataAutomobile: IPostAutomobile): Promise<void>
}

export interface IRequestDataTelegram {
    media: {
        type: string;
        media: string;
        caption?: string;
    }[];
}