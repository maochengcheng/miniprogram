//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    banner: [
      "/images/show_one.png"
    ],
    httpUrl: getApp().api.getHttpUrl(),
    height: getApp().returnWidth() / 2.3667,
    user: {}, //用户信息
    caption: "", //温馨提示
    note: "",
    i: 1,
    banner: [], //轮播图
    menus: [{
      name: "预约会见",
      bg: "/images/menu-one.png",
      url: "/pages/meet/meetCommit/index?type=reserve",
      no: true,
    }, {
      name: "我的会见",
      bg: "/images/menu-two.png",
      url: "/pages/meet/myMeet/index",
    },
    //  {
    //   name: "远程会见",
    //   bg: "/images/menu-three.png",
    //   url: "/pages/meet/meetCommit/index?type=video",
    //   no: true,
    //   first:true,
    // },
     {
      name: "会见须知",
      bg: "/images/menu-four.png",
      url: "/pages/notice/notice"
    }, {
      name: "个人资料",
      bg: "/images/menu-five.png",
      url: "/pages/people/people"
    }, {
      name: "联系我们",
      bg: "/images/menu-six.png",
      url: "/pages/phone/phone"
    }],
    isFirst: true,
  },
  onLoad: function() {

    getApp().login(true, res => {
      this.setData({
        isFirst: false
      })
      if (res.register) {
        wx.redirectTo({
          url: '/pages/register/home/index',
        })
      }
      if (res.login) {
        this.getUserInfo();
        this.getBanner();
        // this.getCaption();
      }
    })
  },
  onShow() {
    if (!this.data.isFirst) {

      getApp().login(false, res => {
        if (res.register) {
          wx.redirectTo({
            url: '/pages/register/home/index',
          })
        }
        if (res.login) {
          this.getUserInfo();
          this.getBanner();
          // this.getCaption();
        }
      })
    }
    // this.getUserInfo(false);
    // this.getBanner(false);
    // // this.getCaption(false);

  },
  /**
   * 问题提示滚动
   */
  scrollLetter() {


  },
  /**
   * @description:跳转到菜单所指链接
   */
  goUrl(e) {
    let index = getApp().common.ed(e, "index");
    let user = this.data.user;
    let url = this.data.menus[index].url;
    let first = this.data.menus[index].first;
    if(first){
      wx.showModal({
        content:"是否是第一次预约",
        confirmText:"是",
        cancelText:'否',
        success(res){
          if(res.confirm){
            getApp().common.toast("第一次预约请使用预约会见",'none')
          }else if(res.cancel){
            wx.navigateTo({
              url: url,
            })
          }
        }
      })
      return;
    }
    wx.navigateTo({
      url: url,
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
      }
    )
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
          caption: res,
          note: res && res.length ? res[0].note : ''
        })
      }
    )
  },
  /**
   * @description:获取轮播图
   */
  getBanner() {
    getApp().api.get("/api/user/carousel").then(
      (res) => {
        this.setData({
          banner: res
        })
      }
    )
  }
})