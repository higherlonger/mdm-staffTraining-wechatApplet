const app = getApp();
Page({
  data: {
    tel: ""
  },
  onLoad() {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        wx.navigateTo({
          url: '../index/index',
        })
      }
    })
  },
  phone: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  login() {
    var _this = this;
    wx.request({
      url: app.globalData.check,
      data: {
        phone: _this.data.tel,
        openId: app.globalData.openid,
        type:0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 1) {
          console.log("userId:" + res.data.userId)
          wx.setStorage({
            key: 'userId',
            data: res.data.userId
          })
          wx.navigateTo({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: '验证失败！',
            image: '../warn.png'
          })
        }
      }
    })


  }
})