Page({
  data: {
    brushColor: '#000000', // 默认画笔颜色
    redValue: 0,
    greenValue: 0,
    blueValue: 0,
    boxColor: '#000000',
    brushWidth: 5, // 默认画笔宽度
    showColor: false, // 控制颜色选择器的显示
    showWidth: false, // 控制宽度选择器的显示
    ctx: null,
    width: null,
    height: null,
    canvas: null,
    picPath: null,
    isDrawing: false,
    undoPic: false,
    startX: 0,
    startY: 0,
    showBrushOptions: true,
    settingBrushWidth: false,
    settingBrushColor: false,
    canvasHistory: [],
    // setting
    colorOptions: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ffffff', '#000000'] // 颜色选项
    // widthOptions: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20] // 画笔宽度选项
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

  onRedColorChange(e) {
    const red = e.detail.value;
    console.log("onRedColorChange red:", red, "e,", e)
    this.setData({ redValue: red });
    this.setBoxColor();
  },

  onBlueColorChange(e) {
    const blue = e.detail.value;
    this.setData({ blueValue: blue });
    this.setBoxColor();
  },

  onGreenColorChange(e) {
    const green = e.detail.value;
    this.setData({ greenValue: green });
    this.setBoxColor();
  },

  setBoxColor: function() {
    const r = this.data.redValue / 100.0 * 256;
    const g = this.data.greenValue / 100.0 * 256;
    const b = this.data.blueValue / 100.0 * 256;
    this.setData({
      brushColor: `rgb(${r}, ${g}, ${b})` 
    });
    console.log("r:", r, "g", g, "b", b, "redValue:", this.data.redValue, "greenValue:", this.data.greenValue, "blueValue:", this.data.blueValue);
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
        this.setData({
          width: width,
          height: height
        });

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
    });
    // console.log("undoPic:", this.data.undoPic);
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
    const { ctx, startX, startY, brushColor, brushWidth } = this.data;
    let currentX = startX;
    let currentY = startY;
    this.currentPath = [{currentX, currentY, brushColor, brushWidth}];
    // const ctx = wx.createCanvasContext('myCanvas', this);
    // ctx.setStrokeStyle(this.data.brushColor);
    // ctx.setLineWidth(this.data.brushWidth);
    // ctx = wx.createCanvasContext('myCanvas', this);
    ctx.lineWidth = this.data.brushWidth
    ctx.brushColor = this.data.brushColor
    ctx.strokeStype = this.data.brushColor
    ctx.lineCap = 'round'

    ctx.beginPath();

    console.log("startX:", this.data.startX, " startY:", this.data.startY, this.data.brushColor, this.data.brushWidth)
  },

  touchmove: function (e) {
    // e.preventDefault(); // 阻止默认行为
    // e.stopPropagation(); // 阻止事件冒泡

    console.log("touchMove", " ctx", this.data.ctx, " position", e.touches[0], this.data.brushColor, this.data.brushWidth);
    if (!this.data.isDrawing) return;

    const { ctx, startX, startY, brushColor, brushWidth } = this.data;
    const currentX = e.touches[0].x;
    const currentY = e.touches[0].y;

    this.currentPath.push({ currentX, currentY, brushColor, brushWidth });

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

    console.log("touchEnd", this.data.brushColor, this.data.brushWidth);
    this.setData({
      isDrawing: false
    });

    if (this.currentPath && this.currentPath.length > 0) {
      const newHistory = [...this.data.canvasHistory, this.currentPath];
      this.setData({
        canvasHistory: newHistory,
        // isDrawing: false,
      });
    }
    console.log("canvashistory size:", this.data.canvasHistory);
  },

  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  undo: function() {
    console.log("undo");
    if (this.data.canvasHistory.length === 0) return;

    // 移除最后一条路径
    const newHistory = this.data.canvasHistory.slice(0, -1);
    this.setData({
      canvasHistory: newHistory,
    });
    console.log("canvashistory size:", this.data.canvasHistory);

    const { ctx, startX, startY } = this.data;
    ctx.clearRect(0, 0, this.data.width, this.data.height);

    console.log("clear ok", this.data.picPath);
    // for (var i = 0; i < 1000000; ++i) {
    //   //
    // }

    // await sleep(1000);

    console.log("plot image");
    if (this.data.picPath) {
      this.loadImageToCanvas(this.data.picPath);
    }

    // console.log("plot path undoPic", this.data.undoPic);

    for (const path of newHistory) {
      console.log("path:", path);
      for (let i = 1; i < path.length; i++) {
        ctx.lineWidth = path[i - 1].brushWidth;
        ctx.brushColor = path[i - 1].brushColor;
        ctx.strokeStype = path[i - 1].brushColor;
        ctx.beginPath();
        
        ctx.moveTo(path[i - 1].currentX, path[i - 1].currentY);
        ctx.lineTo(path[i].currentX, path[i].currentY);      
        // console.log(path[i - 1].currentX, path[i - 1].currentY, " to ", path[i].currentX, path[i].currentY);
        ctx.stroke();
      }
      // console.log("final", path[0].currentX, path[0].currentY, "to", path[path.length - 1].currentX, path[path.length - 1].currentY);
    }
  },

  loadImg: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]; // 获取临时文件路径
        this.loadImageToCanvas(tempFilePath);
        this.setData({
          picPath: tempFilePath
        });
      },
      fail: (err) => {
        console.error("选择图片失败：", err);
      },
    });
  },

  loadImageToCanvas: function(imagePath) {
    console.log("loadImageToCanvas", imagePath);
    const { canvas, ctx } = this.data;

    const img = canvas.createImage();
    img.src = imagePath;

    img.onload = () => {
      // 将图片绘制到 Canvas 上
      const imgWidth = img.width;
      const imgHeight = img.height;
      const canvasWidth = this.data.width;
      const canvasHeight = this.data.height;
      console.log("img onload", imgWidth, imgHeight, canvasWidth, canvasHeight);

      const scaleX = canvasWidth / imgWidth;
      const scaleY = canvasHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY); // 保证图片完整显示

      // 计算图片在 Canvas 上的显示区域
      const displayWidth = imgWidth * scale;
      const displayHeight = imgHeight * scale;

      const offsetX = (canvasWidth - displayWidth) / 2; // 居中显示
      const offsetY = (canvasHeight - displayHeight) / 2;
      console.log("drawImage", offsetX, offsetY, displayWidth, displayHeight, scale);

      ctx.drawImage(img, offsetX, offsetY, displayWidth, displayHeight);
      // ctx.draw(true);
      // ctx.drawImage(img, 0, 0);
      console.log("drawImage undoPic1", this.data.undoPic);
      this.data.undoPic = true;
      console.log("drawImage undoPic2", this.data.undoPic);
    };

    img.onerror = (err) => {
      console.error("图片加载失败：", err);
    };
    
  },

  // loadImg2: function() {
  //   let canvas = this.data.canvas;
  //   let ctx = this.data.ctx;
  //   const img = canvas.createImage();
  //   console.log(ctx, canvas, img);
  //   img.onLoad = () => {
  //     ctx.drawImage(img, 0, 0);
  //     console.log("Here onLoad");
  //   }
  //   img.src = "https://img2.baidu.com/it/u=1208038369,1789115807&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667";
  //   console.log("img.src:");
  //   ctx.drawImage(img, 0, 0);
  // },

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
    this.data.picPath = null;
  },

  saveImg: function () {
    const {canvas, ctx, startX, startY } = this.data;
    console.log("saveImg ctx", ctx);
    console.log("saveImg", "canvas", canvas)

    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        console.log('用户授权成功');
        // 继续执行保存图片的操作
        // saveImageToAlbum();
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
                  wx.showToast({
                    title: '图片已保存到相册', // 提示文本
                    icon: 'success', // 图标样式
                    duration: 2000, // 显示时间（单位：毫秒）
                  });
                },
                fail: (err) => {
                  wx.showToast({
                    title: '保存失败，请重试',
                    icon: 'none',
                    duration: 2000,
                  });
                },
                complete: (res) => {
    
                }
              })
          },
      })
      },
      fail() {
        console.log('用户授权失败');
        wx.showToast({
          title: '请授权保存图片',
          icon: 'none',
        });
      }
    });
    

    
  }
});
