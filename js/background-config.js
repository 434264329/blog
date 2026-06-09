// 背景配置文件
// 可以在此添加背景图片路径或渐变色配置

const backgroundConfig = {
    // 背景类型：'image' 使用图片, 'gradient' 使用渐变色
    backgrounds: [
        {
            type: 'image',
            value: 'background/2.jpg',
            name: '壁纸1'
        },
        {
            type: 'image',
            value: 'background/3.jpg',
            name: '壁纸2'
        },
        {
            type: 'image',
            value: 'background/4.png',
            name: '壁纸3'
        }
    ],

    // 是否启用随机背景
    enableRandom: true,

    // 背景切换动画时间（毫秒）
    animationDuration: 1000,

    // 背景不透明度（0-1）
    opacity: 1
};