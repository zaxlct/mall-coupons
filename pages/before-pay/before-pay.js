import BeforePayModel from './before-pay-model'
const beforePayModel = new BeforePayModel()
let g_timer = null

Page({
  data:{
    id: '',
    name: '',
    price: 0,
    num: 1,
    isBindPhone: false,
    isSendMsging: false,
    phone: '',
    code: '',
    nickname: '',
    timeOut: 60,
  },
  onLoad(options){
    const { name = '', price = 0, id='' } = options
    this.setData({
      id,
      name,
      price: Number(price),
    })
    
    this._checkIsBindPhone()
  },

  _checkIsBindPhone(token) {
    beforePayModel.checkIsBindPhone(res => {
      this.setData({
        isBindPhone: Boolean(Number(res.data.status))
      })
    })
  },

  subtractNum() {
    if(this.data.num > 1) {
      this.setData({
        num: this.data.num - 1
      })
    }
  },

  addNum() {
    this.setData({
      num: this.data.num + 1
    })
  },

  bindPhone(e) {
    this.setData({
      phone: e.detail.value.trim()
    })
  },

  bindCode(e) {
    this.setData({
      code: e.detail.value.trim()
    })
  },

  sendSmS() {
    if(!this.data.phone) {
      wx.showModal({
        title: '请输入手机号！',
        content: '',
        showCancel: false,
      })
      return 
    }
    
    if(this.data.phone.substring(0, 1) != 1 || this.data.phone.length !== 11) {
      wx.showModal({
        title: '手机号格式错误！',
        content: '',
        showCancel: false,
      })
      return 
    }

    this.setData({
      isSendMsging: true,
    })

    // 获取用户昵称
    const self = this    
    wx.getUserInfo({
      success(res) {
        self.setData({
          nickname:  res.userInfo.nickName,
        })
      }
    })

    // 60s 倒计时
    g_timer = setInterval(() => {
      if(this.data.timeOut === 1) {
        clearInterval(g_timer)
        this.setData({
          isSendMsging: false,
          timeOut: 60,
        })
        return 
      }
      this.setData({
        timeOut: this.data.timeOut - 1
      })
    }, 1000)

    this._serverSendSms()
  },

  // 发送短信
  _serverSendSms(token) {
    const data = {
      phone: this.data.phone,
    }
    beforePayModel.sendSmS(data, res => {
      if(res.data.status != 1) {
        wx.showModal({
          title: '手机号发送失败，请退出重试！',
          content: '',
          showCancel: false,
        })
      }
    })
  },

  submitPay() {
    if(this.data.isBindPhone) {
      this._wxPay()
      return
    }

    if(!this.data.phone) {
      wx.showModal({
        title: '请输入手机号！',
        content: '',
        showCancel: false,
      })
      return 
    }

    if(!this.data.code) {
      wx.showModal({
        title: '请输入验证码！',
        content: '',
        showCancel: false,
      })
      return 
    }
    this._postUserInfo()
  },

  _postUserInfo() {
    const data = {
      nickname: this.data.nickname,
      phone: this.data.phone,
      code: this.data.code,
    }

    beforePayModel.postUserInfo(data, res => {
      if(res.data) {
        if(res.data.status === 1) {
          // 绑定手机号成功，继续微信支付
          this.setData({
            isBindPhone: true,
          })
          this._wxPay()
        }  
      } else if(res.errors){
        // 验证码错误
        wx.showModal({
          title: '验证码错误！',
          content: '',
          showCancel: false,
        })

        clearInterval(g_timer)
        this.setData({
          isSendMsging: false,
          timeOut: 60,
        })
      }
    })
  },

  // 微信支付
  _wxPay() {
    const data = {
      id: this.data.id,
      num: this.data.num,
    }
    const self = this
    beforePayModel.wxPay(data, res => {
      if(res.data) {
        const {
          appid,
          timestamp,
          nonce_str,
          pack_age,
          sign_type,
          pay_sign,
          order_time
        } = res.data

        wx.requestPayment({
          timeStamp: timestamp,
          nonceStr: nonce_str,
          package: pack_age,
          signType: 'MD5',
          paySign: pay_sign,
          success(res_pay){
            console.log(`/pages/after-pay/after-pay?name=${self.data.name}&id=${self.data.id}&num=${self.data.num}&order_time=${order_time}&nonce_str=${nonce_str}`)
            wx.redirectTo({
              url: `/pages/after-pay/after-pay?name=${self.data.name}&id=${self.data.id}&num=${self.data.num}&order_time=${order_time}&nonce_str=${nonce_str}`
            })
          },
          fail(){
            wx.showModal({
              title: '支付失败，请重试！',
              content: '',
              showCancel: false,
            })
          }
        })
      } else if(res.errors) {
        wx.showModal({
          title: '支付失败，请重试！',
          content: '',
          showCancel: false,
        })
      }
    })
  },

  onUnload(){
    if(g_timer) clearInterval(g_timer)
  }
})
