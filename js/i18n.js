// 多语言支持系统
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'zh';
        this.translations = {};
        this.loadTranslations();
    }

    // 加载翻译文件
    loadTranslations() {
        this.translations = {
            'zh': {
                // 导航栏
                'nav.home': '首页',
                'nav.my': '我的',
                'nav.resources': '资源',
                'nav.software': '软件',
                'nav.donate': '捐赠',
                'nav.back': '返回',
                
                // 页面标题
                'title.main': '主界面 - 我的博客',
                'title.profile': '我的主页 - 个人资料',
                'title.resources': '资源中心 - 我的博客',
                'title.software': '软件中心 - 我的博客',
                'title.donate': '捐赠 - 我的博客',
                'title.wechat': '微信捐赠 - 我的博客',
                'title.alipay': '支付宝捐赠 - 我的博客',
                
                // 搜索
                'search.placeholder': '输入搜索内容...',
                'search.button': '搜索',
                'search.academic': '学术搜索',
                
                // 常用网站
                'quicklinks.title': '常用网站',
                
                // 资源页面
                'resources.title': '资源中心',
                'resources.heading': '资源中心',
                'resources.subtitle': '这里收集了我的各种资源和链接',
                'resources.search_placeholder': '搜索资源...',
                'resources.visit': '访问',
                'resources.no_results': '没有找到匹配的资源',
                
                // 软件页面
                'software.title': '软件中心',
                'software.subtitle': '这里是由我和AI写的软件工具',
                'software.search_placeholder': '搜索软件...',
                'software.download': '下载',
                'software.no_download': '暂无下载',
                'software.no_results': '没有找到匹配的软件',
                
                // 捐赠页面
                'donate.intro': '如果您觉得我的内容对您有帮助，欢迎通过以下方式支持我的创作：',
                'donate.wechat': '微信捐赠',
                'donate.wechat_desc': '使用微信扫码支付',
                'donate.wechat_thanks': '感谢您的微信捐赠支持！',
                'donate.alipay': '支付宝捐赠',
                'donate.alipay_desc': '使用支付宝扫码支付',
                'donate.alipay_thanks': '感谢您的支付宝捐赠支持！',
                'donate.note': '可选择上述捐赠方式，感谢你的每一笔捐赠',
                
                // 个人资料页面
                'profile.title': '我的主页',
                'profile.heading': '我的主页',
                'profile.subtitle': '欢迎访问我的个人空间',
                'profile.social_title': '社交媒体',
                'profile.bilibili': '哔哩哔哩',
                'profile.bilibili_desc': '我的B站主页',
                'profile.visit_bilibili': '访问B站',
                'profile.douyin': '抖音',
                'profile.douyin_desc': '我的抖音主页',
                'profile.visit_douyin': '访问抖音',
                
                // 通用
                'common.loading': '加载中...',
                'common.error': '加载失败',
                'common.back_to_top': '返回顶部'
            },
            'en': {
                // Navigation
                'nav.home': 'Home',
                'nav.my': 'My',
                'nav.resources': 'Resources',
                'nav.software': 'Software',
                'nav.donate': 'Donate',
                'nav.back': 'Back',
                
                // Page titles
                'title.main': 'Home - My Blog',
                'title.profile': 'My Profile - Personal Info',
                'title.resources': 'Resource Center - My Blog',
                'title.software': 'Software Center - My Blog',
                'title.donate': 'Donate - My Blog',
                'title.wechat': 'WeChat Donation - My Blog',
                'title.alipay': 'Alipay Donation - My Blog',
                
                // Search
                'search.placeholder': 'Enter search terms...',
                'search.button': 'Search',
                'search.academic': 'Academic Search',
                
                // Quick links
                'quicklinks.title': 'Quick Links',
                
                // Resources page
                'resources.title': 'Resource Center',
                'resources.heading': 'Resource Center',
                'resources.subtitle': 'Collection of my various resources and links',
                'resources.search_placeholder': 'Search resources...',
                'resources.visit': 'Visit',
                'resources.no_results': 'No matching resources found',
                
                // Software page
                'software.title': 'Software Center',
                'software.subtitle': 'Software tools written by me and AI',
                'software.search_placeholder': 'Search software...',
                'software.download': 'Download',
                'software.no_download': 'No Download',
                'software.no_results': 'No matching software found',
                
                // Donate page
                'donate.intro': 'If you find my content helpful, please consider supporting my work through the following methods:',
                'donate.wechat': 'WeChat Donation',
                'donate.wechat_desc': 'Scan QR code with WeChat',
                'donate.wechat_thanks': 'Thank you for your WeChat donation support!',
                'donate.alipay': 'Alipay Donation',
                'donate.alipay_desc': 'Scan QR code with Alipay',
                'donate.alipay_thanks': 'Thank you for your Alipay donation support!',
                'donate.note': 'Choose any of the above donation methods, thank you for every donation',
                
                // Profile page
                'profile.title': 'My Profile',
                'profile.heading': 'My Profile',
                'profile.subtitle': 'Welcome to my personal space',
                'profile.social_title': 'Social Media',
                'profile.bilibili': 'Bilibili',
                'profile.bilibili_desc': 'My Bilibili homepage',
                'profile.visit_bilibili': 'Visit Bilibili',
                'profile.douyin': 'Douyin',
                'profile.douyin_desc': 'My Douyin homepage',
                'profile.visit_douyin': 'Visit Douyin',
                
                // Common
                'common.loading': 'Loading...',
                'common.error': 'Loading failed',
                'common.back_to_top': 'Back to Top'
            },
            'ja': {
                // ナビゲーション
                'nav.home': 'ホーム',
                'nav.my': 'マイ',
                'nav.resources': 'リソース',
                'nav.software': 'ソフトウェア',
                'nav.donate': '寄付',
                'nav.back': '戻る',
                
                // ページタイトル
                'title.main': 'ホーム - 私のブログ',
                'title.profile': 'マイプロフィール - 個人情報',
                'title.resources': 'リソースセンター - 私のブログ',
                'title.software': 'ソフトウェアセンター - 私のブログ',
                'title.donate': '寄付 - 私のブログ',
                'title.wechat': 'WeChat寄付 - 私のブログ',
                'title.alipay': 'Alipay寄付 - 私のブログ',
                
                // 検索
                'search.placeholder': '検索内容を入力...',
                'search.button': '検索',
                'search.academic': '学術検索',
                
                // よく使うサイト
                'quicklinks.title': 'よく使うサイト',
                
                // リソースページ
                'resources.title': 'リソースセンター',
                'resources.heading': 'リソースセンター',
                'resources.subtitle': '私の様々なリソースとリンクのコレクション',
                'resources.search_placeholder': 'リソースを検索...',
                'resources.visit': '訪問',
                'resources.no_results': '一致するリソースが見つかりません',
                
                // ソフトウェアページ
                'software.title': 'ソフトウェアセンター',
                'software.subtitle': '私とAIが書いたソフトウェアツール',
                'software.search_placeholder': 'ソフトウェアを検索...',
                'software.download': 'ダウンロード',
                'software.no_download': 'ダウンロードなし',
                'software.no_results': '一致するソフトウェアが見つかりません',
                
                // 寄付ページ
                'donate.intro': '私のコンテンツがお役に立てた場合は、以下の方法でサポートをお願いします：',
                'donate.wechat': 'WeChat寄付',
                'donate.wechat_desc': 'WeChatでQRコードをスキャン',
                'donate.wechat_thanks': 'WeChat寄付のサポートをありがとうございます！',
                'donate.alipay': 'Alipay寄付',
                'donate.alipay_desc': 'AlipayでQRコードをスキャン',
                'donate.alipay_thanks': 'Alipay寄付のサポートをありがとうございます！',
                'donate.note': '上記の寄付方法からお選びください。すべての寄付に感謝いたします',
                
                // プロフィールページ
                'profile.title': 'マイプロフィール',
                'profile.heading': 'マイプロフィール',
                'profile.subtitle': '私の個人スペースへようこそ',
                'profile.social_title': 'ソーシャルメディア',
                'profile.bilibili': 'Bilibili',
                'profile.bilibili_desc': '私のBilibiliホームページ',
                'profile.visit_bilibili': 'Bilibiliを訪問',
                'profile.douyin': 'Douyin',
                'profile.douyin_desc': '私のDouyinホームページ',
                'profile.visit_douyin': 'Douyinを訪問',
                
                // 共通
                'common.loading': '読み込み中...',
                'common.error': '読み込み失敗',
                'common.back_to_top': 'トップに戻る'
            }
        };
    }

    // 获取翻译文本
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations['zh']?.[key] || 
                          key;
        
        // 替换参数
        return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] || match;
        });
    }

    // 切换语言
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.updatePageContent();
            this.updatePageTitle();
            this.updateLanguageSelector();
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 获取支持的语言列表
    getSupportedLanguages() {
        return [
            { code: 'zh', name: '中文', flag: '🇨🇳' },
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' }
        ];
    }

    // 更新页面内容
    updatePageContent() {
        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新带有 data-i18n-title 属性的元素的 title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // 更新带有 data-i18n-placeholder 属性的元素的 placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
    }

    // 更新页面标题
    updatePageTitle() {
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            document.title = this.t(key);
        }
    }

    // 更新语言选择器显示
    updateLanguageSelector() {
        const currentLang = this.getSupportedLanguages().find(lang => lang.code === this.currentLanguage);
        
        // 更新自动创建的语言选择器
        const languageBtn = document.querySelector('.language-btn');
        if (languageBtn && currentLang) {
            languageBtn.innerHTML = `
                <span class="language-flag">${currentLang.flag}</span>
                <span class="language-name">${currentLang.name}</span>
                <svg class="language-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }

        // 更新手动创建的语言选择器（profile页面）
        const currentLanguageSpan = document.querySelector('.current-language');
        if (currentLanguageSpan && currentLang) {
            currentLanguageSpan.innerHTML = `
                <span class="flag">${currentLang.flag}</span>
                <span class="lang-name">${currentLang.name}</span>
            `;
        }

        // 更新选项的激活状态
        document.querySelectorAll('.language-option').forEach(option => {
            const langCode = option.getAttribute('data-lang') || option.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
            if (langCode === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // 创建语言选择器
    createLanguageSelector() {
        const navContainer = document.querySelector('.nav-container');
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (!navContainer || !themeToggle) return;

        // 检查是否已存在语言选择器
        if (document.querySelector('.language-selector')) return;

        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        
        const currentLang = this.getSupportedLanguages().find(lang => lang.code === this.currentLanguage);
        
        languageSelector.innerHTML = `
            <button class="language-btn" onclick="toggleLanguageMenu()">
                <span class="language-flag">${currentLang.flag}</span>
                <span class="language-name">${currentLang.name}</span>
                <svg class="language-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="language-menu">
                ${this.getSupportedLanguages().map(lang => `
                    <button class="language-option ${lang.code === this.currentLanguage ? 'active' : ''}" 
                            data-lang="${lang.code}" 
                            onclick="changeLanguage('${lang.code}')">
                        <span class="language-flag">${lang.flag}</span>
                        <span class="language-name">${lang.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        // 在主题切换按钮前插入语言选择器
        navContainer.insertBefore(languageSelector, themeToggle);
    }

    // 初始化多语言支持
    init() {
        this.createLanguageSelector();
        this.updatePageContent();
        this.updatePageTitle();
    }
}

// 创建全局实例
const i18n = new I18n();

// 全局函数
function toggleLanguageMenu() {
    const selector = document.querySelector('.language-selector');
    const menu = document.querySelector('.language-menu');
    if (selector && menu) {
        selector.classList.toggle('show');
        menu.classList.toggle('show');
    }
}

function changeLanguage(language) {
    i18n.setLanguage(language);
    
    // 关闭菜单
    const selector = document.querySelector('.language-selector');
    const menu = document.querySelector('.language-menu');
    if (selector) {
        selector.classList.remove('show');
    }
    if (menu) {
        menu.classList.remove('show');
    }
    
    // 重新加载动态内容
    if (typeof loadSoftware === 'function') loadSoftware();
    if (typeof loadResources === 'function') loadResources();
    if (typeof loadQuickLinks === 'function') loadQuickLinks();
}

// 点击外部关闭语言菜单
document.addEventListener('click', function(event) {
    const languageSelector = document.querySelector('.language-selector');
    const menu = document.querySelector('.language-menu');
    if (languageSelector && menu && !languageSelector.contains(event.target)) {
        languageSelector.classList.remove('show');
        menu.classList.remove('show');
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    i18n.init();
});