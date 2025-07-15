// 资源页面功能
let allResources = []; // 存储所有资源数据

// 初始化粒子系统
function initParticles() {
    if (typeof particlesJS !== 'undefined' && typeof particlesConfig !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    }
}

// 更新粒子颜色
function updateParticlesColor() {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const theme = document.documentElement.getAttribute('data-theme');
        const particles = window.pJSDom[0].pJS.particles;
        
        if (particles && particles.array) {
            particles.array.forEach(particle => {
                particle.color.value = theme === 'dark' ? '#ffffff' : '#000000';
            });
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 初始化粒子系统
    initParticles();
    
    // 加载资源数据
    loadResources();
    
    // 设置滚动监听
    setupScrollListener();
});

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

// 加载资源数据
function loadResources() {
    try {
        // 检查资源数据是否存在
        const data = window.resourcesData || resourcesData;
        if (data && data.resources) {
            allResources = data.resources;
            displayResources(allResources);
        } else {
            console.error('资源数据未找到');
            showNoResults();
        }
    } catch (error) {
        console.error('加载资源数据时出错:', error);
        showNoResults();
    }
}

// 显示资源
function displayResources(resources) {
    const container = document.getElementById('resourcesContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (!container) return;
    
    if (resources.length === 0) {
        container.innerHTML = '';
        noResultsMessage.style.display = 'block';
        return;
    }
    
    noResultsMessage.style.display = 'none';
    
    // 获取当前语言的访问按钮文本
    const visitText = i18n ? i18n.t('resources.visit') : '访问';
    
    container.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <div class="resource-header">
                <div class="resource-icon ${getIconClass(resource.icon)}">
                    ${getIconSVG(resource.icon)}
                </div>
                <div class="resource-info">
                    <h3>${resource.title}</h3>
                    <div class="resource-name">${resource.name}</div>
                </div>
            </div>
            <p class="resource-description">${resource.description}</p>
            <button class="resource-btn" onclick="openResource('${resource.url}')">
                ${visitText}
            </button>
        </div>
    `).join('');
}

// 过滤资源
function filterResources() {
    const searchInput = document.getElementById('resourceSearchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayResources(allResources);
        return;
    }
    
    const filteredResources = allResources.filter(resource => {
        return resource.title.toLowerCase().includes(searchTerm) ||
               resource.description.toLowerCase().includes(searchTerm);
    });
    
    displayResources(filteredResources);
}

// 显示无结果消息
function showNoResults() {
    const container = document.getElementById('resourcesContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (container) container.innerHTML = '';
    if (noResultsMessage) noResultsMessage.style.display = 'block';
}

// 获取图标类名
function getIconClass(iconType) {
    const iconMap = {
        'github': 'github',
        'bilibili': 'bilibili',
        'douyin': 'douyin',
        'blog': 'blog',
        'project': 'project'
    };
    return iconMap[iconType] || 'project';
}

// 获取图标SVG
function getIconSVG(iconType) {
    // 检查是否是图片路径
    if (iconType.includes('/') || iconType.includes('.')) {
        // 如果是图片路径，返回img标签
        return `<img src="${iconType}" alt="icon" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    }
    
    // 原有的SVG图标
    const icons = {
        'github': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        'bilibili': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.12zM6.4 15.64a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96zm6.4 0a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96z"/></svg>',
        'douyin': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
        'blog': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        'project': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
        'python': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.21-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25c-.2 0-.37.09-.5.27-.13.18-.2.39-.2.61 0 .22.07.43.2.61.13.18.3.27.5.27.2 0 .37-.09.5-.27.13-.18.2-.39.2-.61 0-.22-.07-.43-.2-.61-.13-.18-.3-.27-.5-.27z"/></svg>',
        'iso': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    };
    return icons[iconType] || icons['project'];
}

// 打开资源
function openResource(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// 返回主页面
function goBackToMain() {
    window.location.href = 'main.html';
}

// 主题切换
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 更新粒子颜色
    setTimeout(updateParticlesColor, 100);
}