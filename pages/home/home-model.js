import Base from '../../utils/base'

export default class HomeModel extends Base {
  constructor() {
    super()
  }

  getCouponsData(cb) {
    const params = {
      url: 'coupons',
      successCb: data => typeof cb == 'function' && cb(data)
    }
    this.request(params)
  }
}