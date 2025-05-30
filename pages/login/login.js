
Page({
  data: {
      isLogin: true,
      formData: {
          username: '',
          password: '',
          confirmPassword: '',
          gender: 'MALE',
          age: '24',
          inviteCode: 'GYKTEST'
      },
      registerButtonText: '注册账号'
  },

  // 测试服务器连接
  testServerConnection() {
      wx.request({
          url: 'http://localhost:8084/api/registerWithInfo',
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { 
          username: 'test',
          password: 'test',
          confirmPassword: 'test',
          gender: 'MALE',
          age: '19',
          inviteCode: 'GYKTEST'
        },
          success: () => {
              console.log('服务器连接成功');
          },
          fail: (err) => {
              console.error('无法连接到服务器:', err);
          }
      });
  },

  // 页面加载时测试服务器连接
  onLoad() {
      this.testServerConnection();
  },

  // 微信授权回调
  handleUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
          const userInfo = e.detail.userInfo;
          wx.showLoading({ title: '登录中...' });
          console.log(e.detail.userInfo);

          setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                  title: `欢迎回来`,
                  icon: 'success'
              });
              wx.switchTab({ url: '/pages/home/home' });
          }, 1500);
      }
  },

  // 切换登录/注册
  switchTab(e) {
      const type = e.currentTarget.dataset.type;
      console.log('Switching to', type);
      if (type === 'register') {
          this.setData({
              isLogin: false,
              registerButtonText: '立即注册'
          });
      } else {
          this.setData({
              isLogin: true,
              registerButtonText: '注册账号',
              formData: {
                  username: '',
                  password: '',
                  confirmPassword: '',
                  role: 'USER',
                  gender: 'MALE',
                  age: '24',
                  inviteCode: 'GYKTEST',
              }
          });
      }
  },

  // 输入框变更
  onInputChange(e) {
      const { name } = e.currentTarget.dataset;
      if (name) {
          console.log(`Input change: ${name} = ${e.detail.value}`);
          this.setData({
              [`formData.${name}`]: e.detail.value
          });
      } else {
          console.error('Input name is undefined');
      }
  },

  // 统一表单提交
  handleSubmit() {
      console.log('handleSubmit called');
      const { isLogin, formData } = this.data;
      console.log('Form data:', formData);

      // 通用验证
      if (!formData.username.trim()) {
          wx.showToast({ title: '用户名不能为空', icon: 'none' });
          console.log('Username is empty');
          return;
      }
      if (!formData.password.trim()) {
          wx.showToast({ title: '密码不能为空', icon: 'none' });
          console.log('Password is empty');
          return;
      }

      // 注册模式专属验证
      if (!isLogin) {
          if (formData.password !== formData.confirmPassword) {
              wx.showToast({ title: '两次输入密码不一致', icon: 'none' });
              console.log('Passwords do not match');
              return;
          }
          if (formData.password.length < 6) {
              wx.showToast({ title: '密码至少需要6位', icon: 'none' });
              console.log('Password is too short');
              return;
          }

          // 调用注册接口
          wx.showLoading({ title: '注册中...' });
          wx.request({
              url: 'http://localhost:8084/api/registerWithInfo',
              method: 'POST',
              header: {
                  'Content-Type': 'application/json'
              },
              data: {
                  username: formData.username,
                  password: formData.password,
                  role: 'USER',
                  gender: formData.gender,
                  age: formData.age,
                  inviteCode: formData.inviteCode
              },


              success: (res) => {
                  wx.hideLoading();
                  if (res.data && res.data.code === 200) {
                      wx.showToast({
                          title: '注册成功',
                          icon: 'success'
                      });
                      this.setData({
                          isLogin: true,
                          registerButtonText: '注册账号',
                          formData: {
                              username: '',
                              password: '',
                              confirmPassword: ''
                          }
                      });
                  } else {
                      const errorMsg = res.data && res.data.message? res.data.message : '未知错误';
                      wx.showToast({
                          title: errorMsg,
                          icon: 'none'
                      });
                  }
              },
              fail: (err) => {
                  wx.hideLoading();
                  wx.showToast({
                      title: '注册失败',
                      icon: 'none'
                  });
                  console.error('注册请求失败:', err);
              }
          });
          return;
      }

      wx.showLoading({ title: '登录中...' });
      wx.request({
          url: 'http://localhost:8084/api/login',
          method: 'POST',
          header: {
              'Content-Type': 'application/json'
          },
          data: JSON.stringify({
              username: formData.username,
              password: formData.password
          }),
          success: (res) => {
              wx.hideLoading();
              if (res.data && res.data.code === 200) {
                  wx.showToast({
                      title: '登录成功',
                      icon: 'success'
                  });
                  // 保存用户信息和 token 到本地存储
                  wx.setStorageSync('userInfo', res.data.data);
                  wx.setStorageSync('token', res.data.data.token);
                  wx.switchTab({ url: '/pages/home/home' });
              } else {
                  const errorMsg = res.data && res.data.message? res.data.message : '未知错误';
                  wx.showToast({
                      title: errorMsg,
                      icon: 'none'
                  });
              }
          },
          fail: (err) => {
              wx.hideLoading();
              wx.showToast({
                  title: '登录失败',
                  icon: 'none'
              });
              console.error('登录请求失败:', err);
          }
      });
  },

  // 返回登录按钮点击事件
  backToLogin() {
      this.setData({
          isLogin: true,
          registerButtonText: '注册账号',
          formData: {
              username: '',
              password: '',
              confirmPassword: '',
              role: '',
              gender: '',
              age: '',
              inviteCode: ''
          }
      });
  }
});