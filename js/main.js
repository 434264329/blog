// 主题管理
let currentTheme = localStorage.getItem('theme') || 'light';
let isAnimating = false;

// 初始化
// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // 初始化粒子系统
    initParticles();
    
    // 设置滚动监听
    setupScrollListener();
    
    // 平滑滚动
    setupSmoothScroll();
    
    // 加载快速链接
    loadQuickLinks();
    
    // 搜索引擎选择监听
    const searchEngineSelect = document.getElementById('searchEngine');
    if (searchEngineSelect) {
        searchEngineSelect.addEventListener('change', updateAcademicButton);
        updateAcademicButton(); // 初始化状态
    }
});

// 主题切换函数
function toggleTheme() {
    if (isAnimating) return;
    
    isAnimating = true;
    const toggleBall = document.querySelector('.toggle-ball');
    
    if (!toggleBall) {
        isAnimating = false;
        return;
    }
    
    // 重置transform，然后添加缩放动画
    const currentTransform = toggleBall.style.transform || '';
    const baseTransform = currentTransform.includes('translateX') ? currentTransform.split(' scale')[0] : '';
    
    toggleBall.style.transform = baseTransform + ' scale(0.8)';
    
    setTimeout(() => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // 更新粒子颜色
        setTimeout(() => {
            if (typeof updateParticlesColor === 'function') {
                updateParticlesColor();
            }
        }, 100);
        
        // 恢复按钮动画
        const newBaseTransform = document.documentElement.getAttribute('data-theme') === 'dark' ? 'translateX(28px)' : '';
        toggleBall.style.transform = newBaseTransform;
        
        setTimeout(() => {
            isAnimating = false;
        }, 200);
    }, 150);
}

// 滚动监听设置
function setupScrollListener() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 显示/隐藏返回顶部按钮
        if (scrollTop > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
        
        // 导航栏滚动效果
        const nav = document.querySelector('.glass-nav');
        if (nav) {
            if (scrollTop > 50) {
                nav.style.background = 'var(--secondary-bg)';
                nav.style.boxShadow = '0 15px 45px var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            } else {
                nav.style.background = 'var(--glass-bg)';
                nav.style.boxShadow = '0 12px 40px var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }
        }
    });
}

// 返回顶部函数
function scrollToTop() {
    const btn = document.getElementById('backToTop');
    
    if (btn) {
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 平滑滚动设置
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 显示我的页面
function showMyPage() {
    window.open('profile.html', '_blank');
}

// 显示资源页面
function showResourcesPage() {
    window.open('resources.html', '_blank');
}

// 搜索功能
function updateAcademicButton() {
    const searchEngine = document.getElementById('searchEngine');
    const academicBtn = document.getElementById('academicBtn');
    
    if (!searchEngine || !academicBtn) return;
    
    if (['google', 'baidu', 'bing'].includes(searchEngine.value)) {
        academicBtn.disabled = false;
    } else {
        academicBtn.disabled = true;
    }
}

// 处理搜索按键事件
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}

// 执行搜索
function performSearch() {
    const searchEngine = document.getElementById('searchEngine');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchEngine || !searchInput) return;
    
    const searchQuery = searchInput.value.trim();
    
    if (!searchQuery) {
        alert('请输入搜索内容');
        return;
    }
    
    const searchUrls = {
        google: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
        baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`,
        '360': `https://www.so.com/s?q=${encodeURIComponent(searchQuery)}`,
        sogou: `https://www.sogou.com/web?query=${encodeURIComponent(searchQuery)}`
    };
    
    window.open(searchUrls[searchEngine.value], '_blank');
}

// 执行学术搜索
function performAcademicSearch() {
    const searchEngine = document.getElementById('searchEngine');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchEngine || !searchInput) return;
    
    const searchQuery = searchInput.value.trim();
    
    if (!searchQuery) {
        alert('请输入搜索内容');
        return;
    }
    
    const academicUrls = {
        google: `https://scholar.google.com/scholar?q=${encodeURIComponent(searchQuery)}`,
        baidu: `https://xueshu.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`,
        bing: `https://www.bing.com/academic/search?q=${encodeURIComponent(searchQuery)}`
    };
    
    if (academicUrls[searchEngine.value]) {
        window.open(academicUrls[searchEngine.value], '_blank');
    }
}

// 窗口大小改变时重新初始化粒子
window.addEventListener('resize', () => {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        window.pJSDom[0].pJS.fn.vendors.resize();
    }
});

// 页面可见性改变时暂停/恢复粒子动画
document.addEventListener('visibilitychange', () => {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        if (document.hidden) {
            window.pJSDom[0].pJS.fn.vendors.stop();
        } else {
            window.pJSDom[0].pJS.fn.vendors.start();
        }
    }
});


// 快速链接功能
function openQuickLink(url) {
    window.open(url, '_blank');
}

// 动态加载快速链接
// 动态加载快速链接
function loadQuickLinks() {
    const container = document.querySelector('.quick-links-grid');
    if (!container || !quickLinksData) return;
    
    container.innerHTML = '';
    
    quickLinksData.forEach(link => {
        const linkCard = document.createElement('div');
        linkCard.className = 'quick-link-card';
        linkCard.onclick = () => openQuickLink(link.url);
        
        let iconContent = '';
        if (link.icon.type === 'text') {
            iconContent = `<span class="icon-text">${link.icon.content}</span>`;
        } else {
            iconContent = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    ${link.icon.content}
                </svg>
            `;
        }
        
        linkCard.innerHTML = `
            <div class="quick-link-icon ${link.id}">
                ${iconContent}
            </div>
            <div class="quick-link-info">
                <h3>${link.name}</h3>
                <p>${link.description}</p>
            </div>
        `;
        
        container.appendChild(linkCard);
    });
}