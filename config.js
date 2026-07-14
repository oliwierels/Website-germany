/* ============================================================
   LVD_CONFIG — the single edit point for swappable content.
   König Ludwig II von Robotollern · B2B booking site
   Loaded before content.js / app.js. Plain global config.
   ------------------------------------------------------------
   >>> LAUNCH STATUS (сайт ОПУБЛИКОВАН 04.07.2026 — noindex снят, пароль убран):
       [x] Реальные юр-данные (арендованный адрес, телефон, info@) — 04.07.2026
       [x] contact.endpoint живой: crm.robotollern.de
       [x] Соцсети — реальные URL
       [x] Шрифты локально (без Google Fonts), картинки WebP
       [ ] ОСТАЛОСЬ: вписать legal.vatId, когда придёт USt-IdNr от Finanzamt
       [ ] Analytics (Clarity): вписать analytics.clarityId + раздел в Datenschutz
           уже готов; скрипт грузится только после согласия «Statistik»
   ============================================================ */
window.LVD_CONFIG = {

  /* --- ROYAL PHOTO SWAP -----------------------------------------------
     The crown + red-sable-cloak shoot is not in yet. While this flag is
     false the page shows the current plain Unitree G1 cutouts WITH a small
     "Krone + Umhang folgt" annotation over each robot image.
     When the studio shots arrive:
        1) drop them into assets/robots/ (same filenames, or change paths)
        2) set  royalPhotosReady: true
     The annotations disappear and nothing else changes. One-move swap. */
  royalPhotosReady: true,

  images: {
    hero:  'assets/robots/king.png',
    what:  'assets/robots/king-wave.png',
    /* Флот: собака — U.S. Army photo (Public Domain), дрон — A.BourgeoisP,
       CC BY 4.0 via Wikimedia Commons (Bildnachweis в Impressum). Карточка
       короля берёт hero-фото, карточка G1-брендинга — bust. */
    fleet: {
      dog:      'assets/robots/fleet-dog.png',
      drone:    'assets/robots/fleet-drone.png',
      branding: 'assets/robots/bust.png',
    },
    /* GALERIE «Live vom Hof»: сейчас плейсхолдеры — заменить на фото/кадры
       с тура и из соцсетей (просто поменяй пути/подписи и пересобери). */
    /* Порядок = визуальный ритм (арт-ревью 04.07): верхний ряд — три полные
       фигуры (якорь/диагональ/шаг внутрь), нижний — кропы по углам.
       crop: 'bust' = портретный кроп с bleed вверх+вниз; 'waist' = срез по
       бёдрам, bleed только вниз. Полные фигуры — без crop. */
    gallery: [
      { src: 'assets/robots/walk.png',   de: 'Auftritt',     en: 'On stage' },
      { src: 'assets/robots/front2.png', de: 'Dynamik',      en: 'Dynamic' },
      { src: 'assets/robots/kick.png',   de: 'In Bewegung',  en: 'In motion' },
      { src: 'assets/robots/bust.png',   de: 'Porträt',      en: 'Portrait', crop: 'bust' },
      { src: 'assets/robots/squat.png',  de: 'Showeinlage',  en: 'Show act' },
      { src: 'assets/robots/sit.png',    de: 'Begrüßung',    en: 'Greeting', crop: 'waist' },
    ],
  },

  /* --- SOCIAL HUB ------------------------------------------------------
     The site is the hub for every channel. Real profile URLs (2026-07-03).
     Icons render monochrome with an ember hover; each link gets an
     aria-label built from `label` and opens in a new tab. */
  socials: [
    { icon: 'instagram',      label: 'Instagram', href: 'https://www.instagram.com/robotollern' },
    { icon: 'brand-tiktok',   label: 'TikTok',    href: 'https://www.tiktok.com/@robotollern' },
    { icon: 'youtube',        label: 'YouTube',   href: 'https://www.youtube.com/@LudwigIIvonRobottollern' },
    { icon: 'brand-threads',  label: 'Threads',   href: 'https://www.threads.com/@robotollern' },
    { icon: 'facebook',       label: 'Facebook',  href: 'https://www.facebook.com/share/1BYhCKFLCV/' },
    { icon: 'brand-x',        label: 'X',         href: 'https://x.com/robotollern' },
  ],

  /* --- CONTACT / FORM --------------------------------------------------
     No backend yet. Set `endpoint` to a POST URL to go live (the form falls
     back to a simulated success while it is empty). email/phone are the
     SINGLE source — the Impressum and the form's mailto fallback both read
     these (no second copy elsewhere). */
  contact: {
    email:    'info@robotollern.de',                            // общая почта для контактов (на сайте и в Impressum)
    phone:    '+49 160 5724145',                                // показывается ТОЛЬКО в Impressum (не в футере)
    endpoint: 'https://crm.robotollern.de/api/lead-form',       // живой приём заявок → CRM-лиды
  },

  /* --- ANALYTICS (Microsoft Clarity: Heatmaps, Session-Recordings) ------
     Бесплатно. Скрипт грузится ТОЛЬКО после согласия «Statistik» в баннере.
     Включить: 1) завести проект на clarity.microsoft.com → скопировать ID;
     2) вписать его сюда; 3) добавить раздел «Webanalyse (Microsoft Clarity)»
     в Datenschutzerklärung (напомнить Claude). Пустой ID = ничего не грузится. */
  analytics: {
    clarityId: '',
  },

  /* --- KI-CHAT-WIDGET ---------------------------------------------------
     Плавающий чат-ассистент (правый нижний угол). Живёт на CRM-сервере;
     квалифицирует запросы и складывает лиды в дашборд crm.robotollern.de.
     Отключить: enabled: false. */
  chatWidget: {
    enabled: true,
    src: 'https://crm.robotollern.de/widget.js',
  },

  /* --- LEGAL PLACEHOLDERS ---------------------------------------------
     The UG is not registered yet. These bracketed values are findable by
     search and replaced in one pass before launch. email/phone are pulled
     from `contact` above so there is only ONE place to edit them. */
  /* ENTWURF (черновые данные, 03.07.2026) — перед публикацией заменить на
     данные зарегистрированной фирмы. Всё ещё помечено .ph-пилюлями в модалке. */
  legal: {
    /* publicBrand — то, что видно в футере (без имени/адреса).
       Полные юр-данные показываются только в Impressum-модалке.
       Адрес — арендованная ladungsfähige Geschäftsadresse (04.07.2026);
       домашний адрес НЕ публикуется. */
    publicBrand:  'GERA',
    company:      'GERA – Maksym Herasymenko',      // Einzelunternehmen (Diensteanbieter = Inhaber)
    careOf:       'c/o MDC#robotollern',
    street:       'Welserstraße 3',
    city:         '87463 Dietmannsried',
    managing:     'Maksym Herasymenko',
    register:     'Einzelunternehmen — keine Eintragung im Handelsregister',
    vatId:        'USt-IdNr.: folgt',               // ENTWURF: вписать, когда придёт от Finanzamt
    hostProvider: 'Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland',
    lastUpdated:  '04.07.2026',
    // email + phone come from contact.* (single source) — see app.js
  },
};
