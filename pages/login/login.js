Page({
  data: {
      isLogin: true,
      formData: {
          username: '',
          password: '',
          confirmPassword: ''
      },
      registerButtonText: '注册账号',
      registeredUsers: {} // 用于临时保存注册的用户信息
  },

  // 微信授权回调
  handleUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
          const userInfo = e.detail.userInfo;
          wx.showLoading({ title: '登录中...' });

          setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                  title: `登陆成功`,
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
                  confirmPassword: ''
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
      const { isLogin, formData, registeredUsers } = this.data;
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

          // 注册成功，保存用户信息
          const newUser = {
              username: formData.username,
              password: formData.password
          };
          const updatedUsers = { ...registeredUsers };
          updatedUsers[formData.username] = newUser;
          this.setData({
              registeredUsers: updatedUsers
          });
      }

      // 提交逻辑
      wx.showLoading({
          title: isLogin ? '登录中...' : '注册中...'
      });

      setTimeout(() => {
          wx.hideLoading();
          if (isLogin) {
              // 从临时保存的注册信息中验证登录
              const user = registeredUsers[formData.username];
              if (user && user.password === formData.password) {
                  wx.showToast({
                      title: '登录成功',
                      icon: 'success'
                  });
                  wx.navigateTo({
                      url: '/pages/pretest/pretest'
                  });
              } else {
                  wx.showToast({
                      title: '用户名或密码错误',
                      icon: 'none'
                  });
              }
          } else {
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
          }
      }, 1500);
  }
});    