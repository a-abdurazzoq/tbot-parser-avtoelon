import {IKeyToPostAutoElon, IPathToPostAutoElon} from "../interfaces/Constants";

export const PathToDataPostAutoElon: IPathToPostAutoElon = {
    name: "header div.a-title div.a-title__container h1",
    description: ".description .description-text",
    position: "header div.a-title div.a-title__container h1",
    price: ".a-price__text",
    images: ".photos-block > .photo-list a",
    image: ".main-photo a"
}

export const KeyToDataPostAutoElon: IKeyToPostAutoElon = {
    address: "Shahar",
    color: "Rangi",
    engineSize: "Dvigatel hajmi, l",
    fuelType: "Dvigatel hajmi, l",
    mileage: "Yurgani",
    year: "Yili",
    driverUnit: "Uzatma",
    transmission: "Uzatish qutisi",
    body: "Kuzov"
}

export const PathToSpecificationAutomobile: string = ".description-params"