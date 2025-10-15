interface user {
    userid : number 
    firstname : string
    secondname : string;
    birthDate : Date;
    gender : gender[];
    street : string;
    houseNumber : number;
    email: string
    paymentMethod: payment[]
}

interface payment {
    paypal : string;
    card: card[]
}

interface gender {
    male?: boolean;
    female?: boolean;
    divers?: boolean 
}
interface card {
    visa?: number;
    mastercard?: number;
    ec?: number 
}