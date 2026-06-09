// 视觉效果JavaScript

// 随机选择背景
function applyRandomBackground() {
    if (typeof backgroundConfig === 'undefined' || !backgroundConfig.enableRandom) {
        return;
    }

    const backgrounds = backgroundConfig.backgrounds;
    if (!backgrounds || backgrounds.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const selectedBg = backgrounds[randomIndex];

    // 检测是否在子目录中
    const isInSubDir = window.location.pathname.includes('/donate/');
    const basePath = isInSubDir ? '../' : '';

    let bgContainer = document.getElementById('random-background');
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.id = 'random-background';
        bgContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            transition: opacity ${backgroundConfig.animationDuration || 1000}ms ease;
            opacity: 0;
        `;
        document.body.prepend(bgContainer);
    }

    if (selectedBg.type === 'image') {
        bgContainer.style.background = `url('${basePath}${selectedBg.value}') center/cover no-repeat`;
    } else {
        bgContainer.style.background = selectedBg.value;
    }

    bgContainer.style.opacity = backgroundConfig.opacity || 0.3;
}

// 初始化视觉效果
function initVisualEffects() {
    applyRandomBackground();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initVisualEffects, 100);
});