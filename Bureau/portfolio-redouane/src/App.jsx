import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Code2, ExternalLink, Github, Mail, Menu, Moon, Sun, X, Languages } from 'lucide-react';
import SectionHeading from './components/SectionHeading.jsx';
import { journey, profile, projects, skills } from './data/portfolio.js';

const translations = {
  fr: {
    navAbout:'À propos', navSkills:'Compétences', navProjects:'Projets', navJourney:'Parcours', navContact:'Contact', openMenu:'Ouvrir le menu', closeMenu:'Fermer le menu', theme:'Changer de thème',
    student:'Portfolio étudiant', hello:'BONJOUR, JE SUIS', role:'Développeur Web Full Stack Junior', projectsBtn:'Découvrir mes projets', contactBtn:'Me contacter', scroll:'DÉFILER POUR EXPLORER',
    aboutEyebrow:'01 — À PROPOS', aboutTitle:'Développer avec curiosité.', aboutTitle2:'Progresser avec chaque projet.', aboutText:'Je suis étudiant en développement digital, option Web Full Stack. J’aime transformer une idée en application web concrète, apprendre de nouvelles méthodes et améliorer la qualité de mon code.', goal:'Mon objectif', goalText:'Rejoindre une équipe où je peux contribuer à des projets réels, apprendre auprès de développeurs expérimentés et évoluer comme développeur Full Stack.',
    skillsEyebrow:'02 — COMPÉTENCES', skillsTitle:'Mes outils de développement', skillsText:'Une sélection des technologies et outils utilisés dans ma formation et mes projets.', projectsEyebrow:'03 — PROJETS SÉLECTIONNÉS', projectsTitle:'Des idées mises en pratique.', projectsText:'Des projets qui illustrent ma démarche de développement web. Leur présentation sera mise à jour au fil de leur évolution.', source:'Code source', demo:'Voir la démo', moreCode:'Plus de code et d’expérimentations sur', github:'mon GitHub', journeyEyebrow:'04 — PARCOURS', journeyTitle:'Formation & expérience', journeyText:'Mon parcours dans le développement digital et mes premières expériences pratiques.', contactEyebrow:'05 — CONTACT', contactTitle:'Construisons quelque chose', contactTitle2:'de concret.', contactText:'Vous proposez un stage, une opportunité junior ou souhaitez discuter d’un projet web ? Je serais ravi d’échanger avec vous.', sendEmail:'Envoyer un e-mail', viewGithub:'Consulter mon GitHub', footer:'Conçu et développé avec React & Vite.', available:'Ouvert aux opportunités de stage et junior', frontend:'Frontend', backend:'Backend', databases:'Bases de données', tools:'Outils & méthodes', projectLabel:'PROJET', webApp:'APPLICATION WEB', codeComment:'// Toujours apprendre.', learning:'apprendre', building:'projets utiles',
  },
  en: {
    navAbout:'About', navSkills:'Skills', navProjects:'Projects', navJourney:'Experience', navContact:'Contact', openMenu:'Open menu', closeMenu:'Close menu', theme:'Toggle theme',
    student:'Student portfolio', hello:'HELLO, I’M', role:'Junior Full Stack Web Developer', projectsBtn:'Explore my projects', contactBtn:'Get in touch', scroll:'SCROLL TO EXPLORE',
    aboutEyebrow:'01 — ABOUT', aboutTitle:'Building with curiosity.', aboutTitle2:'Growing with every project.', aboutText:'I’m a Digital Development student specializing in Web Full Stack. I enjoy turning ideas into practical web applications, learning new approaches, and improving my code quality.', goal:'My goal', goalText:'Join a team where I can contribute to real projects, learn from experienced developers, and grow as a Full Stack developer.',
    skillsEyebrow:'02 — SKILLS', skillsTitle:'My development toolkit', skillsText:'A selection of technologies and tools used in my training and projects.', projectsEyebrow:'03 — SELECTED PROJECTS', projectsTitle:'Ideas put into practice.', projectsText:'Projects that reflect my approach to web development. Their details will be updated as the projects evolve.', source:'Source code', demo:'Live demo', moreCode:'More code and experiments on', github:'my GitHub', journeyEyebrow:'04 — JOURNEY', journeyTitle:'Education & experience', journeyText:'My path in digital development and my first practical experiences.', contactEyebrow:'05 — CONTACT', contactTitle:'Let’s build something', contactTitle2:'meaningful.', contactText:'Have an internship, junior opportunity, or web project to discuss? I’d be happy to connect.', sendEmail:'Send an email', viewGithub:'Visit my GitHub', footer:'Designed and built with React & Vite.', available:'Open to internship and junior opportunities', frontend:'Frontend', backend:'Backend', databases:'Databases', tools:'Tools & methods', projectLabel:'PROJECT', webApp:'WEB APPLICATION', codeComment:'// Always keep learning.', learning:'learning', building:'useful projects',
  },
  ar: {
    navAbout:'نبذة عني', navSkills:'المهارات', navProjects:'المشاريع', navJourney:'المسار', navContact:'اتصل بي', openMenu:'فتح القائمة', closeMenu:'إغلاق القائمة', theme:'تغيير المظهر',
    student:'ملف تعريفي لطالب', hello:'مرحباً، أنا', role:'مطور ويب Full Stack مبتدئ', projectsBtn:'اكتشف مشاريعي', contactBtn:'تواصل معي', scroll:'تصفّح لاكتشاف المزيد',
    aboutEyebrow:'01 — نبذة عني', aboutTitle:'أطوّر بفضول.', aboutTitle2:'وأتقدم مع كل مشروع.', aboutText:'أنا طالب في شعبة التنمية الرقمية، تخصص Web Full Stack. أحب تحويل الأفكار إلى تطبيقات ويب عملية، وتعلّم أساليب جديدة وتحسين جودة الكود.', goal:'هدفي', goalText:'الانضمام إلى فريق أساهم معه في مشاريع حقيقية، وأتعلم من مطورين ذوي خبرة، وأتطور كمطور Full Stack.',
    skillsEyebrow:'02 — المهارات', skillsTitle:'أدوات التطوير التي أستخدمها', skillsText:'مجموعة من التقنيات والأدوات التي أستعملها في التكوين والمشاريع.', projectsEyebrow:'03 — مشاريع مختارة', projectsTitle:'أفكار تتحول إلى تطبيقات.', projectsText:'مشاريع تعكس طريقة عملي في تطوير الويب. سيتم تحديث تفاصيلها مع تقدم العمل عليها.', source:'الكود المصدري', demo:'عرض مباشر', moreCode:'المزيد من الأكواد والتجارب على', github:'حسابي على GitHub', journeyEyebrow:'04 — المسار', journeyTitle:'التكوين والتجربة', journeyText:'مساري في التنمية الرقمية وأولى تجاربي التطبيقية.', contactEyebrow:'05 — التواصل', contactTitle:'لنبنِ شيئاً', contactTitle2:'عملياً ومفيداً.', contactText:'هل تتوفر على فرصة تدريب أو وظيفة للمبتدئين، أو ترغب في مناقشة مشروع ويب؟ يسعدني التواصل معك.', sendEmail:'إرسال بريد إلكتروني', viewGithub:'زيارة GitHub', footer:'تم التصميم والتطوير باستخدام React وVite.', available:'منفتح على فرص التدريب والوظائف للمبتدئين', frontend:'الواجهة الأمامية', backend:'الخلفية البرمجية', databases:'قواعد البيانات', tools:'الأدوات والمنهجيات', projectLabel:'مشروع', webApp:'تطبيق ويب', codeComment:'// تعلّم باستمرار.', learning:'التعلّم', building:'مشاريع مفيدة',
  }
};

const skillTitleKeys = { Frontend:'frontend', Backend:'backend', Databases:'databases', 'Tools & methods':'tools' };

function Header({ dark, setDark, lang, setLang, t }) {
  const [open, setOpen] = useState(false);
  const links = [[t.navAbout, '#apropos'], [t.navSkills, '#competences'], [t.navProjects, '#projets'], [t.navJourney, '#parcours'], [t.navContact, '#contact']];
  return <header className="site-header"><a className="brand" href="#accueil" aria-label="Home"><span>{"<Redouane/>"}<span className="brand-dot">.</span></span></a>
    <button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-label={open ? t.closeMenu : t.openMenu}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
    <nav className={open ? 'nav-links nav-open' : 'nav-links'}>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>
    <div className="header-controls"><div className="language-switch" aria-label="Language selector"><Languages size={15}/>{['fr','en','ar'].map(code => <button key={code} type="button" className={lang === code ? 'language-active' : ''} onClick={() => setLang(code)} aria-pressed={lang === code}>{code.toUpperCase()}</button>)}</div>
    <button className="theme-toggle icon-button" onClick={() => setDark(!dark)} aria-label={t.theme}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button></div>
  </header>;
}

function ProjectCard({ project, t, lang }) {
  return <article className={`project-card ${project.featured ? 'project-featured' : ''}`}>
    <div className="project-top"><span className="project-number">{project.number} / {t.projectLabel}</span><span className="project-category">{project.category[lang]}</span></div>
    <div className="project-visual" aria-hidden="true">
    <div className="mock-window"> 
    <img src={project.image} alt={project.title}></img>
    <div className="mock-bar">
    {/*<i/><i/><i/><span>{project.title.toLowerCase().replace(/\s+/g,'-')}.app</span></div><div className="mock-content"><div className="mock-side"><b/><b/><b/><b/></div><div className="mock-main"><div className="mock-title"/><div className="mock-grid"><span/><span/><span/></div><div className="mock-lines"><i/><i/><i/></div></div>*/}

    </div>
    </div><span className="visual-label">{t.webApp}</span> 
    </div>
    <div className="project-body"><h3>{project.title}</h3><p>{project.description[lang]}</p><div className="tag-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div><div className="project-links"><a href={project.github} target="_blank" rel="noreferrer"><Github size={16}/> {t.source} <ArrowUpRight size={15}/></a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">{t.demo} <ExternalLink size={15}/></a>}</div></div>
  </article>;
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('portfolio-theme') !== 'light');
  const [lang, setLang] = useState(() => ['fr','en','ar'].includes(localStorage.getItem('portfolio-language')) ? localStorage.getItem('portfolio-language') : 'fr');
  const t = translations[lang];
  const isArabic = lang === 'ar';
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    localStorage.setItem('portfolio-language', lang);
  }, [lang, isArabic]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);
  return <div className={isArabic ? 'app app-rtl' : 'app'}><Header dark={dark} setDark={setDark} lang={lang} setLang={setLang} t={t}/><main>
    <section className="hero section-wrap" id="accueil"><div className="hero-copy"><div className="availability"><span className="status-dot"/> {t.available} · {profile.location}</div><p className="eyebrow">{t.hello}</p><h1>{profile.name}<span className="hero-period">.</span></h1><h2>{t.role}</h2><p className="hero-description">{profile.intro[lang]}</p><div className="hero-actions"><a className="button button-primary" href="#projets">{t.projectsBtn} <ArrowDownRight size={18}/></a><a className="button button-secondary" href={`mailto:${profile.email}`}>{t.contactBtn} <Mail size={17}/></a></div><div className="hero-socials"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={13}/></a><span className="social-separator"/> <span className="mono-label">HTML · CSS · JS · REACT · PHP · LARAVEL</span></div></div>
      <div className="hero-art" aria-label="Code illustration"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="code-card"><div className="code-card-header"><div className="window-dots"><i/><i/><i/></div><span>developer.js</span><Code2 size={15}/></div><div className="code-lines"><p><span className="code-purple">const</span> developer <span className="code-pink">=</span> {'{'}</p><p className="indent"><span className="code-blue">name</span>: <span className="code-green">'{profile.name}'</span>,</p><p className="indent"><span className="code-blue">role</span>: <span className="code-green">'Full Stack Junior'</span>,</p><p className="indent"><span className="code-blue">{t.learning}</span>: <span className="code-orange">true</span>,</p><p className="indent"><span className="code-blue">building</span>: <span className="code-green">'{t.building}'</span></p><p>{'}'};</p><p className="code-comment">{t.codeComment}</p><p><span className="code-purple">while</span> (<span className="code-orange">true</span>) {'{'}</p><p className="indent">improve(); <span className="cursor"/></p><p>{'}'}</p></div></div><div className="floating-chip chip-react"><span>⚛</span> React</div><div className="floating-chip chip-php"><span>₱</span> PHP / Laravel</div><div className="hero-stamp"><span>BUILD</span><span>·</span><span>LEARN</span><span>·</span><span>REPEAT</span></div></div>
      <a className="scroll-hint" href="#apropos"><span className="scroll-line"/> {t.scroll}</a>
    </section>

    <section className="about section-wrap reveal" id="apropos"><SectionHeading eyebrow={t.aboutEyebrow} title={<>{t.aboutTitle}<br/><span className="text-muted">{t.aboutTitle2}</span></>} text={t.aboutText}/><div className="about-note"><span className="note-icon"><Code2 size={20}/></span><div><strong>{t.goal}</strong><p>{t.goalText}</p></div></div></section>
    <section className="skills-section section-wrap reveal" id="competences"><SectionHeading eyebrow={t.skillsEyebrow} title={t.skillsTitle} text={t.skillsText}/><div className="skills-grid">{skills.map((group, index) => <article className="skill-card" key={group.title}><div className="skill-card-head"><span>0{index + 1}</span><h3>{t[skillTitleKeys[group.title]] || group.title}</h3></div><div className="tag-list">{group.items.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div></section>
    <section className="projects-section section-wrap reveal" id="projets"><SectionHeading eyebrow={t.projectsEyebrow} title={t.projectsTitle} text={t.projectsText}/><div className="projects-grid">{projects.map(project => <ProjectCard key={project.number} project={project} t={t} lang={lang}/>)}</div><p className="project-footnote">{t.moreCode} <a href={profile.github} target="_blank" rel="noreferrer">{t.github} <ArrowUpRight size={13}/></a>.</p></section>
    <section className="journey-section section-wrap reveal" id="parcours"><SectionHeading eyebrow={t.journeyEyebrow} title={t.journeyTitle} text={t.journeyText}/><div className="timeline">{journey.map((item, i) => <article className="timeline-item" key={item.title.fr}><div className="timeline-marker">0{i + 1}</div><div className="timeline-content"><div className="timeline-meta"><span>{item.type[lang]}</span><time>{item.date}</time></div><h3>{item.title[lang]}</h3><p className="timeline-place">{item.place}</p><p className="timeline-description">{item.description[lang]}</p></div></article>)}</div></section>
    <section className="contact-section section-wrap reveal" id="contact"><div className="contact-panel"><div><p className="eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle}<br/><span>{t.contactTitle2}</span></h2><p className="contact-copy">{t.contactText}</p></div><div className="contact-actions"><a className="button button-primary" href={`mailto:${profile.email}?subject=${encodeURIComponent(lang === 'fr' ? 'Contact depuis mon portfolio' : lang === 'en' ? 'Contact from my portfolio' : 'تواصل من خلال ملف أعمالي')}`}>{t.sendEmail} <ArrowUpRight size={17}/></a><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><a className="contact-github" href={profile.github} target="_blank" rel="noreferrer"><Github size={17}/> {t.viewGithub} <ArrowUpRight size={14}/></a></div></div></section>
  </main><footer className="site-footer"><a className="brand" href="#accueil"><span>{"<Redouane/>"}<span className="brand-dot">.</span></span></a><p>{t.footer}</p><span>© {new Date().getFullYear()} Redouane Skouti</span></footer></div>;
}
