// 个人资料页面功能

// 初始化粒子系统
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '#d3d3d3' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.4, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 2, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 120, color: getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '#d3d3d3', opacity: 0.3, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 150, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    }
}

// 更新粒子颜色
function updateParticlesColor() {
    const newColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        window.pJSDom[0].pJS.particles.color.value = newColor;
        window.pJSDom[0].pJS.particles.line_linked.color = newColor;
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置主题
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
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