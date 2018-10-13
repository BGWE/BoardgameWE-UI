import Model from "./Model.js";

export default class Event extends Model {
    /** @inheritdoc */
    static get className() {
        return "event";
    }

    /** @inheritdoc */
    _initProperties() {
        super._initProperties();

        this.name = null;
        this.start = null;
        this.end = null;
        this.description = null;
        this.location = null;
    }
}