// pages/index/load/load.js
var app = getApp()
Page({
  onShow: function () {
    if (app.globalData.code != ''){
      wx.request({
        url: 'https://www.pkusess.club/openid',
        //url: 'http://127.0.0.1:5000/openid',
        method: 'POST',
        data: { 'code': app.globalData.code },
        success: (res) => {
          app.globalData.openid = res.data.openID;
          wx.redirectTo({
            url: '../home/home',
          })
        }
      })
    }
    else{
      wx.redirectTo({
        url: '../home/home',
      })
    }
  },
})