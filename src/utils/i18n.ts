export const translations = {
  zh: {
    'brand.title': "JIM'S BLOG",
    'nav.home': '首页 HOME',
    'nav.articles': '文章 ARTICLES',
    'nav.study': '学习 STUDY',
    'nav.projects': '项目 PROJECTS',
    'nav.tags': '标签 TAGS',
    'nav.about': '关于 ABOUT',
    'nav.archive': '归档 ARCHIVE',
    'nav.guestbook': '留言板 GUESTBOOK',
    'hero.hello': '你好，',
    'hero.im': '我是 Jim.',
    'hero.slogan': '一名热爱技术与二次元的开发者。',
    'hero.explore': '探索更多 Explore',
    'home.latest': 'LATEST ARTICLES',
    'home.viewall': 'VIEW ALL',
    'stats.articles': '文章 ARTICLES',
    'stats.projects': '项目 PROJECTS',
    'stats.tags': '标签 TAGS',
    'stats.days': 'DAYS CODING',
    'footer.built': 'Built with Astro',
    'footer.deployed': 'Deployed on Cloudflare',
    '404.lost': '你似乎偏离了道路。',
    '404.void': '你要到达的坐标不存在或已坍缩进虚空。',
    '404.back': '返回首页',
  },
  en: {
    'brand.title': "JIM'S BLOG",
    'nav.home': 'HOME',
    'nav.articles': 'ARTICLES',
    'nav.study': 'STUDY',
    'nav.projects': 'PROJECTS',
    'nav.tags': 'TAGS',
    'nav.about': 'ABOUT',
    'nav.archive': 'ARCHIVE',
    'nav.guestbook': 'GUESTBOOK',
    'hero.hello': 'Hello, ',
    'hero.im': "I'm Jim.",
    'hero.slogan': 'A developer who loves technology & anime.',
    'hero.explore': 'Explore More',
    'home.latest': 'LATEST ARTICLES',
    'home.viewall': 'VIEW ALL',
    'stats.articles': 'ARTICLES',
    'stats.projects': 'PROJECTS',
    'stats.tags': 'TAGS',
    'stats.days': 'DAYS CODING',
    'footer.built': 'Built with Astro',
    'footer.deployed': 'Deployed on Cloudflare',
    '404.lost': 'You seem to have strayed off the path.',
    '404.void': 'The coordinate you are trying to reach does not exist.',
    '404.back': 'Return Home',
  }
};

export function getLocale(pathname: string): 'zh' | 'en' {
  // If pathname starts with /en or /en/, locale is 'en', otherwise 'zh'
  return pathname.startsWith('/en') ? 'en' : 'zh';
}

export function useTranslations(pathname: string) {
  const lang = getLocale(pathname);
  return (key: keyof typeof translations['zh']) => {
    return translations[lang][key] || translations['zh'][key];
  };
}

export function localizePath(pathname: string, targetLang: 'zh' | 'en'): string {
  const currentLang = getLocale(pathname);
  if (currentLang === targetLang) return pathname;
  
  if (targetLang === 'en') {
    return `/en${pathname === '/' ? '' : pathname}`;
  } else {
    const cleaned = pathname.replace(/^\/en/, '');
    return cleaned === '' ? '/' : cleaned;
  }
}
