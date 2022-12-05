export interface IAutoElonRepo {
    getHtmlPageAboutAutomobile(url: string): Promise<string>

    getPhoneNumberHolderAutomobile(id: string): Promise<string>
}

export interface IResponseDataPhoneNumber {
    type: string,
    data: {
        class: string,
        id: number,
        model: {
            phone: string
        }
    }
}