const app = getApp()
Page({
  data:{
    consume: 0, // 用户输入的消费额度
    merchant_id: 1, // 商家 id
    merchant_info: {},
    coupons: [], // 优惠券列表
    couponTotal: 0, // 优惠券一共抵用了多少钱
    pay_sum: 0, // 需要支付的金额
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
      },
      fail() {
        app.wxLogin(self.fetchData)
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
          // TODO 再 forEach 一个 disabled: false 字段
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
            console.log('merchants', 401)
            app.wxLogin(self.fetchData)
          }
        }
      },
      fail() {
        wx.showToast({title: '网络错误，请重试！'})
      },
    })
  },
  bindConsume(e) {
    // TODO 用户改变输入的消费额度时，要判断消费额度是否大于当前已选择的优惠券总额
    const consume = Number(e.detail.value.trim())
    const couponTotal = this.data.coupons.reduce((total,prev) => total + prev.face_value * Number(prev.isSeleted), 0)
    const pay_sum = consume - couponTotal < 0 ? 0 : consume - couponTotal
    this.setData({
      consume,
      pay_sum,
    })
  },
  checkboxChange(e) {
    // TODO 防止出现用户多用了优惠券的情况
    let { coupons } = this.data
    coupons.forEach(item => item.isSeleted = false)
    e.detail.value.forEach(index => {
      coupons[Number(index)].isSeleted = true
    })
    const couponTotal = coupons.reduce((total,prev) => total + prev.face_value * Number(prev.isSeleted), 0)
    const pay_sum = this.data.consume - couponTotal < 0 ? 0 : this.data.consume - couponTotal

    //TODO 用户选择的优惠券总额大于 用户输入的消费额度 时，禁止用户再添加优惠券
    // if(couponTotal >= this.data.consume) {
    //   coupons.forEach(item => item.disabled = true)
    // }

    this.setData({
      coupons,
      couponTotal,
      pay_sum,
    })
  },

  submitPay() {
    // TODO consume 不能为空
  },

  onUnload(){
    // 页面关闭
  }
})