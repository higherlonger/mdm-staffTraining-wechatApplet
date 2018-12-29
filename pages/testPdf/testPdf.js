Page({
  data:{
    pdf:"http://192.168.1.118:8080/pdf/e84a36ca8b5543b59cb6d24e82e1f91d.pdf",
    ppt:""
  },
  onLoad(){
    
  },
  openPdf(){
    console.log(1);
    wx.showLoading({
      title: '',
    })
    wx.downloadFile({
      url: 'https://www.jiujiunet.cc/tt/3.ppt',
      success(res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            var savedFilePath = res.savedFilePath;
            console.log(savedFilePath);
            wx.openDocument({
              filePath: savedFilePath,
              success: function (res) {
                console.log('打开文档成功');
              },
              fail(err) {
                console.log("打开文档失败")
              }
            })
            wx.getSavedFileList({
              success: function (res) {
                console.log(res.fileList)
              }
            })
          },
          fail(){
            console.log("本地存储失败");
            wx.hideLoading();
          }
        })
        
      },
      fail(err) {
        console.log("下载失败：" + JSON.stringify(err));
        wx.hideLoading();
      }
    })
  }
})