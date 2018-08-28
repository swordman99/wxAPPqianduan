// pages/index/load/load.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.code != ''){
      wx.request({
        url: 'https://www.pkusess.club/openid',
        //url: 'http://127.0.0.1:5000/openid',
        method: 'POST',
        data: { 'code': app.globalData.code },
        success: (res) => {
          wx.request({
            url: 'https://www.pkusess.club/freq',
            //url: 'http://127.0.0.1:5000/freq',
            method: 'POST',
            data: {openID: res.data.openID},
            success: (res) => {
              app.globalData.freq = res.data.freq
            }
          })
          app.globalData.openid = res.data.openID;
          wx.redirectTo({
            url: '../home/home',
          })
        }
      })
    }
    else{
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          app.globalData.code = res.code
        }
      })
      wx.redirectTo({
        url: '../home/home',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})