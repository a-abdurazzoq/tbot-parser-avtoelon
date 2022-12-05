export interface IKeyToPostAutoElon {
    address: string;
    color: string;
    engineSize: string;
    fuelType: string;
    mileage: string;
    year: string;
    driverUnit: string;
    transmission: string;
    body: string;
}

export interface IPathToPostAutoElon {
    name: string;
    price: string;
    position: string;
    images: string;
}

export interface ITelegramBot {
    chat_id: number;
    token: string;
}

export interface IKeySpecificationAutomobile {
    ["📆 Yili"]: string;
    ["📶 Pozitsya"]: string;
    ["🏃‍♂️ Probeg"]: string;
    ["🔧 Xolati"]: string;
    ["🚗 Kuzov"]: string;
    ["🎨 Rangi"]: string;
    ["🎚 Uzatish qutisi"]: string;
    ["📊 Dvigatel hajmi"]: string;
    ["🛞 Tortishi"]: string;
    ["⛽️ Yoqilgi turi"]: string;
    ["💰 Narxi"]: string;
    ["📞 Tel"]: string;
    ["🚩 Manzil"]: string;
}