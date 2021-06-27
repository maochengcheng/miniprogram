// pages/notice/notice.js
var wxParse = require("../../components/wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meet:"",
    caption:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMeet();
    this.getCaption();
  },
  /**
   * @description:获取会见须知
   */
  getMeet(){
    var that =this;
    let query = {
      type:2,
    }
    wx.showLoading({
      title: '加载中..',
      mask:true
    })
    getApp().api.get("/api/access/appointmentSettings",query).then(res=>{
     this.setData({
       meet:res
     })
      var detail_content = res[0].note;
      wxParse.wxParse('detail_content', 'html', detail_content,that,5)
    })
  },
  /**
   * @description:获取温馨提示
   */
  getCaption() {
    let query = {
      type: 4
    }
    // wx.showLoading({
    //   title: '加载中...',
    //   mask:true
    // })
    getApp().api.get("/api/access/appointmentSettings", query).then(
      (res) => {
        this.setData({
          caption: res[0],
         
        })
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})