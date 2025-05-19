// 轻量级无水印下载器 - 只在用户交互时激活
console.log('剪映无水印下载器已加载 - 轻量版');

// 面板状态：展开或最小化
let isPanelMinimized = false;

// 检查当前网站是否为豆包网站
function isDoubaoWebsite() {
  return window.location.hostname.includes('doubao.com');
}

// 在页面上创建一个浮动控制面板
function createControlPanel() {
  // 检查是否已经创建过
  if (document.querySelector('.watermark-free-panel')) {
    return getControlPanelElements();
  }
  
  // 创建面板
  const panel = document.createElement('div');
  panel.className = 'watermark-free-panel';
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 14px;
    transition: all 0.3s;
    opacity: 0.9;
    max-width: 300px;
  `;
  
  // 创建顶部操作栏
  const topBar = document.createElement('div');
  topBar.className = 'watermark-free-topbar';
  topBar.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `;
  
  // 添加标题
  const title = document.createElement('div');
  title.textContent = '剪映无水印下载器';
  title.style.cssText = `
    font-weight: bold;
    color: #333;
    flex-grow: 1;
    text-align: center;
  `;
  topBar.appendChild(title);
  
  // 添加最小化按钮
  const minimizeBtn = document.createElement('div');
  minimizeBtn.textContent = '—';
  minimizeBtn.className = 'watermark-free-minimize-btn';
  minimizeBtn.style.cssText = `
    cursor: pointer;
    font-size: 14px;
    margin-right: 8px;
    color: #999;
    padding: 0 5px;
  `;
  minimizeBtn.addEventListener('click', function(event) {
    console.log('最小化按钮临时事件触发');
    handleMinimizeClick(event);
  });
  topBar.appendChild(minimizeBtn);
  
  // 添加关闭按钮
  const closeBtn = document.createElement('div');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    cursor: pointer;
    font-size: 16px;
    color: #999;
  `;
  closeBtn.addEventListener('click', function(event) {
    console.log('关闭按钮被点击');
    event.preventDefault();
    event.stopPropagation();
    document.body.removeChild(panel);
  });
  topBar.appendChild(closeBtn);
  
  panel.appendChild(topBar);
  
  // 创建内容区域 (会在最小化时隐藏)
  const contentArea = document.createElement('div');
  contentArea.className = 'watermark-free-content';
  contentArea.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
  
  // 添加说明
  const description = document.createElement('div');
  description.textContent = '请选择你想要保存的图片或视频，然后点击下方按钮';
  description.style.cssText = `
    font-size: 12px;
    color: #666;
  `;
  contentArea.appendChild(description);
  
  // 创建状态显示
  const status = document.createElement('div');
  status.className = 'watermark-free-status';
  status.textContent = '等待选择媒体...';
  status.style.cssText = `
    font-size: 12px;
    color: #1890ff;
    text-align: center;
  `;
  contentArea.appendChild(status);
  
  // 创建操作按钮
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 5px;
  `;
  
  // 下载按钮
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'watermark-free-download-btn';
  downloadBtn.textContent = '下载';
  downloadBtn.style.cssText = `
    padding: 8px;
    background-color: #52c41a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    flex: 1;
  `;
  downloadBtn.disabled = true;
  downloadBtn.addEventListener('click', () => downloadSelectedMedia());
  buttonContainer.appendChild(downloadBtn);
  
  // 复制按钮
  const copyBtn = document.createElement('button');
  copyBtn.className = 'watermark-free-copy-btn';
  copyBtn.textContent = '复制';
  copyBtn.style.cssText = `
    padding: 8px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    flex: 1;
  `;
  copyBtn.disabled = true;
  copyBtn.addEventListener('click', () => copySelectedMedia());
  buttonContainer.appendChild(copyBtn);
  
  contentArea.appendChild(buttonContainer);
  panel.appendChild(contentArea);
  
  // 添加图标元素（最小化时显示）
  const iconElement = document.createElement('div');
  iconElement.className = 'watermark-free-icon';
  iconElement.style.cssText = `
    width: 40px;
    height: 40px;
    background-color: transparent;
    border-radius: 50%;
    display: none;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    z-index: 10001;
    background-image: url('${chrome.runtime.getURL('icons/icon48.png')}');
    background-size: cover;
    background-position: center;
  `;
  
  // 为图标添加一层透明遮罩，用于捕获点击事件
  const iconOverlay = document.createElement('div');
  iconOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10002;
  `;
  
  iconElement.appendChild(iconOverlay);
  
  // 添加点击事件到覆盖层
  iconOverlay.addEventListener('click', function(event) {
    console.log('图标覆盖层被点击');
    handleIconClick(event);
  }, true);
  
  // 也给图标元素本身添加点击事件作为备份
  iconElement.addEventListener('click', function(event) {
    console.log('图标元素被点击');
    handleIconClick(event);
  }, true);
  
  panel.appendChild(iconElement);
  
  // 添加到页面
  document.body.appendChild(panel);
  
  console.log('面板创建成功');
  
  return {
    panel,
    status,
    downloadBtn,
    copyBtn,
    iconElement,
    contentArea,
    topBar
  };
}

// 获取控制面板元素
function getControlPanelElements() {
  const panel = document.querySelector('.watermark-free-panel');
  if (!panel) return null;
  
  return {
    panel,
    status: document.querySelector('.watermark-free-status'),
    downloadBtn: document.querySelector('.watermark-free-download-btn'),
    copyBtn: document.querySelector('.watermark-free-copy-btn'),
    contentArea: document.querySelector('.watermark-free-content'),
    iconElement: document.querySelector('.watermark-free-icon')
  };
}

// 切换面板大小（最小化/展开）
function togglePanelSize() {
  try {
    console.log('执行切换面板大小函数');
    
    // 查找所有必要的元素
    const panel = document.querySelector('.watermark-free-panel');
    const content = document.querySelector('.watermark-free-content');
    const icon = document.querySelector('.watermark-free-icon');
    const topBar = document.querySelector('.watermark-free-topbar');
    
    // 检查元素是否存在
    if (!panel) {
      console.error('找不到面板元素');
      return;
    }
    
    if (!content) {
      console.error('找不到内容区域元素');
      return;
    }
    
    if (!icon) {
      console.error('找不到图标元素');
      return;
    }
    
    // 切换状态
    isPanelMinimized = !isPanelMinimized;
    console.log('面板状态切换为:', isPanelMinimized ? '最小化' : '展开');
    
    if (isPanelMinimized) {
      // === 最小化面板 ===
      console.log('正在最小化面板...');
      
      // 1. 隐藏内容区域
      content.style.display = 'none';
      
      // 2. 显示图标
      icon.style.display = 'flex';
      
      // 3. 重设面板样式
      panel.style.width = '40px';
      panel.style.height = '40px';
      panel.style.padding = '0';
      panel.style.borderRadius = '50%';
      panel.style.backgroundColor = 'transparent';
      panel.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      
      // 4. 隐藏顶部栏
      if (topBar) {
        topBar.style.display = 'none';
      }
      
      // 5. 防止内容溢出
      panel.style.overflow = 'hidden';
      
      console.log('面板已成功最小化');
    } else {
      // === 展开面板 ===
      console.log('正在展开面板...');
      
      // 1. 恢复面板样式
      panel.style.width = 'auto';
      panel.style.height = 'auto';
      panel.style.maxWidth = '300px';
      panel.style.padding = '10px';
      panel.style.borderRadius = '6px';
      panel.style.backgroundColor = 'white';
      panel.style.overflow = 'visible';
      
      // 2. 显示顶部栏
      if (topBar) {
        topBar.style.display = 'flex';
      }
      
      // 3. 显示内容区域
      content.style.display = 'flex';
      
      // 4. 隐藏图标
      icon.style.display = 'none';
      
      console.log('面板已成功展开');
    }
  } catch (error) {
    console.error('切换面板大小时发生错误:', error);
  }
}

// 当前选中的媒体
let selectedImage = null;
let selectedVideo = null;

// 处理图片点击事件
function handleImageClick(event) {
  // 如果点击的是图片
  if (event.target.tagName === 'IMG') {
    // 检查是否点击的是插件自己的图标，如果是则忽略
    if (event.target.closest('.watermark-free-icon') || 
        event.target.src.includes('chrome-extension://') ||
        event.target.parentNode.classList.contains('watermark-free-icon')) {
      console.log('忽略插件自身图标的点击');
      return;
    }
    
    // 获取控制面板
    const controls = getOrCreateControlPanel();
    
    // 更新选中的媒体
    selectedImage = event.target;
    selectedVideo = null;
    
    // 恢复面板显示（如果已最小化）
    if (isPanelMinimized) {
      togglePanelSize();
    }
    
    // 更新状态
    controls.status.textContent = '已选择图片，可以下载或复制';
    controls.status.style.color = '#52c41a';
    
    // 更新按钮文本
    controls.downloadBtn.textContent = '下载图片';
    controls.copyBtn.textContent = '复制图片';
    
    // 启用按钮
    controls.downloadBtn.disabled = false;
    controls.copyBtn.disabled = false;
    
    // 在控制台显示图片URL（调试用）
    console.log('选中图片URL:', selectedImage.src);
  }
  // 如果点击的是视频
  else if (event.target.tagName === 'VIDEO') {
    // 获取控制面板
    const controls = getOrCreateControlPanel();
    
    // 更新选中的媒体
    selectedVideo = event.target;
    selectedImage = null;
    
    // 恢复面板显示（如果已最小化）
    if (isPanelMinimized) {
      togglePanelSize();
    }
    
    // 更新状态
    controls.status.textContent = '已选择视频，可以下载或复制链接';
    controls.status.style.color = '#1890ff';
    
    // 更新按钮文本
    controls.downloadBtn.textContent = '下载视频';
    controls.copyBtn.textContent = '复制视频地址';
    
    // 启用按钮
    controls.downloadBtn.disabled = false;
    controls.copyBtn.disabled = false;
    
    // 在控制台显示视频URL（调试用）
    console.log('选中视频URL:', selectedVideo.src);
  }
}

// 获取或创建控制面板
function getOrCreateControlPanel() {
  const controls = getControlPanelElements();
  if (controls) return controls;
  return createControlPanel();
}

// 下载选中的媒体
function downloadSelectedMedia() {
  if (selectedImage) {
    downloadSelectedImage();
  } else if (selectedVideo) {
    downloadSelectedVideo();
  } else {
    showNotification('请先选择媒体', true);
  }
}

// 下载选中的图片
function downloadSelectedImage() {
  if (!selectedImage) {
    showNotification('请先选择一张图片', true);
    return;
  }
  
  const imageUrl = selectedImage.src;
  console.log('开始下载图片:', imageUrl);
  
  // 使用a标签下载
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `剪映AI图片_${new Date().getTime()}.webp`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('图片下载已开始！');
}

// 下载选中的视频
function downloadSelectedVideo() {
  if (!selectedVideo) {
    showNotification('请先选择一个视频', true);
    return;
  }
  
  const videoUrl = selectedVideo.src;
  console.log('开始下载视频:', videoUrl);
  
  // 使用a标签下载
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = `剪映视频_${new Date().getTime()}.mp4`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('视频下载已开始！');
}

// 复制选中的媒体到剪贴板
async function copySelectedMedia() {
  if (selectedImage) {
    await copySelectedImage();
  } else if (selectedVideo) {
    await copySelectedVideo();
  } else {
    showNotification('请先选择媒体', true);
  }
}

// 复制选中的图片到剪贴板
async function copySelectedImage() {
  if (!selectedImage) {
    showNotification('请先选择一张图片', true);
    return;
  }
  
  try {
    const imageUrl = selectedImage.src;
    console.log('开始复制图片:', imageUrl);
    
    // 1. 创建临时 canvas 绘制图片
    const img = new Image();
    
    // 添加crossOrigin属性以解决跨域问题
    img.crossOrigin = 'anonymous';
    
    // 处理加载事件
    img.onload = async function() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // 将 canvas 转为 blob
        canvas.toBlob(async (blob) => {
          try {
            if (!blob) {
              throw new Error('无法创建图片数据');
            }
            
            // 复制到剪贴板
            await navigator.clipboard.write([
              new ClipboardItem({ [blob.type]: blob })
            ]);
            
            showNotification('图片已复制到剪贴板！');
          } catch (err) {
            console.error('剪贴板操作失败:', err);
            showNotification('复制图片失败: ' + err.message, true);
          }
        }, 'image/png');
      } catch (err) {
        console.error('Canvas操作失败:', err);
        showNotification('复制图片失败: ' + err.message, true);
      }
    };
    
    // 处理错误事件
    img.onerror = function(err) {
      console.error('图片加载失败:', err);
      showNotification('图片加载失败，无法复制', true);
    };
    
    // 设置图片源
    img.src = imageUrl;
    
    // 如果图片已经缓存，onload可能不会触发
    if (img.complete) {
      img.onload();
    }
  } catch (error) {
    console.error('复制图片失败:', error);
    showNotification('复制图片失败: ' + error.message, true);
  }
}

// 复制选中的视频到剪贴板
async function copySelectedVideo() {
  if (!selectedVideo) {
    showNotification('请先选择一个视频', true);
    return;
  }
  
  try {
    const videoUrl = selectedVideo.src;
    console.log('开始复制视频地址:', videoUrl);
    
    // 尝试将视频链接复制到剪贴板
    try {
      await navigator.clipboard.writeText(videoUrl);
      showNotification('视频地址已复制到剪贴板！');
      
      // 发送消息通知后台
      chrome.runtime.sendMessage({
        action: "copyVideoNoWatermark"
      });
    } catch (err) {
      console.error('剪贴板操作失败:', err);
      showNotification('复制视频地址失败: ' + err.message, true);
    }
  } catch (error) {
    console.error('复制视频地址失败:', error);
    showNotification('复制视频地址失败: ' + error.message, true);
  }
}

// 显示通知
function showNotification(message, isError = false) {
  // 检查是否已有通知
  let notification = document.querySelector('.watermark-free-notification');
  
  if (notification) {
    // 清除现有的超时
    clearTimeout(notification.timeout);
    document.body.removeChild(notification);
  }
  
  // 创建新通知
  notification = document.createElement('div');
  notification.className = 'watermark-free-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 4px;
    background-color: ${isError ? '#ff4d4f' : '#52c41a'};
    color: white;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  `;
  
  document.body.appendChild(notification);
  
  // 设置自动消失
  notification.timeout = setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 初始化图标的点击事件
function setupIconClickHandlers() {
  console.log('设置图标点击处理...');
  
  // 设置最小化状态下的图标点击事件
  const icon = document.querySelector('.watermark-free-icon');
  if (icon) {
    // 移除旧的事件监听器（如果有）
    icon.replaceWith(icon.cloneNode(true));
    
    // 重新获取元素并添加新的事件监听器
    const newIcon = document.querySelector('.watermark-free-icon');
    if (newIcon) {
      console.log('为图标添加点击事件');
      newIcon.addEventListener('click', handleIconClick, true);
    }
  } else {
    console.warn('找不到图标元素，无法设置点击事件');
  }
  
  // 设置最小化按钮点击事件
  const minimizeBtn = document.querySelector('.watermark-free-minimize-btn');
  if (minimizeBtn) {
    // 移除旧的事件监听器（如果有）
    minimizeBtn.replaceWith(minimizeBtn.cloneNode(true));
    
    // 重新获取元素并添加新的事件监听器
    const newMinimizeBtn = document.querySelector('.watermark-free-minimize-btn');
    if (newMinimizeBtn) {
      console.log('为最小化按钮添加点击事件');
      newMinimizeBtn.addEventListener('click', handleMinimizeClick, true);
    }
  }
}

// 处理图标点击事件（最小化状态下）
function handleIconClick(event) {
  console.log('图标被点击');
  
  // 阻止事件继续传播和默认行为
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  // 防止被识别为图片选择
  selectedImage = null;
  selectedVideo = null;
  
  // 直接从最小化状态恢复面板
  isPanelMinimized = true; // 确保切换函数能正确工作
  togglePanelSize();
  
  // 设置一个定时器以确保状态正确更新
  setTimeout(() => {
    const content = document.querySelector('.watermark-free-content');
    const icon = document.querySelector('.watermark-free-icon');
    const panel = document.querySelector('.watermark-free-panel');
    
    if (content) content.style.display = 'flex';
    if (icon) icon.style.display = 'none';
    if (panel) {
      panel.style.width = 'auto';
      panel.style.height = 'auto';
      panel.style.maxWidth = '300px';
      panel.style.borderRadius = '6px';
    }
    
    console.log('面板已强制恢复到展开状态');
  }, 50);
  
  return false;
}

// 处理最小化按钮点击事件
function handleMinimizeClick(event) {
  console.log('最小化按钮被点击');
  event.preventDefault();
  event.stopPropagation();
  
  // 从展开状态最小化面板
  isPanelMinimized = false; // 确保切换函数能正确工作
  togglePanelSize();
}

// 每次创建面板后设置事件处理程序
function afterPanelCreated() {
  console.log('面板创建完成，设置事件处理');
  setupIconClickHandlers();
}

// 更新初始化函数
function initialize() {
  console.log('轻量版无水印下载器初始化中...');
  
  // 添加媒体点击事件监听
  document.addEventListener('click', handleImageClick, true);
  
  // 添加键盘快捷键 (Alt+W)
  document.addEventListener('keydown', (event) => {
    if (event.altKey && event.key === 'w') {
      const controls = getOrCreateControlPanel();
      if (isPanelMinimized) {
        togglePanelSize();
      }
      setupIconClickHandlers();
    }
  });

  // 特殊处理豆包网站的图片
  if (isDoubaoWebsite()) {
    console.log('检测到豆包网站，启用特殊处理...');
    // 使用MutationObserver监听DOM变化，以便在图片加载后捕获它们
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // 检查添加的节点是否包含我们感兴趣的图片
          setTimeout(() => {
            const doubaoImages = document.querySelectorAll('[data-testid="in_painting_picture"]');
            if (doubaoImages.length > 0) {
              console.log('找到豆包图片元素:', doubaoImages.length);
              // 如果找到了图片，可以选择第一个并显示面板
              const controls = getOrCreateControlPanel();
              
              // 添加点击事件处理程序
              doubaoImages.forEach(img => {
                // 防止重复添加事件处理程序
                img.removeEventListener('click', handleDoubaoPictureClick);
                img.addEventListener('click', handleDoubaoPictureClick);
              });
            }
          }, 500); // 稍微延迟，确保图片已完全加载
        }
      });
    });

    // 配置观察器
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 也处理已经在页面上的图片
    setTimeout(() => {
      const doubaoImages = document.querySelectorAll('[data-testid="in_painting_picture"]');
      if (doubaoImages.length > 0) {
        console.log('页面中已有豆包图片元素:', doubaoImages.length);
        doubaoImages.forEach(img => {
          img.removeEventListener('click', handleDoubaoPictureClick);
          img.addEventListener('click', handleDoubaoPictureClick);
        });
      }
    }, 1000);
  }
  
  // 创建控制面板
  setTimeout(() => {
    getOrCreateControlPanel();
    afterPanelCreated();
  }, 1000);
  
  console.log('轻量版无水印下载器初始化完成');
}

// 在适当的时机初始化插件
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// 接收来自background.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "togglePanel") {
    const controls = getOrCreateControlPanel();
    if (isPanelMinimized) {
      togglePanelSize();
    }
    sendResponse({success: true});
  }
});

// 处理豆包图片点击事件的特殊函数
function handleDoubaoPictureClick(event) {
  console.log('豆包图片被点击');
  const img = event.currentTarget;
  
  // 获取控制面板
  const controls = getOrCreateControlPanel();
  
  // 更新选中的媒体
  selectedImage = img;
  selectedVideo = null;
  
  // 恢复面板显示（如果已最小化）
  if (isPanelMinimized) {
    togglePanelSize();
  }
  
  // 更新状态
  controls.status.textContent = '已选择豆包图片，可以下载或复制';
  controls.status.style.color = '#52c41a';
  
  // 更新按钮文本
  controls.downloadBtn.textContent = '下载图片';
  controls.copyBtn.textContent = '复制图片';
  
  // 启用按钮
  controls.downloadBtn.disabled = false;
  controls.copyBtn.disabled = false;
  
  // 在控制台显示图片URL（调试用）
  console.log('选中豆包图片URL:', selectedImage.src);
} 