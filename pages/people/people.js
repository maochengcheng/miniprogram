// pages/people/people.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPeopleInfo();
  },
  /**
   * @description:跳转到注册页重新提交信息审核
   */
  renewAuth(e){
    wx.setStorageSync("wechat_user", e.detail.userInfo);
    wx.navigateTo({
      url: '/pages/register/commit/commit?type=renew',
    })
  },
  /**
   * @description:获取用户详情
   */
  getPeopleInfo(){
    let user = wx.getStorageSync("user");
    if(user){
      this.setData({
        info:user
      })
    }
  },
  /**
   * @description:跳转到联系管理员
   */
  goPhone(){
    wx.navigateTo({
      url: '/pages/phone/phone',
    })
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