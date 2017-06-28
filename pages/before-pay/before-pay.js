const app = getApp()
let timer = null

Page({
  data:{
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
    const { name = '', price = 0 } = options
    const self = this
    this.setData({
      name,
      price: Number(price),
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        self.fetchIsBindPhone(res.data)
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
            app.wxLogin(self.fetchData)
          }
        }
      },
      fail() {
        wx.showToas({title: '网络错误，请重试！'})
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
            app.wxLogin(self.fetchData)
          }
        }
      },
      fail() {
        wx.showToas({title: '网络错误，请重试！'})
      },
    })
  },

  submitPay() {
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
  },

  onUnload(){
    if(timer) clearInterval(timer)
  }
})