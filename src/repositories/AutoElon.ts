import fetch from 'node-fetch';
import {IAutoElonRepo} from "../interfaces/repositories/AutoElon";

export default class AutoElonRepo implements IAutoElonRepo{
    async getHtmlPageAboutAutomobile(url: string): Promise<string> {
        let response = await fetch(url);

        if(response.status >= 400)
            return ""

        return response.text()
    }
};