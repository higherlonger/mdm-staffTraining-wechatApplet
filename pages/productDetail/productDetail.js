const app = getApp();
Page({
  data: {
    "goodsId": "",
    "pageTit": "",
    "detList":"", 
    "testList": "",
    "listId":"",
    "isGoods":"",
    "detail":"",
    "value":"",
    "userId":"",
    "percent":"",
    "id":"",
    "typeId":""
  },
  onLoad(option) {    
    var _this = this;
    // console.log(option.id + "--" + option.title + "--" + option.isGoods + "--" + option.detail);
    this.setData({
      goodsId: option.id,
      pageTit: option.title,
      isGoods: option.isGoods,
      typeId:option.typeId,
      detail: JSON.parse(option.detail)
    })
    // console.log(JSON.parse(option.detail))
    // 动态标题
    wx.setNavigationBarTitle({
      title: _this.data.pageTit
    })
    //从本地获取数据
    wx.getStorage({
      key: 'trainList',
      success: function (res) {
        _this.setData({
          detList: JSON.parse(res.data),
          testList: JSON.parse(res.data)
        })
        _this.getDetail();
      },
      fail(err) {
        console.log(JSON.stringify(err));
      }
    })
    //获取userId
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        _this.setData({
          userId:res.data
        })
      }
    })
  },
  onShow(){
    var _this=this;
    //从本地获取数据
    wx.getStorage({
      key: 'trainList',
      success: function (res) {
        _this.setData({
          detList: JSON.parse(res.data),
          testList: JSON.parse(res.data)
        })
        _this.getDetail();
      },
      fail(err) {
        console.log(JSON.stringify(err));
      }
    })
    //获取userId
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        _this.setData({
          userId: res.data
        })
      }
    })
  },
  open(e){

    let openType = e.currentTarget.dataset.type;
    let process = e.currentTarget.dataset.pro;
    let urlVal = e.currentTarget.dataset.url;
    let nub = e.currentTarget.dataset.index;
    
    this.setData({
      listId: e.currentTarget.dataset.id
    })
    var _this=this;
    if(openType==0){
      wx.showLoading({
        title: '',
      })
      // 更改本地文档状态
      _this.updateStatus();
      wx.hideLoading(); 
      // 播放视频
      wx.navigateTo({
        url: '../testVideo/testVideo?id=' + _this.data.listId + "&goodsId=" + _this.data.goodsId + "&process=" + process + "&url=" + urlVal + "&title=" + e.currentTarget.dataset.tit
      }) 
    }else if(openType==1){
      this.setData({
        id: nub,
        percent: 85
      })
      // 打开文档
      wx.downloadFile({ 
        url: urlVal,
        success(res) {
          _this.setData({
            percent: 100,
            id:""
          })
          wx.openDocument({
            filePath: res.tempFilePath,
            success: function (res) {
              console.log('打开文档成功');
            },
            fail(err) {
              console.log("打开文档失败")
            }
          })
        },
        fail() { 
          wx.showToast({
            title: '打开失败！',
            image: '../warn.png'
          })
          _this.setData({
            percent: 0,
            id: ""
          })
        }
      })
      // console.log("testList:" + _this.data.testList);
      // 更改本地文档状态
      _this.updateStatus();
    }
  }, 
  updateStatus(){
    var _this=this;
    for (var i = 0; i < _this.data.testList.length; i++) {
      if (_this.data.testList[i].id == _this.data.goodsId) {
        for (var j = 0; j < _this.data.testList[i].detail.length; j++) {
          if (_this.data.testList[i].detail[j].id == _this.data.listId) {
            // console.log("true")
            _this.data.testList[i].detail[j].status = 1;
          }
        }
      }
    }
    _this.setData({
      detList: _this.data.testList
    })
    wx.setStorage({
      key: "trainList",
      data: JSON.stringify(_this.data.detList)
    })
  },
  applyTest(){
    var _this = this;
    var testVal=true;
    for (var i = 0; i < _this.data.testList.length; i++) {
      if (_this.data.testList[i].id == _this.data.goodsId) {
        for (var j = 0; j < _this.data.testList[i].detail.length; j++) {
          if (_this.data.testList[i].detail[j].type == 0 && _this.data.testList[i].detail[j].process == 100 || _this.data.testList[i].detail[j].type == 1 && _this.data.testList[i].detail[j].status==1) {
             continue;
          }else{
            testVal=false;
            break;
          }
        }
      }
    }
    if(testVal){
      wx.request({
        url: app.globalData.applyTest,
        data: {
          userId: _this.data.userId,
          typeId: _this.data.typeId,
          id: _this.data.goodsId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if(res.data.code==1){
            wx.showToast({
              title: '申请成功！'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请先学完资料！',
        image: '../warn.png'
      })
    }
  },
  getDetail(){
    var _this=this;
    for (var i = 0; i < _this.data.detList.length;i++){
      if(_this.data.detList[i].id==_this.data.goodsId){
        _this.setData({
          value: _this.data.detList[i].detail
        })
      }
    }
  }

})