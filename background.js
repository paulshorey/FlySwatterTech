chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
  chrome.tabs.executeScript({
    file: './src/lib/jquery-3.5.1.min.js'
  }, function () {
    // Guaranteed to execute only after the previous script returns
    chrome.tabs.executeScript(tabId, {
      file: './src/inject.js'
    })
  })
  }
})