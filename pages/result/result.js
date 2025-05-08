// pages/result/result.js
Page({
  data: {
    // 用户信息
    userInfo: {
      username: '未知',
      id: '未知',
      role: '未知'
    },

    // 测试数据
    submitData: {
      k: 0,
      g: 0,
      h: 0,
      // 其他字段根据实际需要添加
    },

    // 神经类型数据
    neuralTypeData: {
      /* 与Vue版本相同的神经类型数据 */
    },
    currentNeuralType: '未知类型',
    typeAnalysis: [],

    // 专业分析相关
    showProfessional: false, // 是否显示专业分析
    chatHistory: [],         // 聊天记录
    userQuery: '',           // 用户输入
    isLoading: false,        // 加载状态
    isDeepThinking: false    // 深度思考模式
  },

  onLoad() {
    this.loadUserInfo();
    this.loadTestData();
    this.calculateNeuralType();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('user');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 加载测试数据
  loadTestData() {
    const testData = wx.getStorageSync('testResult');
    if (testData) {
      // 格式化数据
      const formatted = {
        k: testData.k.toFixed(2),
        g: testData.g.toFixed(2),
        h: testData.h.toFixed(2),
        // 其他字段处理...
      };
      this.setData({ submitData: formatted });
    }
  },

  // 计算神经类型
  calculateNeuralType() {
    const { k, g, h } = this.data.submitData;
    // 实现与Vue版本相同的类型判断逻辑
    const type = this.getNeuralType(k, g, h);
    const analysis = this.data.neuralTypeData[type]?.sections || [];
    this.setData({ 
      currentNeuralType: type,
      typeAnalysis: analysis 
    });
  },

  // // 专业分析开关
  // toggleProfessional() {
  //   this.setData({ showProfessional: !this.data.showProfessional });
  // },

  // // 处理用户输入
  // handleInput(e) {
  //   this.setData({ userQuery: e.detail.value });
  // },

  // // 提交问题
  // async submitQuestion() {
  //   if (!this.data.userQuery.trim()) return;

  //   const newMsg = {
  //     role: 'user',
  //     content: this.data.userQuery
  //   };

  //   this.setData({ 
  //     isLoading: true,
  //     chatHistory: [...this.data.chatHistory, newMsg],
  //     userQuery: '' 
  //   });

  //   try {
  //     // 调用云函数
  //     const res = await wx.cloud.callFunction({
  //       name: 'aiChat',
  //       data: {
  //         query: this.data.userQuery,
  //         history: this.data.chatHistory,
  //         isDeep: this.data.isDeepThinking
  //       }
  //     });

  //     const aiMsg = {
  //       role: 'assistant',
  //       content: res.result
  //     };

  //     this.setData({
  //       chatHistory: [...this.data.chatHistory, aiMsg]
  //     });

  //   } catch (err) {
  //     console.error('AI请求失败:', err);
  //   } finally {
  //     this.setData({ isLoading: false });
  //   }
  // },

  // 返回首页
  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 下载报告
  downloadReport() {
    wx.showLoading({ title: '生成报告中...' });
    
    // 调用生成PDF的云函数
    wx.cloud.callFunction({
      name: 'generateReport',
      data: {
        userInfo: this.data.userInfo,
        testData: this.data.submitData,
        neuralType: this.data.currentNeuralType
      },
      success: res => {
        wx.hideLoading();
        wx.saveFile({
          tempFilePath: res.fileID,
          success: savedRes => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
      },
      fail: err => {
        wx.hideLoading();
        console.error('报告生成失败:', err);
      }
    });
  }
})