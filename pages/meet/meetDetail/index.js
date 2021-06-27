// pages/meet/meetDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphone: getApp().checkiPhone() ? 'padding-bottom:168rpx;' : 'padding-bottom:100rpx;',
    httpUrl: getApp().api.getHttpUrl(),
    detail:"",//详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = wx.getStorageSync("reserve_detail")
    this.setData({
      detail: detail
    })
  },
  /**
   * @description:预览图片
   */
  previewImg(e){
    let url = getApp().common.ed(e,"url");
    let type = getApp().common.ed(e,"type");
    let list = this.data.detail['qualifications'+type];
    let http = this.data.httpUrl;
    wx.previewImage({
      url:url,
      urls: list.map(it => {
        return http + '/' + it.path
      })
    })
  },
  /**
   * @description:取消预约
   */
  cancel(){
    let item = this.data.detail;
    let query = {
      accessId: item.id
    }
    let _this = this;
    wx.showModal({
      title: '提示',
      content: "确定要取消预约吗?",
      cancelText: "不取消",
      confirmText: "取消预约",
      confirmColor: "#2987F9",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
            mask:true
          })
          getApp().api.get("/api/access/cancelAccess", query).then(
            (res) => {
              getApp().common.toast("取消成功", "success");
              wx.navigateBack()
            }
          )
        }
      }
    })
  },
  /**
   * @description:再次预约
   */
  align(e) {
    let item = this.data.detail;
    let type = item.type == 'OFFLINE' ? 'reserve' : 'video'
    wx.navigateTo({
      url: '/pages/meet/meetCommit/index?type=' + type,
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