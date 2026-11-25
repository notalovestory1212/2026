/* =============================================================
   LOVE-ti 內容設定檔 —— 創作者修改用
   -------------------------------------------------------------
   • 想改任何文字，只要編輯這個檔案，存檔後重新整理網頁即可。
   • 不需要重新生成整個網站。
   • 注意：
     1. s:['D'] 等括號裡的是計分代號，請不要亂改，否則結果會不正確。
     2. types 的 key（DPR、DPR-F 等）對應 assets/mascots/ 裡的圖片檔名，請勿更改。
     3. F 是彩蛋指標：四個「分手選項」全部選中才會解鎖 DPR-F。
   ============================================================= */
window.LOVE_TI_CONTENT = (function(){
  /* 繁體中文為原始檔，歌曲中繼資料（歌詞／歌手／作曲／作詞）三語共用 */
  const base = {

  /* ---------- 頁面文字 ---------- */
  ui: {
    eyebrow: '♥ 3 DIMENSIONS · 8 PERSONALITIES',
    subtitle: '戀愛人格測試 &nbsp;/&nbsp; Love Personality Test',
    introHTML: '<p>在這個快節奏的時代，我們聽過太多關於愛的道理，卻依然在每一次的心動與心碎裡，笨拙地<b>在愛裡摸索自己的形狀</b>。</p><p>LOVE-ti 圍繞<b>身份認同</b>（獨立 vs 連結）、<b>情感表達</b>（理性 vs 感性）及<b>生活方式</b>（儀式感 vs 隨性）三個維度，把親密關係中的人格劃分成 8 種類型。</p><p>點擊測驗，測出你的專屬人格代碼和歌詞！</p>',
    disclaimer: '（本人格測試非心理學專業測評工具，結果僅供娛樂參考）',
    startBtn: '▶ &nbsp;開始測試',
    quizTitle: '戀愛人格測驗',
    quizHint: '跟著直覺選就對了 · 沒有標準答案',
    backBtn: '← 上一題',
    extraLabel: 'EXTRA QUESTION · 額外問題',
    loadingText: 'SCANNING YOUR LOVE SIGNAL ...',
    resultEyebrow: '♥ ANALYSIS COMPLETE · 戀愛人格解析',
    resultTitle: '你的戀愛人格是……',
    resultSub: 'YOUR LOVE PERSONALITY TYPE',
    profileTitle: 'LOVE PROFILE / 戀愛傾向',
    profileSub: '三個維度的偏向分佈',
    profileDims: [
      {name:'身份認同', desc:'', left:'P', right:'C'},
      {name:'情感表達', desc:'', left:'L', right:'D'},
      {name:'生活方式', desc:'', left:'R', right:'S'}
    ],
    compatTitle: 'LOVE COMPATIBILITY / 愛情配對',
    compatSub: '誰和你擦出火花，誰又和你火星撞地球',
    tagSpark: '✦ 擦出火花',
    tagClash: '⚡ 火星撞地球',
    shareImageBtn: '↗ &nbsp;分享結果圖',
    downloadBtn: '⬇ &nbsp;下載結果圖',
    whatsappBtn: 'WhatsApp',
    copyBtn: '♡ &nbsp;複製文字',
    retryBtn: '↻ &nbsp;再測一次',
    homeBtn: '← 回到首頁',

    /* ---------- 展覽宣傳（首頁、結果頁、分享圖共用） ---------- */
    exhibitionSlogan: '當我們靠近另一個人時，其實在靠近怎樣的自己？',
    exhibitionTitle: '(Not) a Love Story 不如說愛',
    exhibitionShare: '2026年12月12日至20日　尖沙咀逸東酒店',
    exhibitionDate: '2026年12月12日至20日',
    exhibitionVenue: '尖沙咀逸東酒店',
    exhibitionBtn: '了解展覽 ↗',
    /* 展覽 IG 頁面 */
    exhibitionUrl: 'https://www.instagram.com/not_a.love.story/',
    exhibitionLink: 'https://www.instagram.com/not_a.love.story/',

    shareCaption: '我的 LOVE-ti 戀愛人格是「{name}」♥️\n🎵「{lyric}」\n〈{song}〉唱：{singer}  曲：{composer} 詞：{lyricist}\n來測測你的戀愛人格 → {url}\n\n💕 *{exhibitionTitle}*\n{exhibitionDate}｜{exhibitionVenue}\n{slogan}\n了解展覽：{exhibitionLink}',
    toastCopy: '結果文字與連結已複製，去放閃吧 ♥',
    toastWhatsApp: '已開啟 WhatsApp，選一個聊天室貼上吧 ♥',
    toastDownload: '結果圖已下載，可以貼到限時動態了 ♥',
    toastFallback: '已下載結果圖並複製文字，貼到 Instagram 或 WhatsApp 即可 ♥',
    toastLang: '已切換語言 ♥',
    langName: '語言',
    footerHTML: 'LOVE-TI · LOVE PERSONALITY TEST<br>專屬稱號與歌詞內容僅供娛樂參考，請別忘了：愛的形狀，永遠由你自己定義。 ♥',
    canvasTitle: 'LOVE PERSONALITY TEST',
    canvasTestHint: '測測你的戀愛人格 →',
    canvasDisclaimer: 'LOVE-TI · 僅供娛樂參考'
    ,canvasIgHint: '追蹤展覽 IG ↗'
  },

  /* ---------- 12 題主問題 ---------- */
  /* s 是計分代號：D/L = 情感表達，P/C = 身份認同，R/S = 生活方式，F = 彩蛋 */
  questions: [
    { q:'你最喜歡的感情階段是？', options:[
      {t:'曖昧時期的心動和拉扯', s:['D']},
      {t:'確認關係時的踏實感', s:['L']},
      {t:'熱戀時的幸福感', s:['C']},
      {t:'穩定期的默契和放鬆', s:['P']}
    ]},
    { q:'週末午後，你們終於有了共同空閒的時間，你最嚮往和另一半怎麼度過？', options:[
      {t:'兩個人窩在沙發上，一邊吃著外賣一邊追劇、打遊戲，享受不被打擾的兩人時光', s:['P','S']},
      {t:'叫上共同好友，在熱鬧的聚會中感受彼此的陪伴', s:['C','R']},
      {t:'提前安排好一整天的行程，享受充實又有計劃的約會', s:['R','L']},
      {t:'隨性地在街上漫步，邊走邊聊，感受不期而遇的驚喜', s:['S','D']}
    ]},
    { q:'如果你喜歡的歌手發行了全新的失戀專輯，你的反應更傾向於……', options:[
      {t:'聽著憂傷的旋律和歌詞，忍不住聯想起許多戀愛中的細節與遺憾', s:['D','C']},
      {t:'加入歌單但不會代入，現實生活該怎麼過怎麼過', s:['L','P']},
      {t:'仔細閱讀歌詞，分析歌手的感情生活', s:['R','P']},
      {t:'在社群媒體上分享，和朋友／另一半一起討論新專輯', s:['S','C']}
    ]},
    { q:'在瀏覽社交媒體時，看見別人在放閃或展示精心策劃的驚喜，你的反應更傾向於……', options:[
      {t:'立即開始準備，別人有的我們也要有，這個禮拜就去那裡！', s:['R']},
      {t:'內心毫無波瀾，覺得愛不一定要拿出來炫耀，我們有自己的風格和節奏', s:['L','P']},
      {t:'默默比較，檢討這段關係，越想越覺得虧欠伴侶／伴侶虧欠自己', s:['D']},
      {t:'轉發給另一半，想知道對方的反應再決定下一步行動', s:['C','S']}
    ]},
    { q:'和另一半意見不合時，你的反應是更傾向於……', options:[
      {t:'轉移話題，暫且不談', s:['P']},
      {t:'主動找對方解釋和討論問題', s:['L']},
      {t:'開始懷疑這段關係是不是不適合自己，浮現分手的念頭', s:['D','F']},
      {t:'翻出兩人的對話紀錄或照片，回想當初甜蜜的樣子，氣就消了一半', s:['C']}
    ]},
    { q:'某日下課／下班後伴侶突然帶你到一家預約困難但你非常想去的餐廳，你的反應更傾向於……', options:[
      {t:'瞬間心裡暖洋洋又感動，覺得這就是夢寐以求的浪漫時刻', s:['D']},
      {t:'立即思考下次要怎麼準備驚喜給對方', s:['L']},
      {t:'有些懊惱，如果我有提前準備適合的衣服就好了', s:['R']},
      {t:'雖然有點意外，但享受當下就好', s:['S']}
    ]},
    { q:'前任突然傳「最近好嗎？」，你的反應更傾向於……', options:[
      {t:'立刻截圖問另一半，討論決定怎麼回', s:['C']},
      {t:'試探對方是無聊還是有事', s:['L']},
      {t:'腦補當年的遺憾和各種「如果」', s:['D']},
      {t:'刪除加封鎖，過去就讓它過去', s:['P']}
    ]},
    { q:'你發現在正式確立關係前，只是對方諸多曖昧對象／備胎之一，你的反應更傾向於......', options:[
      {t:'先跟對方說清楚自己的看法和感受', s:['L']},
      {t:'避而不談，獨自消化情緒', s:['P']},
      {t:'尋求其他人的幫助', s:['C']},
      {t:'不必再說多餘的話，直接分手', s:['D','F']}
    ]},
    { q:'你傳訊息給另一半，對方整天都沒有回覆。你的反應更傾向於……', options:[
      {t:'直接打電話給對方或聯絡對方的好友', s:['C']},
      {t:'對方可能在忙，先做自己的事轉移注意力，再等等', s:['P','S']},
      {t:'反覆重看過往的對話紀錄，內心小劇場爆發：「是不是不愛了？他生氣了嗎？」', s:['D','F']},
      {t:'可能是忘記回了，發個貼圖或訊息提醒對方一下', s:['R','L']}
    ]},
    { q:'你認為愛情裡最能讓關係保鮮的關鍵是……', options:[
      {t:'定期安排約會和節日驚喜', s:['R','C']},
      {t:'保留各自的生活節奏和空間', s:['P','S']},
      {t:'真摯的深夜長談或情感告白', s:['D']},
      {t:'生活中的互相扶持', s:['L']}
    ]},
    { q:'你另一半的父母對你說：「給你一千萬離開我的孩子！」，你的反應更傾向於……', options:[
      {t:'欣然接受，立即拿錢走人', s:[]},
      {t:'坐地起價，一千萬怎麼夠呢？', s:[]},
      {t:'毅然拒絕，我們之間的關係不是用錢衡量的！', s:['D']},
      {t:'陽奉陰違，含淚收下後偷偷繼續談', s:[]}
    ]},
    { q:'某天醒來，另一半竟然變成了一隻蟑螂（可對話），你的第一反應是……', options:[
      {t:'無論如何我都會繼續愛牠的！', s:['D','C']},
      {t:'冷靜評估現狀，思考怎麼安置牠、能不能變回來', s:['L','C']},
      {t:'嚇到逃跑，打電話叫實驗室抓走', s:['P']},
      {t:'殺掉......？', s:['P','F']}
    ]}
  ],

  /* ---------- 額外問題（只有該維度同分才出現） ---------- */
  bonus: [
    { q:'哪一句話更打動你？', options:[
      {t:'「你永遠是我的第一選擇，沒有事情比你更重要」', s:['D']},
      {t:'「不管發生什麼，我都會陪你一起面對、解決問題。」', s:['L']}
    ]},
    { q:'關於手機密碼和社交帳號，你的態度更傾向於......', options:[
      {t:'各自保留隱私空間，互不干涉才是最好的信任', s:['P']},
      {t:'密碼互通、隨時報備，我們之間不能有秘密', s:['C']}
    ]},
    { q:'對於日常相處的節奏，你更認同哪一種想法？', options:[
      {t:'沒有安排的日子容易空虛，有計劃、有期待才像在認真談戀愛', s:['R']},
      {t:'沒有安排的日子最自在，不用刻意營造什麼，舒服最重要', s:['S']}
    ]}
  ],

  /* ---------- 8 種人格 + 1 個隱藏彩蛋 ---------- */
  /* key 是內部代號，對應 assets/mascots/ 裡的圖片檔名，請勿更改 */
  types: {
    DPR:{ name:'戀愛幻想家', desc:'演的怎麼了？人生如戲，不能演嗎？你在感情中既渴望浪漫，也極度重視個人的自由與邊界，一個人的時候，心裡面就已經演完一齣大戲。比起黏膩的現實互動，你更享受那種若即若離的想像餘韻，在自己的小世界裡自導自演、自給自足，既深情又抽離。',
      lyric:'然後當感覺 浮過 會知感覺\n沉過 會知結果', song:'Never Said Goodbye', singer:'麥浚龍', lyricist:'周耀輝', composer:'張繼聰',
      spark:'LPR', sparkWhy:'TA 把你天馬行空的小劇場，一格格落地成真實行程；你負責做夢，TA 負責把夢訂好時間。',
      clash:'LCS', clashWhy:'你要的是留白與邊界，TA 給的是整片黏糊糊的溫柔。一個想退、一個想貼，最容易擦槍走火。' },
    'DPR-F':{ name:'戀愛幻想家（感建分版）', desc:'恭喜解鎖隱藏彩蛋！你的內心小劇場比誰都精彩，但理智永遠比心動快一步踩煞車。朋友找你哭訴，你永遠冷靜輸出「一律建議分手」。輪到自己，只要對方稍微扣分，你已做好撤退的準備——與其委屈自己將就，不如單身保平安！',
      lyric:'然後當感覺 浮過 會知感覺\n沉過 會知結果', song:'Never Said Goodbye', singer:'麥浚龍', lyricist:'周耀輝', composer:'張繼聰',
      spark:'LPR', sparkWhy:'TA 把你天馬行空的小劇場，一格格落地成真實行程；你負責做夢，TA 負責把夢訂好時間。',
      clash:'LCS', clashWhy:'你要的是留白與邊界，TA 給的是整片黏糊糊的溫柔。一個想退、一個想貼，最容易擦槍走火。' },
    DPS:{ name:'脫韁野馬', desc:'你習慣在感情關係中跟著直覺走，心動就立刻衝，但只要感覺到一絲束縛就會想逃。你享受心跳加速與悸動的瞬間，討厭被關係標籤與承諾綁死。對你而言，為愛瘋狂過便已足夠，何必在乎天長地久？',
      lyric:'我相信蜃樓 相信荒謬\n從來憧憬的都不永久 總好過沒有', song:'蜃樓', singer:'容祖兒', lyricist:'周耀輝', composer:'曾家瑋',
      spark:'LPS', sparkWhy:'你們都討厭被框住，TA 不會追問承諾，你也不會被催著落地，剛好可以一起逃逸。',
      clash:'LCR', clashWhy:'TA 要規則、要進度、要答案；你一聽到「我們談談」，就想跳車。' },
    DCR:{ name:'純愛戰士', desc:'「真是失禮啊，我們可是純愛。」一旦愛上，你就會毫無保留地把心交出去。你熱愛高調放閃，把每個紀念日都當成大事來辦，腦海裡更隨時上演著偶像劇般的浪漫情節。對你來說，愛就要轟轟烈烈，理智在心動面前根本不值一提。',
      lyric:'不想正常\n心花正怒放', song:'心花怒放', singer:'容祖兒', lyricist:'周耀輝', composer:'陳奐仁',
      spark:'LCR', sparkWhy:'你負責獻上真心與煙火，TA 負責把這份熱情規畫成一條能走很久的路。',
      clash:'LPS', clashWhy:'你想把每一天都過成紀念日，TA 只想安安靜靜待著；熱度差太遠，很容易互相誤解。' },
    DCS:{ name:'慈善家', desc:'你的心很軟，容易因為一個眼神或一句溫柔就瞬間暈船。你總是習慣把對方的好無限放大，一旦動心便不問退路，總想用愛去溫暖對方。你活在當下的每一份真誠裡，哪怕過程再費力也願意全心付出。',
      lyric:'也許愛情 都要力氣\n當你越困難我越堅持', song:'愛上水仙花', singer:'泳兒', lyricist:'周耀輝', composer:'MINSKI',
      spark:'LCS', sparkWhy:'兩個柔軟的人湊在一起，誰都不用偽裝，愛就自然而然地流動起來。',
      clash:'LPR', clashWhy:'你只想一頭栽進去，TA 先攤開表格；你的真心在 TA 的效率面前，顯得沒了分寸。' },
    LPR:{ name:'卷王', desc:'平時的你理性、獨立又清醒，絕不輕易被情緒左右，但一到節日或紀念日，你的勝負欲就會熊熊燃燒。你認為愛需要具體的載體，從挑選禮物到預訂餐廳都絕不馬虎。你不喜歡空泛的口頭承諾，只在乎眼見為實的細節，用理性的規劃去傳達感性的愛意。',
      lyric:'難道送別你 回頭總是虔誠', song:'我的回憶不是我的', singer:'泳兒、海鳴威', lyricist:'周耀輝', composer:'朱其民',
      spark:'DPR', sparkWhy:'TA 替你補上浪漫的想像力，你替 TA 守住現實的底線，組合剛剛好。',
      clash:'DCS', clashWhy:'你要空間和效率，TA 要即時的情感回應；你越冷靜，TA 越不安。' },
    LPS:{ name:'佛系淡人', desc:'Be chill~ 在感情裡，你追求的是沒有壓力的相處模式。你獨立又務實，比起刻意經營的浪漫，你更喜歡順其自然的陪伴。像一陣微風，有緣便並肩走一段，隨性自在就是最好的狀態。',
      lyric:'一起靜靜的過\n不需要太認識我', song:'借火', singer:'麥浚龍', lyricist:'周耀輝', composer:'馮穎琪',
      spark:'DPS', sparkWhy:'TA 拉著你往前衝，你在旁邊笑著看風景，節奏意外地合拍。',
      clash:'DCR', clashWhy:'TA 的愛太大聲，你的愛太安靜；一邊想被見證，一邊只想低調。' },
    LCR:{ name:'監工', desc:'那......能跟我組一輩子情侶嗎？你把感情當成一項需要用心經營的長期專案，非常看重「我們」的共同未來。你講道理、有規劃，遇到問題習慣攤開來理性溝通。雖然有時顯得像個嚴格的監工，但那全是因為你比誰都認真想走下去。',
      lyric:'我因愛去撐過 去爭過\n為何偏偏得你不知我很落力', song:'愛的履歷', singer:'J.Arie', lyricist:'周耀輝', composer:'覃嘉健',
      spark:'DCR', sparkWhy:'你看見 TA 的認真，TA 感動你的投入；一個掌舵，一個點燈。',
      clash:'DPS', clashWhy:'你拿出合約，TA 看成繩子；你越想確認，TA 越想消失。' },
    LCS:{ name:'史萊姆', desc:'關於你轉生成為史萊姆的這件事，你在感情關係裡對伴侶有種天然的依賴感，又十分講道理。你不愛計較瑣碎的小事，隨遇而安，對方想做什麼你通常都會笑著配合。跟你談戀愛沒有壓力，因為你總能溫柔地接住對方的所有形狀。',
      lyric:'願我不再掛念你　但我偏更掛念你', song:'不呼不吸幾多秒', singer:'薛凱琪', lyricist:'周耀輝', composer:'方大同',
      spark:'DCS', sparkWhy:'TA 熱情地靠近，你溫柔地接住，兩個人都很舒服地軟在一起。',
      clash:'DPR', clashWhy:'你想要貼貼，TA 卻需要把帷幕拉上、一個人待著；你的依賴會嚇跑 TA 的想像。' }
  },

  /* ---------- 滑桿兩端標籤 ---------- */
  TRAIT: {D:'感性', L:'理性', P:'獨立', C:'連結', R:'儀式感', S:'隨性'}
};

  /* ---------- 三語切換：只翻譯介面文字，歌曲中繼資料共用 ---------- */
  const songs = {};
  Object.keys(base.types).forEach(k=>{
    const t = base.types[k];
    songs[k] = {lyric:t.lyric, song:t.song, singer:t.singer, composer:t.composer, lyricist:t.lyricist};
  });
  function build(label, short, patch){
    patch = patch || {};
    const types = {};
    Object.keys(base.types).forEach(k=>{
      types[k] = Object.assign({}, songs[k], base.types[k], (patch.types&&patch.types[k])||{});
    });
    const mapQA = (src, over)=> (over||src).map((item,i)=>({
      q:item.q,
      options:item.options.map((o,j)=>({s:src[i].options[j].s, t:o.t}))
    }));
    return {
      label:label, short:short,
      ui:Object.assign({}, base.ui, patch.ui||{}),
      questions: patch.questions ? mapQA(base.questions, patch.questions) : base.questions,
      bonus: patch.bonus ? mapQA(base.bonus, patch.bonus) : base.bonus,
      types:types,
      TRAIT:Object.assign({}, base.TRAIT, patch.TRAIT||{})
    };
  }

  const zhHans = build('简体中文','简',{
    ui:{
      eyebrow:'♥ 3 个维度 · 8 种人格',
      subtitle:'恋爱人格测试 &nbsp;/&nbsp; Love Personality Test',
      introHTML:'<p>在这个快节奏的时代，我们听过太多关于爱的道理，却在每一次的心动与心碎里，笨拙地<b>在爱里摸索自己的形状</b>。</p><p>LOVE-ti 围绕<b>身份认同</b>（独立 vs 连结）、<b>情感表达</b>（理性 vs 感性）及<b>生活方式</b>（仪式感 vs 随性）三个维度，把亲密关系中的人格划分成 8 种类型。</p><p>点击测验，测出你的专属人格代码和歌词！</p>',
      disclaimer:'（本人格测试非心理学专业测评工具，结果仅供娱乐参考）',
      startBtn:'▶ &nbsp;开始测试',
      quizTitle:'恋爱人格测验',
      quizHint:'跟着直觉选就对了 · 没有标准答案',
      backBtn:'← 上一题',
      extraLabel:'EXTRA QUESTION · 额外问题',
      resultEyebrow:'♥ ANALYSIS COMPLETE · 恋爱人格解析',
      resultTitle:'你的恋爱人格是……',
      profileTitle:'LOVE PROFILE / 恋爱倾向',
      profileSub:'三个维度的偏向分布',
      profileDims:[{name:'身份认同',desc:'',left:'P',right:'C'},{name:'情感表达',desc:'',left:'L',right:'D'},{name:'生活方式',desc:'',left:'R',right:'S'}],
      compatTitle:'LOVE COMPATIBILITY / 爱情配对',
      compatSub:'谁和你擦出火花，谁又和你火星撞地球',
      tagSpark:'✦ 擦出火花',
      tagClash:'⚡ 火星撞地球',
      shareImageBtn:'↗ &nbsp;分享结果图',
      downloadBtn:'⬇ &nbsp;下载结果图',
      copyBtn:'♡ &nbsp;复制文字',
      retryBtn:'↻ &nbsp;再测一次',
      homeBtn:'← 回到首页',
      exhibitionSlogan:'当我们靠近另一个人时，其实在靠近怎样的自己？',
      exhibitionTitle:'(Not) a Love Story 不如说爱',
      exhibitionShare:'2026年12月12日至20日　尖沙咀逸东酒店',
      exhibitionDate:'2026年12月12日至20日',
      exhibitionVenue:'尖沙咀逸东酒店',
      exhibitionBtn:'了解展览 ↗',
      shareCaption:'我的 LOVE-ti 恋爱人格是「{name}」♥️\n🎵「{lyric}」\n〈{song}〉唱：{singer}  曲：{composer} 词：{lyricist}\n来测测你的恋爱人格 → {url}\n\n💕 *{exhibitionTitle}*\n{exhibitionDate}｜{exhibitionVenue}\n{slogan}\n了解展览：{exhibitionLink}',
      toastCopy:'结果文字与连结已复制，去放闪吧 ♥',
      toastWhatsApp:'已开启 WhatsApp，选一个聊天室贴上吧 ♥',
      toastDownload:'结果图已下载，可以贴到限时动态了 ♥',
      toastFallback:'已下载结果图并复制文字，贴到 Instagram 或 WhatsApp 即可 ♥',
      toastLang:'已切换语言 ♥',
      langName:'语言',
      footerHTML:'LOVE-TI · LOVE PERSONALITY TEST<br>专属称号与歌词内容仅供娱乐参考，请别忘了：爱的形状，永远由你自己定义。 ♥',
      canvasTestHint:'测测你的恋爱人格 →',
      canvasDisclaimer:'LOVE-TI · 仅供娱乐参考',
      canvasIgHint:'追踪展览 IG ↗'
    },
    TRAIT:{D:'感性', L:'理性', P:'独立', C:'连结', R:'仪式感', S:'随性'},
    questions:[
      {q:'你最喜欢的感情阶段是？',options:[{t:'暧昧时期的心动和拉扯'},{t:'确认关系时的踏实感'},{t:'热恋时的幸福感'},{t:'稳定期的默契和放松'}]},
      {q:'周末午后，你们终于有了共同空闲的时间，你最向往和另一半怎么度过？',options:[{t:'两个人窝在沙发上，一边吃着外卖一边追剧、打游戏，享受不被打扰的两人时光'},{t:'叫上共同好友，在热闹的聚会中感受彼此的陪伴'},{t:'提前安排好一整天的行程，享受充实又有计划的约会'},{t:'随性地在街上漫步，边走边聊，感受不期而遇的惊喜'}]},
      {q:'如果你喜欢的歌手发行了全新的失恋专辑，你的反应更倾向于……',options:[{t:'听着忧伤的旋律和歌词，忍不住联想起许多恋爱中的细节与遗憾'},{t:'加入歌单但不会代入，现实生活该怎么过怎么过'},{t:'仔细阅读歌词，分析歌手的感情生活'},{t:'在社群媒体上分享，和朋友／另一半一起讨论新专辑'}]},
      {q:'在浏览社交媒体时，看见别人在放闪或展示精心策划的惊喜，你的反应更倾向于……',options:[{t:'立即开始准备，别人有的我们也要有，这个礼拜就去那里！'},{t:'内心毫无波澜，觉得爱不一定要拿出来炫耀，我们有自己的风格和节奏'},{t:'默默比较，检讨这段关系，越想越觉得亏欠伴侣／伴侣亏欠自己'},{t:'转发给另一半，想知道对方的反应再决定下一步行动'}]},
      {q:'和另一半意见不合时，你的反应是更倾向于……',options:[{t:'转移话题，暂且不谈'},{t:'主动找对方解释和讨论问题'},{t:'开始怀疑这段关系是不是不适合自己，浮现分手的念头'},{t:'翻出两人的对话纪录或照片，回想当初甜蜜的样子，气就消了一半'}]},
      {q:'某日下课／下班后伴侣突然带你到一家预约困难但你非常想去的餐厅，你的反应更倾向于……',options:[{t:'瞬间心里暖洋洋又感动，觉得这就是梦寐以求的浪漫时刻'},{t:'立即思考下次要怎么准备惊喜给对方'},{t:'有些懊恼，如果我有提前准备适合的衣服就好了'},{t:'虽然有点意外，但享受当下就好'}]},
      {q:'前任突然传「最近好吗？」，你的反应更倾向于……',options:[{t:'立刻截图问另一半，讨论决定怎么回'},{t:'试探对方是无聊还是有事'},{t:'脑补当年的遗憾和各种「如果」'},{t:'删除加封锁，过去就让它过去'}]},
      {q:'你发现在正式确立关系前，只是对方诸多暧昧对象／备胎之一，你的反应更倾向于……',options:[{t:'先跟对方说清楚自己的看法和感受'},{t:'避而不谈，独自消化情绪'},{t:'寻求其他人的帮助'},{t:'不必再说多余的话，直接分手'}]},
      {q:'你传讯息给另一半，对方整天都没有回复。你的反应更倾向于……',options:[{t:'直接打电话给对方或联络对方的好友'},{t:'对方可能在忙，先做自己的事转移注意力，再等等'},{t:'反覆重看过往的对话纪录，内心小剧场爆发：「是不是不爱了？他生气了吗？」'},{t:'可能是忘记回了，发个贴图或讯息提醒对方一下'}]},
      {q:'你认为爱情里最能保鲜关系的关键是……',options:[{t:'定期安排约会和节日惊喜'},{t:'保留各自的生活节奏和空间'},{t:'真挚的深夜长谈或情感告白'},{t:'生活中的互相扶持'}]},
      {q:'你另一半的父母对你说：「给你一千万离开我的孩子！」，你的反应更倾向于……',options:[{t:'欣然接受，立即拿钱走人'},{t:'坐地起价，一千万怎么够呢？'},{t:'毅然拒绝，我们之间的关系不是用钱衡量的！'},{t:'阳奉阴违，含泪收下后偷偷继续谈'}]},
      {q:'某天醒来，另一半竟然变成了一只蟑螂（可对话），你的第一反应是……',options:[{t:'无论如何我都会继续爱它的！'},{t:'冷静评估现状，思考怎么安置它、能不能变回来'},{t:'吓到逃跑，打电话叫实验室抓走'},{t:'杀掉……？'}]}
    ],
    bonus:[
      {q:'哪一句话更打动你？',options:[{t:'「你永远是我的第一选择，没有事情比你更重要」'},{t:'「不管发生什么，我都会陪你一起面对、解决问题。」'}]},
      {q:'关于手机密码和社交帐号，你的态度更倾向于……',options:[{t:'各自保留隐私空间，互不干涉才是最好的信任'},{t:'密码互通、随时报备，我们之间不能有秘密'}]},
      {q:'对于日常相处的节奏，你更认同哪一种想法？',options:[{t:'没有安排的日子容易空虚，有计划、有期待才像在认真谈恋爱'},{t:'没有安排的日子最自在，不用刻意营造什么，舒服最重要'}]}
    ],
    types:{
      DPR:{name:'恋爱幻想家',desc:'演的怎么了？人生如戏，不能演吗？你在感情中既渴望浪漫，也极度重视个人的自由与边界，一个人的时候，心里面就已经演完一出大戏。比起黏腻的现实互动，你更享受那种若即若离的想象余韵，在自己的小世界里自导自演、自给自足，既深情又抽离。',sparkWhy:'TA 把你天马行空的小剧场，一格格落地成真实行程；你负责做梦，TA 负责把梦订好时间。',clashWhy:'你要的是留白与边界，TA 给的是整片黏糊糊的温柔。一个想退、一个想贴，最容易擦枪走火。'},
      'DPR-F':{name:'恋爱幻想家（感建分版）',desc:'恭喜解锁隐藏彩蛋！你的内心小剧场比谁都精彩，但理智永远比心动快一步踩刹车。朋友找你哭诉，你永远冷静输出「一律建议分手」。轮到自己，只要对方稍微扣分，你已做好撤退的准备——与其委屈自己将就，不如单身保平安！',sparkWhy:'TA 把你天马行空的小剧场，一格格落地成真实行程；你负责做梦，TA 负责把梦订好时间。',clashWhy:'你要的是留白与边界，TA 给的是整片黏糊糊的温柔。一个想退、一个想贴，最容易擦枪走火。'},
      DPS:{name:'脱缰野马',desc:'你习惯在感情关系中跟着直觉走，心动就立刻冲，但只要感觉到一丝束缚就会想逃。你享受心跳加速与悸动的瞬间，讨厌被关系标签与承诺绑死。对你而言，为爱疯狂过便已足够，何必在乎天长地久？',sparkWhy:'你们都讨厌被框住，TA 不会追问承诺，你也不会被催着落地，刚好可以一起逃逸。',clashWhy:'TA 要规则、要进度、要答案；你一听到「我们谈谈」，就想跳车。'},
      DCR:{name:'纯爱战士',desc:'「真是失礼啊，我们可是纯爱。」一旦爱上，你就会毫无保留地把心交出去。你热爱高调放闪，把每个纪念日都当成大事来办，脑海里更随时上演着偶像剧般的浪漫情节。对你来说，爱就要轰轰烈烈，理智在心动的面前根本不值一提。',sparkWhy:'你负责献上真心与烟火，TA 负责把这份热情规划成一条能走很久的路。',clashWhy:'你想把每一天都过成纪念日，TA 只想安安静静待着；热度差太远，很容易互相误解。'},
      DCS:{name:'慈善家',desc:'你的心很软，容易因为一个眼神或一句温柔就瞬间晕船。你总是习惯把对方的好无限放大，一旦动心便不问退路，总想用爱去温暖对方。你活在当下的每一份真诚里，哪怕过程再费力也愿意全心付出。',sparkWhy:'两个柔软的人凑在一起，谁都不用伪装，爱就自然而然地流动起来。',clashWhy:'你只想一头栽进去，TA 先摊开表格；你的真心在 TA 的效率面前，显得没了分寸。'},
      LPR:{name:'卷王',desc:'平时的你理性、独立又清醒，绝不轻易被情绪左右，但一到节日或纪念日，你的胜负欲就会熊熊燃烧。你认为爱需要具体的载体，从挑选礼物到预订餐厅都绝不马虎。你不喜欢空泛的口头承诺，只在乎眼见为实的细节，用理性的规划去传达感性的爱意。',sparkWhy:'TA 替你补上浪漫的想象力，你替 TA 守住现实的底线，组合刚刚好。',clashWhy:'你要空间和效率，TA 要即时的情感回应；你越冷静，TA 越不安。'},
      LPS:{name:'佛系淡人',desc:'Be chill~ 在感情里，你追求的是没有压力的相处模式。你独立又务实，比起刻意经营的浪漫，你更喜欢顺其自然的陪伴。像一阵微风，有缘便并肩走一段，随性自在就是最好的状态。',sparkWhy:'TA 拉着你往前冲，你在旁边笑着看风景，节奏意外地合拍。',clashWhy:'TA 的爱太大声，你的爱太安静；一边想被见证，一边只想低调。'},
      LCR:{name:'监工',desc:'那……能跟我组一辈子情侣吗？你把感情当成一项需要用心经营的长期专案，非常看重「我们」的共同未来。你讲道理、有规划，遇到问题习惯摊开来理性沟通。虽然有时显得像个严格的监工，但那全是因为你比谁都认真想走下去。',sparkWhy:'你看见 TA 的认真，TA 感动你的投入；一个掌舵，一个点灯。',clashWhy:'你拿出合约，TA 看成绳子；你越想确认，TA 越想消失。'},
      LCS:{name:'史莱姆',desc:'关于你转生成史莱姆的这件事，你在感情关系里对伴侣有种天然的依赖感，又十分讲道理。你不爱计较琐碎的小事，随遇而安，对方想做什么你通常都会笑着配合。跟你谈恋爱没有压力，因为你总能温柔地接住对方的所有形状。',sparkWhy:'TA 热情地靠近，你温柔地接住，两个人都很舒服地软在一起。',clashWhy:'你想要贴贴，TA 却需要把帷幕拉上、一个人待着；你的依赖会吓跑 TA 的想象。'}
    }
  });

  const en = build('English','EN',{
    ui:{
      eyebrow:'♥ 3 DIMENSIONS · 8 PERSONALITIES',
      subtitle:'Love Personality Test &nbsp;/&nbsp; 戀愛人格測試',
      introHTML:'<p>In this fast-paced world, we have heard so much about love, yet with every flutter of the heart and every heartbreak, we still stumble, trying to <b>find our own shape in love</b>.</p><p>LOVE-TI categorizes intimate relationships into 8 unique personality types across three key dimensions: <b>Identity</b> (Independent vs. Connected), <b>Emotional expression</b> (Rational vs. Emotional), and <b>Lifestyle</b> (Ritual vs. Spontaneous).</p><p>Take the quiz to discover your personality code and lyrics!</p>',
      disclaimer:'(This test is not a professional psychological assessment. Results are for entertainment only.)',
      startBtn:'▶ &nbsp;START TEST',
      quizTitle:'Love Personality Quiz',
      quizHint:'Go with your gut · There are no wrong answers',
      backBtn:'← Back',
      extraLabel:'EXTRA QUESTION',
      loadingText:'SCANNING YOUR LOVE SIGNAL ...',
      resultEyebrow:'♥ ANALYSIS COMPLETE · YOUR LOVE PROFILE',
      resultTitle:'Your love personality is...',
      resultSub:'YOUR LOVE PERSONALITY TYPE',
      profileTitle:'LOVE PROFILE / Your Tendencies',
      profileSub:'Where you lean on each of the three dimensions',
      profileDims:[{name:'IDENTITY',desc:'',left:'P',right:'C'},{name:'EMOTIONS',desc:'',left:'L',right:'D'},{name:'LIFESTYLE',desc:'',left:'R',right:'S'}],
      compatTitle:'LOVE COMPATIBILITY',
      compatSub:'Who matches/ clashes with you',
      tagSpark:'✦ Great match',
      tagClash:'⚡ Clash',
      shareImageBtn:'↗ &nbsp;SHARE IMAGE',
      downloadBtn:'⬇ &nbsp;DOWNLOAD IMAGE',
      whatsappBtn:'WhatsApp',
      copyBtn:'♡ &nbsp;COPY TEXT',
      retryBtn:'↻ &nbsp;RETAKE',
      homeBtn:'← HOME',
      exhibitionSlogan:'As we draw closer to another, what kind of self do we come closer to?',
      exhibitionTitle:'(Not) a Love Story',
      exhibitionShare:'12–20 December 2026　Hotel East, Tsim Sha Tsui',
      exhibitionDate:'12–20 December 2026',
      exhibitionVenue:'Hotel East, Tsim Sha Tsui',
      exhibitionBtn:'About ↗',
      shareCaption:'My LOVE-ti love personality is "{name}" ♥️\n🎵 "{lyric}"\n"{song}" — {singer}  Music: {composer}  Lyrics: {lyricist}\nTake the test → {url}\n\n💕 *{exhibitionTitle}*\n{exhibitionDate} | {exhibitionVenue}\n{slogan}\nAbout the exhibition: {exhibitionLink}',
      toastCopy:'Text and link copied — go show it off ♥',
      toastWhatsApp:'Pick a chat and paste it ♥',
      toastDownload:'Image downloaded — ready for your story ♥',
      toastFallback:'Image downloaded and text copied. Paste it on Instagram or WhatsApp ♥',
      toastLang:'Language switched ♥',
      langName:'Language',
      footerHTML:'LOVE-TI · LOVE PERSONALITY TEST<br>Your type and lyrics are for entertainment only. Remember: the shape of love is always yours to define. ♥',
      canvasTestHint:'Take the test →',
      canvasDisclaimer:'LOVE-TI · FOR ENTERTAINMENT ONLY',
      canvasIgHint:'FOLLOW ON IG ↗'
    },
    TRAIT:{D:'Emotional', L:'Rational', P:'Independent', C:'Connected', R:'Ritual', S:'Spontaneous'},
    questions:[
      {q:'Which stage of a relationship do you like most?',options:[{t:'The chemistry and intimacy of situationship'},{t:'The sense of security when the relationship is confirmed'},{t:'The bliss of the honeymoon phase'},{t:'The unspoken understanding and ease of stable phase'}]},
      {q:'It is a weekend afternoon and you both finally have time together. How would you most looking forward to spending it with your partner?',options:[{t:'Cuddling up on the sofa together and enjoying uninterrupted quality time'},{t:'Gathering with mutual friends to enjoy each other’s company within a lively atmosphere'},{t:'Planning a full-day schedule in advance for a structured and effective date'},{t:'Wandering casually down the street and embracing unexpected experiences'}]},
      {q:'If your favourite singer released the latest breakup album, you’re more likely to...',options:[{t:'Let the sad melodies and lyrics draw you into memories of love and regret'},{t:'Add it to a playlist without taking it personally, life goes on as usual'},{t:'Read the lyrics closely and analyse the singer’s underlying love story'},{t:'Share it on social media and discuss it with friends or your partner'}]},
      {q:'You see someone posting loved-up photos or dating surprise. you’re more likely to...',options:[{t:'Start planning right away — if they have it, we need it too! Let go there this week!'},{t:'Feel nothing; love does not need to be shown off, we have your own style and rhythm'},{t:'Quietly compare and re-examine the relationship, feeling that you owe your partner — or they owe you'},{t:'Forward it to your partner to see their reaction before deciding what to do'}]},
      {q:'When you are having argument your partner, you’re more likely to...',options:[{t:'Change the subject and leave it for now'},{t:'Take the initiative to explain and talk the problem through'},{t:'Start wondering whether the relationship suits you, and thoughts of breaking up'},{t:'Look back at old chats or photos until half of the anger melts away'}]},
      {q:'One day after class or work, your partner suddenly takes you to a restaurant that is hard to book but you really want to go to. You’re more likely to...',options:[{t:'Deeply moved — this is the most romantic moment of your life!'},{t:'Immediately start thinking about how to plan an equally big surprise next time'},{t:'Feel a little bit annoyed since you would have prepared a better outfit if you had known in advance'},{t:'Surprised, but just enjoy the moment'}]},
      {q:'Your ex suddenly texts you "How have you been?" You’re more likely to...',options:[{t:'Screenshot it and ask your partner how to reply'},{t:'Find out whether they are just bored or actually need something'},{t:'Fill in the gaps with old regrets and every "what if"'},{t:'Delete and block — the past stays in the past'}]},
      {q:'You discover that before the relationship was confirmed, you were just one of many backups for your partner. You’re more likely to...',options:[{t:'Talk it through and explain how you feel first'},{t:'Avoid the topic and process the emotions alone'},{t:'Seek help from others'},{t:'Break up immediately'}]},
      {q:'You text your partner and get no reply all day. You’re more likely to...',options:[{t:'Call them directly or contact their friends'},{t:'They are probably busy; do something else to distract yourself and wait a little longer'},{t:'Reread old messages until your inner monologue explodes: "Don they love me anymore? Are they angry?"'},{t:'They probably forgot — send a sticker or a gentle reminder'}]},
      {q:'What do you think keeps a relationship fresh?',options:[{t:'Regular dates and holiday surprises'},{t:'Keeping your own pace and personal space'},{t:'Sincere late-night talks or confessions of feeling'},{t:'Supporting each other in everyday life'}]},
      {q:'Your partner parents say to you: "Here is ten million — leave my child!" How do you react?',options:[{t:'Accept happily and take the money and run'},{t:'Negotiate upward — surely ten million is not enough?'},{t:'Refuse firmly — our relationship cannot be measured in money!'},{t:'Agree outwardly, accept it in tears, and secretly keep seeing each other'}]},
      {q:'You wake up one day to find your partner has turned into a talking cockroach. What is your first reaction?',options:[{t:'I will love it no matter what!'},{t:'Assess the situation calmly and figure out how to care for it — and whether it can change back'},{t:'Run away in shock and call a lab to take it away'},{t:'Kill it...?'}]}
    ],
    bonus:[
      {q:'Which line moves you more?',options:[{t:'"You will always be my first choice — nothing matters more than you."'},{t:'"Whatever happens, I will face it and solve it with you."'}]},
      {q:'When it comes to phone passwords and social accounts, how do you feel?',options:[{t:'Keep privacy to yourselves; not interfering is the best trust'},{t:'Share passwords and report everything — there can be no secrets between us'}]},
      {q:'Regarding the rhythm of everyday life together, which view do you agree with?',options:[{t:'Days without plans feel empty; having plans and things to look forward to feels like really dating'},{t:'Days without plans are the most comfortable; no need to force anything, feeling at ease matters most'}]}
    ],
    types:{
      DPR:{name:'Love Dreamer',desc:'So what if you are acting? Life is a stage, is it not? You crave romance while fiercely guarding your freedom and boundaries. Alone, you have already staged a whole drama in your head. More than clingy real-life interaction, you savour the bittersweet aftertaste of "almost" — directing and starring in your own little world, self-sufficient, both devoted and detached.',sparkWhy:'They turn your wild little daydreams into real plans, one panel at a time — you do the dreaming, they book the time.',clashWhy:'You need space and boundaries; they give a whole flood of sticky tenderness. One wants to step back, the other to cling — a recipe for sparks.'},
      'DPR-F':{name:'Love Dreamer (Breakup Edition)',desc:'Congratulations — you unlocked the hidden ending! Your inner drama beats anyone, but logic always hits the brakes one step ahead of your heart. When friends cry over relationships, you calmly answer, "Just break up." But when it is your turn, one small deduction and you are already planning your exit — better single and safe than settling for less.',sparkWhy:'They turn your wild little daydreams into real plans, one panel at a time — you do the dreaming, they book the time.',clashWhy:'You need space and boundaries; they give a whole flood of sticky tenderness. One wants to step back, the other to cling — a recipe for sparks.'},
      DPS:{name:'Wild at Heart',desc:'You follow your instincts in love: one spark and you charge ahead, but the slightest hint of being tied down makes you want to run. You live for the rush of a racing heart and hate being boxed in by labels or promises. For you, having loved wildly is enough — why worry about forever?',sparkWhy:'You both hate being boxed in. They will not ask for promises, and you will not be pushed to settle — perfect partners in escape.',clashWhy:'They want rules, progress and answers; the moment they say "let talk," you want to jump out of the car.'},
      DCR:{name:'Pure-Love Warrior',desc:'"How rude — we are pure love, you know." Once you fall, you hand over your heart without reservation. You love to show it off, treat every anniversary like a major event, and keep a rom-com running in your head. For you, love should be grand and dramatic; reason stands no chance against a beating heart.',sparkWhy:'You bring the heart and the fireworks; they turn that passion into a road you can walk for a long time.',clashWhy:'You want every day to be an anniversary; they just want to sit quietly. The gap in intensity invites misunderstanding.'},
      DCS:{name:'The Softie',desc:'Your heart is soft; a single glance or a kind word is enough to make you swoon. You magnify every good thing about the other person and, once smitten, never think of retreat — you only want to warm them with your love. You live in each sincere present moment and will give your all, however hard the road gets.',sparkWhy:'Two soft people together — no need to pretend, and love just flows on its own.',clashWhy:'You want to dive right in; they open a spreadsheet first. Your sincerity looks out of place beside their efficiency.'},
      LPR:{name:'The Overachiever',desc:'Usually rational, independent and clear-headed, you never let emotions steer you — until a holiday or anniversary arrives, when your competitive fire lights up. You believe love needs concrete form: from picking gifts to booking restaurants, nothing is left to chance. Empty promises mean little; you show love through careful planning and tangible details.',sparkWhy:'They supply the romantic imagination; you guard the real-world baseline. Together, it just works.',clashWhy:'You want space and efficiency; they want instant emotional response. The calmer you are, the more insecure they feel.'},
      LPS:{name:'Chill Soul',desc:'Be chill~ In love, you want a pressure-free connection. Independent and pragmatic, you prefer natural companionship over manufactured romance. Like a soft breeze, you walk alongside someone for a while if the mood is right — easy and free is your best state.',sparkWhy:'They pull you forward; you watch the scenery and smile beside them. Surprisingly, your rhythms match.',clashWhy:'Their love is loud, yours is quiet — one wants to be witnessed, the other just wants to stay low-key.'},
      LCR:{name:'The Supervisor',desc:'So... want to be my partner for life? You treat love as a long-term project that needs careful management and care deeply about "our" shared future. You reason things through, make plans, and talk problems out calmly. You may look like a strict supervisor at times, but only because no one wants to make it last more than you do.',sparkWhy:'You see their seriousness; they are moved by your devotion — one steers, the other lights the way.',clashWhy:'You hand out a contract; they see a rope. The more you try to confirm, the more they want to vanish.'},
      LCS:{name:'The Slime',desc:'About turning into a slime: in relationships you have a natural dependence on your partner, yet you are very reasonable. You do not sweat the small stuff and go with the flow, usually smiling along with whatever they want to do. Dating you is stress-free, because you always gently catch whatever shape your partner takes.',sparkWhy:'They approach with warmth, you catch them gently — both of you soften together, comfortably.',clashWhy:'You want to cling; they need to draw the curtain and be alone. Your dependence scares off their imagination.'}
    }
  });

  const zhHant = build('繁體中文','繁');

  return {
    defaultLang:'zh-Hant',
    langs:{'zh-Hant':zhHant, 'zh-Hans':zhHans, 'en':en},
    order:['zh-Hant','zh-Hans','en']
  };
})();
