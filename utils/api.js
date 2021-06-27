import common from "./common.js"
let formHeader = {
  "content-type": 'application/x-www-form-urlencoded'
}
let header = ""

let environment = 'public'
function getHttpUrl() {
  if (environment == 'public') {
    return "http://192.168.1.9:8080"
  }
  if (environment == 'test') {
    return "http://192.168.8.126:8087"
  }
  if (environment == 'hefei') {
    return "https://hfgajg.top"
  }

}

let currentUser = ""

function fetchData(url, payload, success, error, method, header) {
  let defaultHeader = {
    'content-type': 'application/json'
  }
  if (!header) {
    header = {}
  }
  currentUser = wx.getStorageSync('accessToken');
  header.token = currentUser;
  wx.request({
    url: getHttpUrl() + url,
    data: payload,
    method: method ? method : "GET",
    header: header || defaultHeader,
    success(res) {
      wx.stopPullDownRefresh();//停止下拉刷新
      wx.hideLoading();//关闭loading
      let data = res.data;
      if (data.code == 200 || data.code == 204) {
        success && success(data.data);
      } else if (data.code == 401) {
        // wx.showModal({
        //   title: '需要登陆',
        //   content: '请点击确定跳转到注册页面',
        //   showCancel:false,
        //   success(res){
        //     wx.navigateTo({
        //       url: '/pages/register/home/index',
        //     })
        //   }
        // })
        //重新登录
        // common.toast(data.msg)
      } else {
        common.toast(data.msg || data.message || "服务器错误", "none", 1500);
      }
    },
    fail(err) {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      error && error("网络错误或服务器资源不可用")
    }
  })
}

let api = {
  get: function (url, payload, noLoading) {
    if (noLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    return new Promise((resolve, reject) => {
      fetchData(url, payload, resolve, reject);
    })
  },
  post: function (url, payload, noLoading) {
    if (noLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    return new Promise((resolve, reject) => {
      fetchData(url, payload, resolve, reject, "POST")
    })
  },
  getHttpUrl() {
    return getHttpUrl();
  },
}

module.exports = api