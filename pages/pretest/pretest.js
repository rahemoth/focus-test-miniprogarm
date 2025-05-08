Page({
  data: {
    currentTestIndex: 0,
    selectedCells: [],
    isTestCompleted: false,
    points: [],
    showNotice: false,
    touchStartX: 0,
    tableBackgroundColor: '#ffffff',
    cellBackground: [],  // 二维数组，存储每个单元格的背景色
    cellIndex: 0,        // 当前处理的单元格索引（行优先）
    currentRow: 0,
    currentCol: 0,
    table1Data: []       // 5x5表格数据（数值0-7）
  },

  onLoad() {
    this.initializeTest();
  },

  // 初始化测试流程（新增调试日志）
  initializeTest() {
    console.log('[初始化] 开始生成表格数据');
    this.generateRandomTableData();
    console.log('[初始化] 表格数据生成完成:', this.data.table1Data);
    this.prepareNextTest(0);
  },

  // 准备下一个测试（新增状态重置）
  prepareNextTest(nextIndex) {
    console.log(`[测试切换] 准备第${nextIndex}个测试`);
    this.setData({
      isTestCompleted: false,
      cellIndex: 0,
      selectedCells: [],
      cellBackground: []  // 强制清空旧背景数据
    });

    if (nextIndex === 0) {
      const points = this.getRandomPoints(0, 7);
      this.setData({ points }, () => {
        console.log('[测试准备] 表头阳性符号:', this.data.points);
      });
    }

    this.initCellBackground();
  },

  // 初始化单元格背景（新增空值校验）
  initCellBackground() {
    const { table1Data } = this.data;
    if (!table1Data.length || !table1Data[0].length) {
      console.error('[初始化失败] 表格数据为空');
      return;
    }

    const rows = table1Data.length;
    const cols = table1Data[0].length;
    const background = Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => '#ffffff')  // 默认白色
    );
    background[0][0] = '#00008B';  // 初始选中第一个单元格（深蓝色）

    this.setData({ 
      cellBackground: background,
      currentRow: 0,
      currentCol: 0
    }, () => {
      console.log('[背景初始化] 首单元格背景色:', this.data.cellBackground[0][0]);
    });
  },

  // 处理选择逻辑（新增索引校验和状态打印）
  processSelection() {
    const { isTestCompleted, cellIndex, cellBackground, table1Data } = this.data;
    if (isTestCompleted) {
      console.log('[操作忽略] 测试已完成');
      return;
    }

    const rows = table1Data.length;
    const cols = table1Data[0]?.length || 0;
    if (!rows || !cols) {
      console.error('[操作失败] 表格数据不完整');
      return;
    }

    // 当前单元格坐标计算
    const currentRow = Math.floor(cellIndex / cols);
    const currentCol = cellIndex % cols;
    console.log(`[当前处理] 索引${cellIndex} -> 行${currentRow}, 列${currentCol}`);

    // 深拷贝背景数组（避免引用问题）
    const newCellBackground = JSON.parse(JSON.stringify(cellBackground));
    newCellBackground[currentRow][currentCol] = '#87CEEB';  // 标记已处理为浅蓝

    // 计算下一个单元格
    const nextIndex = cellIndex + 1;
    const nextRow = Math.floor(nextIndex / cols);
    const nextCol = nextIndex % cols;

    // 检查是否完成所有单元格
    if (nextIndex >= rows * cols) {
      this.setData({ 
        isTestCompleted: true,
        cellBackground: newCellBackground
      }, () => {
        console.log('[测试完成] 所有单元格已处理');
      });
      return;
    }

    // 标记下一个单元格为深蓝色
    newCellBackground[nextRow][nextCol] = '#00008B';

    this.setData({
      cellIndex: nextIndex,
      currentRow: nextRow,
      currentCol: nextCol,
      cellBackground: newCellBackground,
      selectedCells: [...this.data.selectedCells, { row: currentRow, col: currentCol }]
    }, () => {
      console.log('[状态更新后] 下一个单元格背景色:', newCellBackground[nextRow][nextCol]);
      console.log('[当前背景数组]', this.data.cellBackground);  // 关键调试：打印最新背景数据
    });
  },

  // 按钮事件（保持原有逻辑）
  handleRelated() { 
    console.log('点击【相关】按钮');
    this.processSelection(); 
  },
  handleUnrelated() { 
    console.log('点击【不相关】按钮');
    this.processSelection(); 
  },
  handleInvalid() { 
    console.log('点击【无效】按钮');
    this.processSelection(); 
  },

  // 滑动处理（新增边界提示）
  touchEnd(e) {
    const { touchStartX, currentTestIndex } = this.data;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;

    if (Math.abs(diffX) > 50) {
      const nextIndex = diffX > 0 
        ? (currentTestIndex - 1 + 3) % 3 
        : (currentTestIndex + 1) % 3;
      
      this.setData({ currentTestIndex: nextIndex }, () => {
        console.log(`[滑动切换] 切换到测试${nextIndex}`);
        this.prepareNextTest(nextIndex);
      });
    }
  },

  // 切换表格背景（新增颜色列表校验）
  changeTableColor() {
    const colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'];
    const currentIndex = colors.indexOf(this.data.tableBackgroundColor);
    if (currentIndex === -1) {
      console.error('[颜色切换失败] 当前颜色不在预设列表中');
      return;
    }
    const nextIndex = (currentIndex + 1) % colors.length;
    this.setData({ tableBackgroundColor: colors[nextIndex] });
  },

  // 生成随机表格（保持原有逻辑）
  generateRandomTableData() {
    this.setData({
      table1Data: Array.from({ length: 5 }, () => 
        Array.from({ length: 5 }, () => Math.floor(Math.random() * 8))
      )
    });
  },

  // 生成随机点（保持原有逻辑）
  getRandomPoints(min, max) {
    const points = new Set();
    while (points.size < 2) {
      points.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(points);
  }
});