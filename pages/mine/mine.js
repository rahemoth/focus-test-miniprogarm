// pages/mine/mine.js
Page({

  
  data: {
    userInfo: {
      id: null,
      username: '',
      role: ''
    },
  },


  onLoad() {
    
    this.loadUserInfo();

  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
      console.log('用户ID:', this.data.userInfo.id);
    } else {
      this.setData({
        userInfo: {}
      });
    }
  },

  MyTestResult(){
    

  },

  getTestResults() {
    wx.showLoading({ title: '加载中' });
    const token = wx.getStorageSync('token'); 
    const userId = this.data.userInfo.id; // 实际需从用户信息中获取，或根据业务传参
    
    wx.request({
        url: 'http://localhost:8084/api/USER/results', // 替换为实际后端接口地址
        method: 'GET',
        header: { 'Authorization': `Bearer ${token}` },
        data: {
            userId: userId
        },
        success: (res) => {
                console.log('完整响应数据:', res.data);  // 打印完整响应
                const filteredData = this.filterTablesWithMaxId(res.data.data);
                console.log('过滤后数据:', filteredData);
                wx.getStorageSync('result', filteredData);
                wx.navigateTo({
                  url: '/pages/result/result',
                })
        },
        fail: (err) => {
            wx.showToast({ title: '网络请求失败', icon: 'none' });
            console.error('请求失败:', err);
        },
        complete: () => {
            wx.hideLoading(); // 隐藏加载提示（若有）
        }
    });
},


  filterTablesWithMaxId(apiData) {
    const idList = [];
    const tableNames = ['summaryResults', 'table1Results', 'table2Results', 'table3Results'];

    // 步骤1：收集所有有效id及对应表名
    tableNames.forEach(tableName => {
        const tableData = apiData[tableName];
        if (Array.isArray(tableData) && tableData.length > 0) {
            tableData.forEach(item => {
                const id = item?.id;
                if (typeof id === 'number' && id >= 0) {
                    idList.push({ id, tableName });
                }
            });
        }
    });

    // 步骤2：无有效id时返回空数组
    if (idList.length === 0) return [];

    // 步骤3：找到最大id对应的表名
    const maxId = Math.max(...idList.map(item => item.id));
    const targetTableName = idList.find(item => item.id === maxId)?.tableName;

    // 步骤4：直接返回目标表的数组（确保返回数组，避免undefined）
    return targetTableName ? apiData[targetTableName] || [] : [];
  },



  myInfo(){

  },



  logout(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

})