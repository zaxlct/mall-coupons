import Token from 'utils/token'

App({
  onLaunch() {
    /*  
     * token 过期速度远远快于微信的 session（用户登录态），
     * 获取 token 会更新微信的 session，故这里不需要执行 wx.checkSession 
     */
    
    const token = new Token()
    token.verify()
  }
})