Page({
  data: {
    feedbackContent: '', // 反馈内容
    contactInfo: '',     // 联系方式
  },

  // 监听反馈内容输入
  onFeedbackInput(e) {
    this.setData({
      feedbackContent: e.detail.value
    });
  },

  // 监听联系方式输入
  onContactInput(e) {
    this.setData({
      contactInfo: e.detail.value
    });
  },

  // 提交反馈
  onSubmit() {
    const { feedbackContent, contactInfo } = this.data;

    if (!feedbackContent.trim()) {
      wx.showToast({
        title: '反馈内容不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 模拟发送反馈到服务器
    wx.showLoading({ title: '提交中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });
      // 重置输入框
      this.setData({
        feedbackContent: '',
        contactInfo: ''
      });
    }, 1000);
  }
});
