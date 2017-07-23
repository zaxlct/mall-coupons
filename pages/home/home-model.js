import Base from '../../utils/base'

export default class HomeModel extends Base {
  constructor() {
    super()
  }

  getCouponsData(successCb) {
    const params = {
      url: 'coupons',
      successCb,
    }
    this.request(params)
  }
}