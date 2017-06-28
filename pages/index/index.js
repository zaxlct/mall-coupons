//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    coupons: [],
  },
  onLoad() {
    const self = this
    wx.getStorage({
      key: 'token',
      success(res) {
        self.fetchData(res.data)
      } 
    })
  },
  fetchData(token) {
    const self = this
    wx.request({
      url: 'https://gjb.demo.chilunyc.com/api/weapp/coupons',
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      success(res) {
        const { data } = res
        console.log(data)
        if(data.data) {
          self.setData({
            coupons: res.data.data
          })
        } else if(data.errors) {
          if(data.errors.status == 401) {
            app.wxLogin(self.fetchData)
          }
        }
      },
      fail() {
        wx.showToas({title: '网络错误，请重试！'})
      },
    })
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
})
