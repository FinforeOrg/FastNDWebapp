# FastND Web App

Built with:

* JavascriptMVC
* jQuery Mobile


Dependencies:

* jQuery UI Sortable - Sorting the columns on the desktop UI
* mediaelement.js
* iScroll4
* jquery.impromptu
* jquery.toastmessage

## Dependencies for building

* Install Ruby (includes Rake)
* Install Ruby DevKit (http://rubyinstaller.org/downloads/ - https://github.com/oneclick/rubyinstaller/wiki/development-kit)
* Install net-sftp gem (install with `gem install net-sftp`)


## Running the app

You'll need a web server to be able to run FastND, because of PHP dependencies, and dynamic loading of components.

You can run the development version, by pointing your web server to the /dev folder.
The production version of the app is located in /build.

## Build Tools

The production version of the app serves contains the minified and concatenated js and css files. To be able to build the app, you'll need to have ruby and rake installed.

Build (in /dev/):
`rake build`

To deply to live-test.finfore.net:
`rake deploy`

### Deploy checklist

1. Rename title


## CSS
base.css - Desktop + Tablet
small-screen.css - Mobile
shared.css - Shared accross interfaces

## Templates
Temaplates use jQuery.tmpl, have the .tmpl extension and are parsed by JavascriptMVC using $.View.

## FastND Web Service API


## 3rd Party APIs

### Bing API
http://www.bing.com/developers/s/APIBasics.html


# TODO

* Convert tmpl template to ej, better performance
* Better, native, notifications https://github.com/kbjr/Notifications
* Manegement, use collapsile sets for each colums
* Implement new, canvas-based marquee, for much better performance.
<span id="sp_marqueeCanvas"> <!--this should always be the same as the "name" setting below, but with "sp_" at the start-->
<script>
//Settings you can change
var text = "I love my <canvas>"; //The text to scroll
var link = "test"; //an optional hyperlink - if it's empty the link will be inactive.

var name = "marqueeCanvas"; //Name of the canvas, needs to be unique for each canvas on a single page.
var width = 500; //width of the canvas
var height = 50; //height of the canvas
var dir = 1; //1 is left, -1 is right :)
var speed = 10; //higher is faster

var fontsize = "18pt"; //font size as per CSS rules
var fontfamily = "Comic Sans MS, serif"; //font family as per CSS rules
var fontweight = "bold"; //font weight as per CSS rules
var fontcolor = "#F00F00"; //Font colour as per CSS rules
var style = ""; /*optional - inline CSS for any further styles to apply to the canvas.
* For example: most useful for setting a border or background colour, as both are transparent by default:
* var style = "border: solid thick #000; background: #009";
*/

var nocanvas = "Uh oh, this browser doesn't support &lt;canvas&gt;"; /*HTML for when canvas isn't supported.
*You should provide an alternative here for people that can't see the canvas version, such as:
*a static image
*an animated GIF
*an alternative animation (using Flash, Java or some other plug-in reliant technology)
*the <marquee> tag, even? (please don't do this one)
*/
 
//End of settings


//Marquee code, don't edit if you don't know what you're doing
//First create the canvas and apply its settings as above
var spanvas = document.getElementById('sp_'+name);
var canvasparent;

if (link != "") //there's a hyperlink set - we need an anchor tag on the canvas
    {
        var newanchor = document.createElement('a');
        newanchor.setAttribute('href',link);
        canvasparent = newanchor; //the canvas needs to be added to the anchor tag
        spanvas.appendChild(newanchor);
    }
else //no hyperlink - the canvas needs adding to the span element
    {
        canvasparent = spanvas;
    }

var newcanvas = document.createElement('canvas');
newcanvas.setAttribute('id',name);
newcanvas.setAttribute('width',width);
newcanvas.setAttribute('height',height);
newcanvas.setAttribute('style',style);
newcanvas.innerHTML = nocanvas;
canvasparent.appendChild(newcanvas);

//Now get ready to draw text
var font = fontweight+" "+fontsize+" "+fontfamily; //font style as per CSS rules
var marquee = document.getElementById(name)
var context = marquee.getContext("2d");
var x = width;
var textlength;

//Now draw and animate the text
setInterval(draw, 1000 / (speed * 10)); //repeatedly calls the draw function, below:

function draw()
    {
        marquee.width = marquee.width; //simplest way to clear a canvas frame
        context.fillStyle = fontcolor;
        context.font = font;
        context.textBaseline = "middle";
        context.fillText(text, x, height / 2); //draw the text in the specified style
        
        x -= dir; //move in the specified direction by 1.
        
        textlength = context.measureText(text); //this gives a pixel length of the text string
        
        if (x < 0 - textlength.width) //Text has scrolled off the left hand side; restart it.
        {
            x = width;
        }
        
        else if (x > width) //Text has scrolled off the right hand side; restart it.
        {
            x = 0 - textlength.width;
        }
    }
</script>
</span>​