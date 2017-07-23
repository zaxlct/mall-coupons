import Base from '../../utils/base'

export default class QrPayModel extends Base {
  constructor() {
    super()
  }

  getMerchantsInfo(merchant_id, successCb) {
    const params = {
      url: 'merchants/' + merchant_id,
      successCb,
    }
    this.request(params)
  }

  wxPay(data, successCb) {
    const params = {
      url: 'consumes/',
      type: 'POST',
      data,
      successCb,
    }
    this.request(params)
  }
}