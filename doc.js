// Program that scans the entire site for hrefs and returns an array to main.js containing them

// Function that gets all the hrefs and returns an Array
function links(doc) {
    var arr = [],
        l = doc.links,
        b = [].slice.call(doc.links);

    for (var i = 0; i < l.length; i++) {
        arr.push(l[i].href);
    }
    return arr;
}

// Calls links and sends the result to Main.js
chrome.runtime.sendMessage({
    action: "getSource",
    source: links(document)
});
