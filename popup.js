// Script for popup that runs the functions for each button

// Listens for any button clicks and runs their respective function
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contactShower').addEventListener('click', showContact);
    document.getElementById('highlightButton').addEventListener('click', highlightFunction);
});

// Contact developer button displays the feedback form and hides the button
function showContact() {
    document.getElementById("iframeLoad").innerHTML =
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc-4R3FBDGSpL9Sz0Z_1Q4LBaS8xFlmIe-7cLSC6ZHagaUKcw/viewform?embedded=true" width="500" height="815" frameborder="0" marginheight="0" marginwidth="0">Cargando...</iframe>';
    document.getElementById('iframeLoad').style.display = 'block';
    this.style.display = 'none'
}

// Highlight bad link button sends a message to Main.js to run the highlight() function
function highlightFunction() {
    chrome.runtime.sendMessage({
        action: "highlight",
    });
}
