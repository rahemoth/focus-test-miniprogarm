Page({
  data: {
    currentTestIndex: 0,
    table1Data: [],
    table1Points: [],
    table1CellBackground: [],
    table1CellIndex: 0,
    table1CurrentRow: 0,
    table1CurrentCol: 0,
    table1TotalRows: 20,
    table1TotalCols: 5,
    table1VisibleRows: 5,
    table1VisibleStartRow: 0,
    table1IsTestCompleted: false,
    
    table2Data: [],
    table2Points: [],
    table2CellBackground: [],
    table2CellIndex: 0,
    table2CurrentRow: 0,
    table2CurrentCol: 0,
    table2TotalRows: 20,
    table2TotalCols: 5,
    table2VisibleRows: 5,
    table2VisibleStartRow: 0,
    table2IsTestCompleted: false,
    
    table3Data: [],
    table3Points: [],
    table3Special: 0,
    table3CellBackground: [],
    table3CellIndex: 0,
    table3CurrentRow: 0,
    table3CurrentCol: 0,
    table3TotalRows: 20,
    table3TotalCols: 5,
    table3VisibleRows: 5,
    table3VisibleStartRow: 0,
    table3IsTestCompleted: false,
    
    touchStartX: 0,
    tableBackgroundColor: '#ffffff'
  },

  onLoad() {
    this.initializeAllTables();
  },

  initializeAllTables() {
    this.generateTable1Data();
    this.generateTable2Data();
    this.prepareTable3()
    this.prepareTable1();
  },

  // 表1相关逻辑
  generateTable1Data() {
    const data = Array.from({ length: this.data.table1TotalRows }, () => 
      Array.from({ length: this.data.table1TotalCols }, () => Math.floor(Math.random() * 8))
    );
    this.setData({ table1Data: data });
  },

  prepareTable1() {
    const points = this.getRandomPoints(0, 7);
    const background = Array.from({ length: this.data.table1TotalRows }, () =>
      Array.from({ length: this.data.table1TotalCols }, () => '#ffffff')
    );
    background[0][0] = '#87CEEB';
    
    this.setData({
      table1Points: points,
      table1CellBackground: background,
      table1CellIndex: 0,
      table1CurrentRow: 0,
      table1CurrentCol: 0,
      table1VisibleStartRow: 0,
      table1IsTestCompleted: false
    });
  },

  processTable1Selection() {
    if (this.data.table1IsTestCompleted) return;
    
    const { table1CellIndex, table1CellBackground, table1VisibleStartRow, table1VisibleRows, table1TotalCols, table1TotalRows } = this.data;
    const currentRow = Math.floor(table1CellIndex / table1TotalCols);
    const currentCol = table1CellIndex % table1TotalCols;
    
    const newBackground = JSON.parse(JSON.stringify(table1CellBackground));
    newBackground[currentRow][currentCol] = '#435869';
    
    const nextIndex = table1CellIndex + 1;
    const nextRow = Math.floor(nextIndex / table1TotalCols);
    const nextCol = nextIndex % table1TotalCols;
    
    if (nextIndex >= table1TotalRows * table1TotalCols) {
      this.setData({
        table1IsTestCompleted: true,
        table1CellBackground: newBackground
      });
      return;
    }
    
    const visibleEndRow = table1VisibleStartRow + table1VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol == 4) {
      this.setData({ table1VisibleStartRow: table1VisibleStartRow + 1 });
    }
    
    newBackground[nextRow][nextCol] = '#87CEEB';
    
    this.setData({
      table1CellIndex: nextIndex,
      table1CurrentRow: nextRow,
      table1CurrentCol: nextCol,
      table1CellBackground: newBackground
    });
  },

  handleTable1CellTap(e) {
    const row = e.currentTarget.dataset.row;
    const col = e.currentTarget.dataset.col;
    this.setData({
      table1CurrentRow: row,
      table1CurrentCol: col
    });
  },

  handleTable1Related() {
    this.processTable1Selection();
  },

  handleTable1Unrelated() {
    this.processTable1Selection();
  },

  handleTable1Invalid() {
    this.processTable1Selection();
  },

  // 表2相关逻辑
  generateTable2Data() {
    const data = Array.from({ length: this.data.table2TotalRows }, () => 
      Array.from({ length: this.data.table2TotalCols }, () => Math.floor(Math.random() * 8))
    );
    this.setData({ table2Data: data });
  },

  prepareTable2() {
    const points = this.getRandomPoints(0, 7);
    const background = Array.from({ length: this.data.table2TotalRows }, () =>
      Array.from({ length: this.data.table2TotalCols }, () => '#ffffff')
    );
    background[0][0] = '#87CEEB';
    
    this.setData({
      table2Points: points,
      table2CellBackground: background,
      table2CellIndex: 0,
      table2CurrentRow: 0,
      table2CurrentCol: 0,
      table2VisibleStartRow: 0,
      table2IsTestCompleted: false
    });
  },

  processTable2Selection() {
    if (this.data.table2IsTestCompleted) return;
    
    const { table2CellIndex, table2CellBackground, table2VisibleStartRow, table2VisibleRows, table2TotalCols, table2TotalRows } = this.data;
    const currentRow = Math.floor(table2CellIndex / table2TotalCols);
    const currentCol = table2CellIndex % table2TotalCols;
    
    const newBackground = JSON.parse(JSON.stringify(table2CellBackground));
    newBackground[currentRow][currentCol] = '#435869';
    
    const nextIndex = table2CellIndex + 1;
    const nextRow = Math.floor(nextIndex / table2TotalCols);
    const nextCol = nextIndex % table2TotalCols;
    
    if (nextIndex >= table2TotalRows * table2TotalCols) {
      this.setData({
        table2IsTestCompleted: true,
        table2CellBackground: newBackground
      });
      return;
    }
    
    const visibleEndRow = table2VisibleStartRow + table2VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol == 4) {
      this.setData({ table2VisibleStartRow: table2VisibleStartRow + 1 });
    }
    
    newBackground[nextRow][nextCol] = '#87CEEB';
    
    this.setData({
      table2CellIndex: nextIndex,
      table2CurrentRow: nextRow,
      table2CurrentCol: nextCol,
      table2CellBackground: newBackground
    });
  },

  handleTable2CellTap(e) {
    const row = e.currentTarget.dataset.row;
    const col = e.currentTarget.dataset.col;
    this.setData({
      table2CurrentRow: row,
      table2CurrentCol: col
    });
  },

  handleTable2Related() {
    this.processTable2Selection();
  },

  handleTable2Unrelated() {
    this.processTable2Selection();
  },

  handleTable2Invalid() {
    this.processTable2Selection();
  },

  // 表3相关逻辑
  prepareTable3() {
    const points = this.getRandomPoints(0, 7);
    const special = Math.floor(Math.random() * 2) + 8;
    
    // 生成背景色数组
    const background = Array.from({ length: this.data.table3TotalRows }, () =>
      Array.from({ length: this.data.table3TotalCols }, () => '#ffffff')
    );
    background[0][0] = '#87CEEB';
    
    // 生成表格数据（使用正确的special值）
    const getRandomValue = () => {
      const baseNumbers = [0, 1, 2, 3, 4, 5, 6, 7];
      const probability = 0.1; // 设定special被抽到的概率是10%
      
      if (Math.random() < probability) {
        return special; // 使用局部变量special（确保有值）
      } else {
        const randomIndex = Math.floor(Math.random() * baseNumbers.length);
        return baseNumbers[randomIndex];
      }
    };
    
    const data = Array.from({ length: this.data.table3TotalRows }, () => 
      Array.from({ length: this.data.table3TotalCols }, getRandomValue)
    );
    
    // 一次性更新所有状态
    this.setData({
      table3Points: points,
      table3Special: special,
      table3Data: data,
      table3CellBackground: background,
      table3CellIndex: 0,
      table3CurrentRow: 0,
      table3CurrentCol: 0,
      table3VisibleStartRow: 0,
      table3IsTestCompleted: false
    });
  },

  processTable3Selection() {
    if (this.data.table3IsTestCompleted) return;
    
    const { table3CellIndex, table3CellBackground, table3VisibleStartRow, table3VisibleRows, table3TotalCols, table3TotalRows } = this.data;
    const currentRow = Math.floor(table3CellIndex / table3TotalCols);
    const currentCol = table3CellIndex % table3TotalCols;
    
    const newBackground = JSON.parse(JSON.stringify(table3CellBackground));
    newBackground[currentRow][currentCol] = '#435869';
    
    const nextIndex = table3CellIndex + 1;
    const nextRow = Math.floor(nextIndex / table3TotalCols);
    const nextCol = nextIndex % table3TotalCols;
    
    if (nextIndex >= table3TotalRows * table3TotalCols) {
      this.setData({
        table3IsTestCompleted: true,
        table3CellBackground: newBackground
      });
      return;
    }
    
    const visibleEndRow = table3VisibleStartRow + table3VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol == 4) {
      this.setData({ table3VisibleStartRow: table3VisibleStartRow + 1 });
    }
    
    newBackground[nextRow][nextCol] = '#87CEEB';
    
    this.setData({
      table3CellIndex: nextIndex,
      table3CurrentRow: nextRow,
      table3CurrentCol: nextCol,
      table3CellBackground: newBackground
    });
  },

  handleTable3CellTap(e) {
    const row = e.currentTarget.dataset.row;
    const col = e.currentTarget.dataset.col;
    this.setData({
      table3CurrentRow: row,
      table3CurrentCol: col
    });
  },

  handleTable3Related() {
    this.processTable3Selection();
  },

  handleTable3Unrelated() {
    this.processTable3Selection();
  },

  handleTable3Invalid() {
    this.processTable3Selection();
  },

  // 公共方法
  swiperChange(e) {
    const index = e.detail.current;
    this.setData({ currentTestIndex: index });
    
    if (index === 0) this.prepareTable1();
    else if (index === 1) this.prepareTable2();
    else if (index === 2) this.prepareTable3();
  },

  touchStart(e) {
    this.setData({ touchStartX: e.touches[0].clientX });
  },

  touchEnd(e) {
    const { touchStartX, currentTestIndex } = this.data;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;

    if (Math.abs(diffX) > 50) {
      const nextIndex = diffX > 0 
        ? (currentTestIndex - 1 + 3) % 3 
        : (currentTestIndex + 1) % 3;
      
      this.setData({ currentTestIndex: nextIndex }, () => {
        if (nextIndex === 0) this.prepareTable1();
        else if (nextIndex === 1) this.prepareTable2();
        else if (nextIndex === 2) this.prepareTable3();
      });
    }
  },

  changeTableColor() {
    const colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'];
    const currentIndex = colors.indexOf(this.data.tableBackgroundColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    this.setData({ tableBackgroundColor: colors[nextIndex] });
  },

  getRandomPoints(min, max) {
    const points = new Set();
    while (points.size < 2) {
      points.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(points);
  }
});