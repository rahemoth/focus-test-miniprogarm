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
    touchStartX: 0
  },

  onLoad() {
    console.log('页面加载');
    this.prepareNextTest(0);
  },

  // 准备下一个测试
  prepareNextTest(nextIndex) {
    this.setData({
      currentTestIndex: nextIndex,
      isTestCompleted: false,
      selectedCells: Array(5).fill().map(() => Array(5).fill('')), // 修改为5行5列
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

  // 获取随机点
  getRandomPoints(min, max) {
    let first = Math.floor(Math.random() * (max - min + 1)) + min;
    let second = Math.floor(Math.random() * (max - min + 1)) + min;
    while (second === first) {
      second = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return [first, second];
  },

  // 生成表1数据
  generateTable1Data() {
    console.log('生成表1数据');
    const { points } = this.data;
    const data = [];
    const normalNumbers = Array.from({ length: 8 }, (_, i) => i)
        .filter(n => !points.includes(n));
  
    const totalPoints = 10; // 修改为10个点，适合5x5表格
    const pointPositions = [];
    while (pointPositions.length < totalPoints) {
      const pos = Math.floor(Math.random() * 25); // 5x5表格总单元格数为25
      if (!pointPositions.includes(pos)) pointPositions.push(pos);
    }
  
    let counter = 0;
    for (let i = 0; i < 5; i++) { // 修改为5行
      const row = [];
      for (let j = 0; j < 5; j++) { // 修改为5列
        if (pointPositions.includes(counter)) {
          row.push(points[Math.random() < 0.5 ? 0 : 1]);
        } else {
          row.push(normalNumbers[Math.floor(Math.random() * normalNumbers.length)]);
        }
        counter++;
      }
      data.push(row);
    }
    this.setData({ tableData: data });
    console.log('表1数据生成完成', data);
    console.log('tableData:', this.data.tableData);
console.log('points:', this.data.points);
  },

  // 生成表2数据
  generateTable2Data() {
    console.log('开始生成表2数据');
    const data = [];
    const rowPoints = [];
  
    // 为每一行生成随机点
    for (let i = 0; i < 5; i++) { // 5行
      rowPoints.push(this.getRandomPoints(0, 7));
    }
    console.log('行点生成完成:', rowPoints);
  
    for (let i = 0; i < 5; i++) { // 5行
      const groupIndex = Math.floor(i / 1); // 每行一个组
      const currentPoints = rowPoints[groupIndex];
      const normalNumbers = Array.from({ length: 8 }, (_, i) => i)
          .filter(n => !currentPoints.includes(n));
  
      const row = [];
      const pointCols = [];
      while (pointCols.length < 2) {
        const col = Math.floor(Math.random() * 5); // 5列
        if (!pointCols.includes(col)) pointCols.push(col);
      }
      console.log(`第${i}行的点列:`, pointCols);
  
      for (let j = 0; j < 5; j++) { // 5列
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
  // 生成表3数据
  generateTable3Data() {
    console.log('开始生成表3数据');
    const { special } = this.data;
    const data = [];
    const rowPoints = [];
  
    // 为每一行生成随机点
    for (let i = 0; i < 5; i++) { // 5行
      rowPoints.push(this.getRandomPoints(0, 7));
    }
    console.log('行点生成完成:', rowPoints);
  
    for (let i = 0; i < 5; i++) { // 5行
      const groupIndex = Math.floor(i / 1); // 每行一个组
      const currentPoints = rowPoints[groupIndex];
      const normalNumbers = Array.from({ length: 8 }, (_, i) => i)
          .filter(n => !currentPoints.includes(n) && n !== special);
  
      const row = [];
      const specialCol = Math.floor(Math.random() * 4); // 避免越界
      const pointCols = [];
  
      while (pointCols.length < 2) {
        const col = Math.floor(Math.random() * 5); // 5列
        if (col !== specialCol && col !== specialCol + 1 && !pointCols.includes(col)) {
          pointCols.push(col);
        }
      }
      console.log(`第${i}行的特殊列: ${specialCol}, 点列:`, pointCols);
  
      const shouldPutPointAfterSpecial = Math.random() < 0.7;
  
      for (let j = 0; j < 5; j++) { // 5列
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

  // 获取行points
  getRowPoints(rowIndex) {
    const { currentTestIndex, points, rowPoints } = this.data;
    if (currentTestIndex === 0) {
      return points;
    } else {
      const groupIndex = Math.floor(rowIndex / 1); // 修改为每行一个组
      return rowPoints[groupIndex];
    }
  },

  // 判断是否是阳性符号单元格
  isPointCell(rowIndex, cell) {
    const [currentPoint1, currentPoint2] = this.getRowPoints(rowIndex);
    return cell === currentPoint1 || cell === currentPoint2;
  },

  // 处理相关按钮
  handleRelated() {
    this.processSelection('A');
  },

  // 处理不相关按钮
  handleUnrelated() {
    this.processSelection('B');
  },

  // 处理无效按钮
  handleInvalid() {
    this.processSelection('C');
  },

  // 处理选择
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

  // 移动到下一个单元格
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

  // 切换测试表
  switchTest(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.prepareNextTest(index);
  },

  // 返回测试页面
  goBackToTest() {
    wx.navigateBack();
  },

  // 获取图片路径
  getImageSrc(value) {
    return `/images/${value}.png`;
  },

  // 切换说明显示
  toggleNotice() {
    this.setData({
      showNotice: !this.data.showNotice
    });
  },

  // 触摸开始
  touchStart(e) {
    this.setData({
      touchStartX: e.touches[0].clientX
    });
  },

  // 触摸结束
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
  }
});