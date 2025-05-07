App({
  onLaunch() {
    wx.navigateTo({
      url: '/pages/login/login'
    });

  },
  globalData: {
    userInfo: null // 初始时没有用户信息
  } 
});