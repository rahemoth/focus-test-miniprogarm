// pages/home/home.js
Page({
  data: {
    popupShow: false, // 控制弹窗显示状态
  },

  /**
   * 点击「开始测试」触发弹窗
   */
  showPopup() {
    this.setData({ popupShow: true });
  },

  /**
   * 处理弹窗选择结果（跳转测试页面）
   */
  handleSelectResult(e) {
    const { mode, rank, isWhole } = e.detail;
    // 跳转时携带参数（示例：拼接参数到URL）
    wx.navigateTo({
      url: `/pages/test/test`,
    });
    // 关闭弹窗
    this.setData({ popupShow: false });
  },

  /**
   * 预测试跳转（保持原功能）
   */
  navigateTopretest() {
    wx.navigateTo({ url: '/pages/pretest/pretest' });
  },

  /**
   * 关闭弹窗（点击遮罩层时触发）
   */
  closePopup() {
    this.setData({ popupShow: false });
  },
});