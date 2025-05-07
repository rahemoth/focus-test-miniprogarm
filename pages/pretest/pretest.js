Page({
  data: {
    currentTestIndex: 0,
    tableData: [],
    selectedCells: [],
    currentRow: 0,
    currentCol: 0,
    isTestCompleted: false,
    points: [],
    special: null,
    rowPoints: [],
    showNotice: false,
    touchStartX: 0,
    tableBackgroundColor: 'white' // 默认底色为白色
  },

  onLoad() {
    console.log('页面加载');
    this.prepareNextTest(0);
  },

  prepareNextTest(nextIndex) {
    this.setData({
      currentTestIndex: nextIndex,
      isTestCompleted: false,
      selectedCells: Array(4).fill().map(() => Array(3).fill('')), // 修改为4行3列
      currentRow: 0,
      currentCol: 0,
      count: 0
    });

    if (nextIndex === 0) {
      const points = this.getRandomPoints(0, 7);
      this.setData({
        points,
        special: null
      });
      this.generateTable1Data();
    } else if (nextIndex === 1) {
      this.setData({
        points: [],
        special: null
      });
      this.generateTable2Data();
    } else if (nextIndex === 2) {
      const special = Math.random() < 0.5 ? 8 : 9;
      this.setData({
        points: [],
        special
      });
      this.generateTable3Data();
    }
  },

  getRandomPoints(min, max) {
    let first = Math.floor(Math.random() * (max - min + 1)) + min;
    let second = Math.floor(Math.random() * (max - min + 1)) + min;
    while (second === first) {
      second = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return [first, second];
  },

  generateTable1Data() {
    const { points } = this.data;
    const data = [];
    const normalNumbers = Array.from({ length: 10 }, (_, i) => i)
        .filter(n => !points.includes(n));
  
    const totalPoints = 6; // 修改为6个点，适合4x3表格
    const pointPositions = [];
    while (pointPositions.length < totalPoints) {
      const pos = Math.floor(Math.random() * 12); // 4x3表格总单元格数为12
      if (!pointPositions.includes(pos)) pointPositions.push(pos);
    }
  
    for (let i = 0; i < 4; i++) { // 修改为4行
      const row = [];
      for (let j = 0; j < 3; j++) { // 修改为3列
        if (pointPositions.includes(i * 3 + j)) {
          row.push(points[Math.random() < 0.5 ? 0 : 1]);
        } else {
          row.push(normalNumbers[Math.floor(Math.random() * normalNumbers.length)]);
        }
      }
      data.push(row);
    }
    this.setData({ tableData: data });
    console.log('表1数据生成完成', data);
  },

  generateTable2Data() {
    console.log('开始生成表2数据');
    const data = [];
    const rowPoints = [];
  
    // 为每一行生成随机点
    for (let i = 0; i < 4; i++) { // 4行
      rowPoints.push(this.getRandomPoints(0, 7));
    }
    console.log('行点生成完成:', rowPoints);
  
    for (let i = 0; i < 4; i++) { // 4行
      const groupIndex = Math.floor(i / 2); // 每两行一个组
      const currentPoints = rowPoints[groupIndex];
      const normalNumbers = Array.from({ length: 10 }, (_, i) => i)
          .filter(n => !currentPoints.includes(n));
  
      const row = [];
      const pointCols = [];
      while (pointCols.length < 2) {
        const col = Math.floor(Math.random() * 3); // 3列
        if (!pointCols.includes(col)) pointCols.push(col);
      }
      console.log(`第${i}行的点列:`, pointCols);
  
      for (let j = 0; j < 3; j++) { // 3列
        if (pointCols.includes(j)) {
          row.push(currentPoints[Math.floor(Math.random() * 2)]);
        } else {
          row.push(normalNumbers[Math.floor(Math.random() * normalNumbers.length)]);
        }
      }
      data.push(row);
      console.log(`第${i}行数据:`, row);
    }
  
    this.setData({ 
      tableData: data,
      rowPoints 
    });
    console.log('表2数据生成完成:', data);
  },

  generateTable3Data() {
    console.log('开始生成表3数据');
    const { special } = this.data;
    const data = [];
    const rowPoints = [];
  
    // 为每一行生成随机点
    for (let i = 0; i < 4; i++) { // 4行
      rowPoints.push(this.getRandomPoints(0, 7));
    }
    console.log('行点生成完成:', rowPoints);
  
    for (let i = 0; i < 4; i++) { // 4行
      const groupIndex = Math.floor(i / 2); // 每两行一个组
      const currentPoints = rowPoints[groupIndex];
      const normalNumbers = Array.from({ length: 10 }, (_, i) => i)
          .filter(n => !currentPoints.includes(n) && n !== special);
  
      const row = [];
      const specialCol = Math.floor(Math.random() * 2); // 避免越界
      const pointCols = [];
  
      while (pointCols.length < 2) {
        const col = Math.floor(Math.random() * 3); // 3列
        if (col !== specialCol && col !== specialCol + 1 && !pointCols.includes(col)) {
          pointCols.push(col);
        }
      }
      console.log(`第${i}行的特殊列: ${specialCol}, 点列:`, pointCols);
  
      const shouldPutPointAfterSpecial = Math.random() < 0.7;
  
      for (let j = 0; j < 3; j++) { // 3列
        if (j === specialCol) {
          row.push(special);
        } else if (shouldPutPointAfterSpecial && j === specialCol + 1) {
          row.push(currentPoints[Math.floor(Math.random() * currentPoints.length)]);
        } else if (pointCols.includes(j)) {
          row.push(currentPoints[Math.floor(Math.random() * currentPoints.length)]);
        } else {
          row.push(normalNumbers[Math.floor(Math.random() * normalNumbers.length)]);
        }
      }
      data.push(row);
      console.log(`第${i}行数据:`, row);
    }
  
    this.setData({ 
      tableData: data,
      rowPoints 
    });
    console.log('表3数据生成完成:', data);
  },

  handleRelated() {
    this.processSelection('A');
  },

  handleUnrelated() {
    this.processSelection('B');
  },

  handleInvalid() {
    this.processSelection('C');
  },

  processSelection(type) {
    const { currentRow, currentCol, isTestCompleted, selectedCells } = this.data;
    if (isTestCompleted || currentRow < 0 || currentCol < 0) return;

    const newSelectedCells = [...selectedCells];
    newSelectedCells[currentRow][currentCol] = type;
    
    this.setData({
      selectedCells: newSelectedCells,
      count: this.data.count + 1
    });

    this.moveToNextCell();
  },

  moveToNextCell() {
    let { currentRow, currentCol, tableData, selectedCells } = this.data;
    let attempts = 0;
    const maxAttempts = tableData.length * tableData[0].length;
    let found = false;

    do {
      currentCol++;
      if (currentCol >= tableData[0].length) {
        currentCol = 0;
        currentRow++;
        if (currentRow >= tableData.length) {
          currentRow = 0;
        }
      }

      if (selectedCells[currentRow][currentCol] === '') {
        found = true;
      }

      if (++attempts > maxAttempts) {
        this.setData({
          isTestCompleted: true,
          currentRow: -1,
          currentCol: -1
        });
        return;
      }
    } while (!found);

    this.setData({
      currentRow,
      currentCol
    });
  },

  switchTest(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.prepareNextTest(index);
  },

  goBackToTest() {
    wx.navigateBack();
  },

  getImageSrc(value) {
    return `/images/${value}.png`;
  },

  toggleNotice() {
    this.setData({
      showNotice: !this.data.showNotice
    });
  },

  touchStart(e) {
    this.setData({
      touchStartX: e.touches[0].clientX
    });
  },

  touchEnd(e) {
    const { touchStartX } = this.data;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;

    if (Math.abs(diffX) > 50) { // 滑动距离阈值
      if (diffX > 0) {
        // 向右滑动，切换到上一个测试表
        const prevIndex = (this.data.currentTestIndex - 1 + 3) % 3;
        this.prepareNextTest(prevIndex);
      } else {
        // 向左滑动，切换到下一个测试表
        const nextIndex = (this.data.currentTestIndex + 1) % 3;
        this.prepareNextTest(nextIndex);
      }
    }
  },

  changeTableColor() {
    const colors = ['white', '#f0f0f0f0', '#e0e0e0e0', '#d0d0d0d0'];
    const currentIndex = colors.indexOf(this.data.tableBackgroundColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    this.setData({
      tableBackgroundColor: colors[nextIndex]
    });
  }
});