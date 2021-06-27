// pages/register/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caption:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMeet();
  },
  /**
* @description:获取会见须知
*/
  getMeet() {
    var that = this;
    let query = {
      type: 10,
    }
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    getApp().api.get("/api/access/appointmentSettings", query).then(res => {
      this.setData({
        caption: res[0]
      })
    })
  },
  goRegister(e){
    if(e.detail.userInfo){
      wx.setStorageSync("wechat_user", e.detail.userInfo);
      wx.navigateTo({
        url: '../commit/commit',
      })
    }
  },
  goOther(e){
    if(e.detail.userInfo){
      wx.setStorageSync("wechat_user", e.detail.userInfo);
      wx.navigateTo({
        url: '../other/other',
      })
    }
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