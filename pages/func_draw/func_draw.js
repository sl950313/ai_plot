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
    .select('#myCanvas') // 在 WXML 中填入的 id
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
    .select('#myCanvas') // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        this.setData({
          width: canvas.width,
          height: canvas.height
        });
    });
  },

  startDrawFunc: function() {
    console.log("startDrawFunc");
    
    const { ctx, startX, startY, height, width } = this.data;
    // ctx.translate(300, 300);

    let x = width / 2;
    let y = height / 2;
    let size = 30;

    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.bezierCurveTo(x + size * 2, y - size * 2, x + size * 4, y + size * 3, x, y + size * 5);
    ctx.bezierCurveTo(x - size * 4, y + size * 3, x - size * 2, y - size * 2, x, y);

    ctx.fillStyle = 'red';    
    ctx.fill();

    // 绘制到画布
    ctx.stroke();
    return;

    let xi = 0;
    let yi = 0;
    console.log(width, height);
    // for (let i = 0; i < width; ++i) {
    //   ctx.moveTo(xi, yi);
    //   xi = xi + 1;
    //   yi = Math.pow(xi, 1.5);
    //   ctx.lineTo(xi, yi);
    //   // console.log(xi, yi, width, height)
    //   // ctx.stroke();
    // }
    // ctx.stroke();
    // return;

    let start_x = width / 2;
    let start_y = height / 2;
    // let t = 0;
    let vt = 0.001;
    let maxt = 2 * Math.PI;
    let maxi = Math.ceil(maxt / vt);
    start_x = 0;
    start_y = 0;
    let end_x = 0;
    let end_y = 0;
    let pointArr=[];
    var x0 =  width / 2;
    var y0 = height / 2;
    // var x = 0;
    // var y = 0;
    for (var t = -3; t <= 3; t = t + 0.001) {          
      // console.log("start_x:", start_x, "start_y", start_y);

      // ctx.moveTo((start_x + 1) * width / 2, (start_y + 1) * height / 2);
      ctx.moveTo(x + x0, y0 - y);
      t += vt;

      x = 16 * Math.pow(Math.sin(t), 3);
      x = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      // ctx.moveTo(, start_y);
      x = x * 16;
      y = y * 16;
      ctx.lineTo(x + x0, y0 - y);
      start_x = end_x;
      start_y = end_y;
      // ctx.stroke();
    }
    ctx.stroke();

    // ctx.moveTo(0, 0);
    // ctx.lineTo(0, 0);
    // ctx.stroke();

    // ctx.moveTo(0, 0);
    // ctx.lineTo(10, 10);
    // ctx.stroke();

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