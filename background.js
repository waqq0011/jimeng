// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  // 下载图片菜单项
  chrome.contextMenus.create({
    id: "downloadNoWatermark",
    title: "下载无水印图片",
    contexts: ["image"],
    documentUrlPatterns: [
      "*://*.jianying.com/*",
      "*://*.capcut.com/*"
    ]
  });
  
  // 下载视频菜单项
  chrome.contextMenus.create({
    id: "downloadVideo",
    title: "下载无水印视频",
    contexts: ["video"],
    documentUrlPatterns: [
      "*://*.jianying.com/*",
      "*://*.capcut.com/*"
    ]
  });
  
  // 显示控制面板菜单项
  chrome.contextMenus.create({
    id: "showPanel",
    title: "显示无水印工具面板",
    contexts: ["page"],
    documentUrlPatterns: [
      "*://*.jianying.com/*",
      "*://*.capcut.com/*"
    ]
  });
  
  console.log('右键菜单创建完成');
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "downloadNoWatermark") {
    // 发送消息给content script处理下载图片
    chrome.tabs.sendMessage(tab.id, {
      action: "downloadNoWatermark",
      url: info.srcUrl
    });
  } else if (info.menuItemId === "downloadVideo") {
    // 发送消息给content script处理下载视频
    chrome.tabs.sendMessage(tab.id, {
      action: "downloadVideo",
      url: info.srcUrl
    });
  } else if (info.menuItemId === "showPanel") {
    // 显示控制面板
    chrome.tabs.sendMessage(tab.id, {
      action: "togglePanel"
    });
  }
});

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