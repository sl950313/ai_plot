// pages/draw/pic_draw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx : null,
    canvas : null,
    startX : 0,
    startY : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.createSelectorQuery()
    .select('#picCanvas') // 在 WXML 中填入的 id
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
        console.log("pic ctx", this.data.ctx, " canvas", canvas);
    });

    // console.log("ctx", this.data.ctx);

    wx.createSelectorQuery()
    .select('#picCanvas') // 在 WXML 中填入的 id
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
    });
  },

  loadImg: function() {
    let canvas = this.data.canvas;
    let ctx = this.data.ctx;
    const img = canvas.createImage();
    console.log(ctx, canvas, img);
    img.onLoad = () => {
      ctx.drawImage(img, 0, 0);
      console.log("Here onLoad");
    }
    img.src = "https://img2.baidu.com/it/u=1208038369,1789115807&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667";
    console.log("img.src:");
    ctx.drawImage(img, 0, 0);

  },

  touchstart: function (e) {
    this.setData({
      isDrawing: true,
      startX: e.touches[0].x,
      startY: e.touches[0].y
    });
    console.log("startX:", this.data.startX, " startY:", this.data.startY)
  },

  touchmove: function (e) {
    console.log("touchMove", " ctx", this.data.ctx, " position", e.touches[0]);
    if (!this.data.isDrawing) return;

    const { ctx, startX, startY } = this.data;
    const currentX = e.touches[0].x;
    const currentY = e.touches[0].y;

    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    // ctx.draw();

    this.setData({
      startX: currentX,
      startY: currentY
    });
  },

  touchend: function () {
    console.log("touchEnd")
    this.setData({
      isDrawing: false
    });
  },

  clearCanvas: function () {
    wx.createSelectorQuery()
    .select('#picCanvas') // 在 WXML 中填入的 id
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