// pages/register/commit/commit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphone: getApp().checkiPhone()?'padding-bottom:168rpx;':'padding-bottom:100rpx;',
    selectProtocol:false,
    httpUrl:getApp().api.getHttpUrl(),
    user:"",
    lay:{
      name:"",
      phone:"",
      idNumber:"",
      lawyer:"",
      lawOffice:"",
      code:'',
      // photo:"",
      certificate:[]
    },
    gender:{
      'MALE':"男",
      "FEMALE":'女'
    },
    showProtocol:false,
    caption:"",
    codeName:"获取验证码",
    countdown:0,
    type:''
  },

  /**
   * @description:选择性别
   */
  selectSex(){
    let list = [
      '男',
      '女'
    ]
    let typeList = [
      'MALE',
      'FEMALE'
    ]
    let that = this;
    wx.showActionSheet({
      itemList: list,
      success(res){
        that.data.lay.gender = typeList[res.tapIndex]
        that.setData({
          lay:that.data.lay
        })
      }
    })
  },

  /**
* @description:获取会见须知
*/
  getMeet() {
    var that = this;
    let query = {
      type: 11,
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
  /**
   * @descriptio:获取验证码
   * @param { phone} 
   */
  getCode(){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getStorageSync("wechat_user");
    this.setData({
      user: info
    })
    let type = options.type;
    if(type&&type=='renew'){
      wx.setNavigationBarTitle({
        title: '提交审核',
      })
      this.setData({
        type:type
      })
      let user = wx.getStorageSync("user");
      this.setData({
        lay:{
          name:user.name,
          phone:user.phone,
          gender:user.gender,
          idNumber:user.idNumber,
          lawyer:user.licenseNumber,
          lawOffice:user.lawOffice,
          certificate: user.qualifications   
        }
      })
    }
    this.getMeet();
  },
  /**
   * @description:注册提交
   */
  submit(){
    let lay = this.data.lay;
    let user = this.data.user;
    if (!lay.name || !lay.phone ||!lay.gender || !lay.idNumber || !lay.lawyer || !lay.lawOffice || !lay.certificate.length){
      getApp().common.toast("请完善注册信息！");
      return;
    }
    if(lay.certificate.length!=2){
      getApp().common.toast("请上传完整的资料");
      return;
    }
    if(!getApp().filter.name(lay.name)){
      getApp().common.toast("请输入正确的姓名");
      return;
    }
    if(!getApp().filter.phone(lay.phone)){
      getApp().common.toast("请输入正确的手机号！");
      return;
    }
    // if(!lay.code){
    //   getApp().common.toast("请输入验证码");
    //   return;
    // }
    if(!getApp().filter.idNumber(lay.idNumber)){
      getApp().common.toast("请输入正确的身份证号！");
      return;
    }
    if(!getApp().filter.id(lay.lawyer) || lay.lawyer.length!=17){
      getApp().common.toast("请输入正确的律师证号");
      return;
    }
    // if (!getApp().filter.name(lay.lawOffice)){
    //   getApp().common.toast("请输入正确的事务所名称");
    //   return;
    // }
    if (!this.data.selectProtocol){
      getApp().common.toast("请阅读并同意用户服务协议");
      return;
    }
    let query = {
      wechatAvatar: user.avatarUrl,
      gender: lay.gender,
      idNumber: lay.idNumber,
      licenseNumber: lay.lawyer,
      // faceImg: lay.photo,
      name: lay.name,
      phone: lay.phone,
      qualifications:lay.certificate,
      lawOffice: lay.lawOffice,
      code:""
    }
    wx.showLoading({
      title: !this.data.type?'注册中...':'提交中...',
      mask:true
    })
    if(!this.data.type){

      getApp().api.post("/api/user/registered",query).then((res)=>{
        getApp().common.toast("注册成功","success",700);
        wx.setStorageSync("user", res)
        wx.requestSubscribeMessage({
          tmplIds: ['-jeAK0_NWw9G4OluNr0-Tyqubjjmaqx9MpRUibjpSC4'],
          success (res) { },
          complete(){
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/index/index',
              })
            },700)  
          }
        })
      })
    }else if(this.data.type && this.data.type=='renew'){
      getApp().api.post("/api/user/review",query).then((res)=>{
        getApp().common.toast("提交成功","success",700);
        wx.setStorageSync("user", res)
        wx.requestSubscribeMessage({
          tmplIds: ['-jeAK0_NWw9G4OluNr0-Tyqubjjmaqx9MpRUibjpSC4'],
          success (res) { },
          complete(){
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/index/index',
              })
            },700)  
          }
        })
      })
    }
  },
  /**
   * @description:删除图片
   */
  del(e){
    let index = getApp().common.ed(e,"index");
    let lay = this.data.lay;
    lay.certificate.splice(index,1);
    this.setData({
      lay:lay
    })
  },
  /**
   * @description:获取表单值
   */
  getValue(e){
    let name = getApp().common.ed(e,"name");
    this.data.lay[name] = e.detail.value;
    this.setData({
      lay:this.data.lay
    })
  },

  /**
   * @description:选择协议
   * 
   */
  selectPro(){
    this.setData({
      selectProtocol:!this.data.selectProtocol
    })
  },

  /**
   * @description:上传照片 
   */
  uploadImg(){
    let lay = this.data.lay;
    getApp().upload((img)=>{
      lay.photo = img;
      this.setData({
        lay:lay
      })
    })
  },
  /**
   * @descripiton:上传律师执业证
   */
  uploadCertificate(){
    let lay = this.data.lay;
    getApp().upload((img) => {
      let item = {
        path:img,
        type:1
      }
      lay.certificate.push(item);
      this.setData({
        lay:lay
      })
    })
  },
  /**
   * @description:预览图片
   */
  previewImg(e){
    let url = getApp().common.ed(e,"url");
    let urls = this.data.lay.certificate;
    console.log(url,urls)
    wx.previewImage({
      url:url,
      urls: urls.map(it=>{
        return this.data.httpUrl+'/'+it.path
      }),
    })
  },
  /**
 * @description:关闭协议弹窗和打开
 */
  closeProtocol() {
    this.setData({
      showProtocol: !this.data.showProtocol
    })
  },
  /**
   * @description:同意协议
   */
  confrimProtocol() {
    this.setData({
      selectProtocol: true,
      showProtocol: !this.data.showProtocol
    })  },
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