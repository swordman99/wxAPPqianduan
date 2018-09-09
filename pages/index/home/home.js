var app = getApp()
Page({
  //数据
  data: {
    nexttime: '',
    alert2: false,
    alert3: false,
    name: '',
    phone: '',
    stuentnum: '',
    sign: 0,
    noinfo: false,
    currentUser: [],
    num: 0,
    init: { sum: ['---', '---'], lists: [[], []], content: []},
    rank: ['---', '---'],
    last: '---',
    color: ['rgb(100,100,100)', 'rgb(20,20,20)'],
    flag: { global: true, announcement: false, log: false, choose: 0, loged: false, alert: false, submited: false }
  },
  //初始登录数据
  onLoad: function () {
    var that = this;
    wx.request({
      //url: 'https://www.pkusess.club/home',
      url: 'http://127.0.0.1:5000/home',
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
          //url: 'https://www.pkusess.club/getfreq',
          url: 'http://127.0.0.1:5000/getfreq',
          method: 'POST',
          data: { openID: app.globalData.openid },
          success: (res) => {
            that.setData({
              last: res.data.last,
              nexttime: res.data.nexttime
            })
          }
        })
      }
    });
    if(app.globalData.loged){
      that.setData({
        'flag.announcement': false,
        'flag.loged': true,
        'flag.log': false
      })
    }
  },
  //提示尚未登录
  alert2: function () {
    this.setData({ alert2: true })
  },
  //打开公告栏或注册栏
  openAnnouncement: function () {
    this.setData({
      'flag.announcement': true
    })
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
    this.setData({
      'flag.log': true,
      noinfo: false
    })
  },
  //打开校内登陆栏
  logStudent: function () {
    this.setData({ 
      'flag.choose': 1,
      sign: 1
    })
  },
  //打开校外登陆栏
  logOther: function () {
    this.setData({
      'flag.choose': 2,
      sign: 2
    })
  },
  //获取用户信息
  onGotUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
  },
  //点击确认
  submitData: function (e) {
    var that = this;
    if ((e.detail.value.name != '' && e.detail.value.phone != '' && e.detail.value.num != '' && that.data.sign == 1) || (e.detail.value.phone != '' && that.data.sign == 2)) {
      wx.request({
        //url: 'https://www.pkusess.club/login',
        url: 'http://127.0.0.1:5000/login',
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
          wx.request({
            //url: 'https://www.pkusess.club/getfreq',
            url: 'http://127.0.0.1:5000/getfreq',
            method: 'POST',
            data: { openID: app.globalData.openid },
            success: (res) => {
              that.setData({
                last: res.data.last
              })
            }
          })
          //console.log(res)
          if (res.data.isMatch == true) {
            app.globalData.loged = true;
            that.setData({
              'flag.announcement': false,
              'flag.log': false,
              'flag.choose': 0,
              'flag.alert': false,
              'flag.loged': true,
              'flag.submited': false,
              rank: res.data.rank,
              init: res.data.init,
              num: res.data.num
            })
          }
          else {
            that.setData({
              'flag.alert': true,
              'flag.submited': false,
            })
          }
        }
      })
    }
    else{
      that.setData({
        'flag.announcement': false,
        'flag.log': false,
        'flag.choose': 0,
        'flag.alert': false,
        noinfo: true,
        alert2: true
      })
    }
  }
})