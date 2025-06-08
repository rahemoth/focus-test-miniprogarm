Page({
  data: {
   // 当前测试的索引（用于切换不同测试表格）
   currentTestIndex: 0,
    
   // 表1相关数据
   table1TotalRows: 20,          // 表1的总行数
   table1TotalCols: 5,           // 表1的总列数
   table1VisibleRows: 5,         // 表1可见区域的行数
   
   table1Data: [],               // 存储表1的实际数据（二维数组）
   table1Points: [],             // 存储表1的阳性符号（当前轮次需要关注的符号）
   table1CellBackground: [],     // 存储表1单元格的背景颜色（跟踪选中状态）
   
   table1VisibleStartRow: 0,     // 表1可见区域的起始行号
   table1CellIndex: 0,           // 当前选中单元格的索引（线性索引）
   table1CurrentRow: 0,          // 当前选中单元格的行号
   table1CurrentCol: 0,          // 当前选中单元格的列号
   table1IsTestCompleted: false, // 表1测试是否完成的标志
   
   // 表2相关数据
   table2TotalRows: 20,          // 表2的总行数
   table2TotalCols: 5,           // 表2的总列数
   table2VisibleRows: 5,         // 表2可见区域的行数
   table2TotalGroups: 4,         // 总分组数（20行5列=100格，每25格一组）
   table2GroupColors: ['#FFE5CC', '#d5ebe1', '#E5FFCC', '#beb1aa'], // 各组的背景颜色
   
   table2Data: [],               // 存储表2的实际数据
   table2GroupPoints: [],        // 存储每组的阳性符号（二维数组，每组2个符号）
   table2Points: [],             // 存储表2当前组的阳性符号
   table2NextPoints: [],         // 下一组的阳性符号（预加载）
   table2CellBackground: [],     // 存储表2单元格的背景颜色
   
   table2VisibleStartRow: 0,     // 表2可见区域的起始行号
   table2CellIndex: 0,           // 当前选中单元格的索引
   table2CurrentRow: 0,          // 当前选中单元格的行号
   table2CurrentCol: 0,          // 当前选中单元格的列号
   table2CurrentGroup: 0,        // 当前处理的分组序号（0-3）
   table2IsTestCompleted: false, // 表2测试是否完成的标志
   
   // 表3相关数据（支持分组和特殊符号）
   table3TotalRows: 20,          // 表3的总行数
   table3TotalCols: 5,           // 表3的总列数
   table3VisibleRows: 5,         // 表3可见区域的行数
   table3TotalGroups: 4,         // 总分组数
   table3GroupColors: ['#FFE5CC', '#d5ebe1', '#E5FFCC', '#beb1aa'], // 各组的背景颜色
   
   table3Data: [],               // 存储表3的实际数据
   table3GroupPoints: [],        // 存储每组的阳性符号
   table3Points: [],             // 当前组的阳性符号
   table3NextPoints: [],         // 下一组的阳性符号
   table3Special: 0,             // 特殊符号（8或9）
   table3CellBackground: [],     // 存储表3单元格的背景颜色
   
   table3VisibleStartRow: 0,     // 表3可见区域的起始行号
   table3CellIndex: 0,           // 当前选中单元格的索引
   table3CurrentRow: 0,          // 当前选中单元格的行号
   table3CurrentCol: 0,          // 当前选中单元格的列号
   table3CurrentGroup: 0,        // 当前处理的分组序号
   table3IsTestCompleted: false,  // 表3测试是否完成的标志


    showPopup: false,
    popupText: '',
    // 预设三段长文本
    rules: {
      A: `第一阶段（表1）是全表仅有两种阳性符号（在表头有显示），按相关按钮为选中阳性符号，其他符号按不相关按钮标记。
      注：每阶段的测试时长为五分钟。`,
      B: `第二阶段（表2）是每十行刷新一组阳性符号，显示在表头，同样是按相关按钮选中阳性符号，按不相关按钮标记其他符号。
      注：每阶段的测试时长为五分钟。`,
      C: `第三阶段（表3）是在第二阶段的基础上增加了一个特殊符号（其显示在表头），在按相关按钮选中阳性符号、不相关按钮标记其他符号的基础上，增加了一个当特殊符号后紧跟的是阳性符号时，需按无效按钮标记的操作。
      注：每阶段的测试时长为五分钟。`
    }
  },



  onLoad() {
    // 初始化所有表格数据和状态
    this.initializeAllTables();
  },

  initializeAllTables() {
    // 生成表1数据
    this.generateTable1Data();
    // 生成表2数据并初始化相关状态
    this.generateTable2Data();
    this.prepareTable2();
    // 生成表3数据并初始化相关状态
    this.prepareTable3();
    this.prepareTable1();
  },

  // 生成表1数据，使用随机数填充表格
  generateTable1Data() {
    const data = Array.from({ length: this.data.table1TotalRows }, () => 
      Array.from({ length: this.data.table1TotalCols }, () => Math.floor(Math.random() * 10))
    );
    this.setData({ table1Data: data });
  },

  // 准备表1，包括生成阳性符号和初始化背景颜色
  prepareTable1() {
    // 生成表格数据
    this.generateTable1Data();
    
    // 生成阳性符号
    const points = this.getRandomPoints(0, 7);
    
    // 初始化背景颜色，将与阳性符号相同的符号直接标为黄色
    const background = Array.from({ length: this.data.table1TotalRows }, (_, row) => 
      Array.from({ length: this.data.table1TotalCols }, (_, col) => {
        const cellValue = this.data.table1Data[row][col];
        // 如果单元格值等于阳性符号，设置为黄色
        if (cellValue === points[0]) {
          return '#FFFF00';
        }
        // 否则初始化为白色
        return '#ffffff';
      })
    );
    
    // 设置初始选中单元格
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

  // 处理表1的单元格选择逻辑
  processTable1Selection() {
    if (this.data.table1IsTestCompleted) return;
    
    const { table1CellIndex, table1CellBackground, table1VisibleStartRow, table1VisibleRows, table1TotalCols, table1TotalRows } = this.data;
    // 当前操作格坐标
    const currentRow = Math.floor(table1CellIndex / table1TotalCols);
    const currentCol = table1CellIndex % table1TotalCols;
    
    // 标记当前格为已选中颜色
    const newBackground = JSON.parse(JSON.stringify(table1CellBackground));
    newBackground[currentRow][currentCol] = '#435869';
    
    // 计算下一个单元格的索引和坐标
    const nextIndex = table1CellIndex + 1;
    const nextRow = Math.floor(nextIndex / table1TotalCols);
    const nextCol = nextIndex % table1TotalCols;
    
    // 如果所有单元格都已处理，标记测试完成
    if (nextIndex >= table1TotalRows * table1TotalCols) {
      this.setData({
        table1IsTestCompleted: true,
        table1CellBackground: newBackground
      });
      return;
    }
    
    // 如果当前行超出可见区域，滚动可见区域
    const visibleEndRow = table1VisibleStartRow + table1VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol == 4) {
      this.setData({ table1VisibleStartRow: table1VisibleStartRow + 1 });
    }
    
    // 设置下一个待选中格颜色
    newBackground[nextRow][nextCol] = '#87CEEB';
    
    this.setData({
      table1CellIndex: nextIndex,
      table1CurrentRow: nextRow,
      table1CurrentCol: nextCol,
      table1CellBackground: newBackground
    });
  },

  // 处理表1的单元格点击事件
  handleTable1CellTap(e) {
    const row = e.currentTarget.dataset.row;
    const col = e.currentTarget.dataset.col;
    this.setData({
      table1CurrentRow: row,
      table1CurrentCol: col
    });
  },

  // 处理表1的相关按钮点击事件
  handleTable1Related() {
    this.processTable1Selection();
  },

  // 处理表1的不相关按钮点击事件
  handleTable1Unrelated() {
    this.processTable1Selection();
  },

  // 处理表1的无效按钮点击事件
  handleTable1Invalid() {
    this.processTable1Selection();
  },


  // 生成表2数据，使用随机数填充表格
  generateTable2Data() {
    const data = Array.from({ length: this.data.table2TotalRows }, () => 
      Array.from({ length: this.data.table2TotalCols }, () => Math.floor(Math.random() * 10))
    );
    this.setData({ table2Data: data });
  },

  // 准备表2，包括生成阳性符号、初始化背景颜色和分组状态
  prepareTable2() {
    // 生成表格数据
    this.generateTable2Data();
    
    // 生成4组，每组2个不重复的阳性符号
    const groupPoints = Array.from({ length: this.data.table2TotalGroups }, () => 
      this.getRandomPoints(0, 7)
    );
    
    // 初始化背景颜色，同时高亮当前组的阳性符号
    const background = this.initializeTable2Background(groupPoints);
    
    this.setData({
      table2GroupPoints: groupPoints,
      table2Points: groupPoints[0],          // 当前组取第一个数组的2个符号
      table2NextPoints: groupPoints[1] || [],  // 下一组取第二个数组的2个符号
      table2CellBackground: background,
      table2CellIndex: 0,
      table2CurrentRow: 0,
      table2CurrentCol: 0,
      table2VisibleStartRow: 0,
      table2IsTestCompleted: false,
      table2CurrentGroup: 0
    });
  },

  // 初始化表2的背景颜色，高亮当前组的阳性符号并设置组颜色
  initializeTable2Background(groupPoints) {
    const { table2TotalRows, table2TotalCols, table2GroupColors } = this.data;
    const background = Array.from({ length: table2TotalRows }, (_, row) => 
      Array.from({ length: table2TotalCols }, (_, col) => {
        const index = row * table2TotalCols + col;
        const groupIndex = Math.floor(index / 25);
        const cellValue = this.data.table2Data[row][col];
        
        // 当前组的阳性符号
        const currentPoints = groupPoints[groupIndex] || [];
        
        // 如果单元格值是当前组的阳性符号，高亮为黄色
        if (currentPoints.includes(cellValue)) {
          return '#FFFF00';
        }
        
        // 否则使用组颜色
        return table2GroupColors[groupIndex % table2GroupColors.length];
      })
    );
    
    // 设置初始选中单元格
    background[0][0] = '#87CEEB';
    return background;
  },

  // 处理表2的单元格选择逻辑
  processTable2Selection() {
    if (this.data.table2IsTestCompleted) return;
    
    const { 
      table2CellIndex, 
      table2CellBackground, 
      table2TotalCols,
      table2TotalRows,
      table2CurrentGroup,
      table2GroupColors,
      table2GroupPoints,
      table2TotalGroups
    } = this.data;

    // 当前操作格坐标
    const currentRow = Math.floor(table2CellIndex / table2TotalCols);
    const currentCol = table2CellIndex % table2TotalCols;
    
    // 标记当前格为已选中颜色
    const newBackground = JSON.parse(JSON.stringify(table2CellBackground));
    newBackground[currentRow][currentCol] = '#435869';

    const nextIndex = table2CellIndex + 1;
    // 检查是否完成25格
    if (nextIndex % 25 === 0 && nextIndex < table2TotalRows * table2TotalCols) {
      const nextGroup = table2CurrentGroup + 1;
      if (nextGroup < table2TotalGroups) {
        // 更新分组状态
        this.setData({ 
          table2CurrentGroup: nextGroup,
          table2Points: table2GroupPoints[nextGroup],  // 切换当前阳性符号
          table2NextPoints: table2GroupPoints[nextGroup + 1] || []  // 预取下一组
        });

        // 更新后续未操作格的背景颜色
        for (let row = 0; row < table2TotalRows; row++) {
          for (let col = 0; col < table2TotalCols; col++) {
            const index = row * table2TotalCols + col;
            const groupIndex = Math.floor(index / 25);
            
            // 只处理当前组及之后的单元格
            if (groupIndex >= nextGroup) {
              const cellValue = this.data.table2Data[row][col];
              const currentPoints = table2GroupPoints[groupIndex] || [];
              
              // 如果是已选中的单元格，保持状态
              if (newBackground[row][col] === '#435869') {
                continue;
              }
              
              // 如果单元格值是当前组的阳性符号，高亮为黄色
              if (currentPoints.includes(cellValue)) {
                newBackground[row][col] = '#FFFF00';
              } else {
                // 否则使用组颜色
                newBackground[row][col] = table2GroupColors[groupIndex % table2GroupColors.length];
              }
            }
          }
        }
      }
    }

    // 处理测试完成逻辑
    if (nextIndex >= table2TotalRows * table2TotalCols) {
      this.setData({
        table2IsTestCompleted: true,
        table2CellBackground: newBackground
      });
      return;
    }

    // 处理可见区域滚动
    const visibleEndRow = this.data.table2VisibleStartRow + this.data.table2VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol === 4) {
      this.setData({ table2VisibleStartRow: this.data.table2VisibleStartRow + 1 });
    }

    // 设置下一个待选中格颜色
    const nextRow = Math.floor(nextIndex / table2TotalCols);
    const nextCol = nextIndex % table2TotalCols;
    newBackground[nextRow][nextCol] = '#87CEEB';

    this.setData({
      table2CellIndex: nextIndex,
      table2CurrentRow: nextRow,
      table2CurrentCol: nextCol,
      table2CellBackground: newBackground
    });
  },

  // 处理表2的单元格点击事件
  handleTable2CellTap(e) { 
    // 原有逻辑
  },

  // 处理表2的相关按钮点击事件
  handleTable2Related() { 
    this.processTable2Selection(); 
  },

  // 处理表2的不相关按钮点击事件
  handleTable2Unrelated() { 
    this.processTable2Selection(); 
  },

  // 处理表2的无效按钮点击事件
  handleTable2Invalid() { 
    this.processTable2Selection(); 
  },

  // 表3
  prepareTable3() {
    // 生成每组的阳性符号
    const groupPoints = Array.from({ length: this.data.table3TotalGroups }, () => 
      this.getRandomPoints(0, 7)
    );
    
    // 生成特殊符号
    const special = Math.floor(Math.random() * 2) + 8;
    
    // 生成表格数据
    const getRandomValue = () => {
      const baseNumbers = [0, 1, 2, 3, 4, 5, 6, 7];
      const probability = 0.1; // 10%概率生成特殊符号
      
      if (Math.random() < probability) {
        return special; // 特殊符号
      } else {
        const randomIndex = Math.floor(Math.random() * baseNumbers.length);
        return baseNumbers[randomIndex];
      }
    };
    
    const data = Array.from({ length: this.data.table3TotalRows }, () => 
      Array.from({ length: this.data.table3TotalCols }, getRandomValue)
    );
    
    // 初始化背景颜色，同时标注阳性符号和特殊符号
    const background = this.initializeTable3Background(groupPoints, special, data);
    
    // 设置初始状态
    this.setData({
      table3GroupPoints: groupPoints,
      table3Points: groupPoints[0],          // 当前组阳性符号
      table3NextPoints: groupPoints[1] || [], // 下一组阳性符号
      table3Special: special,                // 特殊符号
      table3Data: data,
      table3CellBackground: background,
      table3CellIndex: 0,
      table3CurrentRow: 0,
      table3CurrentCol: 0,
      table3VisibleStartRow: 0,
      table3IsTestCompleted: false,
      table3CurrentGroup: 0
    });
  },

  // 初始化表3的背景颜色，标注阳性符号和特殊符号并设置组颜色
  initializeTable3Background(groupPoints, special, data) {
    const { table3TotalRows, table3TotalCols, table3GroupColors } = this.data;
    const background = Array.from({ length: table3TotalRows }, (_, row) => 
      Array.from({ length: table3TotalCols }, (_, col) => {
        const index = row * table3TotalCols + col;
        const groupIndex = Math.floor(index / 25);
        const cellValue = data[row][col];
        
        // 当前组的阳性符号
        const currentPoints = groupPoints[groupIndex] || [];
        
        // 标注阳性符号为黄色
        if (currentPoints.includes(cellValue)) {
          return '#FFFF00'; // 黄色表示阳性符号
        }
        
        // 标注特殊符号为紫色
        if (cellValue === special) {
          return '#ffa801'; 
        }
        
        // 否则使用组颜色
        return table3GroupColors[groupIndex % table3GroupColors.length];
      })
    );
    
    // 设置初始选中单元格
    background[0][0] = '#87CEEB';
    return background;
  },

  // 处理表格选择逻辑
  processTable3Selection() {
    if (this.data.table3IsTestCompleted) return;
    
    const { 
      table3CellIndex, 
      table3CellBackground, 
      table3TotalCols,
      table3TotalRows,
      table3CurrentGroup,
      table3GroupColors,
      table3GroupPoints,
      table3TotalGroups,
      table3Special,
      table3Points,
      table3Data
    } = this.data;

    // 当前操作格坐标
    const currentRow = Math.floor(table3CellIndex / table3TotalCols);
    const currentCol = table3CellIndex % table3TotalCols;
    
    // 标记当前格为已选中颜色
    const newBackground = JSON.parse(JSON.stringify(table3CellBackground));
    newBackground[currentRow][currentCol] = '#435869';

    const nextIndex = table3CellIndex + 1;
    
    // 检查是否完成25格
    if (nextIndex % 25 === 0 && nextIndex < table3TotalRows * table3TotalCols) {
      const nextGroup = table3CurrentGroup + 1;
      if (nextGroup < table3TotalGroups) {
        // 更新分组状态
        this.setData({ 
          table3CurrentGroup: nextGroup,
          table3Points: table3GroupPoints[nextGroup],  // 切换当前阳性符号
          table3NextPoints: table3GroupPoints[nextGroup + 1] || []  // 预取下一组
        });

        // 更新后续未操作格的背景颜色，重新标注阳性符号和特殊符号
        for (let row = 0; row < table3TotalRows; row++) {
          for (let col = 0; col < table3TotalCols; col++) {
            const index = row * table3TotalCols + col;
            const groupIndex = Math.floor(index / 25);
            
            // 只处理当前组及之后的单元格
            if (groupIndex >= nextGroup) {
              const cellValue = table3Data[row][col];
              const currentPoints = table3GroupPoints[groupIndex] || [];
              
              // 如果是已选中的单元格，保持状态
              if (newBackground[row][col] === '#435869') {
                continue;
              }
              
              // 标注阳性符号为黄色
              if (currentPoints.includes(cellValue)) {
                newBackground[row][col] = '#FFFF00';
              } 
              
              else if (cellValue === table3Special) {
                newBackground[row][col] = '#ffa801';
              } 
              // 否则使用组颜色
              else {
                newBackground[row][col] = table3GroupColors[groupIndex % table3GroupColors.length];
              }
            }
          }
        }
      }
    }

    // 处理测试完成逻辑
    if (nextIndex >= table3TotalRows * table3TotalCols) {
      this.setData({
        table3IsTestCompleted: true,
        table3CellBackground: newBackground
      });
      return;
    }

    // 处理可见区域滚动
    const visibleEndRow = this.data.table3VisibleStartRow + this.data.table3VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol === 4) {
      this.setData({ table3VisibleStartRow: this.data.table3VisibleStartRow + 1 });
    }

    // 设置下一个待选中格颜色
    const nextRow = Math.floor(nextIndex / table3TotalCols);
    const nextCol = nextIndex % table3TotalCols;
    newBackground[nextRow][nextCol] = '#87CEEB';

    // 检查特殊符号逻辑
    const currentValue = table3Data[currentRow][currentCol];
    const nextValue = table3Data[nextRow][nextCol];
    
    if (currentValue === table3Special && table3Points.includes(nextValue)) {
      console.log('.');
     
    }

    this.setData({
      table3CellIndex: nextIndex,
      table3CurrentRow: nextRow,
      table3CurrentCol: nextCol,
      table3CellBackground: newBackground
    });
  },

  // 处理单元格点击
  handleTable3CellTap(e) {
    const row = e.currentTarget.dataset.row;
    const col = e.currentTarget.dataset.col;
    this.setData({
      table3CurrentRow: row,
      table3CurrentCol: col
    });
  },

  // 处理按钮点击
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

  StartFormalTest(){
    wx.switchTab({ url: '/pages/home/home' });
  },

  getRandomPoints(min, max) {
    const points = new Set();
    while (points.size < 2) {
      points.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(points);
  },

  showPopupA() {
    this.setData({
      popupShow: true,
      popupType: 'typeA'
    });
    console.log('111')
    console.log('数据更新后:', this.data.popupShow);
  },

  showPopupB() {
    this.setData({
      popupShow: true,
      popupType: 'typeB'
    });
  },

  showPopupC() {
    this.setData({
      popupShow: true,
      popupType: 'typeB'
    });
    console.log('数据更新后:', this.data.popupShow);
  },

  showPopup(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      showPopup: true,
      popupText: this.data.rules[type]
    });
  },

  // 隐藏弹窗
  hidePopup() {
    this.setData({
      showPopup: false,
      popupText: ''
    });
  }


});