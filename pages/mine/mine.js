// pages/mine/mine.js
Page({
  showProfilePopup: false, // 控制弹出层显示/隐藏
  
  data: {
    userInfo: {
      id: null,
      username: '',
      role: '',
      age: '',
      gender: ''
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
      console.log('用户ID:', this.data.userInfo);
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
    const userId = this.data.userInfo.id; 
    
    wx.request({
        url: 'http://localhost:8084/api/USER/results', 
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


    if (idList.length === 0) return [];

    
    const maxId = Math.max(...idList.map(item => item.id));
    const targetTableName = idList.find(item => item.id === maxId)?.tableName;


    return targetTableName ? apiData[targetTableName] || [] : [];
  },



  myInfo(){
    this.setData({ showProfilePopup: true });
  },

  closeProfilePopup() {
    this.setData({ showProfilePopup: false });
  },

  stopPropagation() {
    
  },

  logout(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

})