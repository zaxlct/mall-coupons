import Token from './token'
import Config from './config'

export default class Base {
  constructor() {
    this.baseUrl = Config.baseUrl
  }

  /*
   *  http 请求类
   * @isRefetch 为 false 时，不做未授权重试机制
   */
  request(params, isRefetch = true) {
    const url = this.baseUrl + params.url
    const self = this

    wx.request({
      url,
      data: params.data,
      method: params.type || 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'Accept': 'application/json'
      },
      success(res) {
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        const codeStartChar = res.statusCode.toString().charAt(0)
        if(codeStartChar == '2') {
          typeof params.successCb == 'function' && params.successCb(res.data)
        } else if (codeStartChar == '4' && isRefetch) {
          // 如果 token 检测失败，那么还有、仅有一次获取新的 token ，重新请求的机会
          that._refetch(params)
        } else {
          that._processError(err)
          typeof params.errorCb == 'function' && params.errorCb(res.data)
        }
      },
    })
  }

  // 未授权重试机制，当检测为 401 时，获取新的 token，然后重新发起对应的请求
  // 为了防止无限循环，只重新发起一次请求
  _refetch(params) {
    const token = new Token()
    token.getTokenFromServer(token => this.request(params, false))
  }

  _processError(err) {
    console.log(err)
  }

  getDataSet(event, key) {
    return event.currentTarget.dataset[key]
  }
}