import Base from '../../utils/base'

export default class BeforePayModel extends Base {
  constructor() {
    super()
  }

  checkIsBindPhone(successCb) {
    const params = {
      type: 'POST',
      url: 'users/check',
      successCb,
    }

    this.request(params)
  }

  sendSmS(data, successCb) {
    const params = {
      type: 'POST',
      url: 'sms',
      data,
      successCb,
    }

    this.request(params)
  }

  postUserInfo(data, successCb) {
    const params = {
      type: 'POST',
      url: 'users',
      data,
      successCb,
    }

    this.request(params)
  }

  wxPay(data, successCb) {
    const params = {
      type: 'POST',
      url: 'orders',
      data,
      successCb,
    }

    this.request(params)
  }
}