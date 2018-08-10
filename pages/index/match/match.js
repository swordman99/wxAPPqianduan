Page({
  data:{
    times: 10
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    var step = 1,//计数动画次数
      num = 0,//计数倒计时秒数（n - num）
      start = 1.5 * Math.PI,// 开始的弧度
      end = -0.5 * Math.PI,// 结束的弧度
      time = null;// 计时器容器

    var animation_interval = 1000,// 每1秒运行一次计时器
      n = 8; // 当前倒计时为10秒
    // 动画函数
    function animation() {
      if (step <= n) {
        end = end + 2 * Math.PI / n;
        ringMove(start, end);
        step++;
      } else {
        clearInterval(time);
      }
    };
    // 画布绘画函数
    function ringMove(s, e) {
      var context = wx.createCanvasContext('secondCanvas')

      // 绘制圆环
      context.setStrokeStyle('rgb(134, 165, 186)')
      context.beginPath()
      context.setLineWidth(5)
      context.arc(250, 70, 20, s, e, true)
      context.stroke()
      context.closePath()

      // 绘制倒计时文本
      context.beginPath()
      context.setLineWidth(8)
      context.setFontSize(27)
      context.setFillStyle('rgb(134, 165, 186)')
      context.setTextAlign('center')
      context.setTextBaseline('middle')
      context.fillText(n - num + '', 250, 70, 100)
      context.fill()
      context.closePath()

      context.draw()

      // 每完成一次全程绘制就+1
      num++;
    }
    // 倒计时前先绘制整圆的圆环
    ringMove(start, end);
    // 创建倒计时m.h987yuitryuioihyhujik[jhgvfbnvnjmnbvbnm,nbvfcgklkjhg545545545u ]
    // var times = this.data.times;
    // while (times > 0){
    time = setInterval(animation, animation_interval);
    // times--;
    // }
  },

})