// 请求后端发题目：56、171
// 发送用户选项： 212、248、283、318
// 请求后端发本局比赛所获积分： 352

var app = getApp()
var count = 1 // 当前题数
var sum = 10 // 总题数
var secondFlag = false // 重新开始计时器标志
var processHeight = 60 / sum // 单位进度条高度
var height = processHeight // 进度条高度
var top = 90 - processHeight // 进度条位置
var title = ''
var op = []
Page({
  data: {
    time: 0,
    text: false,
    step: 0,
    finish: false,
    begin: false,
    countdown: 3,
    number: 0,
    avatarUrl: '',
    height: '0%',
    top: '90%',
    title: '',
    op: ['', '', '', ''],
    color: {
      a: 'rgba(15, 170, 157, 0.966)',
      b: 'rgba(15, 170, 157, 0.966)',
      c: 'rgba(15, 170, 157, 0.966)',
      d: 'rgba(15, 170, 157, 0.966)'
    }
  },
  //倒计时
  onReady: function () {
    var url = app.globalData.userInfo.avatarUrl;
    this.setData({
      avatarUrl: url
    });
    const that = this;
    //开场倒计时函数
    function countdownEvent() {
      setTimeout(function () {
        var second = that.data.countdown - 1;
        if (second == 0) {
          that.setData({
            begin: true,
            height: height + '%',
            top: top + '%',
            time: 1
          });
          that.secondBegin();
          return;
        } else {
          that.setData({
            countdown: second
          })
        }
        countdownEvent();
      }, 1000);
    }
    //请求题(请求后端发一道题)
    wx.request({
      url: 'https://www.pkusess.club/questionget',
      //url: 'http://127.0.0.1:5000/questionget',
      method: 'POST',
      data: { openID: app.globalData.openid },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log(res)
        this.setData({
          title: res.data.title, //题目
          op: res.data.op //选项列表
        })
      },
      fail: (res) => {
        that.setData({
          title: '网络请求繁忙，请稍后重试'
        })
      }
    });
    //开场倒计时
    countdownEvent()
  },
  //计时器函数 + 进度条函数
  secondBegin: function () {
    const that = this;
    var step = 1, //计数动画次数
      num = 0, //计数倒计时秒数（n - num）
      start = 1.5 * Math.PI, // 开始的弧度
      end = -0.5 * Math.PI, // 结束的弧度
      time = null, // 计时器容器
      n = 8, // 当前倒计时为8秒
      rpx;
    //获取rpx参数
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 320;
      },
    });
    // 动画函数
    function animation() {
      if (step <= n && secondFlag == false) {
        end = end + 2 * Math.PI / n;
        ringMove(start, end);
        step++;
      } else {
        // 十道题结束
        if (count == sum) {
          clearInterval(time);
          that.finish();
        } else {
          if (step > n){
            wx.request({
              url: 'https://www.pkusess.club/questionget',
              //url: 'http://127.0.0.1:5000/questionget',
              method: 'POST',
              data: { openID: app.globalData.openid },
              header: {
                'Content-Type': 'application/json'
              },
              success: (res) => {
                that.setData({
                  title: res.data.title, //题目
                  op: res.data.op //选项列表
                })
              },
              fail: (res) => {
                that.setData({
                  title: '网络请求繁忙，请稍后重试'
                })
              }
            });        
          }
          step = 1;
          num = 0;
          end = -0.5 * Math.PI;
          ringMove(start, end);
          count++;
          height = height + processHeight;
          top = top - processHeight;
          that.setData({
            time: count,
            height: height + '%',
            top: top + '%'
          });
          secondFlag = false;
        }
      }
    };
    // 画布绘画函数
    function ringMove(s, e) {
      var context = wx.createCanvasContext('secondCanvas')

      // 绘制圆环
      context.setStrokeStyle('rgb(134, 165, 186)')
      context.beginPath()
      context.setLineWidth(5 * rpx)
      context.arc(25 * rpx, 25 * rpx, 20 * rpx, s, e, true)
      context.stroke()
      context.closePath()

      // 绘制倒计时文本
      context.beginPath()
      context.setLineWidth(8 * rpx)
      context.setFontSize(27 * rpx)
      context.setFillStyle('rgb(134, 165, 186)')
      context.setTextAlign('center')
      context.setTextBaseline('middle')
      context.fillText(n - num + '', 25 * rpx, 25 * rpx, 100 * rpx)
      context.fill()
      context.closePath()

      context.draw()

      // 每完成一次全程绘制就+1
      num++;
    }
    // 倒计时前先绘制整圆的圆环
    ringMove(start, end);
    // 创建倒计时
    time = setInterval(animation, 1000);
  },
  //初始化函数
  init: function (index) {
    var that = this
    //标记正确答案
    if (index == 'a') {
      this.setData({
        'color.a': 'white'
      })
    } else if (index == 'b') {
      this.setData({
        'color.b': 'white'
      })
    } else if (index == 'c') {
      this.setData({
        'color.c': 'white'
      })
    } else {
      this.setData({
        'color.d': 'white'
      })
    }
    //请求题
    wx.request({
      url: 'https://www.pkusess.club/questionget',
      //url: 'http://127.0.0.1:5000/questionget',
      method: 'POST',
      data: { openID: app.globalData.openid },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        that.setData({
          title: res.data.title, //题目
          op: res.data.op //选项列表
        })
      },
      fail: (res) => {
        that.setData({
          title: '网络请求繁忙，请稍后重试'
        })
      }
    });
    //停留一秒
    var t = new Date().getTime();

    function sleep(d) {
      while (new Date().getTime() - t <= d);
    }
    sleep(1000);
    //重新设置
    this.setData({
      plate: false,
      title: title,
      op: op,
      color: {
        a: 'rgba(15, 170, 157, 0.966)',
        b: 'rgba(15, 170, 157, 0.966)',
        c: 'rgba(15, 170, 157, 0.966)',
        d: 'rgba(15, 170, 157, 0.966)'
      }
    })
    secondFlag = true; //重新开始计时,进度条增加
  },
  //提交函数
  submitA: function () {
    this.setData({
      plate: true
    })
    const that = this;
    //发送用户选项，返回judge和currentOp
    wx.request({
      url: 'https://www.pkusess.club/questionjudge',
      //url: 'http://127.0.0.1:5000/questionjudge',
      data: {
        openID: app.globalData.openid,
        userOp: 'a', //用户选项
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        var index = res.data.opr //正确答案
        //答对
        if (res.judge == true) {
          that.setData({
            number: res.number,
            'color.a': 'white'
          })
        }
        //答错
        else {
          that.setData({
            'color.a': 'rgb(252, 79, 11)'
          })
        }
        this.init(index)
      }
    });
  },
  submitB: function () {
    this.setData({
      plate: true
    })
    const that = this;
    //发送用户选项，返回judge和currentOp
    wx.request({
      url: 'https://www.pkusess.club/questionjudge',
      //url: 'http://127.0.0.1:5000/questionjudge',
      data: {
        openID: app.globalData.openid,
        userOp: 'b',
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        var index = res.data.opr
        //答对
        if (res.judge == true) {
          that.setData({
            number:res.number,
            'color.b': 'white'
          })
        }
        //答错
        else {
          that.setData({
            'color.b': 'rgb(252, 79, 11)'
          })
        }
        this.init(index)
      }
    });
  },
  submitC: function () {
    this.setData({
      plate: true
    })
    const that = this;
    //发送用户选项，返回judge和currentOp
    wx.request({
      url: 'https://www.pkusess.club/questionjudge',
      //url: 'http://127.0.0.1:5000/questionjudge',
      data: {
        openID: app.globalData.openid,
        userOp: 'c',
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        var index = res.data.opr
        //答对
        if (res.judge == true) {
          that.setData({
            number: res.number,
            'color.c': 'white'
          })
        }
        //答错
        else {
          that.setData({
            'color.c': 'rgb(252, 79, 11)'
          })
        }
        this.init(index)
      }
    });
  },
  submitD: function () {
    this.setData({
      plate: true
    })
    const that = this;
    //发送用户选项，返回judge和currentOp
    wx.request({
      url: 'https://www.pkusess.club/questionjudge',
      //url: 'http://127.0.0.1:5000/questionjudge',
      data: {
        openID: app.globalData.openid,
        userOp: 'd',
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        var index = res.data.opr
        //答对
        if (res.judge == true) {
          that.setData({
            number: res.number,
            'color.d': 'white'
          })
        }
        //答错
        else {
          that.setData({
            'color.d': 'rgb(252, 79, 11)'
          })
        }
        this.init(index)
      }
    });
  },
  //结束函数
  finish: function () {
    //接收总数
    var that = this;
    wx.request({
      url: 'https://www.pkusess.club/finish',
      //url: 'http://127.0.0.1:5000/finish',
      data: {
        openID: app.globalData.openid,
        flag: 'finish'
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        that.setData({
          number: res.data.number
        })
      }
    });
    //页面初始化
    count = 1
    secondFlag = false
    height = processHeight
    top = 90 - processHeight
    //弹出总结框
    function numberAnimation() {
      setTimeout(function () {
        var step = that.data.step + 1;
        if (step == that.data.number + 1) {
          that.setData({
            text: true,
          });
          return;
        } else {
          that.setData({
            step: step
          })
        }
        numberAnimation();
      }, 300);
    }
    this.setData({
      finish: true
    });
    numberAnimation();
  }
})
//2.home页面onshow方法更新数据 4.排行榜