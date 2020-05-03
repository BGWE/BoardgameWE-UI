import axios from 'axios';
import qs from 'qs';

export default class Model {

  /**
   * @param {Object} [props]    Object containing the properties of the object to set
   */
  constructor(props) {
    if (new.target === Model) {
      throw new Error('Model is an abstract class and cannot be constructed directly.');
    }

    this._initProperties();
    this.populate(props);
  }

  /**
   * Initialize the properties allowed for current object (the children must override this method to initialize their
   * custom properties)
   */
  _initProperties() {
    this.id = null;
  }

  toString() {
    let str = `[${this.className}] ${this.id}`;
    if(this.name) {
      str += `: ${this.name}`;
    }
    return str;
  }

  /**
   * Clone the object
   *
   * @returns {this} the clone of the object
   */
  clone() {
    return new this.constructor(JSON.parse(JSON.stringify(this)));
  }

  /**
   * Populate the instance with the properties of the provided object
   *
   * @param {Object} props Object containing the properties to set
   */
  populate(props) {
    if(props) {
      for(let key in props) {
        this[key] = props[key];
      }
    }
  }

  /**
   * Return an object containing only the public properties of the current object
   *
   * @param {Array<string>} forcedProperties The properties to include in the constructed properties object, even
   *  if they are  null
   *
   * @returns {Object} Object with public properties only
   */
  getPublicProperties(forcedProperties=[]) {
    let props = {};
    for(let key in this) {
      let value = this[key];
      if(!key.startsWith('_') && (forcedProperties.includes(key) || value != null)) {
        props[key] = value;
      }
    }
    return props;
  }

  /**
   * @static Fetch an object
   *
   * @param {number} id The identifier of the object to fetch
   *
   * @returns {this} The fetched object
   */
  static async fetch(id) {
    return new this({id}).fetch();
  }

  /**
   * Fetch from database the properties of the model and update the model with those properties
   *
   * @returns {this} The object with fetched properties
   */
  async fetch() {
    if(this.isNew()) {
      throw new Error('Cannot fetch a model with no ID.');
    }

    let {data} = await axios.get(this.uri);

    this.populate(data);
    return this;
  }

  /**
   * Fetch all models
   *
   * @param {Object} params The URL params to use in the request
   *
   * @returns {Array<Model>} The list of all models
   */
  static async fetchAll(params={}) {
    let {data} = await axios.get(this.collectionName, {
      params,
      paramsSerializer: params => {
        return qs.stringify(params);
      }
    });
    return data.map(elem => new this(elem));
  }

  /**
   * Save the object (if it is new, it is added; otherwise, it is updated)
   *
   * @param {Object} params
   * @param {Array<string>} forcedProperties The properties to include in the constructed properties object, even
   *  if they are  null
   *
   * @returns {this} The saved object, as returned by backend
   */
  async save(params={}, forcedProperties=[]) {
    let data;
    if(this.isNew()) {
      ({data} = await axios.post(this.uri, this.getPublicProperties(forcedProperties), {
        params,
        paramsSerializer: params => {
          return qs.stringify(params);
        }
      }));
    }
    else {
      ({data} = await axios.put(this.uri, this.getPublicProperties(forcedProperties)));
    }
    this.populate(data);
    return this;
  }

  /**
   * @static Delete an object
   *
   * @param {number} id The identifier of the object to delete
   */
  static async delete(id) {
    return new this({id}).delete();
  }

  /**
   * Delete the object
   */
  async delete() {
    if(this.isNew()) {
      throw new Error('Cannot delete a model with no ID.');
    }

    await axios.delete(this.uri);
  }

  /**
   * @returns {boolean} whether or not the object is new (not yet added to the database)
   */
  isNew() {
    return (this.id == null);
  }

  /**
   * @returns {string} API URI to use to perform operations on the object
   */
  get uri() {
    if(this.isNew()) {
      return `${this.className}`;
    }
    else {
      return `${this.className}/${this.id}`;
    }
  }

  /**
   * @abstract
   * @returns {string} The class name of the model used in API endpoints
   */
  static get className() {
    throw new Error('Abstract getter className() not overriden in child.');
    // return this.name.toLowerCase(); not used to allow minification
    // (see https://stackoverflow.com/questions/29310530/get-the-class-name-of-es6-class-instance#39522406)
  }

  get className() {
    return this.constructor.className;
  }

  static get collectionName() {
    return this.className + 's';
  }


}
