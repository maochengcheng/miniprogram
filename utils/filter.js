
const filter = {
  phone: function (str) {
    let reg = new RegExp(/^1[3456789]\d{9}$/g);
    return reg.test(str)
  },
  idNumber: function (str) {
    let reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
    return reg.test(str)
  },
  plateNumber: function (str) {
    // let reg = new RegExp(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/);
    let reg = new RegExp(/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|(DF[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/);
    return reg.test(str);
  },
  name:function(str){
    // let reg = new RegExp(/^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/);
    let reg = new RegExp(/^[\u4e00-\u9fa5]{2,20}$/);
    return reg.test(str)
  },
  id:function(str){
    let reg = new RegExp(
      
    );
    return reg.test(str)
  }
}

module.exports = filter