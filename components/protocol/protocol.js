// components/protocol/protocol.js
var wxParse = require("../../components/wxParse/wxParse.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: String,
      value: "",
      observer(newval, oldval) {
        console.log(newval)
        if(newval){
          wxParse.wxParse('detail_content', 'html', newval, this, 5)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    meet:'',
  },
  onLoad(){
    this.getReserveDetail();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @description:关闭
     */
    close(){
      this.triggerEvent('close')
    },
    /**
     * @description:阅读并同意
     */
    confirm(){
      this.triggerEvent('confrim')
    }
  }
})
