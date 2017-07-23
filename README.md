# mall-coupons
- 给在商场购物的顾客提供的优惠券小程序
- 用户可以在商场的大屏幕或者其他海报上扫描二维码，打开小程序购买对应的优惠券
- 在支持优惠券的商家扫描二维码，打开小程序使用优惠券抵扣消费金额

## token 令牌维护机制
![token](https://ws2.sinaimg.cn/large/006tKfTcly1fhu6ep5e9rj317s0padtb.jpg)
具体代码实现请看 /utlis/token.ks

## 页面介绍
### 用户的优惠券列表页↓
- URL: `pages/index/index` 
- <img src="https://ws3.sinaimg.cn/large/006tNc79ly1fhjfy8axygj30ki0vg40s.jpg" width="450" />

### 优惠券详情页↓
- URL: `pages/detail/detail`
- <img src="https://ws4.sinaimg.cn/large/006tNc79ly1fhjfzoj6dzj30ku0zqq8e.jpg" width="450" />

### 购买优惠券页↓
- URL: `pages/before-pay/before-pay`
- <img src="https://ws2.sinaimg.cn/large/006tNc79ly1fhjg22bk0qj30kw0li759.jpg" width="450" />

### 优惠券支付完成页↓
- URL: `pages/after-pay/after-pay`
- <img src="https://ws4.sinaimg.cn/large/006tNc79ly1fhjg35gpc1j30ks0rudi4.jpg" width="450" />

### 扫码商家的二维码，优惠券抵扣消费金额页面↓
- URL: `pages/qr-pay/qr-pay`
- <img src="https://ws1.sinaimg.cn/large/006tNc79ly1fhjg4dhddxj30ki0xo76j.jpg" width="450" />

### 消费成功页面↓
- URL: `pages/pay-success/pay-success` 
- <img src="https://ws4.sinaimg.cn/large/006tNc79ly1fhjg557vnej30ky0nwq46.jpg" width="450" />


## 感谢第三方库
[wxParse](微信小程序富文本解析自定义组件)

## TODO
- model.js 虽然做到了 views 和 model 的分离，但是当 ajax 发生错误时的判断没有交给 model.js 来处理，而是不恰当的放到 views 里判断了。
model.js 应该再过滤和判断一下数据，让 views 只需要拿到自己想到数据，不需要做其他的事。

- 使用优惠券抵用消费金额时，当总优惠的金额大于消费金额时，应该提示用户