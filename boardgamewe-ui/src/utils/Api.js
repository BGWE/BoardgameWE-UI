import {Constants} from "./Constants"

var CONTENT_TYPE = Object.freeze({"json":"application/json"}) 

export class Api {
    static _fetch(uri, options) {
        console.log("Fetching " + Constants.API_ADDRESS + uri);

        if (typeof options === 'undefined') { options = {}; }

        return fetch(Constants.API_ADDRESS + uri, options);
    }

    static fetch(uri) {
        return Api._fetch(uri);
    }

    static post(uri, payload, content_type) {
        let options = {
            method: "POST",
            body: payload
        }
        if (typeof content_type !== 'undefined') { options["headers"] = {"Content-Type": CONTENT_TYPE[content_type]}; }
        
        return Api._fetch(uri, options)
    }

    static delete(uri) {
        let options = {
            method: "DELETE"
        }
        return Api._fetch(uri, options)
    }
}
