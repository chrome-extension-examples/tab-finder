window.onload = function() {
    var input = document.getElementById("input");
    input.focus();
    input.addEventListener("keypress", function() {
        if(event.key === 'Enter') {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                if (extractHostname(tabs[0].url) === input.value) {
                    // do nothing
                    window.close();
                } else {
                    gotoTabOrOpenNewTab(input.value);
                }
            });
        }
    });
};

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

// chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html#ttl=Tutorials%20on%20Advanced%20Stats%20and%20Machine%20Learning%20With%20R&pos=0&uri=http://r-statistics.co/
// http://r-statistics.co/
// chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html#ttl=18.%20Properties%20of%20Determinants%20-%20YouTube&pos=0&uri=https://www.youtube.com/watch?v=srxexLishgY&list=PLE7DDD91010BC51F8&index=19&t=1651s
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