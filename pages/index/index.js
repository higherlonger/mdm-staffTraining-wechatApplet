const app = getApp();
Page({
  data: {
    trainType: [],
    listType: [],
    list: [],
    userId: "",
    localNotice:"",
    localNotice2:"",
    Number:"",
    colorAry: ["jv", "huang", "lan", "purple", "Goldenrod1", "green", "CornflowerBlue", "Violet", "Seashell4", "Red3", "SkyBlue2", "PaleGreen", "NavajoWhite", "SeaGreen2", "MediumSlateBlue", "goldenrod", "RosyBrown1", "Violet"]
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var _this = this;
    // 获取数据
    this.getData();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    wx.getStorage({
      key: 'trainType',
      success: function (res) {
        _this.addType(JSON.parse(res.data));
      },
      fail(err) {
        _this.setDataList();
      }
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        _this.setData({
          userId: res.data
        })
        // 处理未读数据数量
        _this.unRead();
      }
    })
  },
  onLoad() {
    var _this = this;
    // 获取数据
    this.getData();
    wx.getStorage({
      key: 'trainType',
      success: function (res) {
        _this.addType(JSON.parse(res.data));
      },
      fail(err) {
        _this.setDataList();
      }
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        _this.setData({
          userId: res.data
        })
        // 处理未读数据数量
        _this.unRead();
      }
    })

  },
  onShow() {
    var _this = this;
    this.getData();
    wx.getStorage({
      key: 'trainType',
      success: function (res) {
        _this.addType(JSON.parse(res.data));
      },
      fail(err) {
        _this.setDataList();
      }
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        _this.setData({
          userId: res.data
        })
        // 处理未读数据数量
        _this.unRead();
      }
    })
  },
  getData() {
    wx.showLoading({
      title: '',
    })
    var _this = this;
    wx.request({
      url: app.globalData.typeList,
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          list: res.data.list
        })
        wx.hideLoading();
      }
    })
  },
  //本地存储初始化
  setDataList() {
    var _this = this;
    let val = [];
    for (var i = 0; i < _this.data.list.length; i++) {
      val.push({
        "id": _this.data.list[i].id,
        "ok": "0"
      })
    }
    wx.setStorage({
      key: "trainType",
      data: JSON.stringify(val)
    })
    _this.setData({
      trainType: val
    })
  },
  //查新并添加 
  addType(data) {
    var _this = this;
    let flag = false;
    for (var i = 0; i < _this.data.list.length; i++) {
      flag = false;
      for (var j = 0; j < data.length; j++) {
        if (_this.data.list[i].id == data[j].id) {
          flag = true;
        } else {
          continue;
        } 
      }
      if (!flag) {
        data.push({
          "id": _this.data.list[i].id,
          "ok": "0"
        })
      }
    }
    wx.setStorage({
      key: "trainType",
      data: JSON.stringify(data)
    })
    this.setData({
      trainType: data
    })
  },
  // 跳转
  toList(e) {
    // console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../trainList/trainList' + '?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title
      })
    }
  },
  toNotice(){
    var _this = this;
    for (var i = 0; i < _this.data.localNotice2.length; i++) {
      _this.data.localNotice2[i].status = 1;
    }
    console.log(_this.data.localNotice2)
    _this.setData({
      localNotice: _this.data.localNotice2,
      Number:0
    })
    wx.setStorage({
      key: 'notice',
      data: JSON.stringify(_this.data.localNotice2),
    })
    wx.navigateTo({
      url: '../notice/notice'
    })
  },
  unRead() {
    var _this = this;
    var noticeFlag=false;
    wx.getStorage({
      key: 'notice',
      success: function(res) { 
        let test = JSON.parse(res.data);
        _this.setData({
          localNotice: test,
          localNotice2: test
        })
        noticeFlag=true;
      },
      fail:function(){
        noticeFlag=false;
      }
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
        //res.data.list
        if(noticeFlag==false){
          // 本地没消息，进行初始化
          _this.initNotice(res.data.list);
          _this.getNumber();
        }else{
          // 更新本地消息
          _this.updateNotice(res.data.list);
          _this.getNumber();
        }
      }
    })
  },
  initNotice(noticeVal){
    var noticeAry=[];
    for (var i = 0; i < noticeVal.length;i++){
      noticeAry.push({
        "id": noticeVal[i].id,
        "status":0
      })
    }
    this.setData({
      localNotice: noticeAry,
      localNotice2: noticeAry
    })
    wx.setStorage({
      key: 'notice',
      data: JSON.stringify(noticeAry)
    })
  },
  updateNotice(noticeVal){
    var _this=this;
    var timeFlag=false;
    for(var i=0;i<noticeVal.length;i++){
      timeFlag=false;
      for(var j=0;j<_this.data.localNotice.length;j++){
        if(noticeVal[i].id==_this.data.localNotice[j].id){
          timeFlag=true;
          break;
        }
      }
      if(!timeFlag){
        _this.data.localNotice.push({
          "id": noticeVal[i].id,
          "status": 0
        })
      }
    }
    _this.setData({
      localNotice: _this.data.localNotice,
      localNotice2: _this.data.localNotice
    })
    wx.setStorage({
      key: 'notice',
      data: JSON.stringify(_this.data.localNotice)
    })
  },
  getNumber(){
    var _this=this;
    var sum=0;
    for(var i=0;i<_this.data.localNotice.length;i++){
      if(_this.data.localNotice[i].status==0){
        sum++;
      }
    }
    _this.setData({
      Number:sum 
    })
  }





})