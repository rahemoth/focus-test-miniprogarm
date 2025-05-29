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
    selectedIndex: -1, // 选中的选项索引（-1表示未选中）
  },

  handleButtonTap(e) {
    const index = e.currentTarget.dataset.index;
    console.log(`点击按钮：${this.data.buttonList[index].text}`,index);
  },

  // 选项单选事件
  handleOptionSelect(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index,
    });
    console.log(`选中选项：${this.data.optionList[index].text}`, index);
    console.log(this.data.selectedIndex)
  },
});