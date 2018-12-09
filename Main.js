/* Where most of the program's functions are: comparing urls to safe list, highlighting unsafe links, creating percentage of safe links, updating the ui */

// Indicates successful install
chrome.runtime.onInstalled.addListener(function(details) {
    console.log("Installed successfully!")
});
// Inserts the link parser
document.write('<script type="text/javascript" src="psl.js"></script>');
// Counter for the number of safe and dangerous links
var safeLinks = 0;
var badLinks = 0;
// Keeps an array of the suspicious links on a page
var badLinkList = [];
// Obtains the message from doc.js and invokes the method to change the icon and color of the extension
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        // Sorts through the list of links, classifies them, and returns the color and text the extension badge should be
        var gui = ui(safe(request.source))

        //Sets the text of the badge
        chrome.browserAction.setBadgeText({
            text: gui["text"],
        })

        //  Sets the background color
        chrome.browserAction.setBadgeBackgroundColor({
            color: gui["color"],
        })

    }
});

// Recieves an array with the links and determines if it is not safe.
function safe(links) {
    console.log('start')
    console.log(links.length)
    // Loops through the links
    for (var i = links.length - 1; i >= 0; i--) {
        if (!check(links[i], i)) {
            badLinks++;
        } else {
            // removes good link from array and reindexes
            links.splice(i, 1);
            safeLinks++;
        }
    }
    // Creates a badLinkList out of the modified links list (with good links removed)
    badLinkList = links;
    console.log("Array of suspicious links:")
    console.log(badLinkList);
    // Calculates the percentage of links on the site that are safe
    percentSafe = Math.round((safeLinks / (safeLinks + badLinks)) * 100);
    return percentSafe;
}

// Runs when the highlight bad links button is pressed
chrome.runtime.onMessage.addListener(function(message) {
    // Calls the highlight function
    if (message.action == "highlight") {
        highlight(badLinkList);
    }

});
// Receives a link and looks for it in the js array returning true if it's there and false if it isn't
function check(url, i) {
    link = new URL(url);
    var domain = link.hostname;
    // Uses the parser to organize the link into its base domain (ex. from https://mail.yahoo.com/d/folders/1 to yahoo.com)
    checkedUrl = psl.parse(domain).domain;
    return window.top_sites.includes(checkedUrl);
}

// Highlights the suspicious links
function highlight(linkArray) {
    console.log(linkArray);

    // Acquired from https://goo.gl/AspgD8
    // Runs through all the <a> elements on a site and compares them with the suspicious link list, highlighting any that match
    var code =
        `
        document.querySelectorAll(
        '${linkArray.map(l => `a[href^="${l}"]`).join(',')}'
        ).forEach(a => a.style.border = 'solid 2px red')
    `;

    // Executes the code
    chrome.tabs.executeScript(null, { code: code });
}

// Returns the color and text the badge should be based on its safety percentage
function ui(safe) {
    // Resets the counter variables so they can be used in a new page
    safeLinks = 0;
    badLinks = 0;
    if (safe >= 70) {
        return { text: `${safe}%`, color: "green" };
    } else if (safe >= 40 && safe < 70) {
        return { text: `${safe}%`, color: "orange" };
    } else if (safe <= 40) {
        return { text: `${safe}%`, color: "red" };
    }
}

// Executes the js file that finds all the <a> element links on the site
function onWindowLoad() {
    chrome.tabs.executeScript(null, {
        file: "doc.js"
    }, function() {
        var message = document.querySelector('#message');
        // Error checking in case injection fails
        if (chrome.runtime.lastError) {
            console.log('There was an error injecting script : \n' + chrome.runtime.lastError.message);
        }
    });

}

// Calls the function onwindowLoad once the window is loaded
window.onload = onWindowLoad;
