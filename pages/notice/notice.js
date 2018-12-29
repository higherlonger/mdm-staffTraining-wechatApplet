const app = getApp();
Page({
  data:{
    list: "",
    isContent:false,
    userId:""
  }, 
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var _this = this;
    _this.setData({
      isContent: false
    })
    wx.request({
      url: app.globalData.notice,
      data: {
        userId: _this.data.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("长度：" + res.data.list.length);
        if (res.data.list.length == 0) {
          _this.setData({
            isContent: true
          })
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        _this.setData({
          list: res.data.list
        })
      }
    }) 
  },
  onLoad(){
    var _this=this;
    //取userId
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        _this.setData({
          userId:res.data
        })
        // 获取数据
        _this.getData();
      }
    })
    
    
  },
  getData(){
    var _this=this;
    wx.showLoading({
      title: '',
    })
    console.log("us:" + _this.data.userId)
    wx.request({
      url: app.globalData.notice,
      data: {
        userId: _this.data.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("长度：" + res.data.list.length);
        if (res.data.list.length == 0) {
          _this.setData({
            isContent: true
          })
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        _this.setData({
          list: res.data.list
        })

      }
    })
  }


})