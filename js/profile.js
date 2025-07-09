// 个人资料页面功能

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
});

// 返回主页面
function goBack() {
    window.location.href = 'main.html';
}

// 打开B站主页
function openBilibili(event) {
    event.preventDefault();
    window.open('https://space.bilibili.com/506537460', '_blank');
}

// 打开抖音主页
function openDouyin(event) {
    event.preventDefault();
    window.open('https://www.douyin.com/user/MS4wLjABAAAAOT2jxH6xqrFbMc5O6qF5aYsOmvNo9Diy5CqcK85zjv0', '_blank');
}

// 主题切换函数
let isAnimating = false;

function toggleTheme() {
    if (isAnimating) return;
    
    isAnimating = true;
    const toggleBall = document.querySelector('.toggle-ball');
    
    if (!toggleBall) {
        isAnimating = false;
        return;
    }
    
    const currentTransform = toggleBall.style.transform || '';
    const baseTransform = currentTransform.includes('translateX') ? currentTransform.split(' scale')[0] : '';
    
    toggleBall.style.transform = baseTransform + ' scale(0.8)';
    
    setTimeout(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        setTimeout(() => {
            if (typeof updateParticlesColor === 'function') {
                updateParticlesColor();
            }
        }, 100);
        
        const newBaseTransform = newTheme === 'dark' ? 'translateX(28px)' : '';
        toggleBall.style.transform = newBaseTransform;
        
        setTimeout(() => {
            isAnimating = false;
        }, 200);
    }, 150);
}