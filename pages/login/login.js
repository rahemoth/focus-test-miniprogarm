Page({
  data: {
    formData: {
      isLogin: true,
      username: '',
      password: ''
    }
  },

  // 微信授权回调
  handleUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = e.detail.userInfo
      wx.showLoading({ title: '登录中...' })
      
      // 实际开发中此处发送用户信息到后端
      setTimeout(() => {
        wx.hideLoading()
        wx.showToast({
          title: `欢迎回来，${userInfo.nickName}`,
          icon: 'success'
        })
        // 跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
    }
  },

  // 表单提交
  handleSubmit() {
    const { username, password } = this.data.formData
    
    if (!username || !password) {
      return wx.showToast({ 
        title: '请填写用户名和密码', 
        icon: 'none' 
      })
    }


    switchTab(e) 
    {
      const type = e.currentTarget.dataset.type;
      this.setData({
        isLogin: type === 'login', // 根据类型切换状态
        formData: { // 清空表单
          username: '',
          password: '',
          confirmPassword: ''
        }
      });
    }

    wx.showLoading({ title: '登录中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
    }, 1000)
  },

  // 输入框变更
  onInputChange(e) {
    const { name } = e.currentTarget.dataset
    this.setData({
      [`formData.${name}`]: e.detail.value
    })
  },

  handleSubmit() 
  {
    const { isLogin, formData } = this.data;
    
    // 通用验证
    if (!formData.username || !formData.password) {
      return wx.showToast({ title: '请输入用户名和密码', icon: 'none' });
    }
  
    // 注册专属验证
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        return wx.showToast({ title: '两次密码不一致', icon: 'none' });
      }
      if (formData.password.length < 6) {
        return wx.showToast({ title: '密码至少6位', icon: 'none' });
      }
    }
  
    // 提交逻辑
    wx.showLoading({ title: isLogin ? '登录中...' : '注册中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: isLogin ? '登录成功' : '注册成功',
        icon: 'success'
      });
      // 实际开发中此处发起网络请求
    }, 1500);
  }
})