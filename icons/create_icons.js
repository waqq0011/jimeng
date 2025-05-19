const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建图标的尺寸
const sizes = [16, 48, 128];

// 为每个尺寸创建图标
sizes.forEach(size => {
  // 创建一个Canvas实例
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 绘制图标背景
  ctx.fillStyle = '#1890ff';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // 绘制"无"字
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('无', size / 2, size / 2);

  // 将Canvas内容转换为Buffer
  const buffer = canvas.toBuffer('image/png');

  // 将Buffer写入文件
  fs.writeFileSync(`icon${size}.png`, buffer);
  
  console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!'); 