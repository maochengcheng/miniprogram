// pages/register/other.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     lay:{
       phone:"",
       code:""
     },
     countdown:0,
     codeName:"获取验证码"
  },
  /**
   * 获取手机号和验证码
   */
  getInputValue(e){
    let key = getApp().common.ed(e,"key");
    this.data.lay[key] = e.detail.value;
    this.setData({
      lay:this.data.lay
    })
  },
  /**
   * 
   * 发送手机验证码 
   */
  sendCode(){
    let lay = this.data.lay;
    if(!lay.phone){
      getApp().common.toast("请先输入手机号",'none');
      return;
    }
    if(!getApp().filter.phone(lay.phone)){
      getApp().common.toast("请输入正确的手机号！");
      return;
    }
    if(this.data.countdown){
      getApp().common.toast("请"+this.data.countdown+'S后再试');
      return;
    }
    let query = {
      phone:lay.phone
    }
    wx.showLoading({
      title: '获取中..',
      mask: true
    })
    getApp().api.post("/api/user/verificationCode",lay.phone).then(
      (res)=>{
        console.log(res)
        getApp().common.toast("获取验证码成功");
        this.setData({
          countdown:60,
        })
        this.startCountdown();
      }
    )
  },
    /**
   * @description:开始倒计时
   * @param {*} options 
   */
  startCountdown(){
    this.setData({
      countdown:this.data.countdown>0?this.data.countdown-1:0
    })
    this.setData({
      codeName:this.data.countdown?this.data.countdown+'S':'获取验证码'
    })
    if(this.data.countdown){
      setTimeout(()=>{
        this.startCountdown();
      },1000)
    }
    },
  /**
   * 手机号登陆、换绑
   */
  phoneLogin(){
    let lay = this.data.lay;
    if(!getApp().filter.phone(lay.phone)){
      getApp().common.toast("请输入正确的手机号！");
      return;
    }
    if(!lay.phone){
      getApp().common.toast("请输入正确的手机号！");
      return;
    }
    if(!lay.code){
      getApp().common.toast("请输入验证码！");
      return;
    }
    let query = {
      phone:lay.phone,
      phoneCode:lay.code
    }
      wx.showLoading({
      title: '换绑中...',
      mask:true
    })
    getApp().api.get("/api/user/phoneLogin",query).then(
      (res)=>{
        getApp().common.toast("换绑成功","success",700);
        wx.setStorageSync("user", res)
        setTimeout(()=>{
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },700)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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