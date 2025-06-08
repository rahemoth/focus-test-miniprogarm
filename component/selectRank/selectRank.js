Component({
  properties: {
    show: { type: Boolean, value: false }, 
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
    selectedRank: 1, 
    selectedMode: -1, 
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
      const rankValue = e.detail.value; 
     
      this.setData({ selectedRank: rankValue  });
      console.log(rankValue);
    },

    
    confirmSelection() {
      
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
      
      this.setData({ show: false });

      wx.navigateTo({
        url: '/pages/user_test/user_test',
      })
    },

    
    closePopup() {
      this.setData({ show: false });
    },
  },
});