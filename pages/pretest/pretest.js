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
    table1Data: [],       // 5x5表格数据（数值0-7）
    totalRows: 20,
    totalcols: 5,       // 总行数（10行）
    visibleRows: 5,       // 可见行数（5行）
    cellBackground: [],    // 10行5列的背景色数组
    visibleEndRow: 4,
    visibleStartRow: 0
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
      cellBackground: [],  // 强制清空旧背景数据
      visibleStartRow: 0 
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
    const { totalRows, visibleRows , totalcols } = this.data;

    
    // 初始化10行5列的背景数组
    const background = Array.from({ length: totalRows }, () => 
      Array.from({ length: totalcols }, () => '#ffffff')  // 每行5个元素
    );
    background[0][0] = '#87CEEB';  // 初始选中第一个单元格（0行0列）

    this.setData({ 
      cellBackground: background,
      currentRow: 0,
      currentCol: 0,
      visibleStartRow: 0  // 初始可见起始行为0
    }, () => {
      console.log('[背景初始化] 首单元格背景色:', this.data.cellBackground[0][0]);
    });
  },

  // 处理选择逻辑（新增索引校验和状态打印）
  processSelection() {
    const { 
      isTestCompleted, 
      cellIndex, 
      cellBackground, 
      visibleStartRow, 
      visibleRows,
      totalcols,
      totalRows  // 从data中解构totalRows（10行）
    } = this.data; 
  
    if (isTestCompleted) return;
  
    const currentRow = Math.floor(cellIndex / totalcols);
    const currentCol = cellIndex % totalcols;
    console.log(`[当前处理] 索引${cellIndex} -> 行${currentRow}, 列${currentCol}`);
  
    // 深拷贝初始化newCellBackground
    const newCellBackground = JSON.parse(JSON.stringify(cellBackground));
  
    // 计算可见区域最后一行索引
    const visibleEndRow = visibleStartRow + visibleRows - 1;
  
    // 触发滚动条件
    if (currentRow > visibleEndRow-3 && currentCol == 4) {
      this.setData({ 
        visibleStartRow: visibleStartRow + 1 
      }, () => {
        console.log(`可见区域更新为行${visibleStartRow + 1}到行${visibleStartRow + visibleRows}`);
      });
    }
  
    // 标记当前单元格为浅蓝
    newCellBackground[currentRow][currentCol] = '#435869';  // 此处不再报错
  
    const nextIndex = cellIndex + 1;
    const nextRow = Math.floor(nextIndex / totalcols);
    const nextCol = nextIndex % totalcols;
  
    // 检查是否完成所有单元格（10行×5列=50个单元格）
    if (nextIndex >= totalRows * totalcols) {
      this.setData({ 
        isTestCompleted: true,
        cellBackground: newCellBackground  // 保存修改后的背景数组
      });
      return;
    }
  
    // 检查下一行是否存在
    if (!newCellBackground[nextRow]) {
      console.error('[背景错误] 下一行不存在', nextRow);
      return;
    }
  
    // 标记下一个单元格为深蓝色
    newCellBackground[nextRow][nextCol] = '#87CEEB';
  
    // 更新数据（包括cellBackground和可见区域）
    this.setData({
      cellIndex: nextIndex,
      currentRow: nextRow,
      currentCol: nextCol,
      cellBackground: newCellBackground,  // 关键：将修改后的背景数组保存回data
      visibleEndRow: visibleStartRow + visibleRows - 1
    });
  },

  generateRandomTableData() {
    const{
      totalcols,
      totalRows
    }=this.data;
    const newData = Array.from({ length: totalRows }, () => 
      Array.from({ length: totalcols }, () => {
        const num = Math.floor(Math.random() * 8);  // 0-7的随机数
        return num;
      })
    );
    this.setData({ table1Data: newData }, () => {
      console.log('[表格数据验证] 总行数:', this.data.table1Data.length);  // 输出10
      console.log('[表格数据验证] 首行数值:', this.data.table1Data[0]);  // 输出5个0-7的数值
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



  // 生成随机点（保持原有逻辑）
  getRandomPoints(min, max) {
    const points = new Set();
    while (points.size < 2) {
      points.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(points);
  }
});