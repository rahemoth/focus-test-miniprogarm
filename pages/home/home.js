// pages/home/home.js
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  navigateTopretest(){
    wx.navigateTo({ url: '/pages/pretest/pretest' });

  },

  navigateTotest(){
    wx.navigateTo({
      url: '/pages/user_test/user_test',
    });
  },
  


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})