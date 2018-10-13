import Model from "./Model.js";
import axios from "axios";

export default class User extends Model {
    /** @inheritdoc */
    static get className() {
        return "user";
    }

    /** @inheritdoc */
    _initProperties() {
        super._initProperties();

        this.username = null;
        this.name = null;
        this.surname = null;
        this.email = null;
        this.password = null;
    }

    static async login(username, password) {
        let {data} = await axios.post("user/login", {username, password});
        return data.token; 
    }
}
