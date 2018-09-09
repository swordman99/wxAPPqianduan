//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎参加地学知识竞赛',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: 'pages/logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      if (app.globalData.code != '') {
        wx.request({
          //url: 'https://www.pkusess.club/openid',
          url: 'http://127.0.0.1:5000/openid',
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
      else {
        wx.redirectTo({
          url: '../load1/load1',
        })
      }
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        if (app.globalData.code != '') {
          wx.request({
            //url: 'https://www.pkusess.club/openid',
            url: 'http://127.0.0.1:5000/openid',
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
        else {
          wx.redirectTo({
            url: '../load1/load1',
          })
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          if (app.globalData.code != '') {
            wx.request({
              //url: 'https://www.pkusess.club/openid',
              url: 'http://127.0.0.1:5000/openid',
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
          else {
            wx.redirectTo({
              url: '../load1/load1',
            })
          }
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    if (app.globalData.code != '' && app.globalData.userInfo != '') {
      wx.request({
        //url: 'https://www.pkusess.club/openid',
        url: 'http://127.0.0.1:5000/openid',
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
    else {
      wx.redirectTo({
        url: '../load1/load1',
      })
    }
  }
})