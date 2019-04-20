import axios from 'axios';

export default class Authentication {
  static async forgotPassword(email) {
    let {data} = await axios.post(`auth/forgot_password`, {email: email});
    return data;
  }

  static async resetPassword(token, id, password) {
    let {data} = await axios.post(`auth/reset_password`, {token: token, id: id, password: password});
    return data;
  }
}