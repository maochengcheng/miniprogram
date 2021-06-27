function update() {
  if (wx.canIUse("getUpdateManager")) {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      console.log(res);

      if (res.hasUpdate) {
        updateManager.onUpdateReady(res => {
          wx.showModal({
            title: '更新提示',
            content: '小程序有新的版本，是否更新？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          wx.showModal({
            title: '已有新版本',
            content: '新版本已上线，请删除当前小程序，重新搜索打开',
          })
        })
      }
    })
  } else {
    wx.showModal({
      title: '温馨提示',
      content: '当前微信版本过低，无法支持该功能，请升级到最新版本微信后重试',
    })
  }
}

module.exports = update