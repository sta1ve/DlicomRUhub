// CURSOR
const cur = document.getElementById('cur');
const cring = document.getElementById('cring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = (mx - 3) + 'px';
  cur.style.top = (my - 3) + 'px';
});

(function animateRing() {
  rx += (mx - rx - 14) * 0.1;
  ry += (my - ry - 14) * 0.1;
  cring.style.left = rx + 'px';
  cring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
})();

// Scale cursor on interactive elements — but keep system cursor hidden
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'scale(3)';
    cring.style.borderColor = 'rgba(0,200,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'scale(1)';
    cring.style.borderColor = 'rgba(0,200,255,0.5)';
  });
});


// 3D GEM SCENE
(function initThree() {
  const canvas = document.getElementById('threeCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 8;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function makeCrystal(color1, color2) {
    const group = new THREE.Group();
    const geo = new THREE.OctahedronGeometry(1.2, 0);
    geo.scale(0.7, 1.4, 0.7);
    const mat = new THREE.MeshPhongMaterial({
      color: color1, transparent: true, opacity: 0.85,
      shininess: 200, specular: new THREE.Color(0xffffff)
    });
    group.add(new THREE.Mesh(geo, mat));
    const wmat = new THREE.MeshBasicMaterial({ color: color2, wireframe: true, transparent: true, opacity: 0.25 });
    const wmesh = new THREE.Mesh(geo.clone(), wmat);
    wmesh.scale.set(1.02, 1.02, 1.02);
    group.add(wmesh);
    return group;
  }

  scene.add(new THREE.AmbientLight(0x111133, 2));
  const dl1 = new THREE.DirectionalLight(0x1a6fff, 4);
  dl1.position.set(2, 3, 2); scene.add(dl1);
  const dl2 = new THREE.DirectionalLight(0x00c8ff, 3);
  dl2.position.set(-2, -1, 1); scene.add(dl2);
  const dl3 = new THREE.DirectionalLight(0x5b2cf0, 2);
  dl3.position.set(0, 2, -2); scene.add(dl3);

  const gemL = makeCrystal(0x1a6fff, 0x00c8ff);
  gemL.position.set(-5.5, 0, 0);
  gemL.scale.set(1.4, 1.4, 1.4);
  scene.add(gemL);

  const gemR = makeCrystal(0x5b2cf0, 0xa78bfa);
  gemR.position.set(5.5, 0, 0);
  gemR.scale.set(1.2, 1.2, 1.2);
  scene.add(gemR);

  const smallColors = [[0x00c8ff, 0x1a6fff], [0x5b2cf0, 0xec4899], [0x1a6fff, 0x5b2cf0]];
  const smalls = [];
  smallColors.forEach((c, i) => {
    const g = makeCrystal(c[0], c[1]);
    const side = i % 2 === 0 ? -1 : 1;
    g.position.set(side * (3 + i * 0.8), (i - 1) * 1.5, -1);
    g.scale.set(0.4, 0.4, 0.4);
    scene.add(g);
    smalls.push({ mesh: g, speed: 0.3 + i * 0.1, offset: i * 2 });
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    gemL.rotation.y = t * 0.4;
    gemL.rotation.x = Math.sin(t * 0.3) * 0.2;
    gemL.position.y = Math.sin(t * 0.5) * 0.3;

    gemR.rotation.y = -t * 0.35;
    gemR.rotation.x = Math.cos(t * 0.25) * 0.15;
    gemR.position.y = Math.cos(t * 0.45) * 0.3;

    smalls.forEach(s => {
      s.mesh.rotation.y += 0.01 * s.speed;
      s.mesh.rotation.x += 0.007 * s.speed;
      s.mesh.position.y += Math.sin(t * s.speed + s.offset) * 0.003;
    });

    renderer.render(scene, camera);
  }
  animate();
})();


// FAQ TOGGLE
function toggle(el) {
  el.parentElement.classList.toggle('open');
}


// TRANSLATIONS
const translations = {
  en: {
    nav_sub:'Community Hub', nav_about:'About', nav_roles:'Roles', nav_token:'Token', nav_team:'Team',
    hero_tag:'🌍 Global Community',
    hero_sub:'Everything about <strong>Dlicom</strong> — a decentralized platform with DeFi, crypto wallet and social network. Guides, FAQ and news for the global community.',
    hero_btn1:'↗ Join Discord', hero_btn2:'Project Website', scroll:'scroll',
    stat_token:'Token', stat_platform:'Platform', stat_standard:'Standard',
    mascot_title:'Meet Dili', mascot_desc:'The official Dlicom mascot — the face of SocialFi. Create a story, lore or concept about him and earn the <strong>Dliever</strong> role. Any format: text, video, art.', mascot_btn:'Branding →',
    feat1_title:'Social Network', feat1_desc:'Publish posts, chat in encrypted messages, earn tips in DLI tokens. A censorship-resistant alternative to traditional social networks.',
    feat2_title:'Crypto Wallet', feat2_desc:'Self-custody wallet with crypto and NFT support. Best-rate swaps, pay gas fees with DLI tokens, send directly in chat.',
    feat3_title:'DeFi & Staking', feat3_desc:'Stake DLI tokens for USDT rewards. Multiple periods available. Access dApps via built-in Web3 browser.',
    step1_title:'Download the App', step1_desc:'Available on <a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> and <a href="https://play.google.com/store/search?q=dlicom&c=apps" target="_blank">Google Play</a>. Developer: Shlenpower Pte. Ltd.',
    step2_title:'Create a Wallet', step2_desc:'During registration, create a new wallet or import an existing one. Save your seed phrase in a safe place — recovery without it is impossible.',
    step3_title:'Join Discord', step3_desc:'Join the <a href="https://discord.gg/BmYmRXc8" target="_blank">official server</a>. Choose your region to unlock the right channels.',
    step4_title:'Become an Active Member', step4_desc:'Participate in activities, help newcomers, join the Regional Hunt — earn Dliever, Dcoded and DCO roles.',
    hunt_title:'Become Regional Lead or Mod', hunt_desc:'The moment anyone can become a leader of their region. Work with the team, earn roles and shape the community. Right now — no moderators, no leads. The spot is open.',
    hunt_apply:'Apply Now', hunt_discord:'Go to Discord',
    phase1_label:'Phase 1', phase1_title:'Make Your Mark', phase1_desc:'Initial selection. Nominations channel opens.', phase1_li1:'10 Dliever roles', phase1_li2:'Nominations open',
    phase2_label:'Phase 2', phase2_title:'Trial Period', phase2_desc:'Top 5 candidates start working with the team. Only Dlievers can earn Dcoded.', phase2_li1:'5 Dcoded roles', phase2_li2:'Team collaboration',
    phase3_label:'Phase 3', phase3_title:'Final', phase3_desc:'Leaders and mods receive roles and permissions. Finalists list is published.', phase3_li1:'1 DCO role', phase3_li2:'Results published',
    role1_desc:'Pioneers who proved their reliability and knowledge of Dlicom. The most sought-after base role — the start of everything.',
    role2_desc:'Active and dedicated members — an example for newcomers. Requires Dliever role.',
    role3_desc:'Dlicom Contribution Officer. The rarest role. Requires Dcoded + server tag.',
    role4_desc:'Legendary first 1000 users. Airdrop boost, bonus XP. No longer awarded.',
    rule1_title:'Prohibited', rule1_desc:'Politics, racism, discrimination. NSFW content. Spam and self-promotion. Off-topic in themed channels.',
    rule2_title:'Welcome', rule2_desc:'Help newcomers, grow yourself, build connections. Turn ideas into action. Be yourself.',
    rule3_title:'Beware of Scams', rule3_desc:'The Dlicom team will <strong>never message you first in DMs</strong>. Always verify.',
    rule4_title:'Community Principle', rule4_desc:'Value is everything. The <strong>#creators</strong> channel is the most reliable way to earn a role.',
    tok_standard:'Standard', tok_supply:'Total Supply', tok_price:'Initial Price', tok_circ:'Initial Circulation', tok_cap:'Initial Market Cap', tok_lp:'Liquidity Pool', tok_vest:'Vesting',
    faq1_q:'How to become Regional Lead?', faq1_a:'1. Fill out the <a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">application form</a>. 2. In Discord, choose your region. 3. Actively participate in all three phases (25 Feb — 18 Mar).',
    faq2_q:'Is Dliever required to join the Regional Hunt?', faq2_a:'No. Dliever is not required to apply. But active participants earn it automatically and have priority in selection.',
    faq3_q:'What is the DLI token?', faq3_a:'DLI is Dlicom\'s native token on Ethereum. Used for: sending crypto in chat, tips, gas payments, staking with USDT rewards, and voting.',
    faq4_q:'Is KYC required?', faq4_a:'No. Dlicom is a fully decentralized project operating as a DEX. No KYC required. Profiles are based on Ethereum addresses.',
    faq5_q:'What is the Dili mascot contest?', faq5_a:'Create a story, lore or concept about Dili (text, video, art). The best 10 ideas earn the Dliever role. Publish in <code>#creators</code>, quoting the <a href="https://x.com/DlicomApp/status/2023744462434783676" target="_blank">X post</a>.',
    faq6_q:'How to earn on the platform?', faq6_a:'<code>Staking</code> — DLI for USDT rewards. <code>Content</code> — tips from followers. <code>Referrals</code> — invite via your code.',
    faq7_q:'Can I apply for Regional Lead directly, skipping Helper?', faq7_a:'Yes. By applying for Regional Lead, you automatically become a candidate for Regional Helper as well.',
    faq8_q:'Why is now the best time to join?', faq8_a:'It\'s the earliest stage — no moderators, no leads in regions yet. Starting from zero right now is the best window to become a Regional Lead or Helper.',
    cta_title:'Ready to join the Community Hub?', cta_desc:'Join Discord, choose your region and participate in the Regional Hunt', cta_btn1:'↗ Open Discord', cta_btn2:'Apply Now',
    footer_brand:'Community Hub · Unofficial Resource', footer_apply:'Application Form', footer_discord:'Join the Server',
    news_badge_new:'NEW', news_badge_phase1:'PHASE 1', news_badge_info:'INFO',
    news_tag_announce:'📣 Announcement', news_tag_hunt:'🏹 Hunt', news_tag_creators:'🎨 Creators',
    news1_title:'📌 #content-spotlight — raid selection',
    news1_body:'A new channel <strong>#content-spotlight</strong> has appeared in Discord — a dedicated showcase for the best community content. Moderators will hand-pick creators\' posts and feature them there, then organize a full raid on the top works. If your post makes it into <strong>#content-spotlight</strong>, the team considers it worthy of maximum reach. This is your chance to stand out among hundreds of Hunt participants and get on the team\'s radar. Post, put in the effort — and the next raid might just be on you.',
    news2_title:'🚀 Regional Hunt launched',
    news2_body:'Applications for Regional Lead and Regional Helper are now officially open. The <strong>#nominations</strong> channel is unlocked for Junior Hunter role holders. Apply now and be among the first.',
    news3_title:'🎭 Dili lore contest',
    news3_body:'Create a story, art or concept about the Dili mascot. The best 10 entries automatically earn the <strong>Dliever</strong> role. Post in <code>#creators</code> quoting the official X post.'
  },
  ru: {
    nav_sub:'Community Hub', nav_about:'О проекте', nav_roles:'Роли', nav_token:'Токен', nav_team:'Команда',
    hero_tag:'🌍 Глобальное Сообщество',
    hero_sub:'Всё о <strong>Dlicom</strong> — децентрализованной платформе с DeFi, крипто-кошельком и соцсетью. Гайды, FAQ и новости для мирового комьюнити.',
    hero_btn1:'↗ Войти в Discord', hero_btn2:'Сайт проекта', scroll:'скролл',
    stat_token:'Токен', stat_platform:'Платформа', stat_standard:'Стандарт',
    mascot_title:'Знакомься — это Дили (Dili)', mascot_desc:'Официальный маскот Dlicom — лицо SocialFi. Придумай его историю, лор или концепцию и получи роль <strong>Dliever</strong>. Любой формат: текст, видео, арт.', mascot_btn:'Брендинг →',
    feat1_title:'Социальная сеть', feat1_desc:'Публикуй посты, общайся в зашифрованных чатах, получай чаевые в DLI токенах. Цензуростойкая альтернатива традиционным соцсетям.',
    feat2_title:'Крипто-кошелёк', feat2_desc:'Self-custody кошелёк с поддержкой криптовалют и NFT. Свопы с лучшими курсами, оплата газа токенами DLI, отправка прямо в чате.',
    feat3_title:'DeFi & Стейкинг', feat3_desc:'Стейкинг DLI токенов с наградами в USDT. Несколько периодов на выбор. Доступ к dApps через встроенный Web3 браузер.',
    step1_title:'Скачай приложение', step1_desc:'Доступно в <a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> и <a href="https://play.google.com/store/search?q=dlicom&c=apps" target="_blank">Google Play</a>. Разработчик: Shlenpower Pte. Ltd.',
    step2_title:'Создай кошелёк', step2_desc:'При регистрации создай новый кошелёк или импортируй существующий. Сохрани seed-фразу в безопасном месте — восстановление без неё невозможно.',
    step3_title:'Вступи в Discord', step3_desc:'Присоединяйся к <a href="https://discord.gg/BmYmRXc8" target="_blank">официальному серверу</a>. Выбери свой регион, чтобы открыть нужные каналы.',
    step4_title:'Стань активным участником', step4_desc:'Участвуй в активностях, помогай новичкам, участвуй в Regional Hunt — зарабатывай роли Dliever, Dcoded и DCO.',
    hunt_title:'Стань Regional Lead или Mod', hunt_desc:'Момент, когда любой может стать лидером своего региона. Работай с командой, получай роли и влияй на развитие комьюнити. Прямо сейчас — никаких модераторов, никаких лидов. Место свободно.',
    hunt_apply:'Подать заявку', hunt_discord:'Перейти в Discord',
    phase1_label:'Фаза 1', phase1_title:'Заяви о себе', phase1_desc:'Начальный отбор. Открывается канал номинаций.', phase1_li1:'10 ролей Dliever', phase1_li2:'Номинации открыты',
    phase2_label:'Фаза 2', phase2_title:'Испытательный срок', phase2_desc:'Топ 5 кандидатов начинают работу с командой. Только Dliever может получить Dcoded.', phase2_li1:'5 ролей Dcoded', phase2_li2:'Работа с командой',
    phase3_label:'Фаза 3', phase3_title:'Финал', phase3_desc:'Лидеры и моды получают роли и права. Публикуется список финалистов.', phase3_li1:'1 роль DCO', phase3_li2:'Итоги публикуются',
    role1_desc:'Пионеры, доказавшие надёжность и знание Dlicom. Самая желанная базовая роль — старт всего.',
    role2_desc:'Активные и преданные участники — пример для новичков. Требует наличие Dliever.',
    role3_desc:'Dlicom Contribution Officer. Самая редкая роль. Нужен Dcoded + тег сервера.',
    role4_desc:'Легендарные 1000 первых пользователей. Аирдроп буст, бонусный XP. Больше не выдаётся.',
    rule1_title:'Запрещено', rule1_desc:'Политика, расизм, дискриминация. NSFW контент. Спам и самореклама. Офф-топ в тематических каналах.',
    rule2_title:'Приветствуется', rule2_desc:'Помогай новичкам, расти сам, строй связи. Превращай идеи в действия. Будь собой.',
    rule3_title:'Осторожно со скамом', rule3_desc:'Команда Dlicom <strong>никогда не напишет тебе первой в личку</strong>. Всегда проверяй.',
    rule4_title:'Принцип комьюнити', rule4_desc:'Ценность — это всё. Канал <strong>#creators</strong> — самый надёжный способ получить роль.',
    tok_standard:'Стандарт', tok_supply:'Общая эмиссия', tok_price:'Начальная цена', tok_circ:'Начальный оборот', tok_cap:'Начальная капитализация', tok_lp:'Пул ликвидности', tok_vest:'Вестинг',
    faq1_q:'Как стать Regional Lead?', faq1_a:'1. Заполни <a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">форму заявки</a>. 2. В Discord выбери свой регион. 3. Активно участвуй в трёх фазах (25 фев — 18 мар).',
    faq2_q:'Обязателен ли Dliever для участия в Regional Hunt?', faq2_a:'Нет. Dliever не обязателен для подачи заявки. Но активные участники получают его автоматически и имеют приоритет при отборе.',
    faq3_q:'Что такое DLI токен?', faq3_a:'DLI — нативный токен Dlicom на Ethereum. Используется для: отправки крипты в чате, чаевых, оплаты газа, стейкинга с наградами в USDT, голосования.',
    faq4_q:'Нужен ли KYC?', faq4_a:'Нет. Dlicom — полностью децентрализованный проект, работающий как DEX. KYC не требуется. Профили — на основе Ethereum адресов.',
    faq5_q:'Что такое конкурс с маскотом Dili?', faq5_a:'Придумай историю, лор или концепцию про Дили (текст, видео, арт). Лучшие 10 идей получают роль Dliever. Публикуй в <code>#creators</code>, процитировав <a href="https://x.com/DlicomApp/status/2023744462434783676" target="_blank">пост в X</a>.',
    faq6_q:'Как зарабатывать на платформе?', faq6_a:'<code>Стейкинг</code> — DLI в USDT. <code>Контент</code> — чаевые от подписчиков. <code>Рефералы</code> — приглашай по своему коду.',
    faq7_q:'Можно ли подать сразу на Regional Lead, минуя Helper?', faq7_a:'Да. Подавая заявку на Regional Lead, ты автоматически становишься кандидатом и на Regional Helper.',
    faq8_q:'Почему сейчас лучшее время для входа?', faq8_a:'Сейчас самая ранняя стадия — ни модераторов, ни лидов в регионах ещё нет. Стартовать с нуля именно сейчас — лучшее окно для получения должности Regional Lead или Helper.',
    cta_title:'Готов стать частью Community Hub?', cta_desc:'Вступай в Discord, выбирай регион и участвуй в Regional Hunt', cta_btn1:'↗ Открыть Discord', cta_btn2:'Подать заявку',
    footer_brand:'Community Hub · Неофициальный ресурс', footer_apply:'Форма заявки', footer_discord:'Присоединиться к серверу',
    news_badge_new:'НОВОЕ', news_badge_phase1:'ФАЗА 1', news_badge_info:'ИНФО',
    news_tag_announce:'📣 Объявление', news_tag_hunt:'🏹 Хант', news_tag_creators:'🎨 Крейторы',
    news1_title:'📌 #content-spotlight — отбор в рейд',
    news1_body:'В Discord появился новый канал <strong>#content-spotlight</strong> — специальная витрина для лучших материалов сообщества. Модераторы будут вручную отбирать контент авторов и публиковать его там, чтобы затем провести полноценный рейд на лучшие работы. Если твой пост попал в <strong>#content-spotlight</strong> — значит, команда считает его достойным максимального охвата. Это шанс выделиться среди сотен участников Hunt и попасть на радар тиму. Публикуй, старайся, и, возможно, следующий рейд будет именно на тебя.',
    news2_title:'🚀 Regional Hunt стартовал',
    news2_body:'Официально открылся набор на роли Regional Lead и Regional Helper. Канал <strong>#nominations</strong> разблокирован для участников с ролью Junior Hunter. Подай заявку — и попади в историю первых.',
    news3_title:'🎭 Конкурс лора Dili',
    news3_body:'Создай историю, арт или концепцию о маскоте Dili. Лучшие 10 работ получают роль <strong>Dliever</strong> автоматически. Публикуй в <code>#creators</code> с цитатой официального X-поста.'
  },
  ar: {
    nav_sub:'مركز المجتمع', nav_about:'عن المشروع', nav_roles:'الأدوار', nav_token:'الرمز', nav_team:'الفريق',
    hero_tag:'🌍 مجتمع عالمي',
    hero_sub:'كل شيء عن <strong>Dlicom</strong> — منصة لامركزية مع DeFi ومحفظة تشفير وشبكة اجتماعية.',
    hero_btn1:'↗ انضم إلى Discord', hero_btn2:'موقع المشروع', scroll:'انزل',
    stat_token:'الرمز', stat_platform:'المنصة', stat_standard:'المعيار',
    mascot_title:'تعرف على Dili', mascot_desc:'تميمة Dlicom الرسمية. أنشئ قصة عنه واحصل على دور <strong>Dliever</strong>.', mascot_btn:'العلامة التجارية →',
    feat1_title:'شبكة اجتماعية', feat1_desc:'انشر المنشورات، تحدث في رسائل مشفرة، واحصل على إكراميات بعملة DLI.',
    feat2_title:'محفظة تشفير', feat2_desc:'محفظة ذاتية الحضانة مع دعم التشفير والـ NFT.',
    feat3_title:'DeFi والتخزين', feat3_desc:'خزّن عملة DLI للحصول على مكافآت USDT.',
    step1_title:'حمّل التطبيق', step1_desc:'متاح على <a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> وGoogle Play.',
    step2_title:'أنشئ محفظة', step2_desc:'أنشئ محفظة جديدة أو استورد موجودة. احفظ عبارة الأمان.',
    step3_title:'انضم إلى Discord', step3_desc:'انضم إلى <a href="https://discord.gg/BmYmRXc8" target="_blank">السيرفر الرسمي</a>. اختر منطقتك.',
    step4_title:'كن عضواً نشطاً', step4_desc:'شارك في الأنشطة وانضم إلى Regional Hunt.',
    hunt_title:'كن Regional Lead أو Mod', hunt_desc:'اللحظة التي يمكن فيها لأي شخص أن يصبح قائداً لمنطقته. المكان خالٍ الآن.',
    hunt_apply:'تقدم الآن', hunt_discord:'اذهب إلى Discord',
    phase1_label:'المرحلة 1', phase1_title:'أثبت وجودك', phase1_desc:'الاختيار الأولي.', phase1_li1:'10 أدوار Dliever', phase1_li2:'الترشيحات مفتوحة',
    phase2_label:'المرحلة 2', phase2_title:'فترة التجربة', phase2_desc:'أفضل 5 مرشحين يبدأون العمل.', phase2_li1:'5 أدوار Dcoded', phase2_li2:'التعاون مع الفريق',
    phase3_label:'المرحلة 3', phase3_title:'النهائي', phase3_desc:'القادة والمشرفون يحصلون على الأدوار.', phase3_li1:'1 دور DCO', phase3_li2:'نشر النتائج',
    role1_desc:'الرواد الذين أثبتوا موثوقيتهم ومعرفتهم بـ Dlicom.',
    role2_desc:'أعضاء نشطون — قدوة للمبتدئين. يتطلب Dliever.',
    role3_desc:'Dlicom Contribution Officer. يتطلب Dcoded + علامة السيرفر.',
    role4_desc:'أول 1000 مستخدم. لا يُمنح بعد الآن.',
    rule1_title:'محظور', rule1_desc:'السياسة والعنصرية والتمييز. محتوى NSFW. البريد العشوائي.',
    rule2_title:'مرحب به', rule2_desc:'ساعد المبتدئين، انمُ بنفسك، ابنِ علاقات.',
    rule3_title:'احذر من الاحتيال', rule3_desc:'فريق Dlicom <strong>لن يراسلك أولاً في الرسائل الخاصة</strong>.',
    rule4_title:'مبدأ المجتمع', rule4_desc:'القيمة هي كل شيء. قناة <strong>#creators</strong> هي الأضمن.',
    tok_standard:'المعيار', tok_supply:'العرض الكلي', tok_price:'السعر الأولي', tok_circ:'التداول الأولي', tok_cap:'القيمة السوقية', tok_lp:'مجمع السيولة', tok_vest:'الاستحقاق',
    faq1_q:'كيف تصبح Regional Lead?', faq1_a:'1. أكمل <a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">نموذج التقديم</a>. 2. اختر منطقتك في Discord. 3. شارك في المراحل الثلاث.',
    faq2_q:'هل Dliever مطلوب للانضمام؟', faq2_a:'لا. لكن المشاركين النشطين يحصلون عليه تلقائياً.',
    faq3_q:'ما هو رمز DLI?', faq3_a:'DLI هو الرمز الأصلي لـ Dlicom على Ethereum.',
    faq4_q:'هل KYC مطلوب?', faq4_a:'لا. Dlicom مشروع لامركزي بالكامل.',
    faq5_q:'ما هو مسابقة تميمة Dili?', faq5_a:'أنشئ قصة عن Dili. أفضل 10 يفوزون بدور Dliever.',
    faq6_q:'كيف تكسب على المنصة?', faq6_a:'<code>التخزين</code> — DLI مقابل USDT. <code>المحتوى</code> — إكراميات.',
    faq7_q:'هل يمكن التقدم لـ Regional Lead مباشرة?', faq7_a:'نعم، وتصبح مرشحاً لـ Helper تلقائياً.',
    faq8_q:'لماذا الآن أفضل وقت؟', faq8_a:'لا مشرفين، لا قادة بعد. ابدأ الآن.',
    cta_title:'هل أنت مستعد للانضمام؟', cta_desc:'انضم إلى Discord واختر منطقتك', cta_btn1:'↗ فتح Discord', cta_btn2:'تقدم الآن',
    footer_brand:'Community Hub · مورد غير رسمي', footer_apply:'نموذج التقديم', footer_discord:'انضم إلى السيرفر',
    news_badge_new:'جديد', news_badge_phase1:'المرحلة 1', news_badge_info:'معلومات',
    news_tag_announce:'📣 إعلان', news_tag_hunt:'🏹 هانت', news_tag_creators:'🎨 المبدعون',
    news1_title:'📌 #content-spotlight — اختيار المداهمة',
    news1_body:'ظهرت قناة جديدة في Discord <strong>#content-spotlight</strong> — واجهة مخصصة لأفضل محتوى المجتمع. سيختار المشرفون يدوياً منشورات المبدعين وينشرونها هناك، ثم ينظمون مداهمة كاملة على أفضل الأعمال. إذا وصل منشورك إلى <strong>#content-spotlight</strong>، فهذا يعني أن الفريق يعتبره يستحق أقصى وصول. فرصتك للتميز بين مئات المشاركين في Hunt. انشر، اجتهد — وربما تكون المداهمة التالية عليك.',
    news2_title:'🚀 انطلق Regional Hunt',
    news2_body:'فُتح رسمياً التقديم على أدوار Regional Lead وRegional Helper. قناة <strong>#nominations</strong> مفتوحة لحاملي دور Junior Hunter. تقدم الآن وكن من الأوائل.',
    news3_title:'🎭 مسابقة لور Dili',
    news3_body:'أنشئ قصة أو فناً أو مفهوماً عن تميمة Dili. أفضل 10 أعمال تحصل تلقائياً على دور <strong>Dliever</strong>. انشر في <code>#creators</code> مع اقتباس منشور X الرسمي.'
  },
  uk: {
    nav_sub:'Community Hub', nav_about:'Про проект', nav_roles:'Ролі', nav_token:'Токен', nav_team:'Команда',
    hero_tag:'🌍 Глобальна Спільнота',
    hero_sub:'Все про <strong>Dlicom</strong> — децентралізовану платформу з DeFi, крипто-гаманцем і соцмережею.',
    hero_btn1:'↗ Увійти в Discord', hero_btn2:'Сайт проекту', scroll:'скрол',
    stat_token:'Токен', stat_platform:'Платформа', stat_standard:'Стандарт',
    mascot_title:'Познайомся — це Ділі', mascot_desc:'Офіційний маскот Dlicom — обличчя SocialFi. Придумай його лор і отримай роль <strong>Dliever</strong>.', mascot_btn:'Брендинг →',
    feat1_title:'Соціальна мережа', feat1_desc:'Публікуй пости, спілкуйся в зашифрованих чатах, отримуй чайові в DLI.',
    feat2_title:'Крипто-гаманець', feat2_desc:'Self-custody гаманець з підтримкою NFT та свопами за найкращими курсами.',
    feat3_title:'DeFi & Стейкінг', feat3_desc:'Стейкінг DLI з нагородами в USDT. Доступ до dApps через Web3 браузер.',
    step1_title:'Завантаж додаток', step1_desc:'Доступний в <a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> і <a href="https://play.google.com/store/search?q=dlicom&c=apps" target="_blank">Google Play</a>.',
    step2_title:'Створи гаманець', step2_desc:'Створи новий або імпортуй існуючий. Збережи seed-фразу в безпечному місці.',
    step3_title:'Вступи до Discord', step3_desc:'Приєднуйся до <a href="https://discord.gg/BmYmRXc8" target="_blank">офіційного сервера</a>. Обери свій регіон.',
    step4_title:'Стань активним учасником', step4_desc:'Беру участь у Regional Hunt — заробляй ролі Dliever, Dcoded і DCO.',
    hunt_title:'Стань Regional Lead або Mod', hunt_desc:'Момент, коли будь-хто може стати лідером регіону. Жодних модераторів, жодних лідів. Місце вільне.',
    hunt_apply:'Подати заявку', hunt_discord:'Перейти до Discord',
    phase1_label:'Фаза 1', phase1_title:'Заяви про себе', phase1_desc:'Початковий відбір.', phase1_li1:'10 ролей Dliever', phase1_li2:'Номінації відкриті',
    phase2_label:'Фаза 2', phase2_title:'Випробувальний строк', phase2_desc:'Топ 5 кандидатів починають роботу.', phase2_li1:'5 ролей Dcoded', phase2_li2:'Робота з командою',
    phase3_label:'Фаза 3', phase3_title:'Фінал', phase3_desc:'Лідери та моди отримують ролі.', phase3_li1:'1 роль DCO', phase3_li2:'Підсумки публікуються',
    role1_desc:'Піонери, які довели надійність і знання Dlicom.',
    role2_desc:'Активні та відданні учасники — приклад для новачків. Потребує Dliever.',
    role3_desc:'Dlicom Contribution Officer. Потрібен Dcoded + тег сервера.',
    role4_desc:'Легендарні перші 1000 користувачів. Більше не видається.',
    rule1_title:'Заборонено', rule1_desc:'Політика, расизм, дискримінація. NSFW контент. Спам і самореклама.',
    rule2_title:'Вітається', rule2_desc:'Допомагай новачкам, рости сам, будуй зв\'язки.',
    rule3_title:'Обережно зі скамом', rule3_desc:'Команда Dlicom <strong>ніколи не напише тобі першою в ЛС</strong>.',
    rule4_title:'Принцип спільноти', rule4_desc:'Цінність — це все. Канал <strong>#creators</strong> — найнадійніший спосіб.',
    tok_standard:'Стандарт', tok_supply:'Загальна емісія', tok_price:'Початкова ціна', tok_circ:'Початковий обіг', tok_cap:'Початкова капіталізація', tok_lp:'Пул ліквідності', tok_vest:'Вестинг',
    faq1_q:'Як стати Regional Lead?', faq1_a:'1. Заповни <a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">форму заявки</a>. 2. В Discord обери свій регіон. 3. Активно берь участь у трьох фазах.',
    faq2_q:'Чи потрібен Dliever для Regional Hunt?', faq2_a:'Ні. Але активні учасники отримують його автоматично.',
    faq3_q:'Що таке DLI токен?', faq3_a:'DLI — нативний токен Dlicom на Ethereum.',
    faq4_q:'Чи потрібен KYC?', faq4_a:'Ні. Dlicom повністю децентралізований.',
    faq5_q:'Що таке конкурс з маскотом Dili?', faq5_a:'Придумай лор про Діли. Найкращі 10 отримують Dliever. Публікуй у <code>#creators</code>.',
    faq6_q:'Як заробляти?', faq6_a:'<code>Стейкінг</code> — DLI в USDT. <code>Контент</code> — чайові. <code>Реферали</code> — код.',
    faq7_q:'Чи можна подати одразу на Regional Lead?', faq7_a:'Так, і стаєш кандидатом на Helper автоматично.',
    faq8_q:'Чому зараз найкращий час?', faq8_a:'Найрання стадія — ні лідів, ні модів. Найкраще вікно зараз.',
    cta_title:'Готовий приєднатися?', cta_desc:'Вступай до Discord, обери регіон і бери участь у Regional Hunt', cta_btn1:'↗ Відкрити Discord', cta_btn2:'Подати заявку',
    footer_brand:'Community Hub · Неофіційний ресурс', footer_apply:'Форма заявки', footer_discord:'Приєднатися до сервера',
    news_badge_new:'НОВЕ', news_badge_phase1:'ФАЗА 1', news_badge_info:'ІНФО',
    news_tag_announce:'📣 Оголошення', news_tag_hunt:'🏹 Хант', news_tag_creators:'🎨 Крейтори',
    news1_title:'📌 #content-spotlight — відбір до рейду',
    news1_body:'У Discord з\'явився новий канал <strong>#content-spotlight</strong> — спеціальна вітрина для найкращих матеріалів спільноти. Модератори вручну відбиратимуть контент авторів і публікуватимуть його там, щоб потім провести повноцінний рейд на кращі роботи. Якщо твій пост потрапив до <strong>#content-spotlight</strong> — значить, команда вважає його гідним максимального охоплення. Це шанс виділитися серед сотень учасників Hunt і потрапити на радар тиму. Публікуй, старайся — і, можливо, наступний рейд буде саме на тебе.',
    news2_title:'🚀 Regional Hunt стартував',
    news2_body:'Офіційно відкрився набір на ролі Regional Lead і Regional Helper. Канал <strong>#nominations</strong> розблокований для учасників з роллю Junior Hunter. Подай заявку — і потрап в історію перших.',
    news3_title:'🎭 Конкурс лору Dili',
    news3_body:'Створи історію, арт або концепцію про маскота Dili. Найкращі 10 робіт отримують роль <strong>Dliever</strong> автоматично. Публікуй у <code>#creators</code> з цитатою офіційного X-посту.'
  },
  vi: {
    nav_sub:'Community Hub', nav_about:'Về dự án', nav_roles:'Vai trò', nav_token:'Token', nav_team:'Đội ngũ',
    hero_tag:'🌍 Cộng đồng Toàn cầu',
    hero_sub:'Tất cả về <strong>Dlicom</strong> — nền tảng phi tập trung với DeFi, ví crypto và mạng xã hội.',
    hero_btn1:'↗ Tham gia Discord', hero_btn2:'Trang dự án', scroll:'cuộn',
    stat_token:'Token', stat_platform:'Nền tảng', stat_standard:'Tiêu chuẩn',
    mascot_title:'Gặp gỡ Dili', mascot_desc:'Linh vật chính thức của Dlicom. Tạo câu chuyện và nhận vai <strong>Dliever</strong>.', mascot_btn:'Thương hiệu →',
    feat1_title:'Mạng xã hội', feat1_desc:'Đăng bài, trò chuyện mã hóa, kiếm tip bằng DLI token.',
    feat2_title:'Ví Crypto', feat2_desc:'Ví tự quản lý với crypto và NFT. Swap tỷ giá tốt nhất.',
    feat3_title:'DeFi & Staking', feat3_desc:'Stake DLI để nhận USDT. Truy cập dApps qua trình duyệt Web3.',
    step1_title:'Tải ứng dụng', step1_desc:'Có trên <a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> và <a href="https://play.google.com/store/search?q=dlicom&c=apps" target="_blank">Google Play</a>.',
    step2_title:'Tạo ví', step2_desc:'Tạo ví mới hoặc nhập ví hiện có. Lưu seed phrase an toàn.',
    step3_title:'Tham gia Discord', step3_desc:'Vào <a href="https://discord.gg/BmYmRXc8" target="_blank">server chính thức</a>. Chọn khu vực của bạn.',
    step4_title:'Trở thành thành viên tích cực', step4_desc:'Tham gia Regional Hunt — kiếm vai Dliever, Dcoded, DCO.',
    hunt_title:'Trở thành Regional Lead hoặc Mod', hunt_desc:'Thời điểm bất kỳ ai có thể trở thành lãnh đạo khu vực. Vị trí còn trống.',
    hunt_apply:'Đăng ký ngay', hunt_discord:'Đến Discord',
    phase1_label:'Giai đoạn 1', phase1_title:'Khẳng định bản thân', phase1_desc:'Chọn lọc ban đầu.', phase1_li1:'10 vai Dliever', phase1_li2:'Đề cử mở',
    phase2_label:'Giai đoạn 2', phase2_title:'Thử việc', phase2_desc:'Top 5 làm việc với nhóm.', phase2_li1:'5 vai Dcoded', phase2_li2:'Hợp tác nhóm',
    phase3_label:'Giai đoạn 3', phase3_title:'Chung kết', phase3_desc:'Lãnh đạo nhận vai và quyền.', phase3_li1:'1 vai DCO', phase3_li2:'Công bố kết quả',
    role1_desc:'Những tiên phong đã chứng minh kiến thức về Dlicom.',
    role2_desc:'Thành viên tích cực — gương mẫu. Yêu cầu Dliever.',
    role3_desc:'Dlicom Contribution Officer. Yêu cầu Dcoded + server tag.',
    role4_desc:'1000 người dùng đầu tiên. Không còn phát nữa.',
    rule1_title:'Cấm', rule1_desc:'Chính trị, phân biệt. NSFW. Spam.',
    rule2_title:'Chào đón', rule2_desc:'Giúp người mới, phát triển bản thân.',
    rule3_title:'Cảnh giác lừa đảo', rule3_desc:'Nhóm Dlicom <strong>không bao giờ nhắn trước trong DM</strong>.',
    rule4_title:'Nguyên tắc cộng đồng', rule4_desc:'<strong>#creators</strong> là cách đáng tin nhất để kiếm vai.',
    tok_standard:'Tiêu chuẩn', tok_supply:'Tổng cung', tok_price:'Giá khởi điểm', tok_circ:'Lưu thông ban đầu', tok_cap:'Vốn hóa ban đầu', tok_lp:'Bể thanh khoản', tok_vest:'Vesting',
    faq1_q:'Làm thế nào thành Regional Lead?', faq1_a:'1. Điền <a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">mẫu đơn</a>. 2. Chọn khu vực trong Discord. 3. Tham gia ba giai đoạn.',
    faq2_q:'Dliever có cần cho Regional Hunt?', faq2_a:'Không bắt buộc. Thành viên tích cực nhận tự động.',
    faq3_q:'Token DLI là gì?', faq3_a:'DLI là token gốc của Dlicom trên Ethereum.',
    faq4_q:'Cần KYC không?', faq4_a:'Không. Dlicom phi tập trung hoàn toàn.',
    faq5_q:'Cuộc thi Dili là gì?', faq5_a:'Tạo câu chuyện về Dili. 10 tốt nhất nhận Dliever.',
    faq6_q:'Kiếm tiền thế nào?', faq6_a:'<code>Staking</code> — DLI cho USDT. <code>Nội dung</code> — tip.',
    faq7_q:'Có thể đăng ký Regional Lead trực tiếp?', faq7_a:'Có, và tự động là ứng viên Helper.',
    faq8_q:'Tại sao bây giờ là tốt nhất?', faq8_a:'Giai đoạn sớm nhất — chưa có mod hay lead.',
    cta_title:'Sẵn sàng tham gia?', cta_desc:'Tham gia Discord và chọn khu vực của bạn', cta_btn1:'↗ Mở Discord', cta_btn2:'Đăng ký ngay',
    footer_brand:'Community Hub · Tài nguyên không chính thức', footer_apply:'Mẫu đăng ký', footer_discord:'Tham gia Server',
    news_badge_new:'MỚI', news_badge_phase1:'GIAI ĐOẠN 1', news_badge_info:'THÔNG TIN',
    news_tag_announce:'📣 Thông báo', news_tag_hunt:'🏹 Hunt', news_tag_creators:'🎨 Sáng tạo',
    news1_title:'📌 #content-spotlight — tuyển chọn raid',
    news1_body:'Một kênh mới <strong>#content-spotlight</strong> đã xuất hiện trong Discord — nơi trưng bày những nội dung tốt nhất của cộng đồng. Các moderator sẽ tự tay chọn lọc bài đăng của các tác giả và đăng ở đó, sau đó tổ chức raid toàn diện vào những tác phẩm xuất sắc nhất. Nếu bài của bạn vào <strong>#content-spotlight</strong> — nghĩa là nhóm coi đó xứng đáng với phạm vi tiếp cận tối đa. Đây là cơ hội để nổi bật trong hàng trăm người tham gia Hunt. Hãy đăng và cố gắng — raid tiếp theo có thể dành cho bạn!',
    news2_title:'🚀 Regional Hunt khởi động',
    news2_body:'Đã mở chính thức đơn đăng ký vai Regional Lead và Regional Helper. Kênh <strong>#nominations</strong> được mở khóa cho người có vai Junior Hunter. Đăng ký ngay và trở thành người đầu tiên.',
    news3_title:'🎭 Cuộc thi lore Dili',
    news3_body:'Tạo câu chuyện, nghệ thuật hoặc khái niệm về linh vật Dili. 10 tác phẩm tốt nhất tự động nhận vai <strong>Dliever</strong>. Đăng trong <code>#creators</code> kèm trích dẫn bài đăng X chính thức.'
  },
  hi: {
    nav_sub:'Community Hub', nav_about:'परियोजना', nav_roles:'भूमिकाएं', nav_token:'टोकन', nav_team:'टीम',
    hero_tag:'🌍 वैश्विक समुदाय',
    hero_sub:'<strong>Dlicom</strong> के बारे में — DeFi, क्रिप्टो वॉलेट और सोशल नेटवर्क के साथ विकेंद्रीकृत प्लेटफॉर्म।',
    hero_btn1:'↗ Discord से जुड़ें', hero_btn2:'प्रोजेक्ट वेबसाइट', scroll:'स्क्रॉल',
    stat_token:'टोकन', stat_platform:'प्लेटफॉर्म', stat_standard:'मानक',
    mascot_title:'मिलिए Dili से', mascot_desc:'Dlicom का आधिकारिक शुभंकर। उसके बारे में कहानी बनाएं और <strong>Dliever</strong> पाएं।', mascot_btn:'ब्रांडिंग →',
    feat1_title:'सोशल नेटवर्क', feat1_desc:'पोस्ट करें, एन्क्रिप्टेड चैट, DLI टिप्स।',
    feat2_title:'क्रिप्टो वॉलेट', feat2_desc:'NFT सपोर्ट, DLI से गैस फीस।',
    feat3_title:'DeFi & स्टेकिंग', feat3_desc:'DLI स्टेक करें, USDT रिवॉर्ड पाएं।',
    step1_title:'ऐप डाउनलोड', step1_desc:'<a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> और <a href="https://play.google.com/store/search?q=dlicom&c=apps" target="_blank">Google Play</a>।',
    step2_title:'वॉलेट बनाएं', step2_desc:'Seed phrase सुरक्षित रखें।',
    step3_title:'Discord से जुड़ें', step3_desc:'<a href="https://discord.gg/BmYmRXc8" target="_blank">आधिकारिक सर्वर</a> से जुड़ें।',
    step4_title:'सक्रिय सदस्य बनें', step4_desc:'Regional Hunt में शामिल हों।',
    hunt_title:'Regional Lead या Mod बनें', hunt_desc:'कोई भी अपने क्षेत्र का लीडर बन सकता है। अभी स्थान खाली है।',
    hunt_apply:'अभी आवेदन करें', hunt_discord:'Discord पर जाएं',
    phase1_label:'चरण 1', phase1_title:'अपनी पहचान', phase1_desc:'प्रारंभिक चयन।', phase1_li1:'10 Dliever भूमिकाएं', phase1_li2:'नामांकन खुले',
    phase2_label:'चरण 2', phase2_title:'परीक्षण', phase2_desc:'टॉप 5 टीम के साथ काम करते हैं।', phase2_li1:'5 Dcoded', phase2_li2:'टीम सहयोग',
    phase3_label:'चरण 3', phase3_title:'फाइनल', phase3_desc:'लीडर्स को भूमिकाएं मिलती हैं।', phase3_li1:'1 DCO', phase3_li2:'परिणाम',
    role1_desc:'Dlicom के ज्ञान को साबित करने वाले। सबसे मांग वाली भूमिका।',
    role2_desc:'सक्रिय सदस्य। Dliever की आवश्यकता।',
    role3_desc:'Dlicom Contribution Officer। Dcoded + सर्वर टैग।',
    role4_desc:'पहले 1000 उपयोगकर्ता। अब नहीं दिया जाता।',
    rule1_title:'निषिद्ध', rule1_desc:'राजनीति, नस्लवाद। NSFW। स्पैम।',
    rule2_title:'स्वागत', rule2_desc:'नए लोगों की मदद करें।',
    rule3_title:'स्कैम से सावधान', rule3_desc:'टीम <strong>पहले DM नहीं करेगी</strong>।',
    rule4_title:'समुदाय का सिद्धांत', rule4_desc:'<strong>#creators</strong> से भूमिका पाना सबसे विश्वसनीय।',
    tok_standard:'मानक', tok_supply:'कुल आपूर्ति', tok_price:'प्रारंभिक मूल्य', tok_circ:'प्रारंभिक प्रचलन', tok_cap:'बाजार पूंजी', tok_lp:'तरलता पूल', tok_vest:'वेस्टिंग',
    faq1_q:'Regional Lead कैसे बनें?', faq1_a:'<a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">फॉर्म</a> भरें, Discord में क्षेत्र चुनें।',
    faq2_q:'Dliever जरूरी है?', faq2_a:'नहीं, लेकिन सक्रिय लोग स्वतः पाते हैं।',
    faq3_q:'DLI टोकन क्या है?', faq3_a:'Ethereum पर Dlicom का मूल टोकन।',
    faq4_q:'KYC जरूरी?', faq4_a:'नहीं, पूरी तरह विकेंद्रीकृत।',
    faq5_q:'Dili प्रतियोगिता?', faq5_a:'Dili की कहानी बनाएं, Dliever पाएं।',
    faq6_q:'कमाई कैसे?', faq6_a:'<code>स्टेकिंग</code>, <code>कंटेंट</code>, <code>रेफरल</code>।',
    faq7_q:'सीधे Regional Lead?', faq7_a:'हां, Helper के लिए भी स्वतः उम्मीदवार।',
    faq8_q:'अभी क्यों सबसे अच्छा?', faq8_a:'कोई लीड नहीं, कोई मॉड नहीं अभी।',
    cta_title:'Community Hub से जुड़ने के लिए तैयार?', cta_desc:'Discord से जुड़ें, अपना क्षेत्र चुनें', cta_btn1:'↗ Discord खोलें', cta_btn2:'आवेदन करें',
    footer_brand:'Community Hub · अनौपचारिक', footer_apply:'आवेदन फॉर्म', footer_discord:'सर्वर से जुड़ें',
    news_badge_new:'नया', news_badge_phase1:'चरण 1', news_badge_info:'जानकारी',
    news_tag_announce:'📣 घोषणा', news_tag_hunt:'🏹 हंट', news_tag_creators:'🎨 क्रिएटर्स',
    news1_title:'📌 #content-spotlight — रेड चयन',
    news1_body:'Discord में एक नया चैनल <strong>#content-spotlight</strong> आया है — समुदाय की सर्वश्रेष्ठ सामग्री के लिए एक विशेष शोकेस। मॉडरेटर क्रिएटर्स के पोस्ट को मैन्युअली चुनकर वहाँ प्रकाशित करेंगे, फिर शीर्ष कार्यों पर पूर्ण रेड आयोजित करेंगे। अगर आपका पोस्ट <strong>#content-spotlight</strong> में आया — टीम इसे अधिकतम पहुँच के योग्य मानती है। Hunt के सैकड़ों प्रतिभागियों में से अलग दिखने का यही मौका है। पोस्ट करो, कोशिश करो — अगला रेड शायद तुम्हारे लिए हो!',
    news2_title:'🚀 Regional Hunt लॉन्च',
    news2_body:'Regional Lead और Regional Helper के लिए आवेदन आधिकारिक रूप से खुले हैं। <strong>#nominations</strong> चैनल Junior Hunter भूमिका वालों के लिए अनलॉक है। अभी आवेदन करें और पहलों में शामिल हों।',
    news3_title:'🎭 Dili लोर प्रतियोगिता',
    news3_body:'Dili मास्कॉट के बारे में एक कहानी, कला या अवधारणा बनाएँ। सर्वश्रेष्ठ 10 प्रविष्टियाँ स्वचालित रूप से <strong>Dliever</strong> भूमिका प्राप्त करती हैं। आधिकारिक X पोस्ट उद्धृत करते हुए <code>#creators</code> में पोस्ट करें।'
  },
  ng: {
    nav_sub:'Community Hub', nav_about:'About', nav_roles:'Roles', nav_token:'Token', nav_team:'Team',
    hero_tag:'🌍 Global Community',
    hero_sub:'Everything about <strong>Dlicom</strong> — decentralized platform with DeFi, crypto wallet and social network.',
    hero_btn1:'↗ Enter Discord', hero_btn2:'Project Website', scroll:'scroll',
    stat_token:'Token', stat_platform:'Platform', stat_standard:'Standard',
    mascot_title:'Come meet Dili', mascot_desc:'Official Dlicom mascot. Create story about am, collect <strong>Dliever</strong> role.', mascot_btn:'Branding →',
    feat1_title:'Social Network', feat1_desc:'Post your tings, encrypted chat, collect DLI tips.',
    feat2_title:'Crypto Wallet', feat2_desc:'Self-custody wallet, NFT support, pay gas with DLI.',
    feat3_title:'DeFi & Staking', feat3_desc:'Stake DLI, collect USDT rewards. Web3 browser dey inside.',
    step1_title:'Download App', step1_desc:'E dey for <a href="https://apps.apple.com/us/app/dlicom/id6502626332" target="_blank">App Store</a> and <a href="https://play.google.com/store/search?q=dlicom&c=apps" target="_blank">Google Play</a>.',
    step2_title:'Create Wallet', step2_desc:'Create new or import existing. Keep seed phrase safe.',
    step3_title:'Join Discord', step3_desc:'Enter <a href="https://discord.gg/BmYmRXc8" target="_blank">official server</a>. Choose your region.',
    step4_title:'Be Active', step4_desc:'Join Regional Hunt — earn Dliever, Dcoded, DCO roles.',
    hunt_title:'Become Regional Lead or Mod', hunt_desc:'This na the moment anybody fit become leader. No moderators, no leads. Spot dey free.',
    hunt_apply:'Apply Now', hunt_discord:'Go to Discord',
    phase1_label:'Phase 1', phase1_title:'Show Yourself', phase1_desc:'First selection.', phase1_li1:'10 Dliever roles', phase1_li2:'Nominations open',
    phase2_label:'Phase 2', phase2_title:'Trial Period', phase2_desc:'Top 5 go work with team.', phase2_li1:'5 Dcoded', phase2_li2:'Team work',
    phase3_label:'Phase 3', phase3_title:'Final', phase3_desc:'Leaders collect roles.', phase3_li1:'1 DCO', phase3_li2:'Results publish',
    role1_desc:'Pioneers wey don prove their knowledge of Dlicom.',
    role2_desc:'Active members — example for new people. Need Dliever.',
    role3_desc:'Dlicom Contribution Officer. Need Dcoded + server tag.',
    role4_desc:'First 1000 users. No dey give again.',
    rule1_title:'No Go There', rule1_desc:'Politics, racism. NSFW. Spam.',
    rule2_title:'Welcome', rule2_desc:'Help new people, grow yourself.',
    rule3_title:'Beware Scammers', rule3_desc:'Dlicom team <strong>go never DM you first</strong>.',
    rule4_title:'Community Principle', rule4_desc:'<strong>#creators</strong> na the way to get role.',
    tok_standard:'Standard', tok_supply:'Total Supply', tok_price:'Starting Price', tok_circ:'First Circulation', tok_cap:'Market Cap', tok_lp:'Liquidity Pool', tok_vest:'Vesting',
    faq1_q:'How become Regional Lead?', faq1_a:'Fill <a href="https://forms.gle/LT9mZUa1KyUmxrZ1A" target="_blank">form</a>. Choose region for Discord.',
    faq2_q:'Dliever compulsory?', faq2_a:'No. Active people go get am automatic.',
    faq3_q:'Wetin be DLI?', faq3_a:'Native token for Dlicom on Ethereum.',
    faq4_q:'KYC needed?', faq4_a:'No. Dlicom fully decentralized DEX.',
    faq5_q:'Wetin be Dili contest?', faq5_a:'Create story about Dili. Best 10 collect Dliever.',
    faq6_q:'How to earn?', faq6_a:'<code>Staking</code> — DLI. <code>Content</code> — tips.',
    faq7_q:'Can apply Regional Lead direct?', faq7_a:'Yes, and become Helper candidate automatic.',
    faq8_q:'Why now be best time?', faq8_a:'No leads, no mods yet. Start now.',
    cta_title:'You ready join Community Hub?', cta_desc:'Enter Discord and choose your region', cta_btn1:'↗ Open Discord', cta_btn2:'Apply Now',
    footer_brand:'Community Hub · Unofficial', footer_apply:'Application Form', footer_discord:'Join Server',
    news_badge_new:'NEW', news_badge_phase1:'PHASE 1', news_badge_info:'INFO',
    news_tag_announce:'📣 Announcement', news_tag_hunt:'🏹 Hunt', news_tag_creators:'🎨 Creators',
    news1_title:'📌 #content-spotlight — raid selection',
    news1_body:'New channel don appear for Discord — <strong>#content-spotlight</strong>. Na special place where moderators go handpick the best content from creators and post am there, then organise full raid on the top works. If your post enter <strong>#content-spotlight</strong>, the team don see say e worth maximum reach. Na your chance to shine among hundreds of Hunt people. Post your thing, try your best — next raid fit be on you!',
    news2_title:'🚀 Regional Hunt don launch',
    news2_body:'Applications for Regional Lead and Regional Helper don open officially. <strong>#nominations</strong> channel don unlock for Junior Hunter role holders. Apply now and be among the first.',
    news3_title:'🎭 Dili lore contest',
    news3_body:'Create story, art or concept about the Dili mascot. The best 10 go automatically collect <strong>Dliever</strong> role. Post for <code>#creators</code> with quote from the official X post.'
  }
};

let currentLang = 'en';

function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  const labels = { en:'EN', ru:'RU', ar:'AR', uk:'UA', vi:'VN', hi:'IN', ng:'NG' };
  document.getElementById('langLabel').textContent = labels[lang] || lang.toUpperCase();
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
}

const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');
langBtn.addEventListener('click', e => {
  e.stopPropagation();
  langDropdown.classList.toggle('open');
});
document.addEventListener('click', () => langDropdown.classList.remove('open'));
langDropdown.querySelectorAll('.lang-option').forEach(opt => {
  opt.addEventListener('click', e => {
    e.stopPropagation();
    applyLang(opt.dataset.lang);
    langDropdown.classList.remove('open');
  });
});

applyLang('en');


// SCROLL REVEAL
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('vis'), i * 60);
  });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
