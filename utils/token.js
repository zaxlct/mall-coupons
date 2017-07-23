import Config from './config'

export default class Token {
  constructor() {
    this.verifyUrl = Config.baseUrl + 'token/verify'
    this.tokenUrl = Config.baseUrl + 'users/login'
  }

  verify() {
    const self = this
    wx.getStorage({
      key: 'token',
      success(res) {
        self._verifyFromServer(res.data)
      },
      fail() {
        self.getTokenFromServer()
      }
    })
  }

  //验证 token 是否过期
  _verifyFromServer(token) {
    const self = this
    wx.request({
      url: self.verifyUrl,
      header: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      },
      success(res){
        if(res.statusCode == 401) {
          self.getTokenFromServer()
        }
      },
      fail() {
      },
    })
  }

  //获取新的 token
  getTokenFromServer(callBack) {
    const self = this
    wx.login({  
      success(res_code) {
        if (res_code.code) {
          wx.request({
            url: self.tokenUrl,
            method: 'POST',
            data: {
              code: res_code.code
            },
            success(res) {
              wx.setStorageSync('token', res.data.data.token)
              typeof callBack == 'function' && callBack(res.data.data.token)
            },
            fail() {
              wx.showToast({title: '网络错误，请重新授权！'})
            },
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
}