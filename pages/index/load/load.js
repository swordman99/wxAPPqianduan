// pages/index/load/load.js
var app = getApp()
Page({
  onLoad: function () {
    console.log("load")
    if (app.globalData.code != '' && app.globalData.userInfo != ''){
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
        url: '../load1/load1',
      })
    }
  },
})