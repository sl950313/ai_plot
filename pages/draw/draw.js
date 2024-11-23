Page({
  data: {
    brushColor: '#000000', // 默认画笔颜色
    brushWidth: 5, // 默认画笔宽度
    showColor: false, // 控制颜色选择器的显示
    showWidth: false, // 控制宽度选择器的显示
    ctx: null,
    canvas: null,
    isDrawing: false,
    startX: 0,
    startY: 0,
    showBrushOptions: true,
    settingBrushWidth: false,
    settingBrushColor: false,
    // setting
    colorOptions: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'], // 颜色选项
    widthOptions: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20] // 画笔宽度选项
    // brushColor: '#000000'
    // brushWidth: 5
  },

  applyBrushSettings() {
    this.setData({ showBrushOptions: false });
  },

  // 关闭画笔设置弹窗
  closeBrushOptions() {
    this.setData({ showBrushOptions: false });
  },

  openBrushOptions() {
    this.setData({ showBrushOptions: true });
  },

  setBrushWidth() {
    var brushWidthOpen = this.data.settingBrushWidth;
    brushWidthOpen = ~brushWidthOpen;
    this.setData({ settingBrushWidth: brushWidthOpen });
    if (brushWidthOpen) {
      this.setData({ settingBrushColor: false });
    }
  },

  setBrushColor() {
    var brushColorOpen = this.data.settingBrushColor;
    brushColorOpen = ~brushColorOpen;
    this.setData({ settingBrushColor: brushColorOpen });
    if (brushColorOpen) {
      this.setData({ settingBrushWidth: false });
    }
  },

  onBrushWidthChange(e) {
    const width = e.detail.value;
    this.setData({ brushWidth: width });
  },

  onPopupTouchStart(e) {
    this.setData({
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY,
    });
  },

  onPopupTouchMove(e) {
    const { startX, startY, popupTop, popupLeft } = this.data;
    const deltaX = e.touches[0].pageX - startX;
    const deltaY = e.touches[0].pageY - startY;

    this.setData({
      popupTop: popupTop + deltaY,
      popupLeft: popupLeft + deltaX,
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY,
    });
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

  showColorPicker: function () {
    this.setData({ showColor: true });
  },

  hideColorPicker: function () {
    this.setData({ showColor: false });
  },

  selectColor: function (e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      brushColor: color,
      showColor: false, // 选择后隐藏颜色选择器
    });
    console.log("select color:", color, " brush color:", this.data.brushColor);
  },

  showWidthPicker: function () {
    this.setData({ showWidth: true });
  },

  hideWidthPicker: function () {
    this.setData({ showWidth: false });
  },

  selectWidth: function (e) {
    const width = e.currentTarget.dataset.width;
    this.setData({
      brushWidth: width,
      showWidth: false, // 选择后隐藏宽度选择器
    });
  },


  touchstart: function (e) {
    // e.preventDefault(); // 阻止默认行为
    // e.stopPropagation(); // 阻止事件冒泡

    this.setData({
      isDrawing: true,
      startX: e.touches[0].x,
      startY: e.touches[0].y
    });
    const { ctx, startX, startY } = this.data;
    // const ctx = wx.createCanvasContext('myCanvas', this);
    // ctx.setStrokeStyle(this.data.brushColor);
    // ctx.setLineWidth(this.data.brushWidth);
    // ctx = wx.createCanvasContext('myCanvas', this);
    ctx.lineWidth = this.data.brushWidth
    ctx.brushColor = this.data.brushColor
    ctx.strokeStype = this.data.brushColor
    ctx.lineCap = 'round'

    ctx.beginPath();

    console.log("startX:", this.data.startX, " startY:", this.data.startY)
  },

  touchmove: function (e) {
    // e.preventDefault(); // 阻止默认行为
    // e.stopPropagation(); // 阻止事件冒泡

    console.log("touchMove", " ctx", this.data.ctx, " position", e.touches[0]);
    if (!this.data.isDrawing) return;

    const { ctx, startX, startY } = this.data;
    const currentX = e.touches[0].x;
    const currentY = e.touches[0].y;

    ctx.strokeStyle = this.data.brushColor;
    // ctx.setFillStyle(this.data.brushColor);
    // ctx.stokeStyle = rgba(255, 0, 0, 1);

    // ctx.fillStyle = '#1aad19'
    // ctx.strokeStyle = 'rgba(0,1,1,0)'
    ctx.lineWidth = this.data.brushWidth;

    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    // ctx.fill();
    ctx.stroke();
    // ctx.draw();

    this.setData({
      startX: currentX,
      startY: currentY
    });
  },

  touchend: function (e) {
    // e.preventDefault(); // 阻止默认行为
    // e.stopPropagation(); // 阻止事件冒泡

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
  }
});
