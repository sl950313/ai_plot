// pages/func_draw/func_draw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx: null,
    canvas: null,
    isDrawing: false,
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.createSelectorQuery()
    .select('#funcCanvas') // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')
        this.setData({
          ctx: ctx,
          canvas: canvas
        });
        console.log("1ctx", this.data.ctx, " canvas", canvas);
    });

    // console.log("ctx", this.data.ctx);

    wx.createSelectorQuery()
    .select('#funcCanvas') // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height
        console.log("Here2", width, height);

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        this.setData({
          width: width,
          height: height
        });
        console.log("Here", this.data.width, this.data.height);
        // this.drawGrid(10, 10);
    });
  },

  drawGrid: function(gridWidth, gridHeight) {
    console.log("drawGrid Here");
    let width = this.data.width;
    let height = this.data.height;
    this.data.ctx.setLineDash([1, 2])
    this.data.ctx.lineWidth = 1;
    this.data.ctx.lineStyle = "gray";

    for (var i = 0; i < gridHeight; ++i) {
      var startPoint = [-width / 2, i * height / gridHeight - height / 2];
      var endPoint = [width / 2, i * height / gridHeight - height / 2];
      this.drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
    }

    for (var i = 0; i < gridWidth; ++i) {
      var startPoint = [i * width / gridWidth - width / 2, height / 2];
      var endPoint = [i * width / gridWidth - width / 2, -height / 2];
      this.drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
    }
  },

  drawLine: function(x1, y1, x2, y2) {
    var cx1 = x1 + this.data.width / 2;
    var cy1 = this.data.height / 2 - y1;
    var cx2 = x2 + this.data.width / 2;
    var cy2 = this.data.height / 2 - y2;
    var ctx = this.data.ctx;
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
  },

  drawSin4x: function() {
    let width = this.data.width;
    let height = this.data.height;
    let ctx = this.data.ctx;
    this.drawGrid(15, 15);
    ctx.lineStyle = "red";
    ctx.lineWidth = 1;
    let interval = 0.01;
    for (var t = -4 * Math.PI; t <= 4 * Math.PI; t += interval) {
      var startPoint = [t * width / 2 / 4 / Math.PI, height / 2 * Math.sin(t)];
      var endPoint = [(t + interval) * width / 2 / 4 / Math.PI, height / 2 * Math.sin((t + interval))]
      this.drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
      // this.drawLine(endPoint[0], endPoint[1]);
    }
  },

  startHeartDrawFunc: function() {
    console.log("startHeartDrawFunc");
    
    let width = this.data.width;
    let height = this.data.height;


    let ctx = this.data.ctx;
    console.log(ctx, width, height)
    let size = 30;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";

    let func_x = []
    let func_y = []

    x = []
    y = []
    for (var i = -1; i < 1; i = i + 0.01) {

    }

    for (var t = -3; t <= 3; t = t + 0.01) {     
      var x = 16 * Math.pow(Math.sin(t), 3);
      var y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      // x = (x / 20.0 + 1 / 2) * width / 2;
      // y = (y / 20.0 + 1 / 2) * height / 2;
      x = (x / 17.0 ) * width / 2;
      y = (y / 18.0) * height / 2;
      func_x.push(x);
      func_y.push(y);
    }

    var b_x = func_x[0];
    var b_y = func_y[0];
    // ctx.moveTo(b_x, b_y);
    this.drawGrid(10, 10);
    for (var i = 1; i < func_x.length; i = i + 1) {
      b_x = func_x[i];
      b_y = func_y[i];
      this.drawLine(func_x[i - 1], func_y[i - 1], func_x[i], func_y[i]);
    }

    return;
  },

  clearCanvas: function () {
    wx.createSelectorQuery()
    .select('#funcCanvas') // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
    });
  },

  saveImg: function () {
    const {canvas, ctx, startX, startY } = this.data;
    console.log("saveImg ctx", ctx);
    console.log("saveImg", "canvas", canvas)
    wx.canvasToTempFilePath({
      canvas,
      success: res => {
          // 生成的图片临时文件路径
          const tempFilePath = res.tempFilePath
          console.log(tempFilePath)
          // wx.setStorageSync('test', tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: (res) => {
              console.log("save png success", res);
            },
            fail: (err) => {

            },
            complete: (res) => {

            }
          })
      },
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})