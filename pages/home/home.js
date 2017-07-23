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
    const self = this
    homeModel.getCouponsData(data => {
      this.setData({
        coupons: data.data
      })
    })
  },

  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
})
