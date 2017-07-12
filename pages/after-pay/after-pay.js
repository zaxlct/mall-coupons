Page({
  data:{
    name: '',
    id: '',
    num: '',
    order_time: '',
    nonce_str: '',
  },
  onLoad(options){
    console.log('after-pay-options', options)
    const {
      name,
      id,
      num,
      order_time,
      nonce_str,
    } = options

    this.setData({
      name,
      id,
      num,
      order_time,
      nonce_str,
    })
  },

  linkDetail() {
    const self = this
    wx.navigateTo({
      url: `/pages/detail/detail?id=${self.data.id}&order_id=${self.data.nonce_str}`
    })
  },
})