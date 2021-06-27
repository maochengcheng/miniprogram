//app.js
import api from "./utils/api.js"
import common from "./utils/common.js"
import upload from "./utils/upload.js"
import filter from "./utils/filter.js"
import {login} from "./utils/login.js"
import {getInfo} from "./utils/userInfo.js"
let iPhone = false;
let width = ""
App({
  onLaunch: function () {
    // 展示本地存储能力

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        iPhone = res.model.indexOf("iPhone X") > -1
        width = res.windowWidth
      },
    })
  },
  checkiPhone() {
    return iPhone
  },
  returnWidth(){
    return width
  },
  api: api,
  common: common,
  filter: filter,
  login: login,
  getInfo:getInfo,
  upload: upload.uploadImg
})