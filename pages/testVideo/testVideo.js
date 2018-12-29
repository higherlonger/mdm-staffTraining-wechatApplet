function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  data:{
    "listId":"",
    "detList":"",
    "testList":"",
    "goodsId":"",
    "process":0,
    "url":"",
    "pageTit":""
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo');
    // this.videoContext.requestFullScreen(90);
  },
  onLoad(options){
    this.videoContext = wx.createVideoContext('myVideo');
    // this.videoContext.requestFullScreen(90);
    var _this=this;
    this.setData({
      listId: options.id,
      goodsId: options.goodsId,
      process: options.process,
      url:options.url,
      pageTit:options.title
    })
    wx.setNavigationBarTitle({
      title: _this.data.pageTit
    })
    //  //跳转进度
    this.videoContext.seek(_this.data.process);
    
    wx.getStorage({
      key: 'trainList',
      success: function (res) {
        _this.setData({
          detList: JSON.parse(res.data),
          testList: JSON.parse(res.data)
        })
        console.log(_this.data.detList)
      },
      fail(err) {
        console.log(JSON.stringify(err));
      }
    })
  },
  inputValue: '',
  data: {
    src: ''
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  bindtimeupdate: function (e){
   
    //进度
    this.updateStatus(e);
  },
  updateStatus(e) {
    var _this = this;
    for (var i = 0; i < _this.data.testList.length; i++) {
      if (_this.data.testList[i].id == _this.data.goodsId) {
        for (var j = 0; j < _this.data.testList[i].detail.length; j++) {
          if (_this.data.testList[i].detail[j].id == _this.data.listId) {
            _this.data.testList[i].detail[j].process = ((e.detail.currentTime / e.detail.duration) * 100).toFixed(1);
            _this.data.testList[i].detail[j].videoTime = e.detail.currentTime;
            // console.log(_this.data.testList[i].detail[j].videoTime)
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
  }
})