// pages/components/plate/plate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showme: {
      type: Boolean,
      value: false,
      observer(newval, oldval) {
        console.log(newval)
        this.setData({
          showThis: newval
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showThis: false,
    num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    plate: [
      "京", "津", "沪", "渝", "冀", "豫", "云", "辽", "黑", "湘", "皖", "鲁",
      "新", "苏", "浙", "赣", "鄂", "桂", "甘", "晋", "蒙", "陕", "吉", "闽",
      "贵", "粤", "青", "藏", "川", "宁", "琼", "港", "澳", "台"
    ],
    letter: [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
      "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
      "W", "X", "Y", "Z"
    ],
    other: [
      "挂", "学", "警", "使", "领"
    ],
    cityShow: false,
    letterShow: false,
    plateSelect: "",
    letterSelect: "",
    numSelect: "",
    backStatus: false,
    selectStatus: 1,//1,数字键盘。2,字母键盘。3,省份键盘
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeMyself() {
      this.triggerEvent("close");
    },
    stop() {

    },
    changeKeyboard(e) {
      let key = getApp().common.ed(e, "key");
      this.setData({
        selectStatus: key
      })
    },
    checkBack() {
      if (this.data.plateSelect && this.data.letterSelect && this.data.numSelect.length <= 6) {
        this.setData({
          backStatus: true
        })
      } else {
        this.setData({
          backStatus: false
        })
      }
    },
    showCity() {
      this.setData({
        cityShow: !this.data.cityShow,
        letterShow: false
      })
    },
    showLetter() {
      this.setData({
        cityShow: false,
        letterShow: !this.data.letterShow
      })
    },
    selectCity(e) {
      let index = getApp().common.ed(e, "index");
      this.setData({
        plateSelect: this.data.plate[index],
        cityShow: false
      })
      this.checkBack();
    },
    selectLetter(e) {
      let index = getApp().common.ed(e, "index");
      this.setData({
        letterSelect: this.data.letter[index],
        letterShow: false,
      })
      this.checkBack();
    },
    selectNum(e) {
      let index = getApp().common.ed(e, "index");
      let type = getApp().common.ed(e, 'type');
      let arr = type == 'num' ? this.data.num : type == 'other' ? this.data.other : this.data.letter
      let it = this.data.numSelect;
      if (it.length >= 6) {
        getApp().common.toast("车牌号码最多6位", "none");
        return;
      }
      it = it + arr[index];
      this.setData({
        numSelect: it
      })
      this.checkBack();
    },
    clearNum() {
      this.setData({
        numSelect: ""
      })
      this.checkBack();
    },
    back() {
      if (!this.data.backStatus) {
        getApp().common.toast("请输入正确的车牌号", "none")
        return;
      }
      var myEventDetail = {
        result: this.data.plateSelect + this.data.letterSelect + this.data.numSelect
      };
      if (!getApp().filter.plateNumber(myEventDetail.result)) {
        getApp().common.toast("请输入正确的车牌号", 'none');
        return;
      }
      var myEventOption = {};
      this.triggerEvent("result", myEventDetail, myEventOption);
      this.clearAll();
    },
    clearAll() {
      this.setData({
        plateSelect: "",
        letterSelect: "",
        numSelect: ""
      })
    }
  },
  options: {
    addGlobalClass: true,
  }
})
