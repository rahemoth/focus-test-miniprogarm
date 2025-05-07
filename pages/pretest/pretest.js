Page({
  data: {
    count: 0,
    totalCells: 4 * 5, // 4行×5列
    tableData: [],
    currentRow: 0,
    currentCol: 0,
    selectedCells: Array.from({ length: 4 }, () => Array(5).fill('')), // 4行5列
    isTestCompleted: false,
    currentTestIndex: 0,
    points: [],
    special: null,
    rowPoints: Array(2).fill().map(() => []), // 4行需要2组points(每2行一组)
  },

  onLoad() {
    this.prepareNextTest(0);
  },

  prepareNextTest(nextIndex) {
    this.setData({
      currentTestIndex: nextIndex,
      isTestCompleted: false,
      selectedCells: Array.from({ length: 4 }, () => Array(5).fill('')),
      currentRow: 0,
      currentCol: 0,
      count: 0
    });

    if (nextIndex === 0) {
      this.generateTable1Data();
    } else if (nextIndex === 1) {
      this.generateTable2Data();
    } else if (nextIndex === 2) {
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

  // 生成表1数据 (4x5)
  generateTable1Data() {
    const points = this.getRandomPoints(0, 7);
    const normalNumbers = Array.from({ length: 8 }, (_, i) => i).filter(n => !points.includes(n));
    const data = [];
    const totalCells = 4 * 5;
    
    // 随机选择4个位置放置阳性符号
    const pointPositions = [];
    while (pointPositions.length < 4) {
      const pos = Math.floor(Math.random() * totalCells);
      if (!pointPositions.includes(pos)) pointPositions.push(pos);
    }

    for (let i = 0; i < 4; i++) { // 4行
      const row = [];
      for (let j = 0; j < 5; j++) { // 5列
        const index = i * 5 + j;
        if (pointPositions.includes(index)) {
          row.push(points[Math.random() < 0.5 ? 0 : 1]);
        } else {
          row.push(normalNumbers[Math.floor(Math.random() * normalNumbers.length)]);
        }
      }
      data.push(row);
    }
    
    this.setData({
      tableData: data,
      points: points,
      special: null,
      totalCells: 4 * 5
    });
  },

  // 生成表2数据 (4x5)
  generateTable2Data() {
    const rowPoints = [];
    // 4行需要2组points(每2行一组)
    for (let i = 0; i < 2; i++) {
      rowPoints.push(this.getRandomPoints(0, 7));
    }
    
    const data = [];
    for (let i = 0; i < 4; i++) { // 4行
      const groupIndex = Math.floor(i / 2); // 每2行一组
      const currentPoints = rowPoints[groupIndex];
      const normalNumbers = Array.from({ length: 8 }, (_, i) => i)
          .filter(n => !currentPoints.includes(n));

      const row = [];
      const pointCols = [];
      while (pointCols.length < 1) { // 每行1个阳性符号
        const col = Math.floor(Math.random() * 5);
        if (!pointCols.includes(col)) pointCols.push(col);
      }

      for (let j = 0; j < 5; j++) { // 5列
        if (pointCols.includes(j)) {
          row.push(currentPoints[Math.floor(Math.random() * currentPoints.length)]);
        } else {
          row.push(normalNumbers[Math.floor(Math.random() * normalNumbers.length)]);
        }
      }
      data.push(row);
    }
    
    this.setData({
      tableData: data,
      rowPoints: rowPoints,
      points: [],
      special: null,
      totalCells: 4 * 5
    });
  },

  // 生成表3数据 (4x5)
  generateTable3Data() {
    const special = Math.random() < 0.5 ? 8 : 9;
    const rowPoints = [];
    for (let i = 0; i < 2; i++) { // 4行需要2组points
      rowPoints.push(this.getRandomPoints(0, 7));
    }
    
    const data = [];
    for (let i = 0; i < 4; i++) { // 4行
      const groupIndex = Math.floor(i / 2);
      const currentPoints = rowPoints[groupIndex];
      const normalNumbers = Array.from({ length: 8 }, (_, i) => i)
          .filter(n => !currentPoints.includes(n) && n !== special);

      const row = [];
      const specialCol = Math.floor(Math.random() * 3); // 0-3之间，确保special+1不超过4
      const pointCols = [];
      
      while (pointCols.length < 1) {
        const col = Math.floor(Math.random() * 5);
        if (col !== specialCol && col !== specialCol + 1 && !pointCols.includes(col)) {
          pointCols.push(col);
        }
      }

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
    }
    
    this.setData({
      tableData: data,
      rowPoints: rowPoints,
      points: [],
      special: special,
      totalCells: 4 * 5
    });
  },

  getImageSrc(value) {
    return `/images/symbols/${value}.png`;
  },

  handleCellTap(e) {
    if (this.data.isTestCompleted) return;
    const { row, col } = e.currentTarget.dataset;
    this.setData({
      currentRow: row,
      currentCol: col
    });
  },

  handleRelated() {
    this.processSelection('related');
  },

  handleUnrelated() {
    this.processSelection('unrelated');
  },

  handleInvalid() {
    this.processSelection('invalid');
  },

  processSelection(type) {
    if (this.data.isTestCompleted) return;
    const { currentRow, currentCol } = this.data;
    if (currentRow < 0 || currentCol < 0) return;
    
    const selectedCells = this.data.selectedCells.slice();
    let selectionType = '';
    
    if (type === 'related') {
      selectedCells[currentRow][currentCol] = 'related';
      selectionType = 'A';
    } else if (type === 'unrelated') {
      selectedCells[currentRow][currentCol] = 'unrelated';
      selectionType = 'Space';
    } else if (type === 'invalid') {
      selectedCells[currentRow][currentCol] = 'invalid';
      selectionType = 'S';
    }
    
    this.setData({
      selectedCells: selectedCells,
      count: this.data.count + 1
    });
    
    this.recordSelection(selectionType);
    this.moveToNextCell();
    this.checkCompletion();
  },

  moveToNextCell() {
    let { currentRow, currentCol, selectedCells } = this.data;
    let attempts = 0;
    const maxAttempts = this.data.totalCells;
    let found = false;

    do {
      currentCol++;
      if (currentCol >= 5) {
        currentCol = 0;
        currentRow++;
        if (currentRow >= 4) { // 4行
          currentRow = 0;
        }
      }

      const currentState = selectedCells[currentRow] ? selectedCells[currentRow][currentCol] : '';
      if (currentState === '' || currentState === ' ') {
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
    } while (!found && !this.data.isTestCompleted);

    this.setData({
      currentRow,
      currentCol
    });
  },

  checkCompletion() {
    if (this.data.count >= this.data.totalCells) {
      this.setData({
        isTestCompleted: true,
        currentRow: -1,
        currentCol: -1
      });
      this.submitData();
      return true;
    }
    return false;
  },

  recordSelection(state) {
    const { currentRow, currentCol, tableData } = this.data;
    const selection = {
      row: currentRow,
      col: currentCol,
      state,
      value: tableData[currentRow][currentCol],
      timestamp: new Date().toISOString()
    };
    console.log('Recorded selection:', selection);
  },

  submitData() {
    console.log("提交测试数据");
  },

  swiperChange(e) {
    const current = e.detail.current;
    this.prepareNextTest(current);
  },
  
  isPointCell(rowIndex, cell) {
    if (this.data.currentTestIndex === 0) {
      return this.data.points.includes(cell);
    } else {
      const groupIndex = Math.floor(rowIndex / 2);
      const points = this.data.rowPoints[groupIndex];
      return points && points.includes(cell);
    }
  },
  
  handleImageError(e) {
    console.error('图片加载错误:', e.detail.errMsg);
  }
});