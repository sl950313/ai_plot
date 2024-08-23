// index.js
Page({
  data: {
    
  },

  toNormalDraw: function() {
    wx.navigateTo({
      url: '../draw/draw',
    });
  },

  toPicDraw: function() {
    wx.navigateTo({
      url: '../draw/pic_draw',
    })
  },

  toFuncDraw: function() {
    wx.navigateTo({
      url: '../func_draw/func_draw',
    })
  },

  onLoad: function () {
    // const ctx = wx.createCanvasContext('myCanvas');
    // this.setData({ ctx });
  }
})
