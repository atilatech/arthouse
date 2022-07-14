import request from "axios";
import Environment from "./Environment";
import { ServicesHelpers } from "./ServicesHelpers";

class APIKeyCreditService {

    static apiUrl = "https://atila-7.herokuapp.com";

    static getAPIKeyCreditByPublicKey = (publicKey: string) => {
        return request({
            url: `${Environment.atilaApiUrl}/payment/api-key-credits/public-key/?public_key=${publicKey}/`,
            method: 'GET',
            headers: ServicesHelpers.getHeaders({addAPIKey: false}),
        });
    };
}

export default APIKeyCreditService;
