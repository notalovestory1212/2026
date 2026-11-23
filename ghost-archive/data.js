/* ============================================================
   鬼故有跡 · GAME DATA
   所有史實年份/地點均為設計構想，遊戲內標示「待查／原型示意」。
   ============================================================ */

const GHOSTS = {
  war: {
    name: '戰爭型', theme: '戰場、集體死亡、臨時埋葬',
    sound: '軍靴聲、遠處的金屬碰撞', route: '走廊',
    color: '#9aa7b4', speed: 1.0, mix:['step','step','sigh','paper']
  },
  plague: {
    name: '瘟疫型', theme: '疫症、病人被隔離與標籤',
    sound: '滴水聲、咳嗽聲', route: '窗邊',
    color: '#7fbfc9', speed: 1.0, mix:['sigh','step','paper','sigh']
  },
  institution: {
    name: '制度型', theme: '官署、檔案、行政回應',
    sound: '打字機聲、翻紙聲、印章聲', route: '檔案室',
    color: '#c9a86f', speed: 1.15, mix:['type','paper','type','step']
  },
  unclaimed: {
    name: '無主孤魂型', theme: '沒有後人祭祀的死者、被遺忘的人',
    sound: '極輕的呼吸聲、遠處紙錢焚燒', route: '後樓梯',
    color: '#b7a0cb', speed: 0.78, mix:['sigh','paper','step','sigh']
  }
};

/* 教程地圖：三個任務目標 + 兩個港島例子。只有 target 三個要點開。 */
const TUTORIAL_LOCATIONS = [
  { id:'murray', x:560,y:205, name:'美利樓', era:'1963', rumor:'辦公室怪事與一場法事如何成為新聞', src:'同期報道有據', fear:'制度·他者化', target:true, night:'第一夜任務目標' },
  { id:'high',   x:250,y:165, name:'高街鬼屋', era:'1892—2015', rumor:'同一立面被醫療、電影、保育、古蹟反覆命名', src:'同期報道有據', fear:'污名·記憶', target:true, night:'第二夜任務目標' },
  { id:'wahfu',  x:150,y:440, name:'華富邨', era:'1963—', rumor:'「以前係亂葬崗」指哪一片地方？', src:'後來重述', fear:'無主孤魂', target:true, night:'第三夜任務目標' },
  { id:'hku',    x:105,y:95,  name:'港大校園', era:'1997', rumor:'電梯與午夜問時間的校園禁忌', src:'回歸後記錄', fear:'禁忌', target:false, night:'港島其他鬼故' },
  { id:'happy',  x:505,y:445, name:'跑馬地墳場', era:'1918—', rumor:'馬場大火與墳場的冤魂敘事', src:'時段外背景', fear:'集體死亡', target:false, night:'港島其他鬼故' }
];

const NIGHTS = [
/* ══════════════════════════ NIGHT 1 · 美利樓 ══════════════════════════ */
{
  id:1, name:'美利樓', time:'1963 · 一場法事',
  objective:'1963 年，一場法事怎樣由職員的疑慮，變成公開新聞？',
  learning:'區分證據層級——不要把「有人說」當成「已證實」。',
  ghosts:['institution','war'], intrusions:8,
  rooms:['大堂','走廊','檔案室','後樓梯','天台'],
  summaryLine:'你開始學會追問：這句話是誰說的？有沒有批准人？款項呢？',
  docs:[
    {
      id:'n1a', title:'A01 · 職員報稱辦公室異象', date:'原刊 1963-05-05（由 2019 年回顧節引）',
      source:'M02 報章回顧 · 引 M01', status:'同期報道有據',
      links:[['M02 南華早報回顧','https://www.scmp.com/magazines/post-magazine/short-reads/article/3010485/haunted-hong-kong-murray-house-and-its-ghostly'],['M01 工商日報剪報影像','https://www.ourchinastory.com/images/content/hong-kong/2024/08/OurChinaStory-HongKong-MurrayHouse-Haunted4_x1.jpg']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>英文報道開首：<i>“The former Officers’ Mess at the junction of Garden Road and Queen’s Road East is haunted.”</i><span class="kw" data-kw="職員">差餉估價署職員</span>向報紙講述辦公室遇到的怪事。同一原刊還並論附近的前 HMS Tamar 建築（A03，暫列無坐標）。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>你手上這段是 2019 年回顧文章節引的 1963 年 5 月 5 日原刊，<strong>不是原報本身</strong>。原址在中環今中銀大廈位置（P01），1982 年拆卸，1998 年在赤柱重組（P02）。</p>
<div class="doc-sec">兩者關係</div>
<p>報道能定敘事地點，但不能定某一房間的位置。同一批<span class="kw" data-kw="職員">職員</span>既是政府部門一員，也是傳聞講述者與儀式請求者——要把「<span class="kw" data-kw="職員">職員所述</span>」「記者轉述」「法事」三項分開。</p>
<div class="doc-src">來源：M02（2019 回顧引 1963-05-05 原刊）· M01 · 原報版次與上下文仍待查</div>`
    },
    {
      id:'n1b', title:'A02 · 法事見報', date:'剪報刊期 1963-05-20（據轉載影像圖說）',
      source:'M01 剪報影像 · M03 圖說 · M02 回顧', status:'轉載可讀／原版待核',
      links:[['M01 剪報影像','https://www.ourchinastory.com/images/content/hong-kong/2024/08/OurChinaStory-HongKong-MurrayHouse-Haunted4_x1.jpg'],['M03 當代中國專題','https://www.ourchinastory.com/zh/12494']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>轉載剪報的大字標題：<i>「政府請法師唸經超渡亡魂」</i>。M03 的後來圖說寫到<span class="kw" data-kw="僧人">僧人</span>、壇位、放焰口等細節，並述以公帑支付。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>英文回顧把<span class="kw" data-kw="尋求許可">職員最初尋求許可</span>舉行道教儀式，與後來舉行的佛教<span class="kw" data-kw="法事">法事</span>區分開來。5 月 5 日與 5 月 20 日是兩個不同報道時間，語氣與階段可能有別。</p>
<div class="doc-sec">兩者關係</div>
<p>把「最初建議」和「報道記下的做法」拆成兩張卡。<span class="kw" data-kw="超渡">超渡</span>、<span class="kw" data-kw="驅鬼">驅鬼</span>是報紙與圖說的用詞；<span class="kw" data-kw="公帑">公帑</span>款項、批准人與支付時間，要有獨立檔案才能證實。</p>
<div class="doc-src">來源：M01（1963-05-20 剪報，據轉載影像）· M03 · M02 · 未核版次及原版頁碼</div>`
    },
    {
      id:'n1c', title:'A04 · 另一幢美利樓？1974 年歧異', date:'1974（後述）· 2024 公開帖及其他回憶',
      source:'M05 · M06 · M07 · M08', status:'待查線索',
      links:[['M04 政府地區網站','https://www.gohk.gov.hk/en/spots/spot_detail.php?spot=Stanley+Plaza+and+Murray+House'],['M08 港大停車場圖像','https://digitalrepository.lib.hku.hk/catalog/qn59q948f']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>港故事公開帖在講 1974 年時轉指美利道停車場大廈；Gwulo 有人認為曾有兩次法事，也有讀者以官員照片比對。這些是可追線索，說法各異。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>政府資料證實原址在中環、1982 年拆卸、1998 年赤柱重組；港大圖像（M08）可獨立確認停車場大廈是另一座建築。1963 年報道中的前 HMS Tamar 建築另列 P21，尚未定位。</p>
<div class="doc-sec">兩者關係</div>
<p>1974 另記待查（P03），<strong>不併入</strong> 1963 年美利樓事件。查到 “Murray Building」或「美利大廈」時先核地址、機構與附近標誌，切勿以現名互換。行政細節包括<span class="kw" data-kw="公帑">公帑支付</span>在內，都要回到原件。</p>
<div class="doc-src">來源：M05 · M06 · M07 · M08 · M04 · M09 · M10</div>`
    }
  ],
  textAnalysis:{
    words:[
      {w:'法事',n:14,ctx:['遂向政府部門尋求許可在樓內做<span class="kw" data-kw="法事">法事</span>','其後有<span class="kw" data-kw="法事">法事</span>舉行，語氣各異']},
      {w:'職員',n:11,ctx:['<span class="kw" data-kw="職員">職員</span>透露近來樓內常有異響','多名<span class="kw" data-kw="職員">職員</span>的說法被轉述']},
      {w:'超渡',n:8,ctx:['僧人已到場<span class="kw" data-kw="超渡">超渡</span>','回顧文章使用 superstitious／<span class="kw" data-kw="超渡">超渡</span> 等詞']},
      {w:'公帑',n:5,ctx:['文中一句：「據悉費用由<span class="kw" data-kw="公帑">公帑</span>支付。」','<span class="kw" data-kw="公帑">公帑支付</span>的說法只以「據當年報道」帶過']},
      {w:'尋求許可',n:4,ctx:['<span class="kw" data-kw="尋求許可">尋求許可</span>延請僧人做法事']},
      {w:'驅鬼',n:6,ctx:['並以<span class="kw" data-kw="驅鬼">驅鬼</span>儀式安撫人心']},
      {w:'政府部門',n:3,ctx:['遂向<span class="kw" data-kw="政府部門">政府部門</span>反映']},
      {w:'僧人',n:4,ctx:['<span class="kw" data-kw="僧人">僧人</span>已到場超渡']}
    ],
    clusters:[
      {name:'儀式詞群',size:76,words:'超渡 · 驅鬼 · 法事 · 僧人',target:'法事'},
      {name:'行政詞群',size:58,words:'政府部門 · 尋求許可 · 公帑 · 批准',target:'公帑'},
      {name:'人物詞群',size:64,words:'職員 · 記者 · 讀者 · 管理層',target:'職員'}
    ]
  },
  network:{
    nodes:[
      {id:'clerk',label:'職員',group:'人物',x:0.20,y:0.28},
      {id:'dept',label:'政府部門',group:'人物',x:0.52,y:0.20},
      {id:'monk',label:'僧人',group:'人物',x:0.82,y:0.30},
      {id:'paper',label:'報章',group:'來源',x:0.50,y:0.72}
    ],
    targets:{
      n1n1:[['clerk','dept'],['dept','monk'],['monk','paper']],
      n1n2:[['paper','clerk'],['paper','monk']],
      n1n3:[['paper','dept'],['clerk','paper']]
    }
  },
  report:[
    {title:'發生了甚麼？誰先提出做法事？',steps:[
      {id:'n1t1',type:'text',target:'職員',desc:'在報道中找出職員反映並尋求許可的段落，標明是人物引述、記者轉述，還是後來回顧。',
       evidence:{options:['人物引述','記者轉述','後來回顧','行政細節待查'],answer:'人物引述',hint:'報道寫「據美利樓方面職員透露」——是職員親口說的話被記下來。'}},
      {id:'n1n1',type:'network',desc:'連接「職員、政府部門、僧人、報章」之間的關係。'}
    ]},
    {title:'儀式被怎樣描述？',steps:[
      {id:'n1t2',type:'text',target:'法事',desc:'用關鍵詞（超渡、驅鬼、法事）查看各詞在兩份報道中的上下文。',
       evidence:{options:['人物引述','報章記載','後來回顧','行政細節待查'],answer:'報章記載',hint:'「做法事／超渡／驅鬼」是兩份報章用自己的詞描述的，不是職員原話。'}},
      {id:'n1n2',type:'network',desc:'連接「儀式、報章用詞、說話者」。'}
    ]},
    {title:'「公帑支付」的說法有多少證據？',steps:[
      {id:'n1t3',type:'text',target:'公帑',desc:'追查這句話的出處，把來源分為「職員報稱」「報章記載」「行政細節待查」。',
       evidence:{options:['職員報稱','報章記載','行政細節待查','官方公告'],answer:'行政細節待查',hint:'報道只寫「據悉」，沒有批准人、款項數目或行政程序——查不到就標待查。'}},
      {id:'n1n3',type:'network',desc:'把來源和陳述連線，標示證據到了哪一步（批准人、款項如查不到，標「待查」）。'}
    ]}
  ]
},

/* ══════════════════════════ NIGHT 2 · 高街鬼屋 ══════════════════════════ */
{
  id:2, name:'高街鬼屋', time:'同一座樓 · 多重敘事',
  objective:'同一座樓，為甚麼在不同人口中是不同的東西？',
  learning:'同一個地方有多重敘事；最常被轉述的說法，不一定最能代表曾在那裡生活或接受治療的人。',
  ghosts:['plague','institution'], intrusions:10,
  rooms:['地下門診','二樓病房','長走廊','後樓梯','天台','空置翼','舊病房','頂層'],
  summaryLine:'你發現「鬼屋」這個名字，在不同的檔案裡時而出現、時而缺席。',
  docs:[
    {
      id:'n2a', title:'A05/A06/A07 · 同一立面，五個年代', date:'1892 · 1939 · 1961 · 1971 · 1998 · 2015',
      source:'H01 古蹟辦沿革 · H07 · H09', status:'官方沿革有據',
      links:[['H01 古蹟辦','https://www.amo.gov.hk/tc/historic-buildings/monuments/hong-kong-island/monuments_111/index.html'],['H02 古諮會評估','https://www.aab.gov.hk/filemanager/aab/common/171meeting/AAB_7_2015-16-Annex-C.pdf']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>古蹟辦今天把兩個名稱並列：「此外，大樓又稱為「<span class="kw" data-kw="鬼屋">高街鬼屋</span>」。」稱呼已成為地方介紹的一部分。另有日佔刑場與火警怪聲兩說（A06/A07）。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>1892 醫療人員住所 → 1939 新增女病房 → 1961 改作日間精神科門診 → <strong>1971 年起<span class="kw" data-kw="空置">空置</span></strong> → 1998 重建並保留立面 → 2015 立面列法定古蹟。1993 年 12 月長春社反對改劃用途。</p>
<div class="doc-sec">兩者關係</div>
<p><span class="kw" data-kw="用途">門診用途</span>在 1971 年結束，這是<strong>空置起點</strong>，不是已證火警年。從治療場所到空置建築的轉變，是後世想像得以附着的空間前提。醫療史（H09）提醒：不要拿患者身份作跳嚇，也不要把疾病與危險畫上等號。</p>
<div class="doc-src">來源：H01 · H02 · H07 · H09 · 火警日期與傷亡仍待同期消防新聞</div>`
    },
    {
      id:'n2b', title:'A05 · 電影《大迷信》（1992）分析筆記', date:'1992 年公映 · 片段時間碼待閱片',
      source:'H02 古諮會評估 · H05 電影資料館', status:'媒介線索有據／台詞待核',
      links:[['H05 電影資料館小傳','https://www.filmarchive.gov.hk/documents/6.-Research-and-Publication/06-02-Filmmakers-Search/Chinese/Edward-LI_c.pdf'],['D05 電影資料館搜尋','https://www.filmarchive.gov.hk/en/web/hkfa/advanced_search.html']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>古諮會評估點名高街曾在 1992 年《大迷信》中出現；電影把建築稱作<span class="kw" data-kw="鬼屋">鬼屋</span>，以鏡頭、音效和旁白建構<span class="kw" data-kw="恐怖">恐怖</span>氣氛。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>H05 可核片名與公映年份。影片展示時間與鬼故起源要各自記下；時間碼、逐字台詞與拍攝角度正式製作前仍須閱片補上。</p>
<div class="doc-sec">兩者關係</div>
<p><span class="kw" data-kw="恐怖">恐怖</span>、驚慄、<span class="kw" data-kw="靈異">靈異</span>、<span class="kw" data-kw="鬧鬼">鬧鬼</span>組成一組媒介詞群——a vocabulary of <span class="kw" data-kw="靈異">supernatural</span> dread。觀眾的想像由這些詞引導；它證明影像如何講述高街，<strong>不證明稱呼出現的第一年</strong>。</p>
<div class="doc-src">來源：H02 · H05 · H01 · 尚未核影片內逐字台詞或片段日期</div>`
    },
    {
      id:'n2c', title:'保育與改劃 · 長春社個案', date:'1993-12 反對改劃 · 1994-03 城規會初步考慮',
      source:'H03 長春社印刷頁 69', status:'倡議團體自述',
      links:[['H03 長春社個案 PDF','https://www.cahk.org.hk/upload/subpage3/493/self/62a0259b4d233.pdf']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>倡議團體的自述：<i>“called for conservation of the block”</i>——它要求保留建築。保育論述聚焦<span class="kw" data-kw="建築價值">建築價值</span>、歷史意義與<span class="kw" data-kw="社區">社區</span>記憶。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>1993 年 12 月反對改劃用途；1994 年 3 月城規會初步考慮。1998 年重建開始。1996 年方案與區議會角色若入敘事，先把 H07 刊物說法註明為回顧。</p>
<div class="doc-sec">兩者關係</div>
<p>保育文本中<strong>沒有</strong>出現「<span class="kw" data-kw="鬼屋">鬼屋</span>」一詞。要把「鬼故促成保育」寫成結論，還需要能連接保育行動與鬼屋稱號的原始文件——並置本身不是因果。</p>
<div class="doc-src">來源：H03（印刷頁 69）· H07 · H01</div>`
    },
    {
      id:'n2d', title:'官方與集體記憶 · 2015', date:'2015 年 · 古蹟人員訪問',
      source:'H04 政府新聞網', status:'官方說法有據',
      links:[['H04 政府新聞網','https://www.news.gov.hk/en/categories/health/html/2015/12/20151217_155648.shtml']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>2015 年政府新聞網訪問古蹟人員：<i>“if we're talking about collective memory or social values”</i>——把鬼屋稱號放進集體記憶與社會價值，而不是驗證傳聞。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>同一年，高街舊精神病院立面成為法定古蹟。官方介紹把建築定位為古蹟，描述其<span class="kw" data-kw="建築價值">建築價值</span>。</p>
<div class="doc-sec">兩者關係</div>
<p>要和 H01 並置，明確區別「官方<strong>提到</strong>某種說法」與「官方<strong>證實</strong>說法所指的事件」。官方文本同樣<strong>沒有</strong>使用「<span class="kw" data-kw="鬼屋">鬼屋</span>」這個稱呼——最常被轉述的說法，不一定最能代表曾在那裡生活或接受治療的人。</p>
<div class="doc-src">來源：H04 · H01 · H02 · H05</div>`
    }
  ],
  textAnalysis:{
    words:[
      {w:'鬼屋',n:18,ctx:['電影把建築稱作<span class="kw" data-kw="鬼屋">鬼屋</span>','保育文本中沒有出現「<span class="kw" data-kw="鬼屋">鬼屋</span>」一詞']},
      {w:'恐怖',n:12,ctx:['詞語包括：<span class="kw" data-kw="恐怖">恐怖</span>、驚慄、靈異','<span class="kw" data-kw="恐怖">恐怖</span>氣氛由鏡頭與音效建構']},
      {w:'靈異',n:11,ctx:['<span class="kw" data-kw="靈異">靈異</span>、鬧鬼、鬼屋','a vocabulary of <span class="kw" data-kw="靈異">supernatural</span> dread']},
      {w:'建築價值',n:7,ctx:['保育論述聚焦<span class="kw" data-kw="建築價值">建築價值</span>、歷史意義','官方描述其<span class="kw" data-kw="建築價值">建築價值</span>與歷史']},
      {w:'用途',n:6,ctx:['<span class="kw" data-kw="用途">門診用途</span>於 1971 年結束']},
      {w:'社區',n:5,ctx:['歷史意義與<span class="kw" data-kw="社區">社區</span>記憶']},
      {w:'空置',n:4,ctx:['其後建築<span class="kw" data-kw="空置">空置</span>']}
    ],
    clusters:[
      {name:'電影詞群',size:88,words:'鬼屋 · 恐怖 · 驚慄 · 靈異 · 鬧鬼',target:'恐怖'},
      {name:'保育詞群',size:54,words:'建築價值 · 歷史 · 社區 · 保育',target:'建築價值'},
      {name:'官方詞群',size:47,words:'古蹟 · 建築價值 · 歷史 · 描述',target:'建築價值'}
    ]
  },
  network:{
    nodes:[
      {id:'film',label:'電影《大迷信》',group:'來源',x:0.18,y:0.24},
      {id:'ghostname',label:'「鬼屋」稱呼',group:'概念',x:0.52,y:0.20},
      {id:'audience',label:'觀眾想像',group:'人物',x:0.84,y:0.32},
      {id:'conserve',label:'保育倡議者',group:'人物',x:0.20,y:0.70},
      {id:'official',label:'官方',group:'人物',x:0.50,y:0.82},
      {id:'value',label:'建築價值',group:'概念',x:0.80,y:0.70},
      {id:'year',label:'1971',group:'來源',x:0.50,y:0.50}
    ],
    targets:{
      n2n1:[['year','film'],['year','conserve'],['year','official']],
      n2n2:[['film','ghostname'],['ghostname','audience']],
      n2n3:[['conserve','official'],['official','value'],['conserve','value']]
    }
  },
  report:[
    {title:'這座樓曾經是甚麼？',steps:[
      {id:'n2t1',type:'text',target:'用途',desc:'從建築與用途資料中整理年代和用途。',
       evidence:{options:['建築紀錄','電影敘事','街坊口述','官方宣傳'],answer:'建築紀錄',hint:'「1971 年門診用途結束」出自建築與用途資料，不是電影或口述。'}},
      {id:'n2n1',type:'network',desc:'把年份節點連到對應的來源。'}
    ]},
    {title:'電影怎樣說它？',steps:[
      {id:'n2t2',type:'text',target:'恐怖',desc:'（VOSviewer 式聚類）把電影文本的詞語拖入聚類圖，觀察靈與恐怖相關詞群。',
       evidence:{options:['建築紀錄','電影敘事','保育倡議','官方古蹟介紹'],answer:'電影敘事',hint:'「恐怖、驚慄、鬧鬼」是電影《大迷信》的詞群，不是建築紀錄的用語。'}},
      {id:'n2n2',type:'network',desc:'連接「電影、鬼屋稱呼、觀眾想像」。'}
    ]},
    {title:'保育與官方怎樣說它？',steps:[
      {id:'n2t3',type:'text',target:'建築價值',desc:'把保育資料和官方介紹的詞語另成兩個詞群，與電影詞群對比。',
       evidence:{options:['電影敘事','保育與官方敘述','街坊口述','報章記載'],answer:'保育與官方敘述',hint:'「建築價值」出現在長春社保育資料與官方古蹟介紹，電影文本沒有。'}},
      {id:'n2n3',type:'network',desc:'連接「保育倡議者、官方、建築價值、社區」，並標出「鬼屋」一詞在哪些來源出現、哪些缺席。'}
    ]}
  ]
},

/* ══════════════════════════ NIGHT 3 · 華富邨 ══════════════════════════ */
{
  id:3, name:'華富邨', time:'地方記憶的備份',
  objective:'街坊口中的「以前係亂葬崗」，究竟指哪一片地方？最後把三個個案連在一起。',
  learning:'公共建設改變地貌後，鬼故如何成為地方記憶的備份；沒有後人祭祀的死者，為何最容易變成鬼。',
  ghosts:['unclaimed','war','institution','plague'], intrusions:12,
  rooms:['華富一邨','華富二邨','瀑布灣通道','雞籠灣','巴士總站','舊墳場範圍','後樓梯','天台','長走廊'],
  summaryLine:'三個個案浮現同一個模式：被當作「不屬於我們的人」，最後都變成了鬼。',
  docs:[
    {
      id:'n3a', title:'A08/A09/A11 · 街坊回憶與瀑布灣', date:'2016-08-07 訪問 · 受訪者 1968 年遷入',
      source:'W03 香港01 街坊訪問 · W10', status:'事後回憶（刊載／入住年份不同）',
      links:[['W03 香港01 訪問','https://www.hk01.com/%E7%A4%BE%E5%8D%80%E5%B0%88%E9%A1%8C/35496/%E7%80%91%E5%B8%83%E7%81%A3%E6%9C%89%E6%B0%B4%E9%AC%BC-%E8%8F%AF%E5%AF%8C%E9%82%A8%E5%89%8D%E8%BA%AB%E7%AB%9F%E6%98%AF%E4%BA%82%E8%91%AC%E5%B4%97-%E8%88%8A%E8%A1%97%E5%9D%8A%E7%B4%B0%E8%AA%AA%E8%88%87%E9%AC%BC%E5%90%8C%E8%A1%8C%E7%9A%84%E6%AD%B2%E6%9C%88'],['W10 地方志·扶林飛瀑','https://hkchronicles.org.hk/%E5%BF%97%E8%B6%A3%E5%8F%A4%E4%BB%8A/%E5%BF%97%E5%BD%B1%E9%99%A2/%E8%8F%AF%E5%AF%8C%E9%82%A8%E4%B8%AD_%E6%89%B6%E6%9E%97%E9%A3%9B%E7%80%91']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>早期居民回憶：<i>「早期入去好陰森，沒有路燈。」</i>多位街坊提及「<span class="kw" data-kw="亂葬崗">以前係亂葬崗</span>」，但位置說法不一。步操與升降機傳聞只標 P05（哪一座樓、哪一層未知）；瀑布灣水鬼用 P07 作海灣參考點。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>文章 2016 年刊出，兩位受訪者 1968 年搬入；房委會口述（W04）記 1967 年開始入伙；清墳與建邨的歷史錨點在 1963 年（W01）。<strong>2016 是刊載年，1968 是入住年</strong>，兩者不能混用。</p>
<div class="doc-sec">兩者關係</div>
<p>文章同時記他們珍惜獨立廚廁和生活空間——同一地方既是家，也是夜間聽故事的場景。「地方有鬼」這句話，容易掩蓋人的日常生活。口述要與航拍、地貌、文獻互相核對，不能直接當成地圖上的一點。</p>
<div class="doc-src">來源：W03 · W06 · W04 · W10 · 故事年份沒有逐宗核實</div>`
    },
    {
      id:'n3b', title:'A11 · 墳地、農地與 1963 航拍', date:'1949／1963 航拍配舊地圖',
      source:'W01 港大華富研究 · W02 梁啟智判讀 · D06/D07', status:'歷史錨點有據／範圍待數碼化',
      links:[['W01 History before Wah Fu','https://wahfuestate.hku.hk/history-before-wah-fu/'],['W02 梁啟智文章','https://www.inmediahk.net/node/%E7%A4%BE%E5%8D%80/%E8%8F%AF%E5%AF%8C%E9%82%A8%E4%BB%A5%E5%89%8D%E7%9C%9F%E7%9A%84%E6%98%AF%E4%BA%82%E8%91%AC%E5%B4%97%E5%97%8E%EF%BC%9F']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>「The clearance of the remaining graves at Kellett Bay began in July 1963.」對照梁啟智的判讀：<i>「北面有相當廣闊的地段一直以來都是農地。」</i>「整個華富邨都是亂葬崗」的概括因此受到挑戰。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>1963 是<strong>清墳與建邨的歷史錨點</strong>，不代表故事開始。<span class="kw" data-kw="地名">華富一邨、華富二邨、瀑布灣、雞籠灣</span>各有不同地景；雞籠灣舊墳場範圍（P08）仍待數碼化。</p>
<div class="doc-sec">兩者關係</div>
<p>切換「歷史航拍／今日屋邨／資料支持範圍」三個圖層，圈出<strong>有資料支持</strong>的範圍。航拍所見梯級與植被要配合有日期、圖例與圖幅號的圖幅；局部不明地段用斜線或虛線表示。海灣與地名是代表位置，不是事故坐標。</p>
<div class="doc-src">來源：W01 · W02 · W04 · W07 · W09 · D06 · D07</div>`
    },
    {
      id:'n3c', title:'A10 · 總站石棺：兩個版本', date:'1960 年代是傳聞設定，非發現年份',
      source:'W05 公開帖 · S19 · W02', status:'待查線索',
      links:[['W05 石棺公開帖','https://www.facebook.com/papasighstheworld/posts/pfbid0RNHeAV8DwMZvh21YHEWKCLkvHaFDHpRQ69CTAaSKX96sivVuFN54eLXDiUhD9niml'],['S19 當代中國華富','https://www.ourchinastory.com/zh/12406']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>公開帖並列兩種說法：石棺被封存，以及把水泥構件誤看成石棺。同帖呈現的版本互相競爭，年份未核。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>華富邨巴士總站（P06）可定位；石棺、牆體或工程位置不能。現時沒有工程原件，1960 年代只是傳聞的設定年代。</p>
<div class="doc-sec">兩者關係</div>
<p>要挑一件可進一步驗證的材料：工程圖或可靠訪談，而不是公關帖。避免打上「石棺在此」的精確圖釘；<span class="kw" data-kw="遷葬">遷葬</span>傳聞與建邨工程要分開處理，不要把猜測當成多一份獨立證據。</p>
<div class="doc-src">來源：W05 · S19 · W02 · 無工程原件</div>`
    },
    {
      id:'n3d', title:'跨個案 · 三夜累積的關鍵詞', date:'綜合前兩夜與本夜檔案',
      source:'M / H / W 系列 + R01–R08 理論', status:'小樣本比較論點',
      links:[['R01 Bosco 香港青年鬼故','https://doi.org/10.1111/j.1540-5931.2007.00454.x'],['R08 Stoler 殖民檔案','https://press.princeton.edu/books/paperback/9780691146362/along-the-archival-grain']],
      body:`<div class="doc-sec">有甚麼傳聞</div>
<p>三個個案共通的詞：<span class="kw" data-kw="殖民">殖民</span>、<span class="kw" data-kw="疫症">疫症</span>、<span class="kw" data-kw="戰爭">戰爭</span>、<span class="kw" data-kw="遷葬">遷葬</span>、<span class="kw" data-kw="無主孤魂">無主孤魂</span>、<span class="kw" data-kw="禁忌">禁忌</span>。恐懼總是指向被標記為「他者」的人。</p>
<div class="doc-sec">地方的歷史變遷</div>
<p>晚期殖民香港的鬼故常借城市空間的變化而流傳：宗教回應可進入政府工作場所，保育與電影使同一座樓獲得多種公共形象，公共屋邨的前史經居民敘事重新被理解。</p>
<div class="doc-sec">兩者關係</div>
<p>沒有後人祭祀的死者，最容易變成<span class="kw" data-kw="無主孤魂">無主孤魂</span>。這是本組的小樣本比較論點；個別因果需各有史料支撐，不能把三個案當成三份Independent證據。</p>
<div class="doc-src">來源：M · H · W 系列 · R01–R08（小樣本，因果待各案支撐）</div>`
    }
  ],
  map:{
    regions:[
      {id:'estate1',label:'華富一邨',x:0.30,y:0.34},
      {id:'estate2',label:'華富二邨',x:0.55,y:0.30},
      {id:'fall',label:'瀑布灣',x:0.34,y:0.72},
      {id:'coop',label:'雞籠灣',x:0.68,y:0.66}
    ],
    layers:['歷史航拍','今日屋邨','資料支持範圍'],
    answer:'fall', evidence:'部分地段'
  },
  textAnalysis:{
    words:[
      {w:'無主孤魂',n:16,ctx:['三個個案共通的詞：<span class="kw" data-kw="無主孤魂">無主孤魂</span>','沒有後人祭祀的死者，最容易變成<span class="kw" data-kw="無主孤魂">無主孤魂</span>']},
      {w:'殖民',n:13,ctx:['<span class="kw" data-kw="殖民">殖民</span>、疫症、戰爭、遷葬']},
      {w:'亂葬崗',n:11,ctx:['街坊提及「以前係<span class="kw" data-kw="亂葬崗">亂葬崗</span>」']},
      {w:'疫症',n:9,ctx:['<span class="kw" data-kw="疫症">疫症</span>、病人被隔離與標籤']},
      {w:'遷葬',n:8,ctx:['戰爭、<span class="kw" data-kw="遷葬">遷葬</span>、無主孤魂']},
      {w:'禁忌',n:7,ctx:['<span class="kw" data-kw="禁忌">禁忌</span>、民俗畏懼']},
      {w:'地名',n:6,ctx:['<span class="kw" data-kw="地名">華富一邨、華富二邨、瀑布灣、雞籠灣</span>']},
      {w:'戰爭',n:10,ctx:['<span class="kw" data-kw="戰爭">戰爭</span>、集體死亡、臨時埋葬']}
    ],
    clusters:[
      {name:'死亡與記憶',size:92,words:'無主孤魂 · 遷葬 · 亂葬崗 · 禁忌',target:'無主孤魂'},
      {name:'制度與標記',size:70,words:'殖民 · 疫症 · 戰爭 · 檔案',target:'殖民'}
    ]
  },
  network:{
    nodes:[
      {id:'colonial',label:'殖民',group:'概念',x:0.16,y:0.22},
      {id:'plaguew',label:'疫症',group:'概念',x:0.42,y:0.16},
      {id:'warw',label:'戰爭',group:'概念',x:0.70,y:0.22},
      {id:'burial',label:'遷葬',group:'概念',x:0.84,y:0.52},
      {id:'ghostw',label:'無主孤魂',group:'概念',x:0.60,y:0.74},
      {id:'taboo',label:'禁忌',group:'概念',x:0.32,y:0.78},
      {id:'other',label:'他者化',group:'概念',x:0.46,y:0.48},
      {id:'rumor',label:'街坊傳聞',group:'來源',x:0.16,y:0.60},
      {id:'place',label:'地名',group:'來源',x:0.76,y:0.90}
    ],
    targets:{
      n3n1:[['rumor','place']],
      n3n2:[['rumor','ghostw'],['place','ghostw']],
      n3n3:[['colonial','other'],['plaguew','other'],['warw','other'],['other','ghostw'],['ghostw','taboo'],['burial','ghostw']]
    }
  },
  report:[
    {title:'傳聞指的是哪一片地方？',steps:[
      {id:'n3t1',type:'map',target:'fall',desc:'切換三個圖層，在地圖上圈出傳聞可能所指的範圍。'},
      {id:'n3n1',type:'network',desc:'把地名與傳聞連線。'}
    ]},
    {title:'證據支持到哪裡？',steps:[
      {id:'n3t2',type:'map',target:'部分地段',desc:'選擇「整個屋邨／部分地段／資料仍不足」，按「看地圖證據」核對文獻、地貌與回憶各自支持多少。'},
      {id:'n3n2',type:'network',desc:'把來源按證據強弱分級連線。'}
    ]},
    {title:'三個個案有甚麼共通點？',steps:[
      {id:'n3t3',type:'text',target:'無主孤魂',desc:'開放跨個案的關鍵詞，找出共同模式。',
       evidence:{options:['單一街坊口述','跨個案文本分析','官方古蹟介紹','電影文本'],answer:'跨個案文本分析',hint:'這是把三夜檔案的詞連起來後得出的共同模式，不是任何單一來源的說法。'}},
      {id:'n3n3',type:'network',desc:'（Gephi 式大型網絡）把殖民、疫症、戰爭、遷葬、無主孤魂、禁忌連起來。'}
    ]}
  ]
}
];

/* 死亡教育提示——按誤讀來源隨機/輪替 */
const DEATH_NOTES = [
  {title:'你將一個講法當咗事實。',quote:'「政府請法師唸經超渡亡魂」——誰說的？批准人呢？款項呢？（M01 剪報標題／M03 圖說）',body:'剪報證明「有這則報道」，不證明行政程序。把它當成已證實的事實，正是制度型鬼最愛的縫隙。'},
  {title:'你把轉述當成了原刊。',quote:'“The former Officers’ Mess … is haunted.” ——你讀到的是 2019 年回顧節引，不是 1963-05-05 原報。（M02）',body:'回顧文章與原始報道是兩種證據。標明日期與來源類型，是研究的基本功夫。'},
  {title:'你把最受歡迎的說法當成唯一的事實。',quote:'「此外，大樓又稱為「高街鬼屋」。」——古蹟辦並列稱呼；保育與官方文本卻沒有用這個詞。（H01／H03／H04）',body:'最常被轉述的說法，不一定最能代表曾在那裡生活或接受治療的人。'},
  {title:'你把回憶當成了座標。',quote:'「The clearance of the remaining graves at Kellett Bay began in July 1963.」——這是清墳年份，不是「鬼故從此開始」。（W01）',body:'口述記憶需要與航拍、地貌、文獻互相核對，不能直接當成地圖上的一點。'},
  {title:'你忘記問：是誰被當成「不屬於我們的人」。',quote:'殖民 · 疫症 · 戰爭 · 無主孤魂——恐懼總是指向被標記的他者。',body:'鬼故不只是恐怖故事，也是社會如何劃出「我們」與「他們」的紀錄。'}
];

const ENDINGS = {
  A:{title:'驅除',body:`你用結界與法事把鬼全部趕走，保安室恢復平靜。<br><br>但檔案室裡未完成的報告被封存，那些故事再次沒有人記錄。<br><span class="eb-note">不了解，就只能驅趕。</span>`},
  B:{title:'安魂',body:`你不再驅趕，而是把完整的調查報告寫入檔案，標明出處與不確定之處。<br><br>鬼的聲音變成檔案裡的錄音與名字，不再是怪物。<br><br>這不是「與鬼和解」，而是承認這些人和這些事曾經存在，並留下可查證的紀錄。<br><span class="eb-note">18 / 18 · 全部結論均有來源與證據層級</span>`}
};


/* ============================================================
   逐步教程：在實際遊戲介面上操作才會前進
   wait 對應 game.js 的 tutorialAction(key)
   narration = 粵語旁白文字（原型以合成音效＋文字呈現）
   ============================================================ */
const TUTORIAL_STEPS = [
  {
    id:'welcome', wait:'next',
    title:'你是鬼故調查員',
    narration:'喂，聽到嗎？你係新嚟嘅特派調查員。呢度係港島鬼故檔案室。由聽晚開始，你要入去三座建築守夜，同時查清楚啲鬼故點樣嚟。',
    body:'你是剛抵達的<strong>特派鬼故調查員</strong>。表面是保安，實際要查清三則港島鬼故的起源、背景與人文脈絡。教程只有八步；面板遮住畫面可按「－ 收起」或拖曳，趕時間可跳過。',
    action:'按「下一步」開始。'
  },
  {
    id:'comp-on', wait:'comp-on',
    title:'① 先開右側檔案電腦',
    narration:'右邊部電腦係你嘅檔案室——報告、檔案、地圖、文字分析、關係網絡都喺入面。',
    body:'右側是<strong>檔案電腦面板</strong>：報告、檔案、地圖、文字分析、關係網絡都在這裡。開著會加快耗電，有自己的開／關。',
    action:'👉 點主場景的綠色螢幕、下方「💻 展開電腦」，或右側面板的「開」。'
  },
  {
    id:'maploc', wait:'maploc',
    title:'② 在地圖認清三晚任務',
    narration:'先認地方。美利樓、高街鬼屋、華富邨——呢三處就係你接下來三晚要守住嘅建築。',
    body:'「地圖」分頁是 QGIS 示意圖。點開<strong>美利樓、高街鬼屋、華富邨</strong>三個任務目標，每點一個就解鎖一張檔案卡，標明年代、傳聞、來源狀態與恐懼類別。其餘地點是港島其他例子。',
    action:'👉 點「地圖」分頁，再點三個任務目標地點。'
  },
  {
    id:'report', wait:'tab:report',
    title:'③ 完成調查報告',
    narration:'每晚要交報告：傳聞係咩？地方有咩變遷？兩者點樣連埋一齊？',
    body:'每晚的<strong>調查報告</strong>有三個結論、六個任務，圍繞「有甚麼傳聞？」「地方歷史怎樣變？」「兩者關係？」你要到檔案、地圖、文字、網絡分頁逐項完成。三晚合共 18 項，全部完成才能選「安魂」結局。',
    action:'👉 點「報告」分頁，看看六個任務。'
  },
  {
    id:'cam-on', wait:'cam-on',
    title:'④ 展開左側監控',
    narration:'左邊係監控。聽到聲先開，唔使一日到夜開住。',
    body:'左側是<strong>監控面板</strong>，尺寸固定不變。平面圖上每個房間都可點開影像；紅點是鬼的位置。它和右側電腦<strong>可以同時開著</strong>，各自開關。',
    action:'👉 點藍色螢幕、下方「📷 展開監控」，或左側面板的「開」。'
  },
  {
    id:'room', wait:'room',
    title:'⑤ 點房間找紅點',
    body:'點平面圖上任何一個房間，才會出現該房間影像。<strong>每晚平面圖都不同，而且愈來愈大</strong>：第一夜辦公室、第二夜院舍、第三夜屋邨。鬼會在房間間游移，位置飄忽。',
    action:'👉 點平面圖上任一個房間。'
  },
  {
    id:'ward', wait:'ward',
    title:'⑥ 見到影子就按桌上的「界」',
    narration:'聲音由疏到密、由細到大，就係佢越行越近。見到門或者窗有影——即刻撳枱面個「界」！',
    body:'不同聲音會混在一起：腳步、翻紙、打字、嘆息。遠時稀疏細碎，近時密集大聲，最後才會 jumpscare。鬼到門窗時你會看到影子（若被面板遮住，先關掉那一側）；按<strong>桌面上唯一的「界」</strong>——扣 2% 電、10 秒、擋一次，<strong>護住整間保安室</strong>。',
    action:'👉 點桌上圓形的「界」。'
  },
  {
    id:'done', wait:'next',
    title:'準備好了',
    narration:'好，記住：聽聲、開監控逐房間搵；見到影就撳枱面個界。六分鐘，好好運用手上嘅電。',
    body:'完整循環：<strong>聽聲找鬼 → 開監控點房間 → 關掉被影子遮住的那側面板 → 按桌上的「界」護全室 → 繼續做研究</strong>。只開一個設備 ×1.3 耗電，兩個都開 ×1.5。一晚 6 分鐘。',
    action:'按「下一步」開始第一夜 · 美利樓。'
  }
];

