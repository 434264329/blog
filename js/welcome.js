// 欢迎页面功能

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置初始主题
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // 初始化粒子系统
    initParticles();
});

// 进入网站函数
function enterSite() {
    // 直接跳转到主界面
    window.location.href = 'main.html';
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