chrome.runtime.onInstalled.addListener(function(details) {
    console.log("Installed successfully!")
});
var message = document.querySelector('#message');
// chrome.tabs.executeScript(null, {code:
//     "document.body.appendChild(document.createElement('script')).src = 'psl.js';"
// });
// chrome.tabs.executeScript(null,{
//   file: "psl.js"
// }, function() {
//   // If you try and inject into an extensions page or the webstore/NTP you'll get an error
//   if (chrome.runtime.lastError) {
//     message.innerText = 'There was an error loading the domain parser script : \n' + chrome.runtime.lastError.message;
//   }
// });
document.write('<script type="text/javascript" src="psl.js"></script>');

// Obtains the message from doc.js and invokes the method to change the icon and color of the extension
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      console.log(request.source)

      var gui = ui(safe(request.source))

      chrome.browserAction.setBadgeText({
        text: gui["text"],
        //tabId: tab.id
      })

      chrome.browserAction.setBadgeBackgroundColor({
        color: gui["color"],
        //tabId: tab.id
      })

    }
  });

 // Recieves an array with the links and determines if it is not safe.

  function safe(arr){
    console.log('start')
    var links = arr;
    console.log(links.length)
    console.log(document);
    
    for(var i=0; i<links.length; i++) {
        if(!check(links[i],i)){
            //console.log(links[i])
            return false;
        }
    }
    return true;
}

// function cleanDomain(url)
// {
//     var regex = /^[^.\n]+\.[a-z]{2,63}$/gim;
//     return regex.test(url);
// }

// Receives a link and looks for it in the js array returning true if it's there and false if it isn't
function check(url,i){
      link = new URL(url);
      console.log(link);
      var domain = link.hostname;
      console.log(domain);
    // tester = cleanDomain(url);
    // console.log(tester);
    
    checkedUrl = psl.parse(domain).domain;
    return window.top_sites.includes(checkedUrl);
}


function ui(safe){
  if (safe){
      return {text:"safe", color: "green"};
  }else {
      return {text:"risky", color: "red"};
  }
}

/*a Supposed to be listener, not running or working
chrome.tabs.onUpdated.addListener(function(id, info, tab){


  if (info.status !== "complete"){
    console.log('hello')
      return;
  }

  chrome.tabs.executeScript(null, {
    file: "doc.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });


  console.log('entered')
  var gui = ui(link(document))

  chrome.browserAction.setBadgeText({
    text: gui["text"],
    tabId: tab.id
  })

  chrome.browserAction.setBadgeBackgroundColor({
    color: gui["color"],
    tabId: tab.id
  })

});

*/

// Executes the script doc.js
function onWindowLoad() {

  chrome.tabs.executeScript(null, {
    file: "doc.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

// Calls the function onwindowLoad once the window is loaded
window.onload = onWindowLoad;
