chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case 'open-confluence-marcuschiu-com':
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if (extractHostname(tabs[0].url) === 'confluence.marcuschiu.com') {
            window.close();
        } else {
            gotoTabOrOpenNewTab('confluence.marcuschiu.com');
        }
      });
      break;
  }
});

function gotoTabOrOpenNewTab(hostname) {
  getTabIdsAndHostnames(function (tabIds, hostnames) {
      var match_found = false;
      var tabId = -1;
      for (i = 0; i < hostnames.length; i++) {
          if (hostnames[i] === hostname) {
              match_found = true;
              tabId = tabIds[i];
              break;
          }
      }
      if (match_found) {
          chrome.tabs.update(tabId, { 'active': true }, (tab) => { });
      } else {
          window.open('http://' + hostname, '_blank');
      }
  });
}

function getTabIdsAndHostnames(_callback) {
  chrome.windows.getAll({populate:true}, function(windows) {
      var tabIds = [];
      var hostnames = [];
      windows.forEach(function(window) {
          window.tabs.forEach(function(tab) {
              tabIds.push(tab.id);
              hostnames.push(extractHostname(tab.url));
          });
      });
      _callback(tabIds, hostnames);
  });
}

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}