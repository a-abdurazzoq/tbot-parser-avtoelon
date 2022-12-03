export interface IParserAutoElon {
    getDescriptionAutomobileText(url: string): string
}

export interface IPostAutomobile {
    name: string;
    year: string;
    position: string;
    mileage: string;
    condition: string;
    color: string;
    engineSize: string;
    fuelType: string;
    price: string;
    phoneNumber: string;
    address: string;
}