import HomeModel from './home-model'
const homeModel = new HomeModel()

Page({
  data: {
    coupons: [],
  },
  onLoad() {
    this._fetchData()
  },

  _fetchData() {
    homeModel.getCouponsData(res => {
      this.setData({
        coupons: res.data
      })
    })
  },
})
