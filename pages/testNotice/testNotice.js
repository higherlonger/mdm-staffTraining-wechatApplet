Page({
  testSubmit: function (e) {
    var self = this;
    let _access_token = '5_E1pZJQzTC-lC0r-JJz9wVAZv5Zv22CNtmV_7C1T0sqC9TV7mGE4FTmDX2B0PVM4LaGtaTfXwzfJLnD7fDKTg8DOICJNkKBQgn_Ot2zYmBJyY1g1VXoBNdtwUE0QaP8_9tWlbR-Zq7L1OyrrPKCIjAEAOGM';
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
    let _jsonData = {
      access_token: _access_token, touser: openid, template_id: '_CfGS7SqVyNPg9Op8OXzMp6aOl7X9rCkrRfiMcccms8',
      form_id: e.detail.formId, page: "pages/index/index",
      data: {
        "keyword1": { "value": "测试数据一", "color": "#173177" },
        "keyword2": { "value": "测试数据二", "color": "#173177" },
        "keyword3": { "value": "测试数据三", "color": "#173177" },
        "keyword4": { "value": "测试数据四", "color": "#173177" },
      }
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }
    })
  }
})