let common = {
  ed: function (e, name) {
    if (!e.target.dataset[name]) {
      return e.currentTarget.dataset[name];
    }
    return e.target.dataset[name]
  },
  toast: function (title, icon, time) {
    wx.showToast({
      title: title,
      icon: icon ? icon : 'none',
      duration: time || 1000,
      mask: true
    })
  },
  
  editPhone(phone) {
    if (!phone) {
      return ""
    }
    return phone.substring(0, 3) + "****" + phone.substring(7, 11);
  },
  editId(number) {
    if (!number) {
      return ""
    }
    return number.substring(0, 6) + "********" + number.substring(14);
  },
  changeDate(time,status) {
    let date = time?new Date(time):new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let str = year + '-' + this.addZero(month) + '-' + this.addZero(day);
    if(status){
      str =str + ' '+this.addZero(hours)+":"+this.addZero(minute)+":"+this.addZero(second);
    }
    return str;
  },
  addZero(number){
    return number<10?'0'+number:number
  }

}
module.exports = common