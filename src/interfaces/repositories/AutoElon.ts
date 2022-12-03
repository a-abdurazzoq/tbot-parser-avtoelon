export interface IAutoElonRepo {
    getHtmlPageAboutAutomobile(url: string): Promise<string>
}