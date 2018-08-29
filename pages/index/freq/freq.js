// pages/index/freq/freq.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freq: 0,
    last: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.freq > app.globalData.freqall) {
      wx.redirectTo({
        url: '../reject/reject',
      })
    }
    else{
      this.setData({
        freq: app.globalData.freq,
        last: app.globalData.freqall - app.globalData.freq
      })
      wx.request({
        url: 'https://www.pkusess.club/setfreq',
        //url: 'http://127.0.0.1:5000/setfreq',
        method: 'POST',
        data: { openID: app.globalData.openid },
        success: (res) => {
          app.globalData.freq = res.data.freq;
        }
      })
      //停留3秒
      var t = new Date().getTime();
      function sleep(d) {
        while (new Date().getTime() - t <= d);
      }
      sleep(3000);
      wx.redirectTo({
        url: '../match/match',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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