Page({
  data: {
   // 当前测试的索引（用于切换不同测试表格）
   isWholeProcess: true,
   sequenceData: null,
   isSwiperDisabled : true,
    
   // 表1相关数据
   table1TotalRows: 40,          // 表1的总行数
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
   table2TotalRows: 40,          // 表2的总行数
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
   table3TotalRows: 40,          // 表3的总行数
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



   testtime1: 300, // 表1的测试时间
   testtime2: 300, // 表2的测试时间
   testtime3: 300, // 表3的测试时间
   remainingTime: 0, // 从0开始正向计时
   startTime: null,
   lastPressTime: null,
   reactionTimes: [[], [], []],
   responses: ['', '', ''],
   recordIds: [null, null, null],
   tableranks: 0,

   currentTestIndex: null,
   restTimeText: '',
  },

  onLoad() {
    // 初始化 loading 状态
    this.setData({
      loading: true
    });
    
    // 获取缓存数据
    const isWholeProcess = wx.getStorageSync('iswholeprocess');
    const tableranks = wx.getStorageSync('selectedRank');
    
    console.log('isWholeProcess:', isWholeProcess, 'tableranks:', tableranks);
    
    let currentTestIndex;
    if (!isWholeProcess) {
      currentTestIndex = wx.getStorageSync('selectedMode');
      console.log('currentTestIndex:', currentTestIndex);
    } else {
      // 如果是全流程模式，设置默认值或从其他来源获取
      currentTestIndex = 0; 
    }
    
    // 使用 setData 更新视图数据
    this.setData({
      isWholeProcess,
      tableranks,
      currentTestIndex,
      loading: false // 数据加载完成
    });

      // 初始化所有表格数据和状态
      this.initializeAllTables();
      this.startTimer();
  },
    

  



  initializeAllTables() {
    switch (this.data.currentTestIndex) {
      case 0:
        this.prepareTable1();
        break

      case 1:
        this.prepareTable2();
        break;

      case 2:
        this.prepareTable3();
        break;

      case 3:
        this.prepareTable1();
        this.prepareTable2();
        this.prepareTable3();
        break;      

    }

    this.data.startTime = Date.now(); // 初始化 startTime 为当前时间
    this.data.lastPressTime = this.data.startTime; // 重置 lastPressTime
    console.log('现在的时间',this.data.lastPressTime)
  },


  startTimer() {
    //清除现有的计时器（防止重复启动）
     clearInterval(this.timer);

     // 重置剩余时间为0
     this.data.remainingTime = 0;

     //根据当前测试表选择对应的测试时间
     console.log('currentTestIndex:', this.data.currentTestIndex);
     let currentTestTime;
     
     switch(this.data.currentTestIndex) {
       case 0:  // 表1
         currentTestTime = this.data.testtime1;
         break;
       case 1:  // 表2
         currentTestTime = this.data.testtime2;
         break;
       case 2:  // 表3
         currentTestTime = this.data.testtime3;
         break;
       default:
         currentTestTime = 30; // 默认值
     }
     console.log('currentTestTime:', currentTestTime);

     //
     this.timer = setInterval(() => {
       // 增加剩余时间
      this.data.remainingTime++;
      const restCountdown = currentTestTime - this.data.remainingTime;
      const minutes = Math.floor(restCountdown / 60);
      const seconds = restCountdown % 60;
      console.log(minutes,seconds);
      const text = `测试将在 ${minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`}后结束`;
      this.setData({
        restTimeText: text
      });

       // 检查是否达到或超过预设时间
       if (this.data.remainingTime >= currentTestTime) {
         // 清除计时器
         clearInterval(this.timer);
         //处理测试完成逻辑
         if(IsTestCompleted == false){
          this.handleTestCompletion();
         }
         
       }
     }, 1000);  // 每1秒执行一次
   },

   handleTestCompletion(){
    if(this.data.isWholeProcess)
    {
    switch(this.data.currentTestIndex) {
      case 0:  // 表1
        this.setData({ currentTestIndex: 1 });
        this.startTimer();
        break;
      case 1:  // 表2
        this.setData({ currentTestIndex: 2 });
        this.startTimer();
        break;
      case 2:  // 表3
        this.submitData();
        break;
        
    }
  }
  else{
    this.submitData();
  }

   },



   btnprocess(index,IsTestCompleted){
     try{
          const now = Date.now();

          const reactionTime = this.data.lastPressTime
              ? (now - this.data.lastPressTime) / 1000
              : 0;
          this.data.lastPressTime = now;
          
        if(IsTestCompleted == false){
          if (!Array.isArray(this.data.reactionTimes[this.data.currentTestIndex])) {
            this.data.reactionTimes[this.data.currentTestIndex] = [];
          }
          this.data.reactionTimes[this.data.currentTestIndex].push(reactionTime);
        }
          console.log(this.data.reactionTimes);  


        if (IsTestCompleted == false) {
          console.log(IsTestCompleted);
          switch (index) {
            case 1:
                this.data.responses[this.data.currentTestIndex] = (this.data.responses[this.data.currentTestIndex] || '') + "1";
              break;
            case 2:
                this.data.responses[this.data.currentTestIndex] = (this.data.responses[this.data.currentTestIndex] || '') + "2";
              break;
            case 0:
                this.data.responses[this.data.currentTestIndex] = (this.data.responses[this.data.currentTestIndex] || '') + "0";
              break;
          }
          console.log(this.data.responses);
        }
     }

     catch (error) {
       console.error('Error in processKey:', error);
       return null;
     }
   },

   async submitData() {
    try {
      const userid = wx.getStorageSync('userInfo');
      const testResult = {
        userId: userid.id,
        responses: this.data.responses,
        reactionTimes: this.data.reactionTimes,
        recordIds: this.data.recordIds,
        gender: userid.gender,
        ranks: this.data.tableranks
      };
      const tableIndex = this.data.currentTestIndex
      if(!this.data.isWholeProcess)
      {
        for (let i = 0; i < 3; i++) {
          testResult.recordIds[i] = this.data.recordIds[this.data.currentTestIndex]
          console.log('Result',this.testResult);
        }
      }  
      console.log('Result',testResult);

     // 获取本地存储的token
      const token = wx.getStorageSync('token');
      console.log('获取的Token:', token); 

      // 构建请求参数
      const requestParams = {
        url:  `http://localhost:8084/api/submit/processSingle?tableIndex=${tableIndex+1}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: testResult, // 自动JSON序列化，无需手动stringify
        success: (res) => {
          // 检查HTTP状态码（微信小程序中状态码在res.statusCode）
          if (res.statusCode < 200 || res.statusCode >= 300) {
            console.error('请求失败，状态码：', res.statusCode);
            wx.showToast({
              title: '提交失败：测试数据过少或为空',
              icon: 'none'
            });
            console.log('发送的 tableIndex:', tableIndex); // 检查是否为数字
            return;
          }
          
          // 存储结果到本地
          wx.setStorageSync('result', res.data);
          console.log(wx.getStorageSync('result'));
          
          // 跳转到结果页面
          // wx.navigateTo({
          //   url: '/pages/result/result'
          // });
        },
        fail: (err) => {
          console.error('请求失败', err);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      };
      const requestParamswholeprocess = {
        url:  `http://localhost:8084/api/submit/process`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: testResult, 
        success: (res) => {
          // 检查HTTP状态码（微信小程序中状态码在res.statusCode）
          if (res.statusCode < 200 || res.statusCode >= 300) {
            console.error('请求失败，状态码：', res.statusCode);
            wx.showToast({
              title: '提交失败：测试数据过少或为空',
              icon: 'none'
            });
            console.log('发送的 tableIndex:', tableIndex); // 检查是否为数字
            return;
          }
          
          // 存储结果到本地
          wx.setStorageSync('result', res.data);
          console.log(wx.getStorageSync('result'));
          
          // 跳转到结果页面
          // wx.navigateTo({
          //   url: '/pages/result/result'
          // });
        },
        fail: (err) => {
          console.error('请求失败', err);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      };
      if(this.data.isWholeProcess)
        {
          wx.request(requestParamswholeprocess);
        }
      else{
        wx.request(requestParams);
      }

      wx.navigateTo({
        url: '/pages/result/result',
      })
      

    } catch (error) {
      console.error('提交数据出错:', error);
    } 
  },



  // 准备表1////////////////////////////////////////
  async prepareTable1() {
    try {
      // 等待异步数据返回
      const markovSequenceData = await this.getMarkovSequence(0);
      const sequence = markovSequenceData.sequence; 
      
      const { table1TotalRows: rows, table1TotalCols: cols } = this.data; 

      const ids = markovSequenceData.id;
      this.data.recordIds[0] = ids
      console.log('id',this.data.recordIds);


      //将一维sequence按行列拆分为二维数组
      const table1Data = Array.from({ length: rows }, (_, row) => 
        sequence.slice(row * cols, (row + 1) * cols)
      );
      this.setData({ table1Data: table1Data });

      
      // 提取阳性符号（接口返回的selectedPoint1和selectedPoint2是数组，取第一个元素）
      const point1 = markovSequenceData.selectedPoint1; 
      const point2 = markovSequenceData.selectedPoint2;

      const points = [point1, point2]; // 实际符号值
      console.log('表1阳性符号值', points);
      console.log('表1符号数组', table1Data);
      
      

      // 初始化背景颜色
      const background = Array.from({ length: this.data.table1TotalRows }, () => 
        Array.from({ length: this.data.table1TotalCols }, () => '#FFFFFF')
      );

      // 设置初始选中单元格（左上角第一个单元格）
      background[0][0] = '#87CEEB';

      this.setData({
        table1Points: points,
        table1CellBackground: background
      });

    } catch (error) {
      console.error('数据准备失败', error);
    
    }
  },

  // 处理表1的单元格选择逻辑
  processTable1Selection() {
    if (this.data.table1IsTestCompleted) return;
    
    const { table1CellIndex, table1CellBackground, table1VisibleStartRow, table1VisibleRows, table1TotalCols, table1TotalRows ,table1Data } = this.data;
    // 当前格坐标
    const currentRow = Math.floor(table1CellIndex / table1TotalCols);
    const currentCol = table1CellIndex % table1TotalCols;
    console.log("位置",currentRow,currentCol,"索引",table1CellIndex);
    console.log("当前符号",table1Data[currentRow][currentCol]);
    //////////////////////////////////////////////////////////////////////////
    if (table1CellIndex + 1 == table1TotalCols *  table1TotalRows) {
      if(this.data.isWholeProcess == false){
          this.submitData();
      }
      else{
        this.setData({ currentTestIndex: 1 });
        return;
      }

    }


    
    //标记当前格为已选中颜色
    const newBackground = JSON.parse(JSON.stringify(table1CellBackground));
    newBackground[currentRow][currentCol] = '#435869';
    
    
    //计算下一个单元格的索引和坐标
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



  // 处理表1的相关按钮点击事件
  handleTable1Related() {
    this.processTable1Selection();
    this.btnprocess(1,this.data.table1IsTestCompleted);
  },

  // 处理表1的不相关按钮点击事件
  handleTable1Unrelated() {
    this.processTable1Selection();
    this.btnprocess(0,this.data.table1IsTestCompleted);
  },

  // 处理表1的无效按钮点击事件
  handleTable1Invalid() {
    // this.processTable1Selection();
    // this.btnprocess(2,this.data.table1IsTestCompleted);
  },


  // 表2/////////////////////////////////////////////////////////////////////
  async prepareTable2() {
    try {
      // 获取表2接口数据
      const markovSequenceData = await this.getMarkovSequence(1); 
      const { table2TotalRows: rows, table2TotalCols: cols } = this.data;

      // 解构字段
      const { selectedPoint1, selectedPoint2 } = markovSequenceData;
      const ids = markovSequenceData.id;
      this.data.recordIds[1] = ids
      console.log('id',this.data.recordIds);
  
      //生成表2数据
      const table2Data = Array.from({ length: rows }, (_, row) => 
        markovSequenceData.sequence.slice(row * cols, (row + 1) * cols)
      );
  
      //提取组阳性符号
      const groupPoints = selectedPoint1.map((point1, index) => [
        point1, 
        selectedPoint2[index]
      ]);
      console.log('表2阳性符号值', groupPoints);
      console.log('表2符号数组',table2Data);
  
      //初始化背景颜色
      const { table2TotalRows, table2TotalCols, table2GroupColors } = this.data;
      const table2CellBackground = Array.from({ length: table2TotalRows }, (_, row) => 
        Array.from({ length: table2TotalCols }, (_, col) => {
          const index = row * table2TotalCols + col;
          const groupIndex = Math.floor(index / 50); 
          return table2GroupColors[groupIndex % table2GroupColors.length];
        })
      );
      table2CellBackground[0][0] = '#87CEEB';
  
      //设置表2数据
      this.setData({
        table2Data,
        table2GroupPoints: groupPoints,
        table2Points: groupPoints[0],          
        table2NextPoints: groupPoints[1] || [],  
        table2CellBackground,
        table2CellIndex: 0,
        table2CurrentRow: 0,
        table2CurrentCol: 0,
        table2VisibleStartRow: 0,
        table2IsTestCompleted: false,
        table2CurrentGroup: 0
      });
  
    } catch (error) {
      console.error('表2准备失败', error);
      wx.showToast({ title: '表2加载失败', icon: 'none' });
    }
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
      table2TotalGroups,
      table2Data
    } = this.data;
  
    //当前操作格坐标
    const currentRow = Math.floor(table2CellIndex / table2TotalCols);
    const currentCol = table2CellIndex % table2TotalCols;
    console.log("位置",currentRow,currentCol,"索引",table2CellIndex);
    console.log("当前符号",table2Data[currentRow][currentCol]);
////////////////////////////////////////////////////////////////////////////////
    if (table2CellIndex + 1 == table2TotalCols *  table2TotalRows) {
      if(this.data.isWholeProcess == false){
        this.submitData();
      }
      else{
      this.setData({ currentTestIndex: 2 });
      return;
      }
    }
    
    //标记当前格为已选中颜色
    const newBackground = JSON.parse(JSON.stringify(table2CellBackground));
    newBackground[currentRow][currentCol] = '#435869';
    const nextIndex = table2CellIndex + 1;

    //检查是否完成50格
    if (nextIndex % 50 === 0 && nextIndex < table2TotalRows * table2TotalCols) {
      const nextGroup = table2CurrentGroup + 1;
      if (nextGroup < table2TotalGroups) {
        // 更新分组状态
        this.setData({ 
          table2CurrentGroup: nextGroup,
          table2Points: table2GroupPoints[nextGroup],  // 切换当前阳性符号
          table2NextPoints: table2GroupPoints[nextGroup + 1] || []  // 预取下一组
        });
  
        // 更新未操作格的背景颜色
        for (let row = 0; row < table2TotalRows; row++) {
          for (let col = 0; col < table2TotalCols; col++) {
            const index = row * table2TotalCols + col;
            const groupIndex = Math.floor(index / 50);
            
            // 只处理当前组及之后的单元格
            if (groupIndex >= nextGroup) {
              // 如果是已选中的单元格，保持状态
              if (newBackground[row][col] === '#435869') {
                continue;
              }
              
              // 直接使用组颜色
              newBackground[row][col] = table2GroupColors[groupIndex % table2GroupColors.length];
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
  
    //处理可见区域滚动
    const visibleEndRow = this.data.table2VisibleStartRow + this.data.table2VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol === 4) {
      this.setData({ table2VisibleStartRow: this.data.table2VisibleStartRow + 1 });
    }
  
    //设置下一个格颜色
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


  // 处理表2的相关按钮点击事件
  handleTable2Related() { 
    this.processTable2Selection(); 
    this.btnprocess(1,this.data.table2IsTestCompleted);
  },

  // 处理表2的不相关按钮点击事件
  handleTable2Unrelated() { 
    this.processTable2Selection(); 
    this.btnprocess(0,this.data.table2IsTestCompleted);
  },

  // 处理表2的无效按钮点击事件
  handleTable2Invalid() { 
    // this.processTable2Selection(); 
  },

    // 表3
    /* 半夜一个人写代码，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞，好孤独好寂寞 */
  async prepareTable3() {
    try {
      //获取表3接口数据
      const markovSequenceData = await this.getMarkovSequence(2); 
      const { table3TotalRows: rows, table3TotalCols: cols } = this.data;

      // 解构
      const { selectedPoint1, selectedPoint2, selectedSpecial } = markovSequenceData;

      const ids = markovSequenceData.id;
      this.data.recordIds[2] = ids
      console.log('id',this.data.recordIds);
      
      
      // 提取组阳性符号
      const groupPoints = selectedPoint1.map((point1, index) => [
        point1, 
        selectedPoint2[index]
      ]);
      

      //生成表3数据
      const table3Data = Array.from({ length: rows }, (_, row) => 
        markovSequenceData.sequence.slice(row * cols, (row + 1) * cols)
      );
      console.log('表3阳性符号值', groupPoints);
      console.log('表3符号数组',table3Data);
  
      //初始化背景颜色
      const { table3TotalRows, table3TotalCols, table3GroupColors } = this.data;
      const table3CellBackground = Array.from({ length: table3TotalRows }, (_, row) => 
        Array.from({ length: table3TotalCols }, (_, col) => {
          const index = row * table3TotalCols + col;
          const groupIndex = Math.floor(index / 50); 
          return table3GroupColors[groupIndex % table3GroupColors.length];
        })
      );
      table3CellBackground[0][0] = '#87CEEB'; 
  
      //设置表3数据
      this.setData({
        table3Data,
        table3GroupPoints: groupPoints,  
        table3Points: groupPoints[0],          
        table3NextPoints: groupPoints[1] || [],  // 下一组阳性符号
        table3Special: selectedSpecial,  // 特殊符号
        table3CellBackground,
        table3CellIndex: 0,
        table3CurrentRow: 0,
        table3CurrentCol: 0,
        table3VisibleStartRow: 0,
        table3IsTestCompleted: false,
        table3CurrentGroup: 0
      });
  
    } catch (error) {
      console.error('表3准备失败', error);
      wx.showToast({ title: '表3加载失败', icon: 'none' });
    }
  },

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
      table3Special,  // 特殊符号值
      table3Points,   // 当前组阳性符号数组
      table3Data      
    } = this.data;
  
    // 当前操作格坐标及值
    const currentRow = Math.floor(table3CellIndex / table3TotalCols);
    const currentCol = table3CellIndex % table3TotalCols;
    const currentValue = table3Data[currentRow][currentCol];  // 当前单元格值
    console.log("位置",currentRow,currentCol,"索引",table3CellIndex);
    console.log("当前符号",table3Data[currentRow][currentCol]);
    
    
    // 标记当前格为已选中颜色
    const newBackground = JSON.parse(JSON.stringify(table3CellBackground));
    newBackground[currentRow][currentCol] = '#435869';

    const nextIndex = table3CellIndex + 1;
    
    // 检查是否完成50格
    if (nextIndex % 50 === 0 && nextIndex < table3TotalRows * table3TotalCols) {
      const nextGroup = table3CurrentGroup + 1;
      if (nextGroup < table3TotalGroups) {
        // 更新分组状态
        this.setData({ 
          table3CurrentGroup: nextGroup,
          table3Points: table3GroupPoints[nextGroup],  // 切换为下一组阳性符号数组
          table3NextPoints: table3GroupPoints[nextGroup + 1] || []
        });

        // 更新后续未操作格的背景颜色
        for (let row = 0; row < table3TotalRows; row++) {
          for (let col = 0; col < table3TotalCols; col++) {
            const index = row * table3TotalCols + col;
            const groupIndex = Math.floor(index / 50);
            
            if (groupIndex >= nextGroup && newBackground[row][col] !== '#435869') {
              newBackground[row][col] = table3GroupColors[groupIndex % table3GroupColors.length];
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
      this.submitData();
      return;
    }

    // 处理可见区域滚动
    const visibleEndRow = this.data.table3VisibleStartRow + this.data.table3VisibleRows - 1;
    if (currentRow > visibleEndRow - 3 && currentCol === 4) {
      this.setData({ table3VisibleStartRow: this.data.table3VisibleStartRow + 1 });
    }

    // 计算下一个待选中格的坐标及值
    const nextRow = Math.floor(nextIndex / table3TotalCols);
    const nextCol = nextIndex % table3TotalCols;
    const nextValue = table3Data[nextRow][nextCol];  // 下一个单元格值
    
    // 设置下一个待选中格颜色(蓝的)
    newBackground[nextRow][nextCol] = '#87CEEB';

    // 检查 nextValue 是否在当前组阳性符号数组中
    if (currentValue === table3Special && table3Points.includes(nextValue)) {
      console.log('检测到特殊符号后紧跟阳性符号');
    }
//////////////////////////////////////
    

    // 更新状态
    this.setData({
      table3CellIndex: nextIndex,
      table3CurrentRow: nextRow,
      table3CurrentCol: nextCol,
      table3CellBackground: newBackground
    });
  },

  // 处理按钮点击
  handleTable3Related() {
    this.processTable3Selection();
    this.btnprocess(1,this.data.table3IsTestCompleted);
    console.log(this.data.table3IsTestCompleted)
  },

  handleTable3Unrelated() {
    this.processTable3Selection();
    this.btnprocess(0,this.data.table3IsTestCompleted);
    console.log(this.data.table3IsTestCompleted)
  },

  handleTable3Invalid() {
    this.processTable3Selection();
    this.btnprocess(2,this.data.table3IsTestCompleted);
    console.log(this.data.table3IsTestCompleted)
  },

  // 公共方法
  swiperChange(e) {
    
  },

  touchStart(e) {
    
  },

  touchEnd(e) {
    
    
  },


  changeTableColor() {
    const colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'];
    const currentIndex = colors.indexOf(this.data.tableBackgroundColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    this.setData({ tableBackgroundColor: colors[nextIndex] });
  },

  getMarkovSequence(index) {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:8084/api/generate';
      const token = wx.getStorageSync('token');
  
      if (!token) {
        console.log('未检测到 Token');
        reject('未登录'); // 传递错误信息
        return;
      }
  
      wx.request({
        url: url,
        method: 'GET',
        data: { length: 200, type: index, ranks: this.data.tableranks },
        header: { 'Authorization': `Bearer ${token}` },
        success: (res) => {
          if (res.data.code === 401) {
            console.log('401 错误：认证失败', res.data);
            reject(res.data); // 传递错误信息
          } else {
            console.log('表',index,'调用成功', res.data);
            resolve(res.data); // 返回接口数据
          }
        },
        fail: (err) => {
          console.log('接口请求失败', err);
          reject(err); // 传递错误信息
        }
      });
    });
  },

 
 

  getRandomPoints(min, max) {
    const points = new Set();
    while (points.size < 2) {
      points.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(points);
  }
});