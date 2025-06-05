Component({
  properties: {
    show: { type: Boolean, value: false }, // 控制弹窗显示
  },
  data: {
    buttonList: [
      { icon: 'none', text: '表一' },
      { icon: 'none', text: '表二' },
      { icon: 'none', text: '表三' },
      { icon: 'none', text: '全流程' },
    ],
    optionList: [
      { id: 1, text: '1阶' },
      { id: 2, text: '2阶' },
      { id: 3, text: '3阶' },
      { id: 4, text: '4阶' },
    ],
    selectedRank: 1, // 默认选中第0项（1阶）
    selectedMode: -1, // 初始未选择测试类型
    iswholeprocess: false
  },
  methods: {
    handleButtonTap(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ selectedMode: index });
      console.log(index);
    },

    // 滑动条变化事件
    handleSliderChange(e) {
      const rankValue = e.detail.value; // 滑动条值为1-4
      // 将滑动条值（1-4）转换为optionList的索引（0-3）
      this.setData({ selectedRank: rankValue  });
      console.log(rankValue);
    },

    // 确认选择并关闭弹窗
    confirmSelection() {
      // 校验必填项
      if (this.data.selectedMode === -1) {
        wx.showToast({ title: '请选择测试类型', icon: 'none' });
        return;
      }
      if (this.data.selectedMode === 3 )
      {
        this.setData({
          iswholeprocess: true,
        });
      }
      wx.setStorageSync('selectedRank', this.data.selectedRank);
      wx.setStorageSync('selectedMode', this.data.selectedMode);
      wx.setStorageSync('iswholeprocess', this.data.iswholeprocess);
      console.log(this.data.selectedRank,this.data.selectedMode,this.data.iswholeprocess);
      // 关闭弹窗
      this.setData({ show: false });

      wx.navigateTo({
        url: '/pages/user_test/user_test',
      })
    },

    // 点击遮罩层关闭弹窗
    closePopup() {
      this.setData({ show: false });
    },
  },
});