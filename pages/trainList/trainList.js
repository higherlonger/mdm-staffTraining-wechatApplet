const app = getApp();
Page({
  data: {
    typeId: "",
    trainList: "",
    testList: "",
    pageTit: "",
    list: [],
    isGoods: "",
    val: "",
    userId: ""
  },
  onPullDownRefresh() {
    var _this = this;
    wx.showNavigationBarLoading();

    // 获取数据
    wx.request({
      url: app.globalData.goodsList,
      data: {
        "id": _this.data.typeId,
        "name": _this.data.pageTit,
        "staffId": _this.data.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          list: res.data.list,
          isGoods: res.data.isGoods
        })
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.getStorage({
          key: 'trainList',
          success: function (res) {
            _this.addList(JSON.parse(res.data));
            //回显检测
            _this.testData();
          },
          fail(err) {
            wx.hideLoading();
          }
        })
      }
    })


  },
  onLoad(opentions) {
    wx.showLoading({
      title: '',
    })
    var _this = this;
    this.setData({
      typeId: opentions.id,
      pageTit: opentions.title
    })
    // 动态标题
    wx.setNavigationBarTitle({
      title: _this.data.pageTit
    })
    // 获取id
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        _this.setData({
          userId: res.data
        })

        // 获取数据
        wx.request({
          url: app.globalData.goodsList,
          data: {
            "id": _this.data.typeId,
            "name": _this.data.pageTit,
            "staffId": _this.data.userId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            _this.setData({
              list: res.data.list,
              isGoods: res.data.isGoods
            })
            wx.hideLoading();
            wx.getStorage({
              key: 'trainList',
              success: function (res) {

                _this.addList(JSON.parse(res.data));
                //回显检测
                _this.testData();
                console.log(res)
                // console.log("---")
                // console.log(res)
              },
              fail(err) {
                wx.hideLoading();
              }
            })
          }
        })
      }
    })

  },
  onShow() {
    var _this = this;
    wx.getStorage({
      key: 'trainList',
      success: function (res) {
        _this.addList(JSON.parse(res.data));
        //回显检测
        _this.testData();
      },
      fail(err) {
        _this.setDataList();
      }
    })
    // 获取id
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        _this.setData({
          userId: res.data
        })
      }
    })
  },
  //本地存储初始化
  setDataList() {
    var _this = this;
    let val = [];
    let value = [];
    for (var i = 0; i < _this.data.list.length; i++) {
      value = [];
      for (var j = 0; j < _this.data.list[i].detail.video.length; j++) {
        value.push({
          "id": _this.data.list[i].detail.video[j].id,
          "status": 0,
          "process": 0,
          "type": 0,
          "videoTime": 0,
          "url": _this.data.list[i].detail.video[j].url,
          "title": _this.data.list[i].detail.video[j].title
        })
      }
      for (var k = 0; k < _this.data.list[i].detail.file.length; k++) {
        value.push({
          "id": _this.data.list[i].detail.file[k].id,
          "status": 0,
          "process": 0,
          "type": 1,
          "videoTime": 0,
          "url": _this.data.list[i].detail.file[k].url,
          "title": _this.data.list[i].detail.file[k].title
        })
      }
      val.push({
        "id": _this.data.list[i].id,
        "allVideo": 0,
        "allFile": 0,
        "allProcess": 0,
        "checkStatus": "未审核",
        "detail": value
      })
    }
    wx.setStorage({
      key: "trainList",
      data: JSON.stringify(val)
    })
    _this.setData({
      trainList: val
    })

  },
  addList(data) {
    var _this = this;
    let flag = false;
    let flag2 = false;
    let flag3 = false;
    let del = false;
    let delInfo = 0;
    var value = [];
    var value2 = [];

    // 产品内部视频更新
    for (var q = 0; q < _this.data.list.length; q++) {
      for (var w = 0; w < _this.data.list[q].detail.video.length; w++) {
        for (var e = 0; e < data.length; e++) {
          if (_this.data.list[q].id == data[e].id) {
            flag2 = false;
            for (var r = 0; r < data[e].detail.length; r++) {
              if (_this.data.list[q].detail.video[w].id == data[e].detail[r].id) {
                flag2 = true;
              }
            }
            if (!flag2) {
              data[e].detail.push({
                "id": _this.data.list[q].detail.video[w].id,
                "status": 0,
                "process": 0,
                "type": 0,
                "videoTime": 0,
                "url": _this.data.list[q].detail.video[w].url,
                "title": _this.data.list[q].detail.video[w].title
              })
            }
          }
        }
      }
    }

    //产品内部删除
    for (let a = 0; a < data.length; a++) {
      for (let s = 0; s < data[a].detail.length; s++) {
        for (let d = 0; d < _this.data.list.length; d++) {
          if (_this.data.list[d].id == data[a].id) {
            delInfo = 0;
            for (var r = 0; r < _this.data.list[d].detail.video.length; r++) {
              if (_this.data.list[d].detail.video[r].id == data[a].detail[s].id) {
                delInfo++;
              }
            }
            for (var r = 0; r < _this.data.list[d].detail.file.length; r++) {
              if (_this.data.list[d].detail.file[r].id == data[a].detail[s].id) {
                delInfo++;
              }
            }
            if (delInfo==0) {
              data[a].detail.splice(s, 1)
            }

          }
        }
      }
    }



    // 产品内部文档更新
    for (var q = 0; q < _this.data.list.length; q++) {
      for (var w = 0; w < _this.data.list[q].detail.file.length; w++) {
        for (var e = 0; e < data.length; e++) {
          if (_this.data.list[q].id == data[e].id) {
            flag3 = false;
            for (var r = 0; r < data[e].detail.length; r++) {
              if (_this.data.list[q].detail.file[w].id == data[e].detail[r].id) {
                flag3 = true;
              }
            }
            if (!flag3) {
              data[e].detail.push({
                "id": _this.data.list[q].detail.file[w].id,
                "status": 0,
                "process": 0,
                "type": 1,
                "videoTime": 0,
                "url": _this.data.list[q].detail.file[w].url,
                "title": _this.data.list[q].detail.file[w].title
              })
            }
          }
        }
      }
    }

    //产品更新
    for (var i = 0; i < _this.data.list.length; i++) {
      flag = false;
      value = [];

      for (var j = 0; j < data.length; j++) {
        if (_this.data.list[i].id == data[j].id) {
          flag = true;
        } else {
          continue;
        }
      }
      if (!flag) {
        for (var j = 0; j < _this.data.list[i].detail.video.length; j++) {
          value.push({
            "id": _this.data.list[i].detail.video[j].id,
            "status": 0,
            "process": 0,
            "type": 0,
            "videoTime": 0,
            "url": _this.data.list[i].detail.video[j].url,
            "title": _this.data.list[i].detail.video[j].title
          })
        }
        for (var k = 0; k < _this.data.list[i].detail.file.length; k++) {
          value.push({
            "id": _this.data.list[i].detail.file[k].id,
            "status": 0,
            "process": 0,
            "type": 1,
            "videoTime": 0,
            "url": _this.data.list[i].detail.file[k].url,
            "title": _this.data.list[i].detail.file[k].title
          })
        }
        data.push({
          "id": _this.data.list[i].id,
          "allVideo": 0,
          "allFile": 0,
          "allProcess": 0,
          "checkStatus": "未审核",
          "detail": value
        })
      }
    }


    // //产品删除
    for (let e = 0; e < data.length; e++) {
      del = false;
      for (let r = 0; r < _this.data.list.length; r++) {
        if (_this.data.list[r].id == data[e].id) {
          del = true;
        }
      }
      if (!del) {
        data.splice(e, 1)
      }
    }



    wx.setStorage({
      key: "trainList",
      data: JSON.stringify(data)
    })
    _this.setData({
      trainList: data,
      testList: data
    })
  },
  //跳转
  toDetail(e) {
    var _this = this;
    var ary = JSON.stringify(e.currentTarget.dataset.detail);
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../productDetail/productDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title + "&isGoods=" + _this.data.isGoods + "&detail=" + ary + "&typeId=" + e.currentTarget.dataset.typeid
      })
    }
  },
  //回显检测
  testData() {
    var _this = this;
    var videoSum = 0;
    var fileSum = 0;
    var allSum = 0;
    for (var i = 0; i < _this.data.testList.length; i++) {
      videoSum = 0;
      fileSum = 0;
      allSum = 0;
      for (var j = 0; j < _this.data.testList[i].detail.length; j++) {
        if (_this.data.testList[i].detail[j].type == 0 && _this.data.testList[i].detail[j].process == 100) {
          videoSum++;
          allSum++;
        } else if (_this.data.testList[i].detail[j].type == 1 && _this.data.testList[i].detail[j].status == 1) {
          fileSum++;
          allSum++;
        } else {
          continue;
        }
      }
      _this.data.testList[i].allVideo = videoSum;
      _this.data.testList[i].allFile = fileSum;
      _this.data.testList[i].allProcess = ((allSum / _this.data.testList[i].detail.length) * 100).toFixed(1);
      // if (_this.data.testList[i].allProcess==100.0){
      //   _this.setData({
      //     icon:1
      //   })
      // }
      _this.setData({
        trainList: _this.data.testList
      })
      wx.setStorage({
        key: "trainList",
        data: JSON.stringify(_this.data.trainList)
      })
    }

    // wx.hideLoading();

  },
  formName: function (e) {
    this.setData({
      val: e.detail.value
    })
  },
  searchVal() {
    var _this = this;
    wx.request({
      url: app.globalData.goodsList,
      data: {
        val: _this.data.val,
        "id": _this.data.typeId,
        "name": _this.data.pageTit,
        "staffId": "83553def1f69478fbe4cc5b2f7f9f213"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          list: res.data.list,
          isGoods: res.data.isGoods
        })
      }
    })
  }
}) 