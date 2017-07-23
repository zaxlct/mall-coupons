import DetailModel from './detail-model'
import WxParse from '../../common/wxParse/wxParse'
const detailModel = new DetailModel()

const app = getApp()
Page({
  data:{
    wxParseData: '',
    id: '',
    order_id: '',
    item: {},
  },
  onLoad(options){
    const { id = '', order_id = '' } = options
    this.setData({
      id,
      order_id,
    })
    
    this._fetchData()    
  },

  _fetchData() {
    const data = {
      id: this.data.id,
      order_id: this.data.order_id,
    }
    detailModel.getCouponDetailData(data, res => {
      this.setData({
        item: res.data,
        wxParseData: WxParse.wxParse('article', 'html', res.data.details, this)
      })
    })
  },
})