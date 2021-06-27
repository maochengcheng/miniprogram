import api from "api.js";

function checkToken(status,cb) {
  wx.checkSession({
    success() {
      login(status,cb);
      // getSessionToken(cb)
    },
    fail() {
      login(status,cb);
    }
  })
}

function getSessionToken(cb) {
  let token = wx.getStorageSync("accessToken");
  if (!token) {
    login(cb);
  } else {
    let user = wx.getStorageSync("user");
    if (!user || !user.name) {
      cb && cb({ register:true})
    } else {
      cb && cb({ login: true})
    }
  }
}

function login(status,cb) {
  if (status){
    sloading("正在登录");
  }
  wx.login({
    success(res) {
      if (res.code) {
        getApp().api.get("/api/user/login", {
          code: res.code
        }).then(
          (res) => {
            loginSuccess(res, cb)
          }
        ).catch(
          err => {
            getApp().common.toast(err.msg)
            cb && cb({ login: false })
          }
        )
      } else {
        getApp().common.toast("登录失败", true)
        cb && cb({ login: false })
      }
    }
  })
}

function sloading(show) {
  if (!show) {
    wx.hideLoading();
  } else {
    wx.showLoading({
      title: show,
      mask: true
    })
  }
}


function loginSuccess(data, cb) {
  wx.setStorageSync("accessToken", data.token);
  // wx.setStorageSync("platfromId", data.user.platform_id);
  wx.setStorageSync("user", data)
  
  if(data.name){
    cb && cb({ login:true})
  }else{  
    cb && cb({ register: true})
  }
}

module.exports = {
  login: checkToken
}