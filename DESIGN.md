The following is an underneath-the-hood tour of SmellsPhishy:

Let's start first by discussing the programming languages used. SmellsPhishy is programmed in JavaScript (JS) and uses HTML and CSS. The hardest decision we had to make was whether or not to use Python and have a separate server to analyze the links. After much deliberation,
we decided to avoid using python for three main reasons. The first is speed. Using python meant that requests had to be sent back and forth to a server, which would take more time than just having everything local on the browser. The second reason is scalability. Having our own server meant that if many people
where using our extension concurrently, they could potentially crash the server as it could not handle all the requests. The third reason we decided to avoid python was for privacy reasons. Because we are dealing with something as sensitive as browsing and history, we wanted to avoid sending information to a remote server and instead keep it local, safe, and private.

After we decided on just using JS, we had the challenge of implementing complex functionalities with a programming language we didn't know well. Our first task was to create a function that would scan a site for hrefs, which was eventually integrated and became function links(doc) found in doc.js.
Then, we had to make a function that cut down the url into just the domain that way it could be checked easier against a database. For example, we needed to cut google.com/maps or https://www.harvard.edu/about-harvard/harvard-glance to google.com and harvard.edu respectively. We did this by using psl.js, a parser, and integrated this into the check function. 

Then, we needed to check these links against a JS array, top-sites.js, so we created the function check found in main.js. This function obtains the domain, parses it, and then compares it to top-sites and returns a value. After check, we implemented highlight, which places a red border around the links that were returned as unsafe links. We also made the function ui(safe) which divides the number 
of safe links by the total number of links and then multiplies the number by 100 to give a percentage to the user for gauging how safe the urls on the site he or she is visiting are. Lastly, we embedded a Google form iframe in the popup.html in order for users to report bugs, unsafe links that are marked as safe, or safe links that they would like added to our database. This connects automatically with our emails so we can evaluate the responses and determine whether or not a link is safe before we actually add it, because some users may try and report malicious urls as safe. 

Below is just a quick explanation of what each file does.

Main.js - Where most of the program's functions are, comparing urls to safe list, highlighting unsafe links, creating percentage etc.

Doc.js - File contains program that scans site for hrefs

manifest.json - File contains manifest for Chrome extension, includes necessary permissions, icon, etc

popup.html - Chrome extension popup that appears when you click on the icon, contains the buttons for highlighting unsafe links as well as button for reporting to developers,

popup.js - Script for popup

-- Since good security practices in Chrome extension development discourages the use of inline Javascript and events like onClick() in popup.html, we seperated it into its own
file and used listeners in here that would detect a click on the button in popup.html. When a button is click, a function is called to complete the desired action. In the case of highlightFunction(), it
passes a message to Main.js, ordering it to execute the highlight() function. Defining the highlight function in Main.js and only indirectly calling it from popup.js is a faster and more
straightforward design than defining highlight() in popup.js since all files in chrome are isolated from each other and the highlight() function only deals with data in Main.js.

popup.css - Contains CSS and design for popup.html

-- This was separated from popup.html for ease of organization and neatness of code

psl.js - Parser for urls, removes unnecessary text from urls (gives us the functions and references to turn something like www.mail.google.com/mail/u/0/#inbox into google.com)

-- Since this file is something that will most likely never need to be changed, it has been minimized in order to reduce the space it takes up and make it faster to load.

top-sites.js - JS array containing over 15,000 of the most visited sites on the web deemed to be safe


All in all, this was a brief under-the-hood look at our project, SmellsPhishy. Thank you for reading!