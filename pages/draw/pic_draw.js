Page({
  data: {
    selectedImages: [], // 用户选中的图片
    frameInterval: 200, // 帧间隔（默认200ms）
    loopOptions: ['无限', '1次', '2次', '3次'], // 循环次数选项
    loopIndex: 0, // 默认选中无限循环
    generatedGifUrl: '', // 生成的 GIF URL
  },

  // 选择图片
  chooseImages() {
    wx.chooseImage({
      count: 9, // 最多选择 9 张
      success: (res) => {
        this.setData({ selectedImages: res.tempFilePaths });
      },
    });
  },

  // 更新帧间隔
  updateFrameInterval(e) {
    this.setData({ frameInterval: parseInt(e.detail.value) || 200 });
  },

  // 更新循环次数
  updateLoopCount(e) {
    this.setData({ loopIndex: parseInt(e.detail.value) });
  },

  // 调用后台生成 GIF
  generateGif() {
    wx.showLoading({ title: '生成中...' });

    wx.uploadFile({
      url: 'https://106.14.113.34/generate-gif', // 后端接口
      filePath: this.data.selectedImages[0], // 示例，仅上传第一张图片
      name: 'file',
      formData: {
        frameRate: this.data.frameInterval,
        loopCount: this.data.loopIndex === 0 ? 0 : this.data.loopIndex,
      },
      success: (res) => {
        const { gifUrl } = JSON.parse(res.data);
        this.setData({ generatedGifUrl: gifUrl });
        wx.hideLoading();
      },
      fail: (err) => {
        console.error('生成失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '生成失败，抱歉, 当前功能暂不支持哦',
          icon: 'none',
          duration: 2500,
        });
      },
    });
  },

  // 保存 GIF 到相册
  saveGif() {
    wx.downloadFile({
      url: this.data.generatedGifUrl,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: '保存成功' }),
          fail: () => wx.showToast({ title: '保存失败', icon: 'error' }),
        });
      },
    });
  },
});
