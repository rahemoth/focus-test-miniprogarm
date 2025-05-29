// pages/index/index.js
Page({
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
    selectedRank: -1, 
    selectedMode: -1,
    iswholeprocess: false,

  },

  handleButtonTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedMode: index,
    });
    console.log(`点击按钮：${this.data.buttonList[index].text}`,index);
    switch(index)
    {
      case 0:
        wx.setStorageSync('selectedRank', res.data.data);
        wx.setStorageSync('selectedMode', res.data.data);
        wx.setStorageSync('iswholeprocess', res.data.data);
        break;
        
      case 1:
        wx.setStorageSync('selectedRank', res.data.data);
        wx.setStorageSync('selectedMode', res.data.data);
        wx.setStorageSync('iswholeprocess', res.data.data);
        break;

      case 2:
        wx.setStorageSync('selectedRank', res.data.data);
        wx.setStorageSync('selectedMode', res.data.data);
        wx.setStorageSync('iswholeprocess', res.data.data);
        break;    

      case 3:
        this.setData({
          iswholeprocess: true,
        });
        wx.setStorageSync('selectedRank', res.data.data);
        wx.setStorageSync('selectedMode', res.data.data);
        wx.setStorageSync('iswholeprocess', res.data.data);
        break;  
    }
  },

  // 选项单选事件
  handleOptionSelect(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedRank: index,
    });
    console.log(`选中选项：${this.data.optionList[index].text}`, index);
    console.log(this.data.selectedRank)
  },
});