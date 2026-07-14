/* ============================================================
   LVD_CONTENT — all page copy, DE + EN, one place to edit words.
   1:1 with the Claude Design prototype (König Ludwig II, v2).
   Sections rendered: Hero · Was · Einsatz · Buchung · Kontakt + Footer.
   Formal "Sie", no emoji. AI disclosure (EU AI Act Art. 50) in the footer.
   ============================================================ */
window.LVD_CONTENT = {

  /* ---------------------------- DEUTSCH ---------------------------- */
  de: {
    skip: 'Zum Inhalt springen',

    nav: {
      links: [['#top', 'Start'], ['#cases', 'Einsatz'], ['#booking', 'Buchung']],
      langLabel: 'Sprache wählen',
      cta: 'Roboter buchen',
      menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
    },

    hero: {
      royal: 'Der König unter den Robotern.',
      tag: 'Seine Majestät Ludwig II. — humanoider Roboter, Content-Charakter und Gastgeber königlicher Momente. Kein Gerät von der Stange, sondern ein Charakter mit Hofstaat.',
      book: 'Roboter buchen', how: 'So funktioniert’s',
      scroll: 'Audienz beginnen',
      chips: ['Operator inklusive', 'Versichert', 'Deutsch & English', '24/7 erreichbar'],
      heroAlt: 'König Ludwig II., humanoider Unitree-G1-Roboter, mit Krone und rotem Umhang',
    },

    what: {
      kicker: 'Was ist Ludwig II.',
      title: [{ t: 'Der ' }, { t: 'König-Roboter', ember: true }, { br: true }, { t: 'für Ihre Events.' }],
      body: [
        'Seine Majestät ist ein KI-gesteuerter humanoider Roboter (Unitree G1): Er läuft, gestikuliert, spricht und gewährt seinen Gästen Audienz. Im Klartext — ein Event-Roboter, der Ihr Publikum unterhält, anspricht und im Gespräch hält.',
        'Stets in Begleitung eines geschulten Operators. Großspurig im Auftritt, präzise im Betrieb: König im Ton, Profi in der Ausführung.',
      ],
      photoAlt: 'König Ludwig II., humanoider Roboter, mit Krone und rotem Umhang, grüßend',
      specs: [
        ['Unitree G1', 'Humanoide Plattform'],
        ['~1,3 m', 'Körpergröße'],
        ['DE / EN', 'Sprachen, live'],
        ['Operator', 'Immer betreut'],
      ],
    },

    why: {
      kicker: 'Warum ein König-Roboter',
      title: [{ t: 'Wir verkaufen keine Roboter. ' }, { br: true }, { t: 'Wir verkaufen Aufmerksamkeit.', ember: true }],
      intro: 'Weil Werbung übersehen wird — und ein König nicht.',
      items: [
        { icon: 'eye',          title: 'Durchbricht die Banner-Blindheit', body: 'Anzeigen werden weggeklickt, ein König, der durch den Raum schreitet, nicht. Live-Erlebnis schlägt Werbefläche.' },
        { icon: 'fingerprint',  title: 'Unverwechselbare Positionierung', body: 'Ein Auftritt, den Ihre Branche so noch nicht gesehen hat — Ihre Marke wird mit diesem Moment erinnert.' },
        { icon: 'users',        title: 'Volle Aufmerksamkeit des Publikums', body: 'Gäste bleiben stehen, schauen, fragen, filmen — Ihr Stand oder Event wird zum Treffpunkt.' },
        { icon: 'clapperboard', title: 'Viraler Content inklusive', body: 'Jeder Auftritt liefert Foto- und Videomomente, die Gäste freiwillig teilen — organische Reichweite für Ihre Kanäle.' },
      ],
    },

    cases: {
      kicker: 'Einsatzbereiche', title: 'Wo der König Hof hält',
      intro: 'Königliche Geste, klarer Nutzen. Jedes Format bringt einen Anziehungspunkt, über den gesprochen wird — betreut und planbar.',
      items: [
        { icon: 'briefcase',      title: 'Firmenevents, Messen & Konferenzen', royal: '„Audienz auf dem Messestand."', body: 'Standmagnet mit Anziehungskraft — zieht Besucher an und bringt Gespräche in Gang.' },
        { icon: 'rocket',         title: 'Produktlaunches',             royal: '„Seine Majestät enthüllt."',    body: 'Ein Launch-Moment mit Bühne und Reichweite — Aufmerksamkeit, die bleibt.' },
        { icon: 'store',          title: 'Eröffnungen & Retail',        royal: '„Royale Eröffnung."',           body: 'Store- und Filialeröffnungen mit einem Anziehungspunkt, über den man spricht.' },
        { icon: 'gem',            title: 'Hochzeiten & Premium-Feiern', royal: '„Der König gratuliert."',       body: 'Hochzeiten und exklusive Feiern — in Zusammenarbeit mit Eventagenturen und Locations.' },
        { icon: 'party-popper',   title: 'Jubiläen & Kollaborationen',  royal: '„Hofstaat trifft Content."',   body: 'Geburtstage, Jubiläen und Kollabs mit Creator:innen, Blogger:innen, Promis.' },
        { icon: 'heart-handshake', title: 'Soziale Projekte',           warm: 'Ein Auftritt mit Haltung.',      body: 'Begleitete Auftritte bei sozialen und gemeinnützigen Projekten — Aufmerksamkeit für gute Anliegen, behutsam und planbar.' },
      ],
    },

    brands: {
      kicker: 'Für Marken & Medien',
      title: [{ t: 'Der König macht auch ' }, { t: 'Content.', ember: true }],
      intro: 'Ludwig II. ist nicht nur Gast auf Ihrem Event — er ist ein Charakter mit eigenen Kanälen. Seine Reichweite ist jung, seine Bühne offen: Wer früh dabei ist, prägt die Geschichte mit.',
      items: [
        { icon: 'megaphone',    title: 'Brand-Integrationen', royal: '„Der König empfiehlt."', body: 'Ihr Produkt oder Ihre Marke in Ludwigs Videoformaten — als Szene, Gag oder Gastauftritt. Gekennzeichnet, abgestimmt, im Charakter.' },
        { icon: 'shirt',        title: 'Ausstattungs-Partnerschaften', royal: '„Hoflieferant gesucht."', body: 'Krone, Umhang, Accessoires — oder ein G1 in Ihren Farben. Ihre Marke wird Teil der königlichen Garderobe.' },
        { icon: 'video',        title: 'Tech-Reviews & UGC', royal: '„Seine Majestät testet."', body: 'Produktvorstellungen aus königlicher Perspektive — Content, den Sie auf Ihren eigenen Kanälen weiterverwenden können.' },
        { icon: 'handshake',    title: 'Kollaborationen', royal: '„Hof trifft Hof."', body: 'Gemeinsame Formate mit Creator:innen, Redaktionen und Marken — vom Kurzvideo bis zur Serie.' },
      ],
      note: 'Werbliche Inhalte werden als solche gekennzeichnet. Konzept und Umfang: individuell.',
    },

    fleet: {
      kicker: 'Die königliche Flotte', title: 'Der Hofstaat wächst.',
      intro: 'Ludwig II. ist das Gesicht — aber nicht allein. Für Ihr Event stellt der Hof weitere Roboter: heute auf Anfrage, morgen als feste Flotte.',
      items: [
        { icon: 'crown', title: 'König Ludwig II.', royal: '„Das Original."', body: 'Der König unter den Robotern — Krone, Umhang, Audienz. Der Hauptdarsteller für Ihren Anlass.' },
        { icon: 'dog',   title: 'Roboter-Hunde', royal: '„Die Hofhunde."', body: 'Vierbeinige Roboter für Begleitauftritte, Foto-Momente und Interaktion auf Augenhöhe der kleinen Gäste.', status: 'In Vorbereitung' },
        { icon: 'plane', title: 'Drohnen', royal: '„Die Falken des Hofes."', body: 'Aufnahmen Ihres Events aus der Luft und Show-Elemente von oben — nach Absprache und Genehmigungslage.', status: 'In Vorbereitung' },
        { icon: 'bot',   title: 'G1 im Firmen-Branding', royal: '„Ihr Wappen, unser Ritter."', body: 'Ein humanoider Unitree G1 in Ihren Farben und mit Ihrem Logo — als Markenbotschafter auf Zeit.', status: 'Auf Anfrage' },
      ],
      note: 'Verfügbarkeit und Konditionen je nach Format und Termin — fragen Sie unverbindlich an.',
    },

    booking: {
      kicker: 'Ablauf', title: 'So funktioniert die Audienz',
      steps: [
        { n: '01', icon: 'mail',            title: 'Anfrage',    royal: '„Bittet um Audienz."', body: 'Event, Datum und Ort kurz schildern. Sie erhalten zeitnah ein individuelles Angebot.' },
        { n: '02', icon: 'clipboard-check', title: 'Abstimmung', royal: '„Der Hof plant."',     body: 'Ablauf, Sicherheitskonzept und Technik werden gemeinsam festgelegt.' },
        { n: '03', icon: 'crown',           title: 'Auftritt',   royal: '„Der König erscheint."', body: 'Ludwig II. kommt mit Operator und Equipment — professionell betreut von Aufbau bis Abbau.' },
      ],
    },

    scope: {
      kicker: 'Leistungsumfang', title: 'Was die Audienz umfasst.',
      intro: 'Kein Baukasten mit Sternchen. Jeder Einsatz wird individuell auf Ihr Event und Ihre Marke zugeschnitten — und beinhaltet standardmäßig:',
      items: [
        'Ludwig II. in vollem Ornat — Krone, Umhang, königliche Laune',
        'Geschulter Operator während des gesamten Einsatzes',
        'Anreise, Aufbau, Technik-Check und Abbau',
        'Abgestimmter Ablauf und Sicherheitskonzept für Ihre Fläche',
        'Live-Interaktion auf Deutsch und Englisch',
        'Versicherter Betrieb',
        'Auf Wunsch: Content-Aufnahmen vom Einsatz für Ihre Kanäle — nach Absprache',
      ],
      price: 'Einsätze ab 2.500 € zzgl. USt.',
      priceNote: 'Das konkrete Angebot richtet sich nach Format, Dauer und Ort. Ludwig II. ist bewusst kein Massenprodukt — ein Act für Marken und Momente, die herausstechen sollen.',
    },

    ctaBand: {
      title: 'Bereit für eine Audienz?',
      sub: 'Schildern Sie Ihr Event in zwei Sätzen im Chat — unser KI-Assistent nimmt alles auf und das Team antwortet zeitnah mit einem individuellen Angebot. Rund um die Uhr.',
      primary: 'Anfrage im Chat starten', secondary: 'Lieber per Formular',
    },

    assistant: {
      kicker: 'Direkter Draht', title: 'Der Hof antwortet sofort.',
      body: 'Kein Formular-Pingpong, keine Warteschleife: Unser KI-Assistent nimmt Ihre Anfrage direkt im Chat auf, stellt die zwei, drei entscheidenden Rückfragen — Anlass, Datum, Ort — und übergibt alles sofort ans Team. Rund um die Uhr, an jedem Tag.',
      chat: 'Chat hier starten', tg: 'Per Telegram schreiben', mail: 'E-Mail schreiben', wa: 'WhatsApp — in Vorbereitung',
      tgHref: 'https://t.me/dashboard_robotollern_bot',
      note: 'Sie chatten mit einer KI (Kennzeichnung gemäß EU AI Act, Art. 50) — Ihre Angaben gehen direkt ans Team.',
    },

    gallery: {
      kicker: 'Galerie', title: 'Live vom Hof',
      note: 'Momente von Events, Touren und aus Ludwigs Kanälen.',
    },

    faq: {
      kicker: 'Häufige Fragen', title: 'Der Hof gibt Auskunft',
      items: [
        { q: 'Was kann Ludwig auf einem Event?', a: 'Ludwig begrüßt Gäste, bewegt sich frei durch den Raum, interagiert mit dem Publikum und sorgt für Foto- und Videomomente, die geteilt werden. Er wird immer von einem professionellen Operator begleitet.' },
        { q: 'Was kostet ein Auftritt?', a: 'Einsätze beginnen ab 2.500 € zzgl. USt. — der Startpreis für ein kompaktes Format (ab ca. 2 Stunden). Der konkrete Preis hängt von Format, Dauer, Programm und Individualisierung ab; Sie erhalten immer ein individuelles Angebot. Gearbeitet wird mit einer prozentualen Anzahlung.' },
        { q: 'Für welche Anlässe kann man Ludwig buchen?', a: 'Store- und Showroom-Eröffnungen, Messen und Konferenzen, Firmenfeiern, Produktpräsentationen, Presse-Events, Premium-Hochzeiten — und Marken-Kooperationen im Content-Bereich.' },
        { q: 'In welchen Städten und Ländern seid ihr verfügbar?', a: 'Deutschland, Österreich und die Schweiz — Anfahrt und Logistik werden im Angebot individuell berücksichtigt. Weitere Länder und Sprachen sind auf Anfrage möglich.' },
        { q: 'Wie weit im Voraus muss ich buchen?', a: 'Je früher, desto besser — beliebte Termine (Wochenenden, Messezeiten) sind schnell vergeben. Fragen Sie am besten 2–4 Wochen im Voraus an; kurzfristige Anfragen versuchen wir möglich zu machen.' },
        { q: 'Was braucht ihr vor Ort?', a: 'Eine ebene Fläche, Stromanschluss, Internetzugang und einen Raum zur Vorbereitung. Der Veranstalter sorgt für einen geordneten Ablauf und weist die Gäste auf die Regeln hin. Alle Details werden bei der Buchung festgehalten.' },
        { q: 'Drinnen oder draußen?', a: 'Beides ist möglich. Grenzen setzen starke Hitze, Regen, große Treppen und unkontrollierbare Menschenmengen ohne gesicherten Abstand — solche Punkte klären wir vorab gemeinsam.' },
        { q: 'Wie lange dauert ein Auftritt?', a: 'Flexibel — vom kurzen Highlight-Auftritt bis zu mehreren Stunden. Der Akku hält im Schnitt 1,5–2 Stunden aktiven Betrieb; der Wechsel dauert nur wenige Minuten und wird als kurze Pause eingeplant.' },
        { q: 'Ist das sicher für die Gäste?', a: 'Ja. Ludwig wird durchgehend von einem erfahrenen Operator begleitet und gesteuert; Ablauf und Sicherheitskonzept werden vorab mit Ihnen geplant. Der Betrieb ist versichert.' },
      ],
    },

    contact: {
      kicker: 'Anfrage & Buchung', title: 'Audienz anfragen',
      body: 'Schildern Sie Ihr Event — Sie erhalten zeitnah ein individuelles Angebot.',
      wit: 'Seine Majestät antwortet höchstpersönlich. Beziehungsweise das Team.',
      avail: 'Keine Warteschleifen, keine endlosen Terminketten: Unser KI-Assistent ist rund um die Uhr für Sie da, das Team antwortet schnell — Sie bleiben nie ohne Antwort.',
      fields: { company: 'Firma', name: 'Ansprechpartner', email: 'E-Mail', occasion: 'Anlass & Wunschtermin', message: 'Nachricht' },
      ph: { company: 'Unternehmen', name: 'Vor- und Nachname', email: 'name@firma.de', occasion: 'z. B. Messe-Eröffnung, 14.09.', message: 'Ort, ungefähre Gästezahl, Besonderheiten …' },
      submit: 'Anfrage senden', optional: '(optional)',
      note: 'Mit * markierte Felder sind Pflichtfelder. Unser Angebot richtet sich an Geschäftskunden (B2B). Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben gemäß unserer Datenschutzerklärung zu.',
      errReq: 'Bitte ausfüllen.', errEmail: 'Bitte eine gültige E-Mail-Adresse angeben.',
      okTitle: 'Anfrage eingegangen.', okBody: 'Vielen Dank — der Hofstaat meldet sich zeitnah mit einem Angebot.',
    },

    footer: {
      ai: 'Ludwig II. ist eine KI.',
      aiBody: 'Ludwig II. von Robotollern ist ein KI-gesteuerter humanoider Roboter. Gäste interagieren mit einer künstlichen Intelligenz — Kennzeichnung gemäß EU AI Act, Art. 50.',
      nav: [['#what', 'Was'], ['#cases', 'Einsatz'], ['#fleet', 'Flotte'], ['#booking', 'Buchung'], ['#gallery', 'Galerie'], ['#assistant', 'Direkter Draht'], ['#faq', 'FAQ'], ['#contact', 'Anfrage']],
      navLabel: 'Navigation', legalLabel: 'Rechtliches',
      citiesLabel: 'Roboter mieten in',
      cities: [['/roboter-mieten/berlin/', 'Berlin'], ['/roboter-mieten/hamburg/', 'Hamburg'], ['/roboter-mieten/muenchen/', 'München'], ['/roboter-mieten/koeln/', 'Köln'], ['/roboter-mieten/frankfurt-am-main/', 'Frankfurt am Main'], ['/roboter-mieten/duesseldorf/', 'Düsseldorf'], ['/roboter-mieten/stuttgart/', 'Stuttgart'], ['/roboter-mieten/leipzig/', 'Leipzig']],
      citiesAll: ['/roboter-mieten/', 'Alle Einsatzorte'], blogLink: ['/blog/', 'Blog & Ratgeber'],
      legal: [['impressum', 'Impressum'], ['datenschutz', 'Datenschutzerklärung'], ['barrierefreiheit', 'Barrierefreiheitserklärung']],
      cookies: 'Cookie-Einstellungen',
      a11ySettings: 'Barrierefreiheit',
      courtH: 'Der Hofstaat versammelt sich', courtSub: 'Folgen Sie dem König.',
      rights: 'Alle Rechte vorbehalten.', on: 'auf',
      b2b: 'Unsere Angebote richten sich ausschließlich an Unternehmen, Gewerbetreibende und öffentliche Auftraggeber (B2B).',
      made: 'Berlin · Unitree G1 · Deutschlandweit im Einsatz',
    },

    cookie: {
      title: 'Cookies & Einwilligung',
      body: 'Wir verwenden technisch notwendige Cookies. Nicht notwendige Cookies (Statistik, Marketing) setzen wir nur mit Ihrer Einwilligung — standardmäßig deaktiviert.',
      privacy: 'Datenschutz', settings: 'Einstellungen',
      reject: 'Alle ablehnen', save: 'Auswahl speichern', accept: 'Alle akzeptieren',
      essential: 'Notwendig', essentialNote: 'Immer aktiv — für Betrieb und Sicherheit.',
      analytics: 'Statistik', analyticsNote: 'Anonyme Reichweitenmessung.',
      marketing: 'Marketing', marketingNote: 'Personalisierte Inhalte & Kampagnen.',
    },

    legal: {
      tabs: [['impressum', 'Impressum'], ['datenschutz', 'Datenschutz'], ['barrierefreiheit', 'Barrierefreiheit']],
      docsLabel: 'Rechtsdokumente', close: 'Schließen',
    },
  },

  /* ---------------------------- ENGLISH ---------------------------- */
  en: {
    skip: 'Skip to content',

    nav: {
      links: [['#top', 'Home'], ['#cases', 'Use cases'], ['#booking', 'Booking']],
      langLabel: 'Choose language',
      cta: 'Book robot',
      menuOpen: 'Open menu', menuClose: 'Close menu',
    },

    hero: {
      royal: 'The king among robots.',
      tag: 'His Majesty Ludwig II — humanoid robot, content character and host of royal moments. Not an off-the-shelf device, but a character with a court.',
      book: 'Book the robot', how: 'How it works',
      scroll: 'Begin audience',
      chips: ['Operator included', 'Insured', 'German & English', 'Available 24/7'],
      heroAlt: 'King Ludwig II, humanoid Unitree G1 robot, with crown and red cloak',
    },

    what: {
      kicker: 'What Ludwig II is',
      title: [{ t: 'The ' }, { t: 'king robot', ember: true }, { br: true }, { t: 'for your events.' }],
      body: [
        'His Majesty is an AI-driven humanoid robot (Unitree G1): he walks, gestures, speaks and grants his guests an audience. In plain terms — an event robot that entertains your crowd, addresses them and keeps the conversation going.',
        'Always accompanied by a trained operator. Grand in tone, precise in operation: a king in manner, a professional in delivery.',
      ],
      photoAlt: 'King Ludwig II, humanoid robot, with crown and red cloak, greeting',
      specs: [
        ['Unitree G1', 'Humanoid platform'],
        ['~1.3 m', 'Height'],
        ['DE / EN', 'Languages, live'],
        ['Operator', 'Always supervised'],
      ],
    },

    why: {
      kicker: 'Why a king robot',
      title: [{ t: 'We don\'t sell robots. ' }, { br: true }, { t: 'We sell attention.', ember: true }],
      intro: 'Because advertising gets overlooked — and a king does not.',
      items: [
        { icon: 'eye',          title: 'Cuts through banner blindness', body: 'Ads get clicked away; a king striding through the room does not. Live experience beats ad space.' },
        { icon: 'fingerprint',  title: 'Unmistakable positioning', body: 'An appearance your industry has not seen before — your brand gets remembered with the moment.' },
        { icon: 'users',        title: 'The audience\'s full attention', body: 'Guests stop, look, ask, film — your booth or event becomes the meeting point.' },
        { icon: 'clapperboard', title: 'Viral content included', body: 'Every appearance delivers photo and video moments guests share voluntarily — organic reach for your channels.' },
      ],
    },

    cases: {
      kicker: 'Use cases', title: 'Where the king holds court',
      intro: 'Royal gesture, clear benefit. Every format brings an attraction people talk about — supervised and plannable.',
      items: [
        { icon: 'briefcase',      title: 'Corporate events, fairs & conferences', royal: '“An audience at your booth.”', body: 'A booth magnet with pull — draws visitors and gets conversations going.' },
        { icon: 'rocket',         title: 'Product launches',                royal: '“His Majesty unveils.”',      body: 'A launch moment with stage and reach — attention that sticks.' },
        { icon: 'store',          title: 'Openings & retail',               royal: '“A royal opening.”',          body: 'Store and branch openings with an attraction worth talking about.' },
        { icon: 'gem',            title: 'Weddings & premium parties',      royal: '“The king offers his congratulations.”', body: 'Weddings and exclusive celebrations — in cooperation with event agencies and venues.' },
        { icon: 'party-popper',   title: 'Anniversaries & collaborations',  royal: '“Court meets content.”',      body: 'Birthdays, anniversaries and collabs with creators, bloggers, public figures.' },
        { icon: 'heart-handshake', title: 'Social projects',                warm: 'An appearance with purpose.',  body: 'Supervised appearances at social and charitable projects — attention for good causes, gentle and plannable.' },
      ],
    },

    brands: {
      kicker: 'For brands & media',
      title: [{ t: 'The king also makes ' }, { t: 'content.', ember: true }],
      intro: 'Ludwig II is not just a guest at your event — he is a character with channels of his own. His reach is young, his stage is open: early partners help write the story.',
      items: [
        { icon: 'megaphone',    title: 'Brand integrations', royal: '“The king recommends.”', body: 'Your product or brand in Ludwig\'s video formats — as a scene, a gag or a cameo. Disclosed, aligned, in character.' },
        { icon: 'shirt',        title: 'Outfit partnerships', royal: '“Purveyor to the court, wanted.”', body: 'Crown, cloak, accessories — or a G1 in your colours. Your brand becomes part of the royal wardrobe.' },
        { icon: 'video',        title: 'Tech reviews & UGC', royal: '“His Majesty tests.”', body: 'Product features from a royal point of view — content you can reuse on your own channels.' },
        { icon: 'handshake',    title: 'Collaborations', royal: '“Court meets court.”', body: 'Joint formats with creators, editorial teams and brands — from short clip to series.' },
      ],
      note: 'Sponsored content is disclosed as such. Concept and scope: individual.',
    },

    fleet: {
      kicker: 'The royal fleet', title: 'The court is growing.',
      intro: 'Ludwig II is the face — but not alone. For your event the court fields further robots: on request today, as a standing fleet tomorrow.',
      items: [
        { icon: 'crown', title: 'King Ludwig II', royal: '“The original.”', body: 'The king among robots — crown, cloak, audience. The lead act for your occasion.' },
        { icon: 'dog',   title: 'Robot dogs', royal: '“The court hounds.”', body: 'Four-legged robots for supporting acts, photo moments and interaction at the little guests\' eye level.', status: 'In preparation' },
        { icon: 'plane', title: 'Drones', royal: '“The court falcons.”', body: 'Aerial footage of your event and show elements from above — by arrangement and subject to permits.', status: 'In preparation' },
        { icon: 'bot',   title: 'G1 in your branding', royal: '“Your crest, our knight.”', body: 'A humanoid Unitree G1 in your colours and with your logo — a brand ambassador for hire.', status: 'On request' },
      ],
      note: 'Availability and terms depend on format and date — send a non-binding inquiry.',
    },

    booking: {
      kicker: 'Process', title: 'How the audience works',
      steps: [
        { n: '01', icon: 'mail',            title: 'Inquiry',    royal: '“Requests an audience.”', body: 'Outline event, date and place. You receive a prompt, individual quote.' },
        { n: '02', icon: 'clipboard-check', title: 'Alignment',  royal: '“The court plans.”',      body: 'Run of show, safety concept and tech are defined together.' },
        { n: '03', icon: 'crown',           title: 'Appearance', royal: '“The king arrives.”',     body: 'Ludwig II arrives with operator and equipment — professionally supervised from setup to teardown.' },
      ],
    },

    scope: {
      kicker: 'Scope of booking', title: 'What the audience includes.',
      intro: 'No modular fine print. Every booking is tailored individually to your event and your brand — and includes as standard:',
      items: [
        'Ludwig II in full regalia — crown, cloak, royal mood',
        'A trained operator for the entire booking',
        'Travel, setup, tech check and teardown',
        'An agreed run of show and safety concept for your venue',
        'Live interaction in German and English',
        'Insured operation',
        'On request: content capture of the appearance for your channels — by arrangement',
      ],
      price: 'Bookings from €2,500 plus VAT',
      priceNote: 'The specific quote depends on format, duration and location. Ludwig II is deliberately not a mass product — an act for brands and moments meant to stand out.',
    },

    ctaBand: {
      title: 'Ready for an audience?',
      sub: 'Describe your event in two sentences in the chat — our AI assistant takes it all down and the team replies promptly with an individual quote. Around the clock.',
      primary: 'Start your inquiry in the chat', secondary: 'Prefer the form?',
    },

    assistant: {
      kicker: 'Direct line', title: 'The court answers instantly.',
      body: 'No form ping-pong, no hold queue: our AI assistant takes your inquiry right in the chat, asks the two or three questions that matter — occasion, date, place — and hands everything straight to the team. Around the clock, every day.',
      chat: 'Start the chat here', tg: 'Write on Telegram', mail: 'Write an email', wa: 'WhatsApp — coming soon',
      tgHref: 'https://t.me/dashboard_robotollern_bot',
      note: 'You are chatting with an AI (disclosed per EU AI Act, Art. 50) — your details go straight to the team.',
    },

    gallery: {
      kicker: 'Gallery', title: 'Live from the court',
      note: 'Moments from events, tours and Ludwig\'s channels.',
    },

    faq: {
      kicker: 'Frequently asked questions', title: 'The court answers',
      items: [
        { q: 'What can Ludwig do at an event?', a: 'Ludwig greets guests, moves freely through the room, interacts with the audience and creates photo and video moments that get shared. He is always accompanied by a professional operator.' },
        { q: 'What does an appearance cost?', a: 'Bookings start from €2,500 plus VAT — the entry price for a compact format (from roughly 2 hours). The final price depends on format, duration, programme and customisation; you always receive an individual quote. We work with a percentage deposit.' },
        { q: 'What occasions can Ludwig be booked for?', a: 'Store and showroom openings, trade fairs and conferences, corporate parties, product presentations, press events, premium weddings — plus brand collaborations in content.' },
        { q: 'Which cities and countries do you cover?', a: 'Germany, Austria and Switzerland — travel and logistics are included individually in the quote. Other countries and languages are possible on request.' },
        { q: 'How far in advance should I book?', a: 'The earlier, the better — popular dates (weekends, trade-fair season) go fast. Ideally inquire 2–4 weeks ahead; we try to make short-notice requests work.' },
        { q: 'What do you need on site?', a: 'A level surface, a power connection, internet access and a room for preparation. The organiser ensures an orderly setting and briefs guests on the rules. All details are fixed at booking.' },
        { q: 'Indoors or outdoors?', a: 'Both are possible. The limits are strong heat, rain, large stairs and uncontrollable crowds without a secured distance — we clarify these points together in advance.' },
        { q: 'How long does an appearance last?', a: 'Flexible — from a short highlight appearance to several hours. The battery lasts about 1.5–2 hours of active operation; a swap takes only a few minutes and is planned as a short break.' },
        { q: 'Is it safe for the guests?', a: 'Yes. Ludwig is accompanied and controlled by an experienced operator throughout; the run of show and safety concept are planned with you in advance. The operation is insured.' },
      ],
    },

    contact: {
      kicker: 'Inquiry & booking', title: 'Request an audience',
      body: 'Tell us about your event — you receive a prompt, individual quote.',
      wit: 'His Majesty replies in person. Or rather, the team does.',
      avail: 'No hold music, no endless appointment chains: our AI assistant is there for you around the clock and the team replies fast — you are never left without an answer.',
      fields: { company: 'Company', name: 'Contact person', email: 'Email', occasion: 'Occasion & preferred date', message: 'Message' },
      ph: { company: 'Company', name: 'First and last name', email: 'name@company.com', occasion: 'e.g. trade-fair opening, 14 Sep', message: 'Location, approx. number of guests, specifics …' },
      submit: 'Send request', optional: '(optional)',
      note: 'Fields marked with * are required. Our offer is directed at business customers (B2B). By submitting, you agree to the processing of your data as described in our privacy policy.',
      errReq: 'Please fill this in.', errEmail: 'Please enter a valid email address.',
      okTitle: 'Inquiry received.', okBody: 'Thank you — the court will be in touch shortly with a quote.',
    },

    footer: {
      ai: 'Ludwig II is an AI.',
      aiBody: 'Ludwig II von Robotollern is an AI-driven humanoid robot. Guests interact with an artificial intelligence — disclosure per EU AI Act, Art. 50.',
      nav: [['#what', 'What'], ['#cases', 'Use cases'], ['#fleet', 'Fleet'], ['#booking', 'Booking'], ['#gallery', 'Gallery'], ['#assistant', 'Direct line'], ['#faq', 'FAQ'], ['#contact', 'Inquiry']],
      navLabel: 'Navigation', legalLabel: 'Legal',
      citiesLabel: 'Rent the robot in',
      cities: [['/roboter-mieten/berlin/', 'Berlin'], ['/roboter-mieten/hamburg/', 'Hamburg'], ['/roboter-mieten/muenchen/', 'Munich'], ['/roboter-mieten/koeln/', 'Cologne'], ['/roboter-mieten/frankfurt-am-main/', 'Frankfurt am Main'], ['/roboter-mieten/duesseldorf/', 'Düsseldorf'], ['/roboter-mieten/stuttgart/', 'Stuttgart'], ['/roboter-mieten/leipzig/', 'Leipzig']],
      citiesAll: ['/roboter-mieten/', 'All locations'], blogLink: ['/blog/', 'Blog & guides'],
      legal: [['impressum', 'Imprint'], ['datenschutz', 'Privacy policy'], ['barrierefreiheit', 'Accessibility statement']],
      cookies: 'Cookie settings',
      a11ySettings: 'Accessibility',
      courtH: 'The court is gathering', courtSub: 'Follow the king.',
      rights: 'All rights reserved.', on: 'on',
      b2b: 'Our offers are directed exclusively at companies, trades and public-sector clients (B2B).',
      made: 'Berlin · Unitree G1 · Across Germany',
    },

    cookie: {
      title: 'Cookies & consent',
      body: 'We use technically necessary cookies. Non-essential cookies (analytics, marketing) are only set with your consent — off by default.',
      privacy: 'Privacy', settings: 'Settings',
      reject: 'Reject all', save: 'Save choice', accept: 'Accept all',
      essential: 'Essential', essentialNote: 'Always on — for operation and security.',
      analytics: 'Analytics', analyticsNote: 'Anonymous reach measurement.',
      marketing: 'Marketing', marketingNote: 'Personalised content & campaigns.',
    },

    legal: {
      tabs: [['impressum', 'Imprint'], ['datenschutz', 'Privacy'], ['barrierefreiheit', 'Accessibility']],
      docsLabel: 'Legal documents', close: 'Close',
    },
  },
};
