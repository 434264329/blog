// 捐赠页面功能

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

// 跳转到微信捐赠页面
function goToWechat() {
    window.location.href = 'wechat.html';
}

// 跳转到支付宝捐赠页面
function goToAlipay() {
    window.location.href = 'alipay.html';
}

// 返回捐赠主页面
function goBack() {
    window.location.href = 'donate.html';
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