
function getInfo(cb){
  wx.getSetting({
    success(res){
      if(res.authSetting['scope.userInfo']){
        cb && cb (true)
      }else{
        console.log(res)
        wx.authorize({
          scope: 'userInfo',
          success(){
            cb && cb (true)
          },fail(){
            cb && cb (false)
          }
        })
      }
    }
  })
}

module.exports={
  getInfo:getInfo
}