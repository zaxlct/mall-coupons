const WxParse = require('../../common/wxParse/wxParse.js');
Page({
  data:{
    text:"Page detail",
    wxParseData: '',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    var html = '<h1>&nbsp;　　湖南的糖油粑粑好吃啊，在自家厨房里也能做得出来哦!这次小编推荐的是一道DIY粑粑制作法。只需要简单两步，玉米糍粑就变成了长沙街头的地道热卖小吃。</h1><p><img alt="图片替换文字" src="http://static.chinacaipu.com/d/file/menu/hunanmeishi/2015-01-13/e9f6d6b9dc3234a0b1d27d483c8439ad.jpg" style="height:300px; width:400px" /></p><p><strong>材料：</strong><a href="http://baidu.com">玉米糍粑</a></p><p><strong>调料：</strong><em>红糖</em>，<s>白糖</s>，蜂蜜</p><ol>	<li>第一步是这样子的。</li>	<li>第二步</li>	<li>第三步。</li></ol><p><img alt="" src="http://static.chinacaipu.com/d/file/menu/hunanmeishi/2015-01-13/77f554ab56925b7fe4fd0997759c7e67.jpg" style="height:372px; width:440px" /></p><ul>	<li>因为糍粑不太吸油，所以煎的时候多出来的油倒出来比较好</li>	<li>红糖的份量不用太多，太多上色就比较深了。</li></ul><p><img alt="" src="http://static.chinacaipu.com/d/file/menu/hunanmeishi/2015-01-13/a14b462e8bc11685403237786c9056a1.jpg" style="height:224px; width:400px" /></p><p>&nbsp;</p><blockquote><p>当嫩玉米散发出甜丝丝的香味，美味诱惑实在是无法抵挡，大口啃玉米特别过瘾，但你有注意到啃过的玉米棒上总是留下许多淡黄色的嫩小颗粒吗?这些被浪费掉的小黄颗粒却是最有营养的玉米精华，以后要小口啃玉米，不然就亏大了!</p></blockquote>';

    const that = this
    //更新数据
    that.setData({
      wxParseData: WxParse.wxParse('article', 'html', html, that)
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})