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
* Manegement, use collapsile sets for each column
* YQL proxy, instead of PHP: http://ajaxian.com/archives/using-yql-as-a-proxy-for-cross-domain-ajax (use column id for callback function, to keep caching)