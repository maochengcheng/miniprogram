// pages/meet/meetCommit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphone: getApp().checkiPhone() ? 'padding-bottom:168rpx;' : 'padding-bottom:100rpx;',
    httpUrl: getApp().api.getHttpUrl(),
    type: "", //类别
    times: [],
    selects: ['是', '否'],
    currentTime: 0, //选中时间段 
    layDate: "", //选中时间
    layFrist: "", //是否初次会见
    orderQuantity: 0, //订餐数量
    layQuantity: "", //是否订餐
    selectProtocol: false, //是否选择协议,
    layNumber: "", //车牌号,
    layName: "", //被会见人姓名
    birthday:"", //被会见人出生日期
    layCenterName: "", //看守所名称
    layCenterId: "", //看守所id
    layLetter: [], //介绍信
    layCeri:[{},{}],//律师证
    layBook: [], //委托书
    showProtocol: false, //显示协议
    showPlate: false, //显示车牌输入框
    weekList: [], //
    dententionList: [], //看守所列表
    reseveCaption:"",//预约会见提示
    detail_content:'',
    laylawsuitStatus:"", //诉讼状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type
    })
    if (options.type == 'reserve') {
      this.setData({
        layCenterName: "",
        layCenterId: ""
      })
    }
    wx.setNavigationBarTitle({
     // title: options.type == 'video' ? '远程会见' : '预约会见',
     title: options.type == 'video' ? '预约会见' : '预约会见',
    })
    this.getPeriod();
    // this.checkTime();
    this.getUserInfo();
    this.getDentention();
    this.getMeet();
    this.getReserveDetail();
  },
  /**
    * @descripiton:获取弹窗预约须知
    */
  getReserveDetail() {
    var that = this;
    let query = {
      type: 2,
      detentionName:this.detentionName
    }
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    getApp().api.get("/api/access/appointmentSettings", query).then(res => {
      this.setData({
        meet: res,
        detail_content:res[0].note
      })
    })
  },
  /**
 * @description:获取会见须知
 */
  getMeet() {
    var that = this;
    let query = {
      type: 9,
    }
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    getApp().api.get("/api/access/appointmentSettings", query).then(res => {
      this.setData({
        reseveCaption: res[0]
      })
    })
  },
  /**
   * @description:获取看守所名称
   */
  selectDontention(e) {
    console.log(e)
    this.setData({
      layCenterName: this.data.dententionList[Number(e.detail.value)].name,
      layCenterId: this.data.dententionList[Number(e.detail.value)].id
    })
    this.getPeriod();
  },
  /**
   * @description:获取看守所名称
   */
  getDentention() {
    let query = {
      size:9999,
      freeze:1
    }
    getApp().api.get("/api/access/detentionCenter",query).then(
      (res) => {
        this.setData({
          dententionList: res.content
        })
      }
    )
  },
  /**
   * @description:获取七天
   */
  getSeven(cb) {
    if(cb){
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
    }
    getApp().api.get("/api/access/workingDay").then(
      (res) => {
        this.setData({
          weekList: res
        })
        cb && cb()
      }
    )
  },
  /**
   * @description:消息申请 
   */
  message() {
    wx.requestSubscribeMessage({
      tmplIds: ['9d2nJW4WO9WPE_MZCR8AJ-BLyUm0uQ6DiWDKjOpkS4o','UAmdZmBpZmuGZ4KTU2LQkfRiAC0UGJp2z9l3Atnrxuc'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log(res)
      },
      fail(res) {
        if (res.errCode == 20004){

        wx.showModal({
          title: '温馨提示',
          content: '未同意使用订阅消息，将接收不到审核结果通知，是否前往设置打开',
          success(res){
            if(res.confirm){
              wx.openSetting({
                withSubscriptions:true
              })
            }
          }
        })
        }
      }
    })
  },
  /**
   * @description:检查是否在预约开放时间：08:30-16:00
   */
  checkTime() {
    let date = getApp().common.changeDate();
    let newDate = getApp().common.changeDate("", true);
    let start = date + ' 08:00:00';
    let end = date + ' 16:00:00';
    if (new Date(newDate).getTime() < new Date(start).getTime() || new Date(newDate).getTime() > new Date(end).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '预约会见时间为早上8:30至下午16:00',
        showCancel: false,
        success(res) {
          wx.navigateBack()
        }
      })
      return;
    }
  },
  /**
   * @description:检查是否被封号
   */
  check() {
    let user = this.data.user;
    console.log(user)
    if (new Date().getTime() < new Date(user.violationDate).getTime()) {
      wx.showModal({
        title: '温馨提示',
        content: '您已被封，暂时不可预约。解封日期为' + user.violationDate + ",请联系管理员解封。",
        showCancel: false,
        success(res) {

          wx.navigateBack()
        }
      })
      return;
    }
  },
  /**
   * @description:获取时间段
   */
  getPeriod() {
    let current = this.data.layDate ? getApp().common.changeDate(new Date(this.data.layDate).getTime()) : getApp().common.changeDate(new Date().getTime() + (1000 * 60 * 60 * 24));
    let detentionName=this.data.layCenterName;
    let query = {
      type: this.data.type=='video'?7:3,
      timestamp: current + " 00:00:00",
      data: current,
      detentionName:detentionName
    }
    getApp().api.get('/api/access/appointmentSettings', query).then(
      (res) => {
        this.setData({
          times: res,
          layDate: current
        })
      }
    )
  },
  /**
   * @description:选择时间
   */
  selectTime(e) {
    let index = getApp().common.ed(e, "index");
    this.setData({
      currentTime: index
    })
  },

 /**
   * @description:选择被会见人出生日期
   */
  birthdayDate(e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  /**
   * @description:选择日期
   */
  selectDate(e) {
    let date = new Date(e.detail.value).getTime();
    let start = new Date(getApp().common.changeDate(new Date().getTime())).getTime();
    let last = 1000 * 60 * 60 * 24 * 3;
    if (date < start) {
      getApp().common.toast("不能预约过去的时间");
      return;
    }
    if (date == start) {
      getApp().common.toast("不能预约今天");
      return;
    }
    if (date - start > last) {
      getApp().common.toast("预约日期不能大于3天");
      return;
    }
    this.setData({
      layDate: e.detail.value
    })
    this.getPeriod();
  },
  /**
   * @description:选择是否初次会见
   */
  selectFrist(e) {
    this.setData({
      layFrist: Number(e.detail.value) ? '否' : '是'
    })
  },
  /**
   * 选择是否订餐
   */
  selectFood(e) {
    this.setData({
      layQuantity: Number(e.detail.value) ? '否' : '是'
    })
  },
  /**
   * 获取份数
   */
  getQuantity(e) {
    this.setData({
      orderQuantity: Number(e.detail.value)
    })
  },
  /**
   * @description:选择协议
   * 
   */
  selectPro() {
    this.setData({
      selectProtocol: !this.data.selectProtocol
    })
  },
/**
 * @description:上传律师证
 * @param {} e 
 */
upLaywer(e){
  let index = getApp().common.ed(e,"index");
  getApp().upload(img=>{
    let item = {
      path:img,
      type:4,
    }
    let list =this.data.layCeri;
    list[index] = item;
    this.setData({
      layCeri:list
    })
  })
},

  /**
   * @description:上传介绍信
   */
  uploadImg(e) {
    let type = getApp().common.ed(e,"type");
    getApp().upload((img) => {
      let item = {
        path: img,
        type: type ? type:2
      }
      let letter = this.data.layLetter;
      let list =this.data.layCeri;
      if(item.type==2){
        letter.push(item);
      }else{
        list.push(item);
      }
      this.setData({
        layLetter: letter,
        layCeri:list
      })
    })
  },
  /**
   * @description:获取车牌号
   */
  getNumber(e) {
    this.setData({
      layNumber: e.detail.value
    })
  },
  /**
   * @description:获取姓名
   */
  getName(e) {
    this.setData({
      layName: e.detail.value
    })
  },
    /**
   * @description:获取诉讼状态
   */
  lawsuitStatusInput(e) {
    this.setData({
      laylawsuitStatus: e.detail.value
    })
  },
  /**
   * @descripiton:上传当事人委托书
   */
  uploadCertificate() {
    getApp().upload((img) => {
      let item = {
        path: img,
        type: 3
      }
      let book = this.data.layBook;
      book.push(item)
      this.setData({
        layBook: book
      })
    })
  },
  /**
   * @description:检查
   */
  checkTimeTwo() {
    let date = new Date(getApp().common.changeDate('', true)).getTime();
    // let date = new Date(getApp().common.changeDate() + ' 16:30:00').getTime();
    let four = new Date(getApp().common.changeDate() + ' 16:00:00').getTime();
    let morning = new Date(getApp().common.changeDate() + ' 08:30:00').getTime();

    if (date >= four) {
      let list = this.data.weekList.filter(it => {
        return it.work;
      })
      if (!list && !list.length) {
        getApp().common.toast("目前不能预约");
        return false;
      }
      let item = list[0];
      if (item.date == this.data.layDate) {
        getApp().common.toast("16:00点后不能预约下个工作日");
        return false;
      } else {
        return true;
      }
    } 
    // else if(date<morning){
    //   getApp().common.toast("目前不能预约，预约开始时间为08:30");
    //   return false;
    // }
    else {
      return true;
    }
  },
  /**
   * @description:确定预约
   */
  submit() {
    this.getSeven(()=>{
      if (!this.checkTimeTwo()) {
        return;
      }
      let item = this.data.times[this.data.currentTime];
      if (!this.data.times.length) {
        getApp().common.toast("请联系管理员设置时间段");
        return;
      }
      if (item.peopleNumber <= 0) {
        getApp().common.toast("当前时间段已无预约次数!");
        return;
      }
      if (!this.data.layDate) {
        getApp().common.toast("请选择预约日期!");
        return;
      }
      if (!this.data.layName) {
        getApp().common.toast("请输入被会见人姓名!");
        return;
      }
      if (!this.data.birthday) {
        getApp().common.toast("请输入被会见人出生日期!");
        return;
      }
      if (!getApp().filter.name(this.data.layName)) {
        getApp().common.toast("请输入正确的姓名");
        return;
      }
      // if (!this.data.layFrist && this.data.type != 'video') {
      //   getApp().common.toast("请选择是否初次会见!");
      //   return;
      // }
      if (this.data.layCeri.filter((it)=>{
        return it.path
      }).length<2 && this.data.type == 'video') {
        getApp().common.toast("请上传律师证!");
        return;
      }
      if (!this.data.layLetter.length && this.data.type == 'video') {
        getApp().common.toast("请上传介绍信!");
        return;
      }
      if (!this.data.layBook.length && this.data.type == 'video') {
        getApp().common.toast("请上传委托书!");
        return;
      }
      // if (this.data.layNumber && !getApp().filter.plateNumber(this.data.layNumber)) {
      //   getApp().common.toast('请输入正确的车牌号');
      //   return;
      // }
      if (!this.data.layCenterId) {
        getApp().common.toast("请选择看守所");
        return;
      }
      if (this.data.layQuantity == '是') {
        let reg = /^[1-9]\d*$/
        if (!reg.test(this.data.orderQuantity)) {
          getApp().common.toast("请输入正确的订餐份数")
          return;
        }
      }
      if (!this.data.selectProtocol) {
        getApp().common.toast("请阅读并同意预约须知");
        return;
      }
      let date = this.data.layDate.replace('-', '/').replace('-', '/');
      let query = {
        detentionCenterId: this.data.layCenterId,
        detentionCenterName: this.data.layCenterName,
        numberplate: this.data.layNumber,
        suspectsName: this.data.layName,
        birthDay: this.data.birthday,
        lawsuitStatus: this.data.laylawsuitStatus,
        type: this.data.type == 'video' ? "ONLINE" : "OFFLINE",
        qualifications: this.data.layLetter.concat(this.data.layBook).concat(this.data.layCeri),
        first: this.data.layFrist == '是' ? true : false,
        orderQuantity: this.data.orderQuantity,
        appointmentTime: new Date(date + " " + item.period + ":00").getTime()
        // appointmentTime: this.data.layDate + " " + item.period + ":00",
        // appointmentTimeLong: this.data.layDate + " " + item.period + ":00",
  
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      getApp().api.post("/api/access/insertAccess", query).then(
        (res) => {
          getApp().common.toast("预约成功", "success", 700);
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/meet/meetList/index?type=' + this.data.type,
            })
          }, 700)
        }
      )
    });
  },
  /**
   * @description:删除律师证
   */
  delCeri(e){
    let index = getApp().common.ed(e,"index");
    let list = this.data.layCeri;
    list[index]={};
    this.setData({
      layCeri:list
    })
  },
  /**
   * @description:删除介绍信
   */
  delLetter(e) {
    let index = getApp().common.ed(e, "index");
    let list = this.data.layLetter;
    list.splice(index, 1);
    this.setData({
      layLetter: list
    })
  },
  /**
   * @description:删除委托书
   */
  delBook(e) {
    let index = getApp().common.ed(e, "index");
    let list = this.data.layBook;
    list.splice(index, 1);
    this.setData({
      layBook: list
    })
  },
  /**
   * @description:预览图片
   */
  previewImg(e) {
    let index = getApp().common.ed(e, "index");
    let type = getApp().common.ed(e, "type");
    let http = this.data.httpUrl;
    let list = type == 'book' ? this.data.layBook : this.data.layLetter;
    let url = http + '/' + list[index].path;
    console.log(list, url)
    wx.previewImage({
      url: url,
      urls: list.map(it => {
        return http + '/' + it.path
      })
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
    })
  },
  /**
   * @description:打开或者关闭车牌输入框
   */
  closePlate(e) {
    this.setData({
      showPlate: !this.data.showPlate
    })
  },
  /**
   * @description:获取车牌输入结果
   */
  getResult(e) {
    this.setData({
      showPlate: false,
      layNumber: e.detail.result
    })
  },
  /**
   * @description:更新用户信息
   */
  getUserInfo() {
    getApp().api.get("/api/user/getInfo").then(
      (res) => {
        wx.setStorageSync("user", res);
        this.setData({
          user: res
        })
        this.check()
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getSeven();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})