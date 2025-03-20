import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "tr" | "zh" | "es" | "ru" | "fr" | "de" | "ar" | "pt";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: string[]) => string;
};

const translations = {
  en: {
    "app.title": "Future Coin",
    "balance.title": "Your FC Balance",
    "balance.total": "Total earned Future Coin",
    "mining.title": "FC Mining",
    "mining.description": "Mine to earn Future Coin cryptocurrency",
    "mining.active": "STOP",
    "mining.inactive": "START",
    "mining.activeminers": "Active Miners",
    "mining.rate": "Rate",
    "security.title": "Security Center",
    "transfer.title": "Transfer FC",
    "explore.button": "Explore FC Ecosystem",
    "nav.mining": "Mining",
    "nav.team": "Team",
    "nav.transfer": "Transfer",
    "nav.security": "Security",
    "mining.started": "Mining started",
    "mining.startedDesc": "You will earn rewards every 30 seconds.",
    "mining.stopped": "Mining stopped",
    "mining.stoppedDesc": "You earned a total of {0} FC in this session.",
    "mining.successful": "Mining successful!",
    "mining.successfulDesc": "You earned {0} FC.",
    "profile.title": "User Profile",
    "profile.joinDate": "Joined on",
    "profile.totalMined": "Total Mined",
    "profile.level": "Level",
    "profile.edit": "Edit Profile",
    "history.title": "Transaction History",
    "history.empty": "No transactions found",
    "history.mining": "Mining Reward",
    "history.referral": "Referral Bonus",
    "history.purchase": "Purchase",
    "history.date": "Date",
    "history.amount": "Amount",
    "history.type": "Type",
    "referral.title": "Refer Friends",
    "referral.description": "Invite friends and earn FC rewards",
    "referral.code": "Your Referral Code",
    "referral.link": "Share Link",
    "referral.reward": "Earn {0} FC for each friend who joins",
    "referral.copy": "Copy",
    "referral.copied": "Copied!",
    "tasks.title": "Tasks & Badges",
    "tasks.daily": "Daily Tasks",
    "tasks.achievements": "Achievements",
    "tasks.claim": "Claim",
    "tasks.completed": "Completed",
    "tasks.progress": "In Progress",
    "mining.upgrades": "Mining Upgrades",
    "mining.speed": "Speed Boost",
    "mining.efficiency": "Efficiency",
    "mining.upgrade": "Upgrade",
    "mining.level": "Level {0}",
    "mining.cost": "Cost: {0} FC",
    "stats.title": "Statistics",
    "stats.totalMined": "Total Mined",
    "stats.miningTime": "Total Mining Time",
    "stats.upgrades": "Total Upgrades",
    "stats.referrals": "Total Referrals",
    "nav.profile": "Profile",
    "nav.history": "History",
    "nav.referral": "Referral",
    "nav.tasks": "Tasks",
    "nav.stats": "Stats",
  },
  tr: {
    "app.title": "Gelecek Coin",
    "balance.title": "FC Bakiyeniz",
    "balance.total": "Toplam kazanılan Gelecek Coin",
    "mining.title": "FC Madenciliği",
    "mining.description": "Gelecek Coin kripto para kazanmak için madencilik yapın",
    "mining.active": "DURDUR",
    "mining.inactive": "BAŞLAT",
    "mining.activeminers": "Aktif Madenciler",
    "mining.rate": "Oran",
    "security.title": "Güvenlik Merkezi",
    "transfer.title": "FC Transfer",
    "explore.button": "FC Ekosistemini Keşfet",
    "nav.mining": "Madencilik",
    "nav.team": "Takım",
    "nav.transfer": "Transfer",
    "nav.security": "Güvenlik",
    "mining.started": "Madencilik başladı",
    "mining.startedDesc": "Her 30 saniyede bir ödül kazanacaksınız.",
    "mining.stopped": "Madencilik durduruldu",
    "mining.stoppedDesc": "Bu oturumda toplam {0} FC kazandınız.",
    "mining.successful": "Madencilik başarılı!",
    "mining.successfulDesc": "{0} FC kazandınız.",
    "profile.title": "Kullanıcı Profili",
    "profile.joinDate": "Katılma tarihi",
    "profile.totalMined": "Toplam Madencilik",
    "profile.level": "Seviye",
    "profile.edit": "Profili Düzenle",
    "history.title": "İşlem Geçmişi",
    "history.empty": "İşlem bulunamadı",
    "history.mining": "Madencilik Ödülü",
    "history.referral": "Referans Bonusu",
    "history.purchase": "Satın Alma",
    "history.date": "Tarih",
    "history.amount": "Miktar",
    "history.type": "Tür",
    "referral.title": "Arkadaşlarını Davet Et",
    "referral.description": "Arkadaşlarını davet et ve FC ödülleri kazan",
    "referral.code": "Referans Kodunuz",
    "referral.link": "Paylaşım Linki",
    "referral.reward": "Katılan her arkadaşınız için {0} FC kazanın",
    "referral.copy": "Kopyala",
    "referral.copied": "Kopyalandı!",
    "tasks.title": "Görevler ve Rozetler",
    "tasks.daily": "Günlük Görevler",
    "tasks.achievements": "Başarılar",
    "tasks.claim": "Topla",
    "tasks.completed": "Tamamlandı",
    "tasks.progress": "Devam Ediyor",
    "mining.upgrades": "Madencilik Yükseltmeleri",
    "mining.speed": "Hız Artışı",
    "mining.efficiency": "Verimlilik",
    "mining.upgrade": "Yükselt",
    "mining.level": "Seviye {0}",
    "mining.cost": "Maliyet: {0} FC",
    "stats.title": "İstatistikler",
    "stats.totalMined": "Toplam Madencilik",
    "stats.miningTime": "Toplam Madencilik Süresi",
    "stats.upgrades": "Toplam Yükseltmeler",
    "stats.referrals": "Toplam Referanslar",
    "nav.profile": "Profil",
    "nav.history": "Geçmiş",
    "nav.referral": "Referans",
    "nav.tasks": "Görevler",
    "nav.stats": "İstatistikler",
  },
  zh: {
    "app.title": "未来币",
    "balance.title": "您的FC余额",
    "balance.total": "总共赚取的未来币",
    "mining.title": "FC挖矿",
    "mining.description": "挖矿以获取未来币加密货币",
    "mining.active": "停止",
    "mining.inactive": "开始",
    "mining.activeminers": "活跃矿工",
    "mining.rate": "比率",
    "security.title": "安全中心",
    "transfer.title": "转账FC",
    "explore.button": "探索FC生态系统",
    "nav.mining": "挖矿",
    "nav.team": "团队",
    "nav.transfer": "转账",
    "nav.security": "安全",
    "mining.started": "挖矿已开始",
    "mining.startedDesc": "您将每30秒获得奖励。",
    "mining.stopped": "挖矿已停止",
    "mining.stoppedDesc": "您在本次会话中共赚取了{0} FC。",
    "mining.successful": "挖矿成功！",
    "mining.successfulDesc": "您获得了{0} FC。",
    "profile.title": "用户资料",
    "profile.joinDate": "加入日期",
    "profile.totalMined": "总共挖矿量",
    "profile.level": "等级",
    "profile.edit": "编辑资料",
    "history.title": "交易历史",
    "history.empty": "未找到交易",
    "history.mining": "挖矿奖励",
    "history.referral": "推荐奖励",
    "history.purchase": "购买",
    "history.date": "日期",
    "history.amount": "金额",
    "history.type": "类型",
    "referral.title": "推荐朋友",
    "referral.description": "邀请朋友并获得FC奖励",
    "referral.code": "您的推荐码",
    "referral.link": "分享链接",
    "referral.reward": "每邀请一位朋友加入即可获得{0} FC",
    "referral.copy": "复制",
    "referral.copied": "已复制！",
    "tasks.title": "任务和徽章",
    "tasks.daily": "每日任务",
    "tasks.achievements": "成就",
    "tasks.claim": "领取",
    "tasks.completed": "已完成",
    "tasks.progress": "进行中",
    "mining.upgrades": "挖矿升级",
    "mining.speed": "速度提升",
    "mining.efficiency": "效率",
    "mining.upgrade": "升级",
    "mining.level": "等级 {0}",
    "mining.cost": "成本: {0} FC",
    "stats.title": "统计数据",
    "stats.totalMined": "总挖矿量",
    "stats.miningTime": "总挖矿时间",
    "stats.upgrades": "总升级次数",
    "stats.referrals": "总推荐人数",
    "nav.profile": "资料",
    "nav.history": "历史",
    "nav.referral": "推荐",
    "nav.tasks": "任务",
    "nav.stats": "统计",
  },
  es: {
    "app.title": "Moneda Futura",
    "balance.title": "Tu Balance de FC",
    "balance.total": "Total de Moneda Futura ganada",
    "mining.title": "Minería de FC",
    "mining.description": "Mina para ganar criptomoneda de Moneda Futura",
    "mining.active": "PARAR",
    "mining.inactive": "INICIAR",
    "mining.activeminers": "Mineros Activos",
    "mining.rate": "Tasa",
    "security.title": "Centro de Seguridad",
    "transfer.title": "Transferir FC",
    "explore.button": "Explorar Ecosistema FC",
    "nav.mining": "Minería",
    "nav.team": "Equipo",
    "nav.transfer": "Transferir",
    "nav.security": "Seguridad",
    "mining.started": "Minería iniciada",
    "mining.startedDesc": "Recibirás recompensas cada 30 segundos.",
    "mining.stopped": "Minería detenida",
    "mining.stoppedDesc": "Has ganado un total de {0} FC en esta sesión.",
    "mining.successful": "¡Minería exitosa!",
    "mining.successfulDesc": "Has ganado {0} FC.",
    "profile.title": "Perfil de Usuario",
    "profile.joinDate": "Fecha de registro",
    "profile.totalMined": "Total Minado",
    "profile.level": "Nivel",
    "profile.edit": "Editar Perfil",
    "history.title": "Historial de Transacciones",
    "history.empty": "No se encontraron transacciones",
    "history.mining": "Recompensa de Minería",
    "history.referral": "Bono de Referido",
    "history.purchase": "Compra",
    "history.date": "Fecha",
    "history.amount": "Cantidad",
    "history.type": "Tipo",
    "referral.title": "Referir Amigos",
    "referral.description": "Invita amigos y gana recompensas FC",
    "referral.code": "Tu Código de Referido",
    "referral.link": "Enlace para Compartir",
    "referral.reward": "Gana {0} FC por cada amigo que se une",
    "referral.copy": "Copiar",
    "referral.copied": "¡Copiado!",
    "tasks.title": "Tareas y Insignias",
    "tasks.daily": "Tareas Diarias",
    "tasks.achievements": "Logros",
    "tasks.claim": "Reclamar",
    "tasks.completed": "Completado",
    "tasks.progress": "En Progreso",
    "mining.upgrades": "Mejoras de Minería",
    "mining.speed": "Aumento de Velocidad",
    "mining.efficiency": "Eficiencia",
    "mining.upgrade": "Mejorar",
    "mining.level": "Nivel {0}",
    "mining.cost": "Costo: {0} FC",
    "stats.title": "Estadísticas",
    "stats.totalMined": "Total Minado",
    "stats.miningTime": "Tiempo Total de Minería",
    "stats.upgrades": "Total de Mejoras",
    "stats.referrals": "Total de Referidos",
    "nav.profile": "Perfil",
    "nav.history": "Historial",
    "nav.referral": "Referidos",
    "nav.tasks": "Tareas",
    "nav.stats": "Estadísticas",
  },
  ru: {
    "app.title": "Будущая Монета",
    "balance.title": "Ваш Баланс FC",
    "balance.total": "Всего заработано Будущих Монет",
    "mining.title": "Майнинг FC",
    "mining.description": "Майните, чтобы получить криптовалюту Будущая Монета",
    "mining.active": "СТОП",
    "mining.inactive": "СТАРТ",
    "mining.activeminers": "Активные Майнеры",
    "mining.rate": "Ставка",
    "security.title": "Центр Безопасности",
    "transfer.title": "Перевод FC",
    "explore.button": "Исследовать Экосистему FC",
    "nav.mining": "Майнинг",
    "nav.team": "Команда",
    "nav.transfer": "Перевод",
    "nav.security": "Безопасность",
    "mining.started": "Майнинг начат",
    "mining.startedDesc": "Вы будете получать награды каждые 30 секунд.",
    "mining.stopped": "Майнинг остановлен",
    "mining.stoppedDesc": "Вы заработали в общей сложности {0} FC в этой сессии.",
    "mining.successful": "Майнинг успешен!",
    "mining.successfulDesc": "Вы заработали {0} FC.",
    "profile.title": "Профиль Пользователя",
    "profile.joinDate": "Дата регистрации",
    "profile.totalMined": "Всего Добыто",
    "profile.level": "Уровень",
    "profile.edit": "Редактировать Профиль",
    "history.title": "История Транзакций",
    "history.empty": "Транзакции не найдены",
    "history.mining": "Награда за Майнинг",
    "history.referral": "Бонус за Реферала",
    "history.purchase": "Покупка",
    "history.date": "Дата",
    "history.amount": "Сумма",
    "history.type": "Тип",
    "referral.title": "Пригласить Друзей",
    "referral.description": "Пригласите друзей и получите награды FC",
    "referral.code": "Ваш Реферальный Код",
    "referral.link": "Поделиться Ссылкой",
    "referral.reward": "Получите {0} FC за каждого присоединившегося друга",
    "referral.copy": "Копировать",
    "referral.copied": "Скопировано!",
    "tasks.title": "Задания и Значки",
    "tasks.daily": "Ежедневные Задания",
    "tasks.achievements": "Достижения",
    "tasks.claim": "Получить",
    "tasks.completed": "Выполнено",
    "tasks.progress": "В Процессе",
    "mining.upgrades": "Улучшения Майнинга",
    "mining.speed": "Ускорение",
    "mining.efficiency": "Эффективность",
    "mining.upgrade": "Улучшить",
    "mining.level": "Уровень {0}",
    "mining.cost": "Стоимость: {0} FC",
    "stats.title": "Статистика",
    "stats.totalMined": "Всего Добыто",
    "stats.miningTime": "Общее Время Майнинга",
    "stats.upgrades": "Всего Улучшений",
    "stats.referrals": "Всего Рефералов",
    "nav.profile": "Профиль",
    "nav.history": "История",
    "nav.referral": "Рефералы",
    "nav.tasks": "Задания",
    "nav.stats": "Статистика",
  },
  fr: {
    "app.title": "Future Coin",
    "balance.title": "Votre Solde FC",
    "balance.total": "Total des Future Coins gagnés",
    "mining.title": "Minage FC",
    "mining.description": "Minez pour gagner de la cryptomonnaie Future Coin",
    "mining.active": "ARRÊTER",
    "mining.inactive": "DÉMARRER",
    "mining.activeminers": "Mineurs Actifs",
    "mining.rate": "Taux",
    "security.title": "Centre de Sécurité",
    "transfer.title": "Transfert FC",
    "explore.button": "Explorer l'Écosystème FC",
    "nav.mining": "Minage",
    "nav.team": "Équipe",
    "nav.transfer": "Transfert",
    "nav.security": "Sécurité",
    "mining.started": "Minage démarré",
    "mining.startedDesc": "Vous recevrez des récompenses toutes les 30 secondes.",
    "mining.stopped": "Minage arrêté",
    "mining.stoppedDesc": "Vous avez gagné un total de {0} FC dans cette session.",
    "mining.successful": "Minage réussi !",
    "mining.successfulDesc": "Vous avez gagné {0} FC.",
    "profile.title": "Profil Utilisateur",
    "profile.joinDate": "Inscrit le",
    "profile.totalMined": "Total Miné",
    "profile.level": "Niveau",
    "profile.edit": "Modifier le Profil",
    "history.title": "Historique des Transactions",
    "history.empty": "Aucune transaction trouvée",
    "history.mining": "Récompense de Minage",
    "history.referral": "Bono de Parrainage",
    "history.purchase": "Achat",
    "history.date": "Date",
    "history.amount": "Montant",
    "history.type": "Type",
    "referral.title": "Parrainer des Amis",
    "referral.description": "Invitez des amis et gagnez des récompenses FC",
    "referral.code": "Votre Code de Parrainage",
    "referral.link": "Lien de Partage",
    "referral.reward": "Gagnez {0} FC pour chaque ami qui rejoint",
    "referral.copy": "Copier",
    "referral.copied": "Copié !",
    "tasks.title": "Tâches et Badges",
    "tasks.daily": "Tâches Quotidiennes",
    "tasks.achievements": "Logros",
    "tasks.claim": "Réclamer",
    "tasks.completed": "Terminé",
    "tasks.progress": "En Cours",
    "mining.upgrades": "Améliorations de Minage",
    "mining.speed": "Boost de Vitesse",
    "mining.efficiency": "Efficacité",
    "mining.upgrade": "Améliorer",
    "mining.level": "Niveau {0}",
    "mining.cost": "Coût: {0} FC",
    "stats.title": "Statistiques",
    "stats.totalMined": "Total Miné",
    "stats.miningTime": "Temps Total de Minage",
    "stats.upgrades": "Total des Améliorations",
    "stats.referrals": "Total des Parrainages",
    "nav.profile": "Profil",
    "nav.history": "Historique",
    "nav.referral": "Parrainage",
    "nav.tasks": "Tâches",
    "nav.stats": "Stats",
  },
  de: {
    "app.title": "Future Coin",
    "balance.title": "Ihr FC Guthaben",
    "balance.total": "Insgesamt verdiente Future Coin",
    "mining.title": "FC Mining",
    "mining.description": "Schürfen Sie Future Coin Kryptowährung",
    "mining.active": "STOPP",
    "mining.inactive": "START",
    "mining.activeminers": "Aktive Miner",
    "mining.rate": "Rate",
    "security.title": "Sicherheitszentrum",
    "transfer.title": "FC Übertragen",
    "explore.button": "FC Ökosystem Erkunden",
    "nav.mining": "Mining",
    "nav.team": "Team",
    "nav.transfer": "Übertragen",
    "nav.security": "Sicherheit",
    "mining.started": "Mining gestartet",
    "mining.startedDesc": "Sie erhalten alle 30 Sekunden Belohnungen.",
    "mining.stopped": "Mining gestoppt",
    "mining.stoppedDesc": "Sie haben in dieser Sitzung insgesamt {0} FC verdient.",
    "mining.successful": "Mining erfolgreich!",
    "mining.successfulDesc": "Sie haben {0} FC verdient.",
    "profile.title": "Benutzerprofil",
    "profile.joinDate": "Beigetreten am",
    "profile.totalMined": "Insgesamt Geschürft",
    "profile.level": "Level",
    "profile.edit": "Profil Bearbeiten",
    "history.title": "Transaktionsverlauf",
    "history.empty": "Keine Transaktionen gefunden",
    "history.mining": "Mining-Belohnung",
    "history.referral": "Empfehlungsbonus",
    "history.purchase": "Kauf",
    "history.date": "Datum",
    "history.amount": "Betrag",
    "history.type": "Typ",
    "referral.title": "Freunde Empfehlen",
    "referral.description": "Laden Sie Freunde ein und verdienen Sie FC-Belohnungen",
    "referral.code": "Ihr Empfehlungscode",
    "referral.link": "Link Teilen",
    "referral.reward": "Verdienen Sie {0} FC für jeden Freund, der beitritt",
    "referral.copy": "Kopieren",
    "referral.copied": "Kopiert!",
    "tasks.title": "Aufgaben & Abzeichen",
    "tasks.daily": "Tägliche Aufgaben",
    "tasks.achievements": "Erfolge",
    "tasks.claim": "Einfordern",
    "tasks.completed": "Abgeschlossen",
    "tasks.progress": "In Bearbeitung",
    "mining.upgrades": "Mining-Verbesserungen",
    "mining.speed": "Geschwindigkeitsschub",
    "mining.efficiency": "Effizienz",
    "mining.upgrade": "Verbessern",
    "mining.level": "Level {0}",
    "mining.cost": "Kosten: {0} FC",
    "stats.title": "Statistiken",
    "stats.totalMined": "Insgesamt Geschürft",
    "stats.miningTime": "Gesamte Mining-Zeit",
    "stats.upgrades": "Gesamte Verbesserungen",
    "stats.referrals": "Gesamte Empfehlungen",
    "nav.profile": "Profil",
    "nav.history": "Verlauf",
    "nav.referral": "Empfehlung",
    "nav.tasks": "Aufgaben",
    "nav.stats": "Statistiken",
  },
  ar: {
    "app.title": "عملة المستقبل",
    "balance.title": "رصيدك من FC",
    "balance.total": "إجمالي عملة المستقبل المكتسبة",
    "mining.title": "تعدين FC",
    "mining.description": "قم بالتعدين لكسب عملة المستقبل المشفرة",
    "mining.active": "إيقاف",
    "mining.inactive": "بدء",
    "mining.activeminers": "المعدنين النشطين",
    "mining.rate": "المعدل",
    "security.title": "مركز الأمان",
    "transfer.title": "تحويل FC",
    "explore.button": "استكشاف نظام FC",
    "nav.mining": "التعدين",
    "nav.team": "الفريق",
    "nav.transfer": "تحويل",
    "nav.security": "الأمان",
    "mining.started": "بدأ التعدين",
    "mining.startedDesc": "ستحصل على مكافآت كل 30 ثانية.",
    "mining.stopped": "توقف التعدين",
    "mining.stoppedDesc": "لقد ربحت ما مجموعه {0} FC في هذه الجلسة.",
    "mining.successful": "تم التعدين بنجاح!",
    "mining.successfulDesc": "لقد ربحت {0} FC.",
    "profile.title": "الملف الشخصي",
    "profile.joinDate": "تاريخ الانضمام",
    "profile.totalMined": "إجمالي التعدين",
    "profile.level": "المستوى",
    "profile.edit": "تعديل الملف الشخصي",
    "history.title": "سجل المعاملات",
    "history.empty": "لم يتم العثور على معاملات",
    "history.mining": "مكافأة التعدين",
    "history.referral": "كاف

