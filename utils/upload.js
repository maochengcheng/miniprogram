import api from "api.js";
import common from "common.js";
let header = {};

let upload = {
  uploadImg: function (cb) {
    if (wx.getStorageSync('accessToken')) {
      header.token = wx.getStorageSync('accessToken');
    }
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let paths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中...',
          mask: true
        })
        wx.uploadFile({
          url: api.getHttpUrl() + "/other/upload",
          filePath: paths[0],
          header: header,
          name: 'file',
          success: function (el) {
            wx.hideLoading()
            let data = JSON.parse(el.data);
            if (el.statusCode == 200 && data.code==200) {
              data.data.replace("/\\/", "/");
              cb && cb(data.data)
            } else {
              common.toast(data.msg || data.error, "none")
            }
          },
          fail() {
            wx.hideLoading();
            common.toast("网络错误或服务器资源不可用", "none")
          }
        })
      },
      fail: function (err) {
        console.log(err)
        common.toast("未选择图片", "none")
      }
    })
  }
}

module.exports = upload 