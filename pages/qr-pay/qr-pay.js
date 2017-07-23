import QrPayModel from './qr-pay-model'
const qrPayModel = new QrPayModel()

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

    this._getMerchantsInfo(merchant_id)
  },

  _getMerchantsInfo(merchant_id) {
    qrPayModel.getMerchantsInfo(merchant_id, res => {
      if(res.data) {
        const result = res.data
        let { coupons = [] } = result
        // TODO 再 forEach 一个 disabled: false 字段
        coupons.forEach(item => item.isSeleted = false)
        this.setData({
          merchant_info: {
            logo: result.logo,
            name: result.name,
          },
          coupons,
        })
      }
    })
  },

  bindConsume(e) {
    // TODO 用户改变输入的消费额度时，要判断消费额度是否大于当前已选择的优惠券总额
    const consume = Number(e.detail.value.trim())
    const couponTotal = this.data.coupons.reduce((total,prev) => total + prev.face_value * Number(prev.isSeleted), 0)
    const pay_sum = Number((consume - couponTotal < 0 ? 0 : consume - couponTotal).toFixed(1))
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
    const pay_sum = Number((this.data.consume - couponTotal < 0 ? 0 : this.data.consume - couponTotal).toFixed(1))

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
    if(!this.data.consume) {
      wx.showModal({
        title: '请输入消费金额！',
        content: '',
        showCancel: false,
      })
      return 
    }
    
    this._wxPay()
  },
  
  _wxPay(token) {
    const ids = this.data.coupons.filter(coupon => coupon.isSeleted).map(coupon => coupon.order_id).join()    
    const data = {
      ids,
      merchant_id: this.data.merchant_id,
      consume: this.data.consume,
      pay_sum: this.data.pay_sum,
    }
    qrPayModel.wxPay(data, res => {
      if(!res.data) {
         wx.showModal({
          title: '支付失败，请退出重试！',
          content: '',
          showCancel: false,
        })
        return
      }
      const payData = res.data
      console.log(payData)
      if(payData.status === 1) {
        // 不需要调用支付
        console.log(`/pages/pay-success/pay-success?consume=${this.data.consume}&couponTotal=${this.data.couponTotal}&pay_sum=${this.data.pay_sum}`)
        wx.redirectTo({
          url: `/pages/pay-success/pay-success?consume=${this.data.consume}&couponTotal=${this.data.couponTotal}&pay_sum=${this.data.pay_sum}`
        })
      } else if (payData.appid && payData.pay_sign) {
        // 需要调用微信支付
        const {
          appid,
          timestamp,
          nonce_str,
          pack_age,
          sign_type,
          pay_sign,
          order_time
        } = payData

        const self = this
        wx.requestPayment({
          timeStamp: timestamp,
          nonceStr: nonce_str,
          package: pack_age,
          signType: 'MD5',
          paySign: pay_sign,
          success(res_pay){
            console.log(`/pages/pay-success/pay-success?nonce_str=${nonce_str}&consume=${self.data.consume}&couponTotal=${self.data.couponTotal}&pay_sum=${self.data.pay_sum}`)
            wx.redirectTo({
              url: `/pages/pay-success/pay-success?nonce_str=${nonce_str}&consume=${self.data.consume}&couponTotal=${self.data.couponTotal}&pay_sum=${self.data.pay_sum}`
            })
          },
          fail(res_pay){
            wx.showModal({
              title: '支付失败，请重试！',
              content: '',
              showCancel: false,
            })
          }
        })
      }  
    })
  },
})