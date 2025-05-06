App({
  onLaunch() {
    // 直接跳转到 pretest 页面，跳过登录流程
    wx.navigateTo({
      url: '/pages/pretest/pretest'
    });

  },
  globalData: {
    userInfo: null // 初始时没有用户信息
  }
});