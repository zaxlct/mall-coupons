//app.js
App({
  onLaunch: function () {
    const self = this
    wx.checkSession({
      success() {
        console.log('检测已登录！')
      },
      fail() {
        self.wxLogin()
      }
    })
  },

  /* TODO
   * 1. 新的微信号测试
   * 2. Token 过期，code 未过期的情况
   */
  wxLogin(cb) {
    const self = this
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: 'https://gjb.demo.chilunyc.com/api/weapp/users/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success(res) {
              wx.setStorage({
                key: "token",
                data: res.data.data.token,
                success() {
                  typeof cb == "function" && cb(res.data.data.token)
                }
              })
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
  },
})