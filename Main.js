chrome.runtime.onInstalled.addListener(function(details) {
    console.log("Installed successfully!")
});

document.write('<script type="text/javascript" src="psl.js"></script>');

var safeLinks = 0;
var badLinks = 0;

// Obtains the message from doc.js and invokes the method to change the icon and color of the extension
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      // console.log(request.source)

      var gui = ui(safe(request.source))

      chrome.browserAction.setBadgeText({
        text: gui["text"],
      })

      chrome.browserAction.setBadgeBackgroundColor({
        color: gui["color"],
      })

    }
  });

 // Recieves an array with the links and determines if it is not safe.

  function safe(arr)
  {
    console.log('start')
    var links = arr;
    console.log(links.length)

    for(var i=0; i<links.length; i++)
    {
        if(!check(links[i],i))
        {
            badLinks++;
            console.log(links[i])
        }
        else
        {
          safeLinks++;

        }
    }
    percentSafe = Math.round((safeLinks/(safeLinks + badLinks))*100);
    return percentSafe;
  }

// Receives a link and looks for it in the js array returning true if it's there and false if it isn't

function check(url,i)
{
  link = new URL(url);
  console.log(link);
  var domain = link.hostname;
  console.log(domain);
  checkedUrl = psl.parse(domain).domain;
  console.log(i)
  return window.top_sites.includes(checkedUrl);
}


function ui(safe){
  safeLinks = 0;
  badLinks = 0;
  if (safe >= 70)
  {
    return {text:`${safe}%`, color: "green"};
  }
  else if (safe >= 40 && safe < 70)
  {
    return {text:`${safe}%`, color: "orange"};
  }
  else if (safe <= 40)
  {
    return {text:`${safe}%`, color: "red"};
  }
}

function onWindowLoad() {

  chrome.tabs.executeScript(null, {
    file: "doc.js"
  }, function() {
    var message = document.querySelector('#message');
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

// Calls the function onwindowLoad once the window is loaded
window.onload = onWindowLoad;
