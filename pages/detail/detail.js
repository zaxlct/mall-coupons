const WxParse = require('../../common/wxParse/wxParse.js');
const app = getApp()
Page({
  data:{
    wxParseData: '',
    id: '',
    order_id: '',
    item: {},
  },
  onLoad(options){
    const { id = '', order_id = '' } = options
    const self = this
    this.setData({
      id,
      order_id,
    })
    
    wx.getStorage({
      key: 'token',
      success(res) {
        self.fetchCouponDetail(res.data)
      } 
    })
  },
  fetchCouponDetail(token) {
    const self = this
    wx.request({
      url: `https://gjb.demo.chilunyc.com/api/weapp/coupons/${self.data.id}?order_id=${self.data.order_id}`,
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      success(res) {
        const { data } = res
        console.log(data)
        if(data.data) {
          self.setData({
            item: data.data,
            wxParseData: WxParse.wxParse('article', 'html', data.data.details, self)
          })
        } else if(data.errors) {
          if(data.errors.status == 401) {
            app.wxLogin(self.fetchData)
          }
        }
      },
      fail() {
        wx.showToast({title: '网络错误，请重试！'})
      },
    })
  },
})