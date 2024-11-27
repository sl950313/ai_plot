Page({
  data: {
    inputText: '', // 存储用户输入的文本
    isLoading: false, // 是否正在生成
    generatedImage: '', // 存储生成的图像地址
  },

  // 监听输入框内容
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value,
    });
  },

  // 生成图片
  generateImage() {
    const { inputText } = this.data;

    // 检查是否有输入内容
    if (!inputText.trim()) {
      wx.showToast({
        title: '请输入描述文字',
        icon: 'none',
      });
      return;
    }

    // 显示加载提示
    this.setData({
      isLoading: true,
    });

    // 假设通过 API 请求生成图片（需要根据实际 API 修改）
    wx.request({
      url: 'https://106.14.113.34/generate-image', // AI 图像生成接口
      method: 'POST',
      data: {
        description: inputText,
      },
      success: (res) => {
        if (res.data && res.data.imageUrl) {
          this.setData({
            generatedImage: res.data.imageUrl, // 返回的生成图片 URL
          });
        } else {
          wx.showToast({
            title: '生成失败，抱歉, 当前功能暂不支持哦',
            icon: 'none',
            duration: 2500,
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '生成失败，抱歉, 当前功能暂不支持哦',
          icon: 'none',
          duration: 2500,
        });
      },
      complete: () => {
        this.setData({
          isLoading: false,
        });
      },
    });
  },

  // 下载图片
  downloadImage() {
    const { generatedImage } = this.data;

    wx.downloadFile({
      url: generatedImage,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
              });
            },
            fail: (err) => {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
              });
            },
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '图片下载失败',
          icon: 'none',
        });
      },
    });
  },
});
