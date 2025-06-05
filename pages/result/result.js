Page({
  data: {
    currentWeight: '106.0',  // 当前体重
    targetWeight: '98',      // 目标体重
    loseWeight: '8.0',       // 需减重
    endDate: '2024年8月22日',// 完成时间
    duration: '2',           // 周期（月）
    planType: '健康型'       // 计划类型
  },

  onLoad() {
    // 可扩展：动态计算时间差、体重进度等
  },

  goReport() {
    wx.navigateTo({ url: '/pages/report/report' });
  },

  
  backTohome() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  // 右侧分享：定义分享内容（必写，否则分享无内容）
  onShareAppMessage() {
    return {
      title: '分享解析报告给好友', // 分享标题
      path: '/pages/report/report', // 分享的页面路径（需与 goReport 一致）
      imageUrl: '/images/Figure/NN.png', // 可选：分享封面图
    };
  },
})