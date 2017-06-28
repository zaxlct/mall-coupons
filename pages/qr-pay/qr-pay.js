const app = getApp()
Page({
  data:{
    expenditure: 0,
    merchant_id: 1,
    merchant_info: {},
    coupons: [],
    seletedCouponNum: 0,
  },
  onLoad(query){
    const { merchant_id = 1 } = query
    this.setData({
      merchant_id
    })
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
      url: 'https://gjb.demo.chilunyc.com/api/weapp/merchants/' + self.data.merchant_id,
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      success(res) {
        const { data } = res
        if(data.data) {
          const result = data.data
          let { coupons = [] } = result
          coupons.forEach(item => item.isSeleted = false)
          self.setData({
            merchant_info: {
              logo: result.logo,
              name: result.name,
            },
            coupons,
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
  bindExpenditure(e) {
    this.setData({
      expenditure: e.detail.value.trim()
    })
  },
  checkboxChange(e) {
    let { coupons } = this.data
    coupons.forEach(item => item.isSeleted = false)
    e.detail.value.forEach(index => {
      coupons[Number(index)].isSeleted = true
    })
    this.setData({
      coupons
    })
  },
  onUnload(){
    // 页面关闭
  }
})