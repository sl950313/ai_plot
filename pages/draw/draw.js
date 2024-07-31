Page({
  data: {
    ctx: null,
    canvas: null,
    isDrawing: false,
    startX: 0,
    startY: 0
  },

  onLoad: function () {
    // const ctx = wx.createCanvasContext('myCanvas');
    // this.setData({ ctx });

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
    });
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
    console.log("touchMove", " ctx", this.data.ctx);
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
    // x.createSelectorQuery()
    // .select('#myCanvas') // 在 WXML 中填入的 id
    // .fields({ node: true, size: true })
    // .exec((res) => {
    //     // Canvas 对象
    //     const canvas = res[0].node
    //     // 渲染上下文
    //     const ctx = canvas.getContext('2d')
        
    // });
  }
});
