// pages/phone/phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhone();
  },
  /**
   * @description:获取联系方式
   */
  getPhone(){
    let query = {
      type: 6
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    getApp().api.get("/api/access/appointmentSettings", query).then(
      (res) => {
        this.setData({
          phone: res,
        
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})