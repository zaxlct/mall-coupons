Page({
  data:{
    nonce_str: '',
    consume: '',
    couponTotal: '',
    pay_sum: '',
  },
  onLoad(options){
    console.log('pay-success-options', options)
    const {
      nonce_str = '',
      consume = 0,
      couponTotal = 0,
      pay_sum = 0,
    } = options

    this.setData({
      nonce_str,
      consume,
      couponTotal,
      pay_sum,
    })
  },

  linkIndexPage() {
    // TODO 如果这个用户，没用优惠券，直接付款呢？
    wx.redirectTo({
      url: '/pages/home/home'
    })
  },
})