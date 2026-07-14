/* ============================================================
   LVD_LEGAL — Impressum (§ 5 DDG), Datenschutzerklärung (DSGVO/TDDDG)
   und Barrierefreiheitserklärung für robotollern.de.
   Alle unternehmensspezifischen Werte kommen aus config.js
   (legal.* + email/phone aus contact.*). Einziger offener Wert:
   l.vatId (USt-IdNr. folgt) — als <Ph>-Platzhalter markiert.
   Jeder Builder liefert einen HTML-String für das Legal-Modal.
   Stand der Texte: 04.07.2026.
   ============================================================ */
(function () {
  // Placeholder pill. `val` already comes from config; render as a marked token.
  const ph = (val) => `<span class="ph">${val == null ? '' : String(val)}</span>`;

  // Merge: email + phone are single-sourced from config.contact.
  function L() {
    const cfg = window.LVD_CONFIG || {};
    const lg = cfg.legal || {};
    const ct = cfg.contact || {};
    return Object.assign({}, lg, { email: ct.email, phone: ct.phone });
  }

  window.LVD_LEGAL = {
    // ---------------- IMPRESSUM (§ 5 DDG) ----------------
    impressum(lang) {
      const de = lang === 'de'; const l = L();
      return `<div class="legal-body">
        <p class="lead">${de ? 'Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).' : 'Information pursuant to § 5 DDG (German Digital Services Act).'}</p>

        <h3>${de ? 'Diensteanbieter' : 'Service provider'}</h3>
        <address>${l.company}<br>${l.careOf ? l.careOf + '<br>' : ''}${l.street}<br>${l.city}<br>${de ? 'Deutschland' : 'Germany'}</address>
        <p>${de
          ? 'Inhaber: ' + l.managing + ' (Einzelunternehmen).'
          : 'Owner: ' + l.managing + ' (sole proprietorship).'}</p>

        <h3>${de ? 'Kontakt' : 'Contact'}</h3>
        <p>${de ? 'Telefon: ' : 'Phone: '}${l.phone}<br>${de ? 'E-Mail: ' : 'Email: '}${l.email}</p>

        <h3>${de ? 'Registereintrag' : 'Register entry'}</h3>
        <p>${de
          ? l.register + '.'
          : 'Sole proprietorship — not registered in the German commercial register (Handelsregister).'}</p>

        <h3>${de ? 'Umsatzsteuer-Identifikationsnummer' : 'VAT identification number'}</h3>
        <p>${de
          ? 'Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ' + ph(l.vatId) + ' — sie wird hier unmittelbar nach Erteilung durch das Bundeszentralamt für Steuern ergänzt.'
          : 'VAT identification number pursuant to § 27a UStG: ' + ph(l.vatId) + ' — it will be added here as soon as it is issued by the Federal Central Tax Office.'}</p>

        <h3>${de ? 'Redaktionell verantwortlich' : 'Responsible for editorial content'}</h3>
        <p>${de
          ? 'Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV: ' + l.managing + ', ' + (l.careOf ? l.careOf + ', ' : '') + l.street + ', ' + l.city + '.'
          : 'Responsible for editorial content pursuant to § 18 (2) MStV: ' + l.managing + ', ' + (l.careOf ? l.careOf + ', ' : '') + l.street + ', ' + l.city + '.'}</p>

        <h3>${de ? 'Angebot ausschließlich für Unternehmer (B2B)' : 'Offer exclusively for businesses (B2B)'}</h3>
        <p>${de
          ? 'Unsere Leistungen richten sich ausschließlich an Unternehmer im Sinne des § 14 BGB, juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen — nicht an Verbraucher. Alle Preisangaben verstehen sich zuzüglich der gesetzlichen Umsatzsteuer.'
          : 'Our services are directed exclusively at businesses within the meaning of § 14 BGB (German Civil Code), legal entities under public law and special funds under public law — not at consumers. All prices are quoted exclusive of statutory VAT.'}</p>

        <h3>${de ? 'Transparenzhinweis zu Künstlicher Intelligenz (EU AI Act)' : 'AI transparency notice (EU AI Act)'}</h3>
        <p>${de
          ? 'Gemäß Art. 50 der Verordnung (EU) 2024/1689 (KI-Verordnung) weisen wir darauf hin: Der Chat-Assistent auf dieser Website ist ein KI-System; Sie interagieren dort nicht mit einem Menschen. Auch die Figur „Ludwig II. von Robotollern“ ist ein KI-gestützter Roboter-Charakter und keine reale Person. Auf beides wird an den jeweiligen Interaktionspunkten zusätzlich hingewiesen.'
          : 'Pursuant to Art. 50 of Regulation (EU) 2024/1689 (EU AI Act) we point out: the chat assistant on this website is an AI system; you are not interacting with a human there. The character “Ludwig II von Robotollern” is likewise an AI-powered robot character and not a real person. Both are additionally disclosed at the respective points of interaction.'}</p>

        <h3>${de ? 'Verbraucherstreitbeilegung' : 'Consumer dispute resolution'}</h3>
        <p>${de
          ? 'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG). Unser Angebot richtet sich zudem ausschließlich an Unternehmer. Die frühere EU-Plattform zur Online-Streitbeilegung (OS-Plattform) wurde zum 20. Juli 2025 eingestellt.'
          : 'We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG, German Consumer Dispute Resolution Act). Moreover, our offer is directed exclusively at businesses. The former EU online dispute resolution platform (ODR platform) was discontinued as of 20 July 2025.'}</p>

        <h3>${de ? 'Haftung für Inhalte' : 'Liability for content'}</h3>
        <p>${de
          ? 'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich; bei Bekanntwerden entsprechender Rechtsverletzungen entfernen wir diese Inhalte umgehend.'
          : 'As a service provider we are responsible for our own content on these pages under general law pursuant to § 7 (1) DDG. Pursuant to §§ 8 to 10 DDG, however, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances indicating unlawful activity. Obligations to remove or block the use of information under general law remain unaffected. Liability in this respect is only possible from the moment we become aware of a specific infringement; upon becoming aware of such infringements we will remove the content in question without delay.'}</p>

        <h3>${de ? 'Haftung für Links' : 'Liability for links'}</h3>
        <p>${de
          ? 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen; verantwortlich ist stets der jeweilige Anbieter oder Betreiber der Seiten. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren dabei nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.'
          : 'Our site contains links to external third-party websites over whose content we have no influence. We therefore cannot accept any liability for this third-party content; the respective provider or operator of the linked pages is always responsible. The linked pages were checked for possible legal violations at the time of linking; no unlawful content was identifiable at that time. Permanent monitoring of the linked pages is not reasonable without concrete indications of an infringement. Upon becoming aware of legal violations we will remove such links without delay.'}</p>

        <h3>${de ? 'Urheberrecht' : 'Copyright'}</h3>
        <p>${de
          ? 'Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet und Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis; bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Inhalte umgehend.'
          : 'The content and works created by the site operator on these pages are subject to German copyright law. Reproduction, editing, distribution and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are permitted for private, non-commercial use only. Insofar as content on this site was not created by the operator, the copyrights of third parties are respected and third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please notify us; upon becoming aware of legal violations we will remove such content without delay.'}</p>

        <h3>${de ? 'Bildnachweise' : 'Image credits'}</h3>
        <ul>
          <li>${de
            ? 'Drohne: Foto Jason Blackeye, CC0/Public Domain (Unsplash, via Wikimedia Commons) — freigestellt/bearbeitet.'
            : 'Drone: photo by Jason Blackeye, CC0/public domain (Unsplash, via Wikimedia Commons) — cut out/edited.'}</li>
          <li>${de
            ? 'Roboterhund (Unitree): U.S. Army Foto, Public Domain, via Wikimedia Commons — freigestellt/bearbeitet.'
            : 'Robot dog (Unitree): U.S. Army photo, public domain, via Wikimedia Commons — cut out/edited.'}</li>
        </ul>

        <p>${de ? 'Stand: ' : 'Last updated: '}${l.lastUpdated}</p>
      </div>`;
    },

    // ---------------- DATENSCHUTZERKLÄRUNG (DSGVO / TDDDG) ----------------
    datenschutz(lang) {
      const de = lang === 'de'; const l = L();
      return `<div class="legal-body">
        <p class="lead">${de
          ? 'Diese Datenschutzerklärung informiert Sie gemäß Art. 13, 14 DSGVO über Art, Umfang und Zwecke der Verarbeitung personenbezogener Daten auf dieser Website sowie über Ihre Rechte.'
          : 'This privacy policy informs you, pursuant to Art. 13 and 14 GDPR, about the nature, scope and purposes of the processing of personal data on this website and about your rights.'}</p>

        <h3>${de ? '1. Verantwortlicher' : '1. Controller'}</h3>
        <address>${l.company}<br>${l.careOf ? l.careOf + '<br>' : ''}${l.street}<br>${l.city}<br>${de ? 'Deutschland' : 'Germany'}<br>${de ? 'Telefon: ' : 'Phone: '}${l.phone}<br>${de ? 'E-Mail: ' : 'Email: '}${l.email}</address>
        <p>${de
          ? 'Verantwortlicher im Sinne der DSGVO ist der Inhaber, ' + l.managing + '.'
          : 'The controller within the meaning of the GDPR is the owner, ' + l.managing + '.'}</p>

        <h3>${de ? '2. Allgemeines zur Datenverarbeitung' : '2. General information on data processing'}</h3>
        <p>${de
          ? 'Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist oder eine andere Rechtsgrundlage der DSGVO greift. Die Bereitstellung personenbezogener Daten ist weder gesetzlich noch vertraglich vorgeschrieben; ohne bestimmte Angaben (z. B. E-Mail-Adresse im Kontaktformular) können wir Anfragen jedoch nicht bearbeiten. Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne des Art. 22 DSGVO findet nicht statt.'
          : 'We process personal data only insofar as this is necessary to provide a functional website and our content and services, or where another legal basis under the GDPR applies. There is no statutory or contractual obligation to provide personal data; however, without certain information (e.g. an email address in the contact form) we cannot process inquiries. No automated decision-making, including profiling within the meaning of Art. 22 GDPR, takes place.'}</p>

        <h3>${de ? '3. Hosting' : '3. Hosting'}</h3>
        <p>${de
          ? 'Diese Website wird auf Servern der ' + l.hostProvider + ' gehostet. Der Serverstandort liegt in Deutschland. Mit dem Hoster wurde ein Vertrag über Auftragsverarbeitung gemäß Art. 28 DSGVO (AVV) geschlossen. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots (Art. 6 Abs. 1 lit. f DSGVO). Auch die Formulardaten und der Chat-Dienst (siehe unten) laufen über unsere eigene Infrastruktur bei diesem Hoster (crm.robotollern.de, gleicher Server, gleicher Verantwortlicher).'
          : 'This website is hosted on servers of ' + l.hostProvider + '. The server location is Germany. A data processing agreement pursuant to Art. 28 GDPR (DPA) has been concluded with the host. The legal basis is our legitimate interest in the secure, fast and efficient provision of our online offering (Art. 6 (1)(f) GDPR). The form data and the chat service (see below) also run on our own infrastructure with this host (crm.robotollern.de, same server, same controller).'}</p>

        <h3>${de ? '4. Server-Logfiles' : '4. Server log files'}</h3>
        <p>${de
          ? 'Beim Aufruf der Website erhebt der Webserver (Caddy) automatisch Informationen in sogenannten Server-Logfiles: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Ressource, HTTP-Statuscode, übertragene Datenmenge, Referrer-URL sowie Browsertyp und Betriebssystem (User-Agent). Diese Daten dienen der Sicherstellung des Betriebs, der Fehleranalyse und der Abwehr von Angriffen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Stabilität und Sicherheit). Eine Zusammenführung mit anderen Datenquellen erfolgt nicht; die Logfiles werden nach kurzer Zeit routinemäßig gelöscht, sofern kein sicherheitsrelevanter Vorfall eine längere Aufbewahrung erfordert.'
          : 'When the website is accessed, the web server (Caddy) automatically collects information in server log files: IP address, date and time of access, requested resource, HTTP status code, data volume transferred, referrer URL, browser type and operating system (user agent). This data serves to ensure operation, analyse errors and defend against attacks. Legal basis: Art. 6 (1)(f) GDPR (legitimate interest in stability and security). The data is not merged with other data sources; log files are routinely deleted after a short period unless a security-relevant incident requires longer retention.'}</p>

        <h3>${de ? '5. SSL-/TLS-Verschlüsselung' : '5. SSL/TLS encryption'}</h3>
        <p>${de
          ? 'Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte (z. B. Anfragen über das Kontaktformular) durchgängig eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://“ und am Schloss-Symbol in der Adresszeile Ihres Browsers. Bei aktivierter Verschlüsselung können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.'
          : 'For security reasons and to protect the transmission of confidential content (e.g. inquiries via the contact form), this website consistently uses SSL/TLS encryption. You can recognise an encrypted connection by “https://” and the lock icon in your browser’s address bar. When encryption is active, the data you transmit to us cannot be read by third parties.'}</p>

        <h3>${de ? '6. Cookies, Einwilligung & lokale Speicherung' : '6. Cookies, consent & local storage'}</h3>
        <p>${de
          ? 'Technisch notwendige Speicher- und Zugriffsvorgänge auf Ihrem Endgerät erfolgen ohne Einwilligung auf Grundlage von § 25 Abs. 2 Nr. 2 TDDDG. Dazu gehören: der Speicherung Ihrer Consent-Entscheidung im Local Storage Ihres Browsers (Schlüssel „lvd2_consent“) sowie Ihrer Barrierefreiheits-Einstellungen (Schlüssel „lvd2_a11y“, z. B. Textgröße, Kontrast, reduzierte Animationen). Nicht notwendige Kategorien (Statistik, Marketing) werden ausschließlich nach Ihrer aktiven, freiwilligen Einwilligung über den Consent-Banner geladen (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO); sie sind standardmäßig deaktiviert. Der Banner bietet bereits auf der ersten Ebene gleichrangig die Schaltfläche „Alle ablehnen“. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über den Link „Cookie-Einstellungen“ im Footer ändern oder widerrufen; die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.'
          : 'Technically necessary storage and access operations on your device take place without consent on the basis of § 25 (2) no. 2 TDDDG. These include: storing your consent decision in your browser’s local storage (key “lvd2_consent”) and your accessibility settings (key “lvd2_a11y”, e.g. text size, contrast, reduced animations). Non-essential categories (statistics, marketing) are loaded exclusively after your active, voluntary consent via the consent banner (§ 25 (1) TDDDG, Art. 6 (1)(a) GDPR); they are disabled by default. The banner offers an equally prominent “Reject all” button on its first layer. You can change or withdraw your consent at any time with effect for the future via the “Cookie settings” link in the footer; the lawfulness of processing carried out before withdrawal remains unaffected.'}</p>

        <h3>${de ? '7. Kontakt- & Buchungsformular' : '7. Contact & booking form'}</h3>
        <p>${de
          ? 'Wenn Sie uns über das Formular kontaktieren, verarbeiten wir die von Ihnen angegebenen Daten (Firma, Name, E-Mail-Adresse, Anlass/Eventangaben, Nachricht) ausschließlich zur Bearbeitung Ihrer Anfrage, zur Angebotserstellung und für etwaige Anschlussfragen. Die Daten werden verschlüsselt an unser eigenes CRM-System übermittelt, das auf unserem Server in Deutschland (Hetzner) betrieben wird; eine Weitergabe an Dritte erfolgt nicht. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage) sowie Art. 6 Abs. 1 lit. f DSGVO für die interne Organisation. Die Daten werden gelöscht, sobald die Bearbeitung abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten (insbesondere §§ 147 AO, 257 HGB — sechs bzw. acht bis zehn Jahre für steuer- und handelsrechtlich relevante Unterlagen) entgegenstehen.'
          : 'If you contact us via the form, we process the data you provide (company, name, email address, occasion/event details, message) exclusively to handle your inquiry, prepare a quote and deal with any follow-up questions. The data is transmitted in encrypted form to our own CRM system, operated on our server in Germany (Hetzner); it is not passed on to third parties. Legal basis: Art. 6 (1)(b) GDPR (pre-contractual measures at your request) and Art. 6 (1)(f) GDPR for internal organisation. The data is deleted once processing is complete and no statutory retention obligations (in particular §§ 147 AO, 257 HGB — six to ten years for documents relevant under tax and commercial law) prevent deletion.'}</p>

        <h3>${de ? '8. KI-Chat-Assistent' : '8. AI chat assistant'}</h3>
        <p>${de
          ? 'Auf dieser Website steht ein Chat-Assistent zur Verfügung (Schaltfläche unten rechts). Es handelt sich um ein KI-System; hierauf weisen wir gemäß Art. 50 der Verordnung (EU) 2024/1689 (KI-Verordnung) hin — Sie kommunizieren dort nicht mit einem Menschen. Der Chat wird erst aktiv, wenn Sie ihn selbst öffnen. Verarbeitet werden die von Ihnen eingegebenen Chat-Inhalte sowie freiwillig mitgeteilte Kontaktdaten, um Ihre Fragen zu beantworten und Buchungsanfragen zu bearbeiten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Anbahnung auf Ihre Anfrage) und Art. 6 Abs. 1 lit. f DSGVO (effiziente Kommunikation). Die Verarbeitung erfolgt auf unserem eigenen Server in Deutschland (crm.robotollern.de, Hetzner); zur Generierung der Antworten werden die Chat-Inhalte an Anthropic PBC (USA) übermittelt. Die Übermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) bzw. des Angemessenheitsbeschlusses zum EU-US Data Privacy Framework (Art. 45 DSGVO). Bitte geben Sie im Chat keine sensiblen Daten (Art. 9 DSGVO) ein. Zur Fortführung des Gesprächs wird eine zufällig erzeugte Sitzungs-ID lokal in Ihrem Browser gespeichert; dies ist für den Dienst technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Chat-Verläufe werden gelöscht, sobald sie für die Bearbeitung Ihres Anliegens nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.'
          : 'This website offers a chat assistant (button at the bottom right). It is an AI system; we disclose this pursuant to Art. 50 of Regulation (EU) 2024/1689 (EU AI Act) — you are not communicating with a human there. The chat only becomes active when you open it yourself. We process the chat content you enter and any contact details you voluntarily provide in order to answer your questions and handle booking inquiries. Legal basis: Art. 6 (1)(b) GDPR (initiation at your request) and Art. 6 (1)(f) GDPR (efficient communication). Processing takes place on our own server in Germany (crm.robotollern.de, Hetzner); to generate responses, the chat content is transmitted to Anthropic PBC (USA). Transfers to the USA are based on the EU standard contractual clauses (Art. 46 (2)(c) GDPR) and the adequacy decision for the EU-US Data Privacy Framework (Art. 45 GDPR). Please do not enter sensitive data (Art. 9 GDPR) in the chat. To continue the conversation, a randomly generated session ID is stored locally in your browser; this is technically necessary for the service (§ 25 (2) no. 2 TDDDG). Chat histories are deleted once they are no longer required to handle your request and no statutory retention obligations apply.'}</p>

        <h3>${de ? '9. Schriftarten (lokales Hosting)' : '9. Fonts (locally hosted)'}</h3>
        <p>${de
          ? 'Die auf dieser Website verwendeten Schriftarten werden lokal gehostet und direkt mit der Seite ausgeliefert. Es wird keine Verbindung zu Servern von Google (Google Fonts) oder anderen Drittanbietern aufgebaut; es werden hierbei keine Daten an Dritte übertragen.'
          : 'The fonts used on this website are hosted locally and delivered directly with the page. No connection is established to servers of Google (Google Fonts) or other third parties; no data is transferred to third parties in this respect.'}</p>

        <h3>${de ? '10. Webanalyse: Microsoft Clarity (sofern aktiviert)' : '10. Web analytics: Microsoft Clarity (if activated)'}</h3>
        <p>${de
          ? 'Sofern aktiviert, nutzen wir den Analysedienst Microsoft Clarity (Microsoft Ireland Operations Limited, One Microsoft Place, Dublin, Irland; Mutterkonzern: Microsoft Corporation, USA), um die Nutzung der Website mittels Heatmaps und Sitzungsaufzeichnungen auszuwerten und unser Angebot zu verbessern. Clarity wird ausschließlich geladen, wenn Sie im Consent-Banner die Kategorie „Statistik“ aktiv eingewilligt haben; ohne Einwilligung findet keinerlei Datenverarbeitung durch Clarity statt. Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Dabei können u. a. Interaktionsdaten (Maus- und Scrollbewegungen, Klicks), Geräteinformationen und eine gekürzte IP-Adresse verarbeitet werden; Eingabefelder werden maskiert. Eine Übermittlung in die USA kann nicht ausgeschlossen werden und erfolgt auf Grundlage der EU-Standardvertragsklauseln bzw. des EU-US Data Privacy Framework (Microsoft Corporation ist zertifiziert). Sie können Ihre Einwilligung jederzeit über die „Cookie-Einstellungen“ im Footer widerrufen. Weitere Informationen: https://privacy.microsoft.com/de-de/privacystatement.'
          : 'If activated, we use the analytics service Microsoft Clarity (Microsoft Ireland Operations Limited, One Microsoft Place, Dublin, Ireland; parent company: Microsoft Corporation, USA) to analyse the use of the website by means of heatmaps and session recordings and to improve our offering. Clarity is loaded exclusively if you have actively consented to the “Statistics” category in the consent banner; without consent, no data processing by Clarity takes place at all. Legal bases: Art. 6 (1)(a) GDPR and § 25 (1) TDDDG. Interaction data (mouse and scroll movements, clicks), device information and a truncated IP address, among other things, may be processed; input fields are masked. Transfers to the USA cannot be ruled out and are based on the EU standard contractual clauses and the EU-US Data Privacy Framework (Microsoft Corporation is certified). You can withdraw your consent at any time via the “Cookie settings” in the footer. Further information: https://privacy.microsoft.com/en-us/privacystatement.'}</p>

        <h3>${de ? '11. Messenger-Kommunikation (Telegram, WhatsApp)' : '11. Messenger communication (Telegram, WhatsApp)'}</h3>
        <p>${de
          ? 'Wir bieten Ihnen die Möglichkeit, uns auf Ihre Initiative über Messenger-Dienste zu kontaktieren. Beim bloßen Laden unserer Website werden keine Daten an die Anbieter übertragen; eine Verbindung entsteht erst, wenn Sie den jeweiligen Link aktiv anklicken. (a) Telegram: Wenn Sie uns über unseren Telegram-Bot kontaktieren, verarbeitet der Anbieter Telegram FZ-LLC (Dubai, VAE) Ihre Daten nach eigenen Datenschutzbestimmungen (https://telegram.org/privacy); wir verarbeiten die Inhalte Ihrer Nachrichten zur Bearbeitung Ihres Anliegens. (b) WhatsApp Business (sofern angeboten): Wenn Sie uns über WhatsApp kontaktieren, verarbeitet Meta Platforms Ireland Limited (Merrion Road, Dublin 4, Irland) Ihre Daten; für die geschäftliche Nutzung gelten die WhatsApp Business Data Processing Terms; eine Übermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln bzw. des EU-US Data Privacy Framework. Rechtsgrundlage in beiden Fällen: Art. 6 Abs. 1 lit. b DSGVO (Bearbeitung Ihrer Anfrage) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer Kommunikation über den von Ihnen gewählten Kanal). Wenn Sie die Übermittlung von Metadaten an die Messenger-Anbieter vermeiden möchten, nutzen Sie bitte unsere übrigen Kontaktwege (E-Mail, Telefon, Formular).'
          : 'We offer you the option of contacting us on your own initiative via messenger services. No data is transferred to the providers when our website merely loads; a connection is only established when you actively click the respective link. (a) Telegram: if you contact us via our Telegram bot, the provider Telegram FZ-LLC (Dubai, UAE) processes your data under its own privacy policy (https://telegram.org/privacy); we process the content of your messages to handle your request. (b) WhatsApp Business (where offered): if you contact us via WhatsApp, Meta Platforms Ireland Limited (Merrion Road, Dublin 4, Ireland) processes your data; the WhatsApp Business Data Processing Terms apply to business use; transfers to the USA are based on the EU standard contractual clauses and the EU-US Data Privacy Framework. Legal basis in both cases: Art. 6 (1)(b) GDPR (handling your inquiry) and Art. 6 (1)(f) GDPR (legitimate interest in communicating via the channel you have chosen). If you wish to avoid the transfer of metadata to the messenger providers, please use our other contact channels (email, phone, form).'}</p>

        <h3>${de ? '12. Social-Media-Verlinkung' : '12. Social media links'}</h3>
        <p>${de
          ? 'Wir verlinken auf unsere Profile bei externen Plattformen (Instagram, TikTok, YouTube, Threads, Facebook, X). Es handelt sich um reine Verlinkungen ohne eingebettete Plugins: Beim Laden unserer Seite findet keine automatische Datenübertragung an diese Plattformen statt. Erst wenn Sie einen Link aktiv anklicken, werden Sie zur jeweiligen Plattform weitergeleitet; ab diesem Zeitpunkt verarbeitet der jeweilige Anbieter Ihre Daten in eigener Verantwortung nach seinen Datenschutzbestimmungen.'
          : 'We link to our profiles on external platforms (Instagram, TikTok, YouTube, Threads, Facebook, X). These are plain links without embedded plugins: no automatic data transfer to these platforms takes place when our page loads. Only when you actively click a link are you forwarded to the respective platform; from that point on, the respective provider processes your data on its own responsibility under its own privacy policy.'}</p>

        <h3>${de ? '13. Datenverarbeitung bei B2B-Geschäftsanbahnung' : '13. Data processing in B2B business initiation'}</h3>
        <p>${de
          ? 'Zur Anbahnung geschäftlicher Kooperationen verarbeiten wir in Einzelfällen beruflich-geschäftliche Kontaktdaten (Firma, Name, Funktion, geschäftliche E-Mail-Adresse) aus öffentlich zugänglichen Quellen (Unternehmenswebseiten, Impressen, Presseportale, berufliche Netzwerke). Zweck ist die individuelle geschäftliche Kontaktaufnahme; Rechtsgrundlage ist unser berechtigtes Interesse an der Geschäftsanbahnung (Art. 6 Abs. 1 lit. f DSGVO, Erwägungsgrund 47). Sie können dieser Verarbeitung jederzeit widersprechen (Art. 21 Abs. 2 DSGVO) — eine kurze Nachricht genügt; wir kontaktieren Sie dann nicht mehr und vermerken Ihren Widerspruch dauerhaft in unserer Sperrliste. Daten ohne aktiven Kontakt werden spätestens 6 Monate nach Ende der jeweiligen Ansprache gelöscht.'
          : 'To initiate business cooperations we occasionally process professional contact data (company, name, role, business email address) from publicly accessible sources (company websites, imprints, press portals, professional networks). The purpose is individual business contact; the legal basis is our legitimate interest in business initiation (Art. 6 (1)(f) GDPR, Recital 47). You may object to this processing at any time (Art. 21 (2) GDPR) — a short message suffices; we will no longer contact you and will record your objection permanently in our suppression list. Data without active contact is deleted no later than 6 months after the respective outreach ends.'}</p>

        <h3>${de ? '14. Bild- und Tonaufnahmen bei Veranstaltungen' : '14. Photo and video recordings at events'}</h3>
        <p>${de
          ? 'Werden im Rahmen von Veranstaltungen Bild- oder Tonaufnahmen erstellt, geschieht dies ausschließlich auf gesonderter Rechtsgrundlage — insbesondere Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, §§ 22, 23 KUG) oder berechtigtes Interesse mit vorheriger Information der Betroffenen (Art. 6 Abs. 1 lit. f DSGVO). Die Betroffenen werden vor Ort gesondert informiert.'
          : 'Where photo or audio/video recordings are made at events, this is done exclusively on a separate legal basis — in particular consent (Art. 6 (1)(a) GDPR, §§ 22, 23 KUG) or legitimate interest with prior information of the data subjects (Art. 6 (1)(f) GDPR). Data subjects are informed separately on site.'}</p>

        <h3>${de ? '15. Speicherdauer (Übersicht)' : '15. Retention periods (overview)'}</h3>
        <ul>
          <li>${de ? 'Server-Logfiles: routinemäßige Löschung nach kurzer Frist, sofern kein Sicherheitsvorfall vorliegt.' : 'Server log files: routinely deleted after a short period unless a security incident occurs.'}</li>
          <li>${de ? 'Formular- und Chat-Anfragen: Löschung nach abschließender Bearbeitung, soweit keine gesetzlichen Aufbewahrungsfristen (§§ 147 AO, 257 HGB) entgegenstehen.' : 'Form and chat inquiries: deleted after final processing unless statutory retention periods (§§ 147 AO, 257 HGB) apply.'}</li>
          <li>${de ? 'Consent- und Barrierefreiheits-Einstellungen (Local Storage): verbleiben in Ihrem Browser, bis Sie sie selbst löschen.' : 'Consent and accessibility settings (local storage): remain in your browser until you delete them yourself.'}</li>
          <li>${de ? 'B2B-Anbahnungsdaten ohne aktiven Kontakt: Löschung spätestens 6 Monate nach Ende der Ansprache.' : 'B2B initiation data without active contact: deleted no later than 6 months after outreach ends.'}</li>
        </ul>

        <h3>${de ? '16. Ihre Rechte als betroffene Person' : '16. Your rights as a data subject'}</h3>
        <ul>
          <li>${de ? 'Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)' : 'Access to the data processed (Art. 15 GDPR)'}</li>
          <li>${de ? 'Berichtigung unrichtiger Daten (Art. 16 DSGVO)' : 'Rectification of inaccurate data (Art. 16 GDPR)'}</li>
          <li>${de ? 'Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)' : 'Erasure (Art. 17 GDPR) and restriction of processing (Art. 18 GDPR)'}</li>
          <li>${de ? 'Datenübertragbarkeit (Art. 20 DSGVO)' : 'Data portability (Art. 20 GDPR)'}</li>
          <li>${de ? 'Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)' : 'Objection to processing based on Art. 6 (1)(f) GDPR (Art. 21 GDPR)'}</li>
          <li>${de ? 'Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)' : 'Withdrawal of consent with effect for the future (Art. 7 (3) GDPR)'}</li>
          <li>${de ? 'Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO)' : 'Complaint to a data protection supervisory authority (Art. 77 GDPR)'}</li>
        </ul>
        <p>${de
          ? 'Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht an ' + l.email + '.'
          : 'To exercise your rights, an informal message to ' + l.email + ' is sufficient.'}</p>

        <h3>${de ? '17. Zuständige Aufsichtsbehörde' : '17. Competent supervisory authority'}</h3>
        <p>${de
          ? 'Die für uns zuständige Aufsichtsbehörde ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, Telefon: +49 981 180093-0, E-Mail: poststelle@lda.bayern.de, www.lda.bayern.de. Ihnen steht daneben das Recht zu, sich an die Datenschutz-Aufsichtsbehörde Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu wenden (Art. 77 Abs. 1 DSGVO).'
          : 'The supervisory authority responsible for us is the Bavarian State Office for Data Protection Supervision (Bayerisches Landesamt für Datenschutzaufsicht, BayLDA), Promenade 18, 91522 Ansbach, Germany, phone: +49 981 180093-0, email: poststelle@lda.bayern.de, www.lda.bayern.de. You also have the right to contact the data protection supervisory authority of your habitual residence, your place of work or the place of the alleged infringement (Art. 77 (1) GDPR).'}</p>

        <h3>${de ? '18. Aktualität und Änderung dieser Datenschutzerklärung' : '18. Currency and amendment of this privacy policy'}</h3>
        <p>${de
          ? 'Wir behalten uns vor, diese Datenschutzerklärung anzupassen, sobald sich die Rechtslage, unser Online-Angebot oder die Datenverarbeitung ändern. Es gilt jeweils die hier veröffentlichte aktuelle Fassung. Stand: ' + l.lastUpdated + '.'
          : 'We reserve the right to amend this privacy policy whenever the legal situation, our online offering or our data processing changes. The current version published here applies. Last updated: ' + l.lastUpdated + '.'}</p>
      </div>`;
    },

    // ---------------- BARRIEREFREIHEITSERKLÄRUNG ----------------
    barrierefreiheit(lang) {
      const de = lang === 'de'; const l = L();
      return `<div class="legal-body">
        <p class="lead">${de
          ? 'Erklärung zur Barrierefreiheit der Website robotollern.de. Wir orientieren uns freiwillig an den Web Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA, sowie an der EN 301 549.'
          : 'Accessibility statement for the website robotollern.de. We voluntarily follow the Web Content Accessibility Guidelines (WCAG) 2.1, conformance level AA, and EN 301 549.'}</p>

        <h3>${de ? 'Geltungsbereich und Rechtsrahmen' : 'Scope and legal framework'}</h3>
        <p>${de
          ? 'Diese Erklärung gilt für die Website robotollern.de. Unser Angebot richtet sich ausschließlich an Geschäftskunden (B2B); als Kleinstunternehmen, das Dienstleistungen anbietet, unterliegen wir derzeit nicht der formalen Pflicht aus dem Barrierefreiheitsstärkungsgesetz (BFSG). Wir setzen Barrierefreiheit dennoch freiwillig und fortlaufend um, weil sie zu einem guten digitalen Angebot gehört.'
          : 'This statement applies to the website robotollern.de. Our offering is directed exclusively at business customers (B2B); as a micro-enterprise providing services we are currently not subject to the formal obligations of the German Accessibility Strengthening Act (BFSG). We nevertheless implement accessibility voluntarily and continuously, because it is part of a good digital offering.'}</p>

        <h3>${de ? 'Umgesetzte Maßnahmen' : 'Measures implemented'}</h3>
        <ul>
          <li>${de ? 'Semantische HTML-Struktur mit korrekter Überschriften-Hierarchie und Landmark-Regionen' : 'Semantic HTML structure with a correct heading hierarchy and landmark regions'}</li>
          <li>${de ? 'Vollständige Tastaturbedienbarkeit mit sichtbarem Fokus-Indikator' : 'Full keyboard operability with a visible focus indicator'}</li>
          <li>${de ? 'Textalternativen (Alt-Texte) für informative Bilder' : 'Text alternatives (alt text) for informative images'}</li>
          <li>${de ? 'Ausreichende Farbkontraste; Respektieren der Systemeinstellung „Bewegung reduzieren“' : 'Sufficient colour contrast; respect for the system “reduce motion” preference'}</li>
          <li>${de ? 'Barrierefreiheits-Panel auf der Website: Textgröße, heller Modus, erhöhter Kontrast, Animationen aus — die Einstellungen werden lokal in Ihrem Browser gespeichert (Local Storage „lvd2_a11y“, technisch erforderlich)' : 'On-site accessibility panel: text size, light mode, increased contrast, animations off — the settings are stored locally in your browser (local storage “lvd2_a11y”, technically necessary)'}</li>
          <li>${de ? 'Zweisprachige Inhalte (Deutsch/Englisch) mit korrekter Sprachauszeichnung' : 'Bilingual content (German/English) with correct language markup'}</li>
        </ul>

        <h3>${de ? 'Stand der Vereinbarkeit' : 'Compliance status'}</h3>
        <p>${de
          ? 'Die Website ist nach unserer eigenen Bewertung weitgehend mit den WCAG 2.1 AA vereinbar. Eine externe zertifizierte Prüfung wurde bisher nicht durchgeführt; wir testen laufend mit automatisierten Werkzeugen (u. a. axe, Lighthouse) und manuell per Tastatur- und Screenreader-Bedienung.'
          : 'Based on our own assessment, the website is largely compliant with WCAG 2.1 AA. No external certified audit has been carried out to date; we test continuously with automated tools (including axe and Lighthouse) and manually via keyboard and screen-reader operation.'}</p>

        <h3>${de ? 'Bekannte Einschränkungen' : 'Known limitations'}</h3>
        <ul>
          <li>${de ? 'Bild- und Videomaterial wird laufend ergänzt; neue Medien erhalten sukzessive Alt-Texte bzw. Untertitel.' : 'Imagery and video are being added continuously; new media receive alt text or captions successively.'}</li>
          <li>${de ? 'Die Antworten des KI-Chat-Assistenten werden dynamisch generiert; Struktur und Länge der Antworten können variieren.' : 'The responses of the AI chat assistant are generated dynamically; the structure and length of responses may vary.'}</li>
          <li>${de ? 'Verlinkte externe Plattformen (Social Media, Messenger) liegen außerhalb unseres Einflussbereichs.' : 'Linked external platforms (social media, messengers) are outside our control.'}</li>
        </ul>

        <h3>${de ? 'Feedback & Kontakt' : 'Feedback & contact'}</h3>
        <p>${de
          ? 'Sind Ihnen Barrieren aufgefallen oder benötigen Sie Inhalte in einer zugänglichen Form? Schreiben Sie uns an ' + l.email + ' oder rufen Sie uns an: ' + l.phone + '. Wir antworten in der Regel innerhalb weniger Werktage und bemühen uns, gemeldete Barrieren zeitnah zu beheben.'
          : 'Have you noticed any barriers, or do you need content in an accessible format? Write to us at ' + l.email + ' or call us: ' + l.phone + '. We usually respond within a few working days and endeavour to remedy reported barriers promptly.'}</p>

        <h3>${de ? 'Erstellung dieser Erklärung' : 'Creation of this statement'}</h3>
        <p>${de
          ? 'Diese Erklärung wurde auf Grundlage einer Selbstbewertung erstellt und wird bei wesentlichen Änderungen der Website aktualisiert. Stand: ' + l.lastUpdated + '.'
          : 'This statement was prepared on the basis of a self-assessment and is updated whenever the website changes materially. Last updated: ' + l.lastUpdated + '.'}</p>
      </div>`;
    },
  };
})();
