// 软件页面功能脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('软件页面加载完成');
    
    // 初始化粒子系统
    initParticles();
    
    // 设置主题
    setTheme();
    
    // 加载软件数据
    loadSoftware();
    
    // 设置返回顶部按钮
    setupBackToTop();
});

// 初始化粒子系统
function initParticles() {
    if (typeof particlesJS !== 'undefined' && typeof particlesConfig !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    }
}

// 设置主题
function setTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 主题切换
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 加载软件数据
function loadSoftware() {
    const container = document.getElementById('softwareContainer');
    if (!container) {
        console.error('找不到软件容器');
        return;
    }
    
    if (typeof softwareData === 'undefined' || !Array.isArray(softwareData)) {
        console.error('软件数据未加载');
        container.innerHTML = '<div class="no-results">软件数据加载失败，请检查 software-data.js 文件</div>';
        return;
    }
    
    console.log('加载软件数据，共', softwareData.length, '个软件');
    
    container.innerHTML = '';
    
    softwareData.forEach(software => {
        const softwareItem = createSoftwareItem(software);
        container.appendChild(softwareItem);
    });
}

// 创建软件项目
function createSoftwareItem(software) {
    const item = document.createElement('div');
    item.className = 'resource-item';
    item.setAttribute('data-title', software.title.toLowerCase());
    item.setAttribute('data-description', software.description.toLowerCase());
    item.setAttribute('data-category', software.category ? software.category.toLowerCase() : '');
    
    // 处理图标
    let iconHtml = '';
    if (software.icon && (software.icon.includes('.') || software.icon.includes('/'))) {
        iconHtml = `<img src="${software.icon}" alt="软件图标" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <svg style="display:none;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                       <path d="M9 9h6v6H9z" fill="currentColor"/>
                   </svg>`;
    } else {
        iconHtml = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                       <path d="M9 9h6v6H9z" fill="currentColor"/>
                   </svg>`;
    }
    
    // 创建下载按钮
    let downloadButtons = '';
    if (software.downloads && software.downloads.length > 0) {
        downloadButtons = software.downloads.map(download => `
            <a href="${download.url}" class="resource-btn" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                ${download.name}
            </a>
        `).join('');
    } else {
        downloadButtons = `<button class="resource-btn disabled">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            暂无下载
        </button>`;
    }
    
    // 创建元信息
    let metaInfo = '';
    if (software.version) {
        metaInfo += `<span class="meta-item">${software.version}</span>`;
    }
    if (software.size) {
        metaInfo += `<span class="meta-item">${software.size}</span>`;
    }
    if (software.category) {
        metaInfo += `<span class="meta-item category">${software.category}</span>`;
    }
    
    item.innerHTML = `
        <div class="resource-icon">
            ${iconHtml}
        </div>
        <div class="resource-content">
            <div class="resource-header">
                <h3 class="resource-title">${software.title}</h3>
                <div class="resource-meta">
                    ${metaInfo}
                </div>
            </div>
            <p class="resource-description">${software.description}</p>
            <div class="resource-actions">
                ${downloadButtons}
            </div>
        </div>
    `;
    
    return item;
}

// 软件搜索过滤
function filterSoftware() {
    const searchInput = document.getElementById('softwareSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const items = document.querySelectorAll('.resource-item');
    const noResultsMessage = document.getElementById('noResultsMessage');
    let hasResults = false;
    
    items.forEach(item => {
        const title = item.getAttribute('data-title') || '';
        const description = item.getAttribute('data-description') || '';
        const category = item.getAttribute('data-category') || '';
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            category.includes(searchTerm);
        
        if (matchesSearch) {
            item.style.display = 'flex';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (noResultsMessage) {
        noResultsMessage.style.display = hasResults ? 'none' : 'block';
    }
}

// 设置返回顶部按钮
function setupBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
    }
}

// 返回顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}