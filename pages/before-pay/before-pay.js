const app = getApp()
let timer = null

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
    const self = this
    this.setData({
      id,
      name,
      price: Number(price),
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        self.fetchIsBindPhone(res.data)
      },
      fail() {
        app.wxLogin(self.fetchIsBindPhone)
      }
    })
  },

  fetchIsBindPhone(token) {
    const self = this
    wx.request({
      url: 'https://gjb.demo.chilunyc.com/api/weapp/users/check',
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      method: 'POST',
      success(res) {
        const { data } = res
        console.log(data)
        if(data.data) {
          self.setData({
            isBindPhone: Boolean(Number(data.data.status)),
          })
        } else if(data.errors) {
          if(data.errors.status == 401) {
            console.log('users/check', 401)
            app.wxLogin(self.fetchIsBindPhone)
          }
        }
      },
      fail() {
        wx.showToast({title: '网络错误，请重试！'})
      },
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

  sendMsg() {
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

    const self = this
    this.setData({
      isSendMsging: true,
    })

    // 获取用户昵称
    wx.getUserInfo({
      success(res) {
        self.setData({
          nickname:  res.userInfo.nickName,
        })
      }
    })

    // 60s 倒计时
    timer = setInterval(() => {
      if(this.data.timeOut === 1) {
        clearInterval(timer)
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

    // 调用发送短信
    wx.getStorage({
      key: 'token',
      success(res) {
        self.fetchSendMsg(res.data)
      },
      fail() {
        app.wxLogin(self.fetchSendMsg)
      }
    })
  },

  // 发送短信
  fetchSendMsg(token) {
    const self = this
    wx.request({
      url: 'https://gjb.demo.chilunyc.com/api/weapp/sms',
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      data: {phone: self.data.phone},
      method: 'POST',
      success(res) {
        const { data } = res
        console.log(data)
        if(data.data) {
          if(data.data.status != 1) {
            wx.showModal({
              title: '手机号发送失败，请退出重试！',
              content: '',
              showCancel: false,
            })
          }
        } else if(data.errors) {
          if(data.errors.status == 401) {
            app.wxLogin(self.fetchSendMsg)
          }
        }
      },
      fail() {
        wx.showToast({title: '网络错误，请重试！'})
      },
    })
  },

  submitPay() {
    const self = this
    if(this.data.isBindPhone) {
      wx.getStorage({
        key: 'token',
        success(res) {
          self.wxPay(res.data)
        },
        fail() {
          app.wxLogin(self.wxPay)
        }
      })
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

    wx.getStorage({
      key: 'token',
      success(res) {
        self.sendUserInfo(res.data)
      },
      fail() {
        app.wxLogin(self.sendUserInfo)
      }
    })
  },

  sendUserInfo(token) {
    const self = this
    wx.request({
      url: 'https://gjb.demo.chilunyc.com/api/weapp/users',
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      data: {
        nickname: self.data.nickname,
        phone: self.data.phone,
        code: self.data.code,
      },
      method: 'POST',
      success(res) {
        const { data } = res
        console.log(data)
        if(data.data) {
          // 验证码验证成功后再走微信支付的逻辑          
          if(data.data.status === 1) {
            self.setData({
              isBindPhone: true,
            })
            wx.getStorage({
              key: 'token',
              success(res) {
                self.wxPay(res.data)
              },
              fail() {
                app.wxLogin(self.wxPay)
              }
            })
          }
        } else if(data.errors) {
          if(data.errors.status == 401) {
            console.log('weapp/users', 401)
            app.wxLogin(self.sendUserInfo)
          } else {
             wx.showModal({
              title: data.errors.detail + '!',
              content: '',
              showCancel: false,
            })

            clearInterval(timer)
            self.setData({
              isSendMsging: false,
              timeOut: 60,
            })
          }
        }
      },
      fail() {
        wx.showToast({title: '网络错误，请重试！'})
      },
    })
  },

  wxPay(token) {
    const self = this
    wx.request({
      url: 'https://gjb.demo.chilunyc.com/api/weapp/orders',
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      data: {
        id: self.data.id,
        num: self.data.num,
      },
      method: 'POST',
      success(res) {
        const { data } = res
        console.log(data)
        if(data.data) {
          const {
            appid,
            timestamp,
            nonce_str,
            pack_age,
            sign_type,
            pay_sign
          } = data.data

          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr: nonce_str,
            package: pack_age,
            signType: 'MD5',
            paySign: pay_sign,
            success(res){
              wx.redirectTo({
                url: '/pages/after-pay/after-pay'
              })
            },
            fail(res){
               wx.showModal({
                title: '支付失败，请重试！',
                content: '',
                showCancel: false,
              })
            }
          })
        } else if(data.errors) {
          if(data.errors.status == 401) {
            console.log('weapp/orders', 401)
            app.wxLogin(self.wxPay)
          }
        }
      },
      fail() {
        wx.showToast({title: '网络错误，请重试！'})
      },
    })
  },

  onUnload(){
    if(timer) clearInterval(timer)
  }
})