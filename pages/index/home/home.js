var app = getApp()
Page({
  //数据
  data: {
    alert2: false,
    name: '',
    phone: '',
    stuentnum: '',
    currentUser: [],
    num: 0,
    init: { sum: ['---', '---'], lists: [[], []], content: []},
    rank: ['---', '---'],
    last: '---',
    color: ['rgb(100,100,100)', 'rgb(20,20,20)'],
    flag: { global: true, announcement: false, log: false, choose: 0, loged: false, alert: false }
  },
  //初始登录数据
  onLoad: function () {
    //console.log(app.globalData.openid)
    if (app.globalData.openid == ''){
      wx.redirectTo({
        url: '../load/load',
      })
    }
    var that = this;
    wx.request({
      url: 'https://www.pkusess.club/home',
      //url: 'http://127.0.0.1:5000/home',
      method: 'POST',
      data:{
        'openID': app.globalData.openid,
        'userInfo': app.globalData.userInfo
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({ 
          'flag.loged': res.data.loged,
          init: res.data.init,
          rank: res.data.rank,
          num: res.data.num
        })
        app.globalData.num = res.data.num
        wx.request({
          url: 'https://www.pkusess.club/getfreq',
          //url: 'http://127.0.0.1:5000/getfreq',
          method: 'POST',
          data: { openID: app.globalData.openid },
          success: (res) => {
            app.globalData.freq = res.data.freq;
            that.setData({
              last: app.globalData.freqall - app.globalData.freq
            })
          }
        })
      }
    });
    if(app.globalData.loged){
      that.setData({
        'flag.loged': true
      })
    }
  },
  //提示尚未登录
  alert2: function () {
    this.setData({ alert2: true })
  },
  //打开公告栏或登陆栏
  openAnnouncement: function () {
    this.setData({ 'flag.announcement': true })
  },
  //关闭公告栏或登陆栏
  closeAnnouncement: function () {
    this.setData({
      'flag.announcement': false,
      'flag.log': false,
      'flag.choose': 0,
      'flag.alert': false,
      alert2: false
    })
  },
  //转换为全球排行榜
  globalOpen: function () {
    this.setData({
      'flag.global': true,
      color: ['rgb(100,100,100)', 'rgb(20,20,20)']
    })
  },
  //转换为全校排行榜
  friendOpen: function () {
    this.setData({
      'flag.global': false,
      color: ['rgb(20,20,20)', 'rgb(100,100,100)']
    })
  },
  //打开登陆栏
  log: function (e) {
    this.setData({ 'flag.log': true })
  },
  //打开校内登陆栏
  logStudent: function () {
    this.setData({ 'flag.choose': 1 })
  },
  //打开校外登陆栏
  logOther: function () {
    this.setData({ 'flag.choose': 2 })
  },
  //获取用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo);
    app.globalData.userInfo = e.detail.userInfo
  },
  //点击确认
  submitData: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.pkusess.club/login',
      //url: 'http://127.0.0.1:5000/login',
      method: 'POST',
      data: {
        'userInfo': app.globalData.userInfo,
        'openID': app.globalData.openid,
        'type': that.data.flag['choose'] - 1,
        'value': e.detail.value
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.isMatch == true) {
          app.globalData.loged = true;
          that.setData({
            'flag.announcement': false,
            'flag.log': false,
            'flag.choose': 0,
            'flag.alert': false,
            'flag.loged': true,
            rank: res.data.rank,
            init: res.data.init,
            num: res.data.num
          })
        }
        else {
          that.setData({ 'flag.alert': true })
          //修改排行榜效果
        }
      }
    })
  }
})