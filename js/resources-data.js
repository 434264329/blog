// 资源数据
const resourcesData = {
  "resources": [
    {
      "id": 1,
      "title": "GitHub主页",
      "name": "进入网站",
      "description": "这是我的GitHub主页",
      "url": "https://github.com/434264329",
      "icon": "github"
    },
    {
      "id": 2,
      "title": "系统镜像",
      "name": "进入网站",
      "description": "提取码isof",
      "url": "https://www.123865.com/s/4vGjVv-QCrTd?",
      "icon": "picture/iso.webp"
    }
  ]
};

// 确保数据在全局作用域中可用
window.resourcesData = resourcesData;

console.log('资源数据已加载:', resourcesData);