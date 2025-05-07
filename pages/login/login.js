Page({
  data: {
    isLogin: true,
    formData: {
      username: '',
      password: '',
      confirmPassword: '',
      gender: '',
      age: '',
      inviteCode: '',
      selectedCategory: '',
      selectedSub: ''
    },
    registerButtonText: '注册账号',
    // 用于保存注册的账号密码
    registeredUser: {
      username: '',
      password: ''
    }
  },

  // 测试服务器连接（暂时无用，因为不接入 URL）
  testServerConnection() {
    // 这里暂时保留，后续接入 URL 后可以使用
    wx.request({
      url: 'http://10.96.54.185:8083/registerWithInfo',
      method: 'HEAD',
      success: () => {
        console.log('服务器连接成功');
      },
      fail: (err) => {
        console.error('无法连接到服务器:', err);
      }
    });
  },

  // 页面加载时测试服务器连接（暂时无用，因为不接入 URL）
  onLoad() {
    this.testServerConnection();
  },

  // 微信授权回调
  handleUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = e.detail.userInfo;
      wx.showLoading({ title: '登录中...' });

      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: `欢迎回来，${userInfo.nickName}`,
          icon: 'success'
        });
        wx.navigateTo({ url: '/pages/pretest/pretest' });
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
          gender: '',
          age: '',
          inviteCode: '',
          selectedCategory: '',
          selectedSub: ''
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

    if (!isLogin) {
      // 注册模式专属验证
      if (formData.password!== formData.confirmPassword) {
        wx.showToast({ title: '两次输入密码不一致', icon: 'none' });
        console.log('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        wx.showToast({ title: '密码至少需要6位', icon: 'none' });
        console.log('Password is too short');
        return;
      }

      // 保存注册的账号密码
      this.setData({
        'registeredUser.username': formData.username,
        'registeredUser.password': formData.password
      });

      wx.showToast({
        title: '注册成功',
        icon:'success'
      });

      // 切换到登录状态
      this.setData({
        isLogin: true,
        registerButtonText: '注册账号',
        formData: {
          username: '',
          password: '',
          confirmPassword: '',
          gender: '',
          age: '',
          inviteCode: '',
          selectedCategory: '',
          selectedSub: ''
        }
      });
    } else {
      // 登录逻辑
      const { registeredUser } = this.data;
      if (formData.username === registeredUser.username && formData.password === registeredUser.password) {
        wx.showLoading({ title: '登录中...' });
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon:'success'
          });
          wx.navigateTo({ url: '/pages/pretest/pretest' });
        }, 1500);
      } else {
        wx.showToast({
          title: '用户名或密码错误',
          icon: 'none'
        });
      }
    }
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
        gender: '',
        age: '',
        inviteCode: '',
        selectedCategory: '',
        selectedSub: ''
      }
    });
  }
});


// Page({
//   data: {
//       isLogin: true,
//       formData: {
//           username: '',
//           password: '',
//           confirmPassword: '',
//           gender: '',
//           age: '',
//           inviteCode: '',
//           selectedCategory: '',
//           selectedSub: ''
//       },
//       registerButtonText: '注册账号'
//   },

//   // 测试服务器连接
//   testServerConnection() {
//       wx.request({
//           url: 'http://10.96.54.185:8083/registerWithInfo',
//           method: 'HEAD',
//           success: () => {
//               console.log('服务器连接成功');
//           },
//           fail: (err) => {
//               console.error('无法连接到服务器:', err);
//           }
//       });
//   },

//   // 页面加载时测试服务器连接
//   onLoad() {
//       this.testServerConnection();
//   },

//   // 微信授权回调
//   handleUserInfo(e) {
//       if (e.detail.errMsg === 'getUserInfo:ok') {
//           const userInfo = e.detail.userInfo;
//           wx.showLoading({ title: '登录中...' });

//           setTimeout(() => {
//               wx.hideLoading();
//               wx.showToast({
//                   title: `欢迎回来，${userInfo.nickName}`,
//                   icon: 'success'
//               });
//               wx.navigateTo({ url: '/pages/pretest/pretest' });
//           }, 1500);
//       }
//   },

//   // 切换登录/注册
//   switchTab(e) {
//       const type = e.currentTarget.dataset.type;
//       console.log('Switching to', type);
//       if (type === 'register') {
//           this.setData({
//               isLogin: false,
//               registerButtonText: '立即注册'
//           });
//       } else {
//           this.setData({
//               isLogin: true,
//               registerButtonText: '注册账号',
//               formData: {
//                   username: '',
//                   password: '',
//                   confirmPassword: '',
//                   gender: '',
//                   age: '',
//                   inviteCode: '',
//                   selectedCategory: '',
//                   selectedSub: ''
//               }
//           });
//       }
//   },

//   // 输入框变更
//   onInputChange(e) {
//       const { name } = e.currentTarget.dataset;
//       if (name) {
//           console.log(`Input change: ${name} = ${e.detail.value}`);
//           this.setData({
//               [`formData.${name}`]: e.detail.value
//           });
//       } else {
//           console.error('Input name is undefined');
//       }
//   },

//   // 统一表单提交
//   handleSubmit() {
//       console.log('handleSubmit called');
//       const { isLogin, formData } = this.data;
//       console.log('Form data:', formData);

//       // 通用验证
//       if (!formData.username.trim()) {
//           wx.showToast({ title: '用户名不能为空', icon: 'none' });
//           console.log('Username is empty');
//           return;
//       }
//       if (!formData.password.trim()) {
//           wx.showToast({ title: '密码不能为空', icon: 'none' });
//           console.log('Password is empty');
//           return;
//       }

//       // 注册模式专属验证
//       if (!isLogin) {
//           if (formData.password !== formData.confirmPassword) {
//               wx.showToast({ title: '两次输入密码不一致', icon: 'none' });
//               console.log('Passwords do not match');
//               return;
//           }
//           if (formData.password.length < 6) {
//               wx.showToast({ title: '密码至少需要6位', icon: 'none' });
//               console.log('Password is too short');
//               return;
//           }

//           // 调用注册接口
//           wx.showLoading({ title: '注册中...' });
//           wx.request({
//               url: 'http://localhost:8083/registerWithInfo',
//               method: 'POST',
//               header: {
//                   'Content-Type': 'application/json'
//               },
//               data: {
//                   username: formData.username,
//                   password: formData.password,
//                   role: 'USER',
//                   gender: formData.gender,
//                   age: formData.age,
//                   inviteCode: formData.inviteCode,
//                   selectedCategory: formData.selectedCategory,
//                   selectedSub: formData.selectedSub
//               },


//               success: (res) => {
//                   wx.hideLoading();
//                   if (res.data && res.data.code === 200) {
//                       wx.showToast({
//                           title: '注册成功，请登录',
//                           icon: 'success'
//                       });
//                       this.setData({
//                           isLogin: true,
//                           registerButtonText: '注册账号',
//                           formData: {
//                               username: '',
//                               password: '',
//                               confirmPassword: ''
//                           }
//                       });
//                   } else {
//                       const errorMsg = res.data && res.data.message? res.data.message : '未知错误';
//                       wx.showToast({
//                           title: errorMsg,
//                           icon: 'none'
//                       });
//                   }
//               },
//               fail: (err) => {
//                   wx.hideLoading();
//                   wx.showToast({
//                       title: '注册失败，请稍后重试',
//                       icon: 'none'
//                   });
//                   console.error('注册请求失败:', err);
//               }
//           });
//           return;
//       }

//       // 登录逻辑（保持不变）
//       wx.showLoading({ title: '登录中...' });
//       // 这里可以添加登录接口调用逻辑
//       setTimeout(() => {
//           wx.hideLoading();
//           // 模拟登录成功，实际需要调用登录接口验证
//           wx.showToast({
//               title: '登录成功',
//               icon: 'success'
//           });
//           wx.navigateTo({ url: '/pages/pretest/pretest' });
//       }, 1500);
//   },

//   // 返回登录按钮点击事件
//   backToLogin() {
//       this.setData({
//           isLogin: true,
//           registerButtonText: '注册账号',
//           formData: {
//               username: '',
//               password: '',
//               confirmPassword: '',
//               gender: '',
//               age: '',
//               inviteCode: '',
//               selectedCategory: '',
//               selectedSub: ''
//           }
//       });
//   }
// });