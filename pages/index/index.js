// index.js
Page({
  data: {
    
  },

  toNormalDraw: function() {
    wx.navigateTo({
      url: '/pages/draw/draw',
    });
  },

  toPicDraw: function() {
    wx.navigateTo({
      url: '/pages/draw/pic_draw',
    })
  },

  onLoad: function () {
    // const ctx = wx.createCanvasContext('myCanvas');
    // this.setData({ ctx });
  }
})
