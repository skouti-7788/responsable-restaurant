export const profile = {
  name: 'Redouane Skouti',
  firstName: 'Redouane',
  location: 'Agadir, Maroc',
  email: 'radwansakoti77@gmail.com',
  github: 'https://github.com/skouti-7788',
  linkedin: '',
  intro: {
    fr: 'Je conçois des applications web utiles, de l’interface utilisateur à la base de données. Je souhaite progresser grâce à des projets concrets et à des expériences professionnelles.',
    en: 'I build useful web applications, from user interfaces to databases. I’m looking to grow through hands-on projects and professional experience.',
    ar: 'أطوّر تطبيقات ويب عملية، من واجهة المستخدم إلى قاعدة البيانات. أطمح إلى تطوير مهاراتي من خلال مشاريع واقعية وتجارب مهنية.'
  }
};

export const skills = [
  { title: 'Frontend', items: ['HTML5', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Bootstrap'] },
  { title: 'Backend', items: ['PHP', 'Laravel', 'REST API',] },
  { title: 'Databases', items: ['MySQL', 'SQL', 'NOSQL'] },
  { title: 'Tools & methods', items: ['Git', 'GitHub', 'Docker', 'VS Code', 'Postman', 'Linux'] },
];

export const projects = [
  {
    number: '01', title: 'Menu Online', category: { fr: 'Projet Full Stack', en: 'Full Stack project', ar: 'مشروع Full Stack' },
    description: {
      fr: 'Application de gestion de restaurant avec menu numérique accessible par QR code, gestion des plats et catégories, commandes et interface de gestion.',
      en: 'Restaurant management application with a QR-code digital menu, meal and category management, orders, and a management dashboard.',
      ar: 'تطبيق لتسيير المطاعم يتضمن قائمة رقمية عبر QR Code، وتدبير الأطباق والتصنيفات والطلبات ولوحة تحكم.'
    },
    stack: ['React', 'Laravel', 'MySQL','Tailwind CSS'],
    image:"menuOnline.png",
    github: 'https://github.com/skouti-7788/responsable-restaurant', demo:'https://responsable-restaurant-sr5c.vercel.app', featured: true,
  },
  {
    number: '02', title: 'ImmoFinder', category: { fr: 'Projet web', en: 'Web project', ar: 'مشروع ويب' },
    description: {
      fr: 'Projet de recherche immobilière. La présentation sera précisée selon les fonctionnalités réellement terminées.',
      en: 'A property-search project. Its description will be refined to reflect the features actually completed.',
      ar: 'مشروع للبحث عن العقارات. سيتم استكمال الوصف حسب الخصائص التي تم إنجازها فعلياً.'
    },
    image:"immofinder.png",
    stack: ['React','css'],
    github: 'https://github.com/skouti-7788/Immofinder', demo: 'immo-finder-eosin.vercel.app', featured: false,
  },
];

export const journey = [
  {
    date: '2026', type: { fr: 'Stage', en: 'Internship', ar: 'تدريب' }, title: { fr: 'Stage en développement web', en: 'Web development internship', ar: 'تدريب في تطوير الويب' }, place: 'École Jassani — Aït Melloul',
    description: {
      fr: 'Stage d’un mois dans un établissement scolaire. Les tâches et fonctionnalités seront détaillées selon le travail réellement effectué.',
      en: 'One-month internship at a school. Tasks and features will be detailed based on the work actually completed.',
      ar: 'تدريب لمدة شهر في مؤسسة تعليمية. ستُذكر المهام والخصائص وفق العمل المنجز فعلياً.'
    }
  },
  {
    date: '2024 – en cours', type: { fr: 'Formation', en: 'Education', ar: 'التكوين' }, title: { fr: 'Développement Digital — option Web Full Stack', en: 'Digital Development — Web Full Stack track', ar: 'التنمية الرقمية — تخصص Web Full Stack' }, place: 'OFPPT / ISTA Assaka Tikiwin — Agadir',
    description: {
      fr: 'Formation orientée développement web frontend, backend, bases de données et réalisation de projets pratiques.',
      en: 'Training focused on frontend and backend web development, databases, and hands-on projects.',
      ar: 'تكوين يركز على تطوير الواجهات والخلفية، وقواعد البيانات، وإنجاز مشاريع تطبيقية.'
    }
  },
];
