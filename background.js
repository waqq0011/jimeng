// 简化版background.js - 移除右键菜单功能

// 点击扩展图标时显示控制面板
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {
    action: "togglePanel"
  });
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyImageNoWatermark" || request.action === "copyVideoNoWatermark") {
    sendResponse({success: true});
  }
}); 