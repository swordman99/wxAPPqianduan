Page({
  //数据
  data: {
    name: '',
    phone: '',
    stuentNumber: '',
    currentUser: [],
    number: 0,
    init: {sum:[,'---'], lists:[[],[]], content:[]},
    rank: ['---', '---'],
    color: ['rgb(100,100,100)', 'rgb(20,20,20)'],
    flag: {global: true, announcement:false, log:false, choose:0, loged:false, alert:false}
  },
  //初始登录数据
  onLoad: function(){
    var that = this;
    wx.request({
      url:'http://127.0.0.1:5000/home',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res){
        that.setData({init: res.data.init})
      }
    })
  },
  //开始游戏
  begin: function () {
    this.setData({ rank: '--' })
  },
  //打开公告栏或登陆栏
  openAnnouncement: function () {
    this.setData({'flag.announcement': true})
  },
  //关闭公告栏或登陆栏
  closeAnnouncement: function () {
    this.setData({
      'flag.announcement': false,
      'flag.log': false,
      'flag.choose': 0,
      'flag.alert': false
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
  log: function(e) {
    const appInstance = getApp();
    appInstance.globalData.userInfo = e.detail.userInfo;
    this.setData({'flag.log': true})
  },
  //打开校内登陆栏
  logStudent: function() {
    this.setData({'flag.choose': 1})
  },
  //打开校外登陆栏
  logOther: function() {
    this.setData({'flag.choose': 2})
  },
  //点击确认，发送登录数据
  submitData: function(e) {
    var that = this;
    const appInstance = getApp();
    wx.request({
      url: 'http://127.0.0.1:5000/login',
      method: 'POST',
      data: {
        'userInfo': appInstance.globalData.userInfo,
        'type': 'flag.choose' - 1,
        'value': { name: that.data.name, phone: that.data.phone, stuentNumber: that.data.stuentNumber},
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if(res.data.isMatch == true){
          appInstance.globalData.number = res.data.number;
          that.setData({
            'flag.announcement': false,
            'flag.log': false,
            'flag.choose': 0,
            'flag.alert': false,
            rank: res.data.rank,
            number: res.data.number
          })
        }
        else{
          that.setData({'flag.alert': true})
          //修改排行榜效果
        }
      }
    })
  }
})