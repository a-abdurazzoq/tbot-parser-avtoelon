export interface IParserAutoElon {
    getDescriptionAutomobileObject(url: string): Promise<IPostAutomobile>
}

export interface IPostAutomobile {
    name: string;
    year: string;
    position: string;
    mileage: string;
    condition: string;
    color: string;
    engineSize: string;
    driverUnit: string;
    transmission: string;
    body: string;
    fuelType: string;
    price: string;
    phoneNumber: string;
    address: string;
    images: string[];
}