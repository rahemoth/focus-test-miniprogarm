Page({
  data: {  
    

    userInfo: {
      id: null,
      username: '',
      role: ''
    },

    submitData: {
      // 基础信息
      id: null,
      userId: null,
      submit_time: null,

      // 统计字段
      a1: 0, a2: 0, a3: 0,
      d1: 0, d2: 0, d3: 0,
      o1: 0, o2: 0, o3: 0,
      x1: 0, x2: 0, x3: 0,
      e: 0,

      // K 指标
      k1: 0.0, k2: 0.0, k3: 0.0, k: 0.0,
      // G 指标
      g1: 0.0, g2: 0.0, g3: 0.0, g: 0.0,
      // H 指标
      h1: 0.0, h2: 0.0, h3: 0.0, h: 0.0,

      //单表指标字段
      K1: 0.0, K2: 0.0, K3: 0.0, K: 0.0,
      // G 指标
      G1: 0.0, G2: 0.0, G3: 0.0, G: 0.0,
      // H 指标
      H1: 0.0, H2: 0.0, H3: 0.0, H: 0.0,

      // 反应时间字符串（初始为空字符串）
      t1: '', t2: '', t3: '',

      // 评分字段
      score_k: null,
      score_g: null,
      score_h: null,

      //单表评分字段
      scoreK: null,
      scoreG: null,
      scoreH: null,
    },
    
    neuralTypeData: {
      "兴奋型": {sections: [{title: "神经特征", content: ["兴奋过程显著强于抑制过程，反应强烈但不持久"]}, {title: "性格细化", content: ["智力超群，思维敏捷，创造力与观察力突出", "自信果断，精力充沛，外向热情，追求卓越", "热情冲动但易急躁，具有爆发力而缺乏持续性"]}, {title: "推荐职业", content: ["适合高刺激、快节奏的职业（如创业者、急救员）","高创造性领域：科学家、发明家、战略顾问", "领导型岗位：企业家、高层管理者、政策制定者"]}]},
      "活泼型": {sections: [{title: "神经特征", content: ["兴奋抑制平衡且转换灵活，适应性强"]}, {title: "性格细化", content: ["聪明机敏，学习能力强，擅长多任务处理", "活泼外向，喜欢新鲜事物，但可能缺乏耐心", "乐观外向善于交际，但可能缺乏专注深度"]}, {title: "推荐职业", content: ["合多变、社交型工作（如公关、培训师）","快速变化领域：广告创意、产品经理、外交官", "需要应变能力的工作：急诊医生、危机公关"]}]},
      "安静型": {sections: [{title: "神经特征", content: ["神经过程强但灵活性低，慢性子但稳定"]}, {title: "性格细化", content: ["思维严谨，逻辑性强，注重细节和条理", "性格沉稳，情绪稳定，偏好规律性工作", "沉稳可靠有耐心，但可能显得保守"]}, {title: "推荐职业", content: ["安静型适合精细、持久性任务（如科研、精算师）", "需要专注力的工作：学术研究、质量控制"]}]},
      "抑制型": {sections: [{title: "神经特征", content: ["神经过程弱，抑制占优势，容易疲劳"]}, {title: "性格细化", content: ["内向稳重，思维深刻，擅长长期记忆", "偏好独立工作，社交需求较低", "敏感谨慎细致，但易焦虑和犹豫不决"]}, {title: "推荐职业", content: ["抑制型适合谨慎、分析型岗位（如质检、风控师）"]}]},
      // "激情活力型": {sections: [{title: "神经特征", content: ["神经系统强度强，均衡性较差，灵活性低。易受刺激兴奋，反应快但易冲动。"]}, {title: "性格细化", content: ["热情洋溢，行动力强，敢于冒险", "情绪波动较大，需加强自我控制", "适合高强度、快节奏环境"]}, {title: "推荐职业", content: ["应急岗位：消防员、急救医生、特警", "表演行业：演员、运动员、主持人"]}]},
      // "活力稳健型": {sections: [{title: "神经特征", content: ["神经系统强度中等，均衡性较差，灵活性一般。兴奋性略高，但弱于兴奋型。"]}, {title: "性格细化", content: ["积极乐观，反应较快，但准确性一般", "需培养冷静分析问题的习惯"]}, {title: "推荐职业", content: ["销售、市场营销、导游", "团队协调类工作：活动策划、客户经理"]}]},
      // "敏捷灵动型": {sections: [{title: "神经特征", content: ["神经系统强度强，均衡性差，抑制过程占优。易受干扰，注意力分散。"]}, {title: "性格细化", content: ["思维跳跃，创意丰富，但持久性不足", "需加强耐心和专注力训练"]}, {title: "推荐职业", content: ["创意行业：作家、设计师、艺术顾问", "自由职业：咨询师、独立开发者"]}]},
      // "细致耐心型": {sections: [{title: "神经特征", content: ["神经系统强度中等，均衡性较差，抑制略占优。工作能力易波动。"]}, {title: "性格细化", content: ["反应较准确，但易受外界影响", "需提升抗干扰能力和心理稳定性"]}, {title: "推荐职业", content: ["技术支持类：IT运维、测试工程师", "服务行业：客服专员、行政助理"]}]},
      // "灵活适应型": {sections: [{title: "神经特征", content: ["神经系统兴奋与抑制过程的强度强，较集中,均衡性较好,灵活性较高。"]}, {title: "性格细化", content: ["具有较强的活动能力,活泼、热情,具有外倾性."]}, {title: "推荐职业", content: ["项目经理、公关专家、人力资源顾问、市场营销经理等需要灵活应对和多任务处理的职业。"]}]},
      // "热情进取型": {sections: [{title: "神经特征", content: ["神经系统兴奋与抑制过程的强度强,不均衡,动力性兴奋过程占优势"]}, {title: "性格细化", content: ["智力高或较高,注意力一般,思维敏捷,反应迅速,有激情但易激动,"]}, {title: "推荐职业", content: ["销售代表、客户服务经理、创业家、活动策划等需要热情和快速反应的职业。"]}]},
      // "谨慎稳健型": {sections: [{title: "神经特征", content: ["神经系统强度中等，均衡性一般，灵活性中等。无明显突出特征。"]}, {title: "性格细化", content: ["适应性较强，但缺乏显著优势领域"]}, {title: "推荐职业", content: ["综合性岗位：人力资源、教育顾问"]}]},
      // "稳定实干型": {sections: [{title: "神经特征", content: ["神经系统兴奋与抑制过程的强度强,不均衡,动力性抑制过程占优势。"]}, {title: "性格细化", content: ["智力高或较高,注意力不易集中,很容易受干扰。"]}, {title: "推荐职业", content: ["财务分析师、数据科学家、质量控制专家、教育顾问等需要稳定性和细致性的职业。"]}]},
      // "谨慎细致型": {sections: [{title: "神经特征", content: ["神经系统兴奋与抑制过程较强而较集中,均衡性较好,灵活性一般。"]}, {title: "性格细化", content: ["智力高或较高,有条理,肯钻研,注意力集中,观察力、记忆力较强,反应较快,接受能力、理解能力较强,"]}, {title: "推荐职业", content: ["法律顾问、审计师、行政管理、医疗护理等需要细致和稳定性的职业。"]}]},
      // "潜力激发型": {sections: [{title: "神经特征", content: ["神经系统较强但不集中,不均衡。神经系统感受性高"]}, {title: "性格细化", content: ["智力高或较高,注意力涣散,接受能力、理解能力较强,学习和掌握知识,技能较快但很不牢固。"]}, {title: "推荐职业", content: ["艺术家、设计师、创意作家、市场营销、公关、创业等需要创新思维和较高天赋的领域。"]}]},
      // "持久耐力型": {sections: [{title: "神经特征", content: ["神经系统强度较弱，均衡性一般，灵活性较低。需具体分析偏向。"]}, {title: "性格细化", content: ["可能偏向谨慎或抑制型特征"]}, {title: "推荐职业", content: ["稳定性工作：文员、档案管理"]}]},
      // "精细专注型": {sections: [{title: "神经特征", content: ["神经系统强度弱，均衡性较差，灵活性低。接近抑制型或模糊型。"]}, {title: "性格细化", content: ["反应较慢，需更多支持和鼓励"]}, {title: "推荐职业", content: ["低压力工作：园艺、手工制作"]}]},
      // "慎重稳健型": {sections: [{title: "神经特征", content: ["神经系统强度较弱，均衡性好，惰性较大。对强刺激耐受性差。"]}, {title: "性格细化", content: ["细致耐心，长时记忆好，学习速度慢但牢固", "内向稳重，情绪稳定持久"]}, {title: "推荐职业", content: ["科研类：实验室研究员、学术编辑", "需要精确性的工作：校对、质检"]}]},
      // "沉稳内敛型": {sections: [{title: "神经特征", content: ["神经系统强度弱，均衡性差，兴奋易扩散。注意力较难集中。"]}, {title: "性格细化", content: ["做事较认真，善于深思熟虑，每一步都稳扎稳打"]}, {title: "推荐职业", content: ["简单重复性工作：数据录入、流水线操作"]}]},
      // "平和稳定型": {sections: [{title: "神经特征", content: ["神经系统强度弱，均衡性差，抑制占优。反应慢但准确性好。"]}, {title: "性格细化", content: ["性格沉静专注，善于深入思考，做事细致可靠"]}, {title: "推荐职业", content: ["需要精确性的慢节奏工作：校对、会计"]}]},
      // "简单专注型": {sections: [{title: "神经特征", content: ["神经系统强度极弱，均衡性差，灵活性差。兴奋与抑制均扩散。"]}, {title: "性格细化", content: ["性格踏实稳重，思考全面，行动细致周全"]}, {title: "推荐职业", content: ["简单辅助性工作：清洁、仓储整理"]}]},
      "未匹配到类型":{sections: [{title: " ", content: [" "]}, {title: "未匹配到类型", content: ["未匹配到类型"]}, {title: " ", content: [" "]}]}
    },
    neuralType : '',
  },

  onLoad() {
    this.loadTestData();
    this.loadUserInfo();
    this.getNeuralType();
  },

  goReport() {
    wx.navigateTo({ url: '/pages/report/report' });
    
  },

  loadTestData() {
    const result = wx.getStorageSync('result');
    if (result && result.data) {
      const testData = result.data;
      // 合并新数据到 submitData（避免覆盖原有数据）
      const newSubmitData = {
        ...this.data.submitData, // 保留原有数据
        // 基础信息
        userId: testData.userId,
        // 统计字段
        a1: testData.a1,
        a2: testData.a2,
        a3: testData.a3,
        d1: testData.d1,
        d2: testData.d2,
        d3: testData.d3,
        o1: testData.o1,
        o2: testData.o2,
        o3: testData.o3,
        x1: testData.x1,
        x2: testData.x2,
        x3: testData.x3,
        e: testData.e,
        ex: testData.ex,
        // K/G/H 指标（兼容大小写，优先使用后端返回的字段）
        k1: testData.k1 ?? testData.K1 ?? 0, // 优先取 k1，若无则取 K1，默认 0
        k2: testData.k2 ?? testData.K2 ?? 0,
        k3: testData.k3 ?? testData.K3 ?? 0,
        k: testData.k ?? testData.K ??  0,
        g1: testData.g1 ?? testData.G1 ?? 0,
        g2: testData.g2 ?? testData.G2 ?? 0,
        g3: testData.g3 ?? testData.G3 ?? 0,
        g: testData.g ?? testData.G ?? 0,
        h1: testData.h1 ?? testData.H1 ?? 0,
        h2: testData.h2 ?? testData.H2 ?? 0,
        h3: testData.h3 ?? testData.H3 ?? 0,
        h: testData.h ?? testData.H ?? 0,
        // 反应时间
        t1: testData.t1,
        t2: testData.t2,
        t3: testData.t3,
        // 评分（优先使用后端返回的字段，兼容大小写）
        scoreK: testData.scoreK ?? testData.score_k ?? null,
        scoreG: testData.scoreG ?? testData.score_g ?? null,
        scoreH: testData.scoreH ?? testData.score_h ?? null,
      };

      
  
      // 关键：通过 setData 同步数据到视图层
      this.setData({
        submitData: newSubmitData
      });
      
  
      // 验证数据是否同步成功（打印的是视图层的数据）
      console.log('同步后的 k1、k2、k3、k:', 
        this.data.submitData.k1, 
        this.data.submitData.k2, 
        this.data.submitData.k3, 
        this.data.submitData.k
      );
      console.log('同步后的 scoreK、scoreG、scoreH:', 
        this.data.submitData.scoreK, 
        this.data.submitData.scoreG, 
        this.data.submitData.scoreH
      );
    }
  },
  formatNumber(value) {
    console.log('传入的 value 类型:', typeof value); // 输出类型（如 'string'、'number'）
    console.log('value 是否为有效数值:', !isNaN(value) && isFinite(value)); // 检查是否为有效数值
    return value !== null && value !== undefined ? value.toFixed(2) : '—';
  },

    
  

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
      console.log('用户ID:', this.data.userInfo.id);
    } else {
      this.setData({
        userInfo: {}
      });
    }
  },

  getNeuralType() {
    // 根据K、G、H值判断神经类型
    const k = this.data.submitData.scoreK;
    const g = this.data.submitData.scoreG;
    const h = this.data.submitData.scoreH;

    const Combination = `${k}${g}${h}`;
    console.log("让我们看看有没有正确拿到kgh:",Combination);

    const TypeConditions = [
      //兴奋型特征：神经过程强，兴奋占优势，易冲动，抑制能力弱。
      { type: "兴奋型", conditions: ["555","554","553","552","551","545","544","543","542","541","535","534","533","532","531","525","524","523","522","521","515","514","513","512","511","455","454","445","453","452","451"] },
      //神经过程强，兴奋与抑制平衡，反应灵活，适应性强。神经过程强，兴奋与抑制平衡，反应灵活，适应性强。
      { type: "活泼型", conditions: ["435","345","354","453","534","543","324","342","423","432","234","243","325","352","523","532","235","253","315","351","513","531","135","153","335","353","533","344","434","443","334","343","433","225","252","522","125","152","215","251","512","521","155"]},
      //神经过程强且平衡，但灵活性低，反应迟缓但稳定。
      { type: "安静型", conditions: ["444","344","443","434","433","334","343","333","244","424","442","422","225","224","242","422","144","414","441","411","114","141","233","323","332","322","223","232","133","313","331","311","113","131","122","212","355"]},
      //神经过程弱，易疲劳，抑制占优势。
      { type: "抑制型", conditions: ["111","112","121","211","113","131","311","114","141","411","115","151","511","123","132"] },
    ]
    if (k < 1 || k > 5 || g < 1 || g > 5 || h < 1 || h > 5) {
      return "无效数据";
    }
    for (const condition of TypeConditions) {
      if (condition.conditions.includes(Combination)) {
        
        const type = condition.type;
        wx.setStorageSync('neuralType', type);
        console.log(wx.getStorageSync('neuralType'))
        this.setData({ neuralType: type });
        console.log("让我们看看有没有匹配到类型：",this.data.neuralType)
        return;

      }
    }
    this.setData({ neuralType: "未匹配到类型" });
  },

  
  backTohome() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  // 右侧分享：定义分享内容（必写，否则分享无内容）
  onShareAppMessage() {
    return {
      title: '分享解析报告给好友', // 分享标题
      path: '/pages/report/report', // 分享的页面路径（需与 goReport 一致）
      imageUrl: '/images/Figure/NN.png', // 可选：分享封面图
    };
  },
})