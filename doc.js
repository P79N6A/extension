
// get all the href in the dom and return an Array
function links(doc){
    console.log('entre');
    var arr = [], l = doc.links,b = [].slice.call(doc.links);
   
    for(var i=0; i<l.length; i++) {
      arr.push(l[i].href);

    }
    return arr;
}

//call lincks and send the result to Main.js
chrome.runtime.sendMessage({
    action: "getSource",
    source: links(document)
});
