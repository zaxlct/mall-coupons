import Base from '../../utils/base'

export default class DetailModel extends Base {
  constructor() {
    super()
  }

  getCouponDetailData(data, successCb) {
    const params = {
      url: 'coupons/' + data.id,
      data: {
        order_id: data.order_id,
      },
      successCb,
    }
    this.request(params)
  }
}