// pages/meet/meetList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [{
      name: "全部",
    }, {
      name: "已通过"
    }, {
      name: "待审核"
    }, {
      name: "已拒绝"
    }, {
      name: "已取消"
    }],
    type: "", //类别
    margin: '5%',
    currnet: 0, //选中
    list: [], //数据列表
    pageNum: 1,
    pageSize: 10,
    totalPage: 1, //总页数
    loading: false, //加载状态
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type
    })
    wx.setNavigationBarTitle({
      title: options.type == 'video' ? '远程会见' : '预约会见',
    })
   
  },
  /**
   * @description:选择菜单
   * @date:2019-12-30
   */
  selectMenu(e) {
    let index = getApp().common.ed(e, "index");
    let margin = index * 20 + 5 + "%";
    this.setData({
      currnet: index,
      margin: margin,
      pageNum: 1,
    })
    this.getList(true);
  },
  /**
   * @descripiton:查看详情
   * @date:2020-01-01
   */
  goDetail(e) {
    let index = getApp().common.ed(e, "index");
    let item = this.data.list[index];
    wx.setStorageSync("reserve_detail", item);
    wx.navigateTo({
      url: "../meetDetail/index",
    })
  },
  /**
   * @description:获取列表
   */
  getList(status) {
    let query = {
      type: this.data.type == 'video' ? "ONLINE" : "OFFLINE",
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      certification: ["", "PASS", "UNREVIEWED", "REJECTED", "CANCEL"][this.data.currnet]
    }
    for (let key in query) {
      if (!query[key] && query[key] !== 0) {
        delete query[key];
      }
    }
    this.setData({
      loading: true
    })
    if(status){
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
    }
    getApp().api.get("/api/access/obtainAccess", query).then(
      (res) => {
        let list = this.data.list;
        if (this.data.pageNum == 1 || !list) {
          list = []
        }
        let contents = res.contents;
        contents.forEach(it => {
          it.appointmentTime = getApp().common.changeDate(it.appointmentTime.replace("-", "/").replace("-", "/"),true)
        })
        contents = list.concat(contents);
        this.setData({
          list: contents,
          totalPage: res.page.pages,
          loading: false
        })
      }
    )
  },
  /**
   * @description:取消预约
   */
  cancel(e) {
    let index = getApp().common.ed(e, "index");
    let list = JSON.parse(JSON.stringify(this.data.list));
    let item = list[index];
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
              if (!_this.data.currnet) {
                item.certification = "CANCEL"
                list[index] = item;
              } else {
                list.splice(index, 1);
                if(list.length==0){
                  _this.data.pageNum = 1;
                  _this.getList();
                }
              }
              _this.setData({
                list: list
              })
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
    let index = getApp().common.ed(e, "index");
    let item = this.data.list[index];
    let type = item.type == 'OFFLINE' ? 'reserve' : 'video'
    wx.navigateTo({
      url: '/pages/meet/meetCommit/index?type=' + type,
    })
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
    this.getList();
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
    if (this.data.pageNum < this.data.totalPage) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getList();
    }
  },


})