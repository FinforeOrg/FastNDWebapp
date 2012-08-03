# FastND Web App

Built with:

* JavascriptMVC
* jQuery Mobile


## Build Dependencies

* Ruby (includes Rake)
* Ruby DevKit (http://rubyinstaller.org/downloads/ - https://github.com/oneclick/rubyinstaller/wiki/development-kit)
* net-sftp gem (install with `gem install net-sftp`)
* Java JRE (http://www.oracle.com/technetwork/java/javase/downloads/index.html)


## Running the app

You'll need a web server to be able to run FastND, because of the dynamic loading of components.

You can run the development version, by pointing your web server to the /dev folder.
The production version of the app is located in /build.

## Build Tools

The production version of the app serves contains the minified and concatenated `js` and `css` files. To be able to build the app, you'll need to meet the requirments in the *Build Dependencies* section above.

Build (in /dev/):
`rake build`

To deply to stage.fastnd.com:
`rake deploy`

## Versions (stage, inter and production)

Each of these versions represents a level of stability, and are located in separate repositories in GitHub, and in separate locations on the test and production servers.

### Stage

*Stage* is the development version of FastND. This version contains the latest, unstable, source code.

`rake deploy` with automaticly deploy the latest `/build` version to http://stage.fastnd.com.

Repository: https://github.com/FinforeOrg/FastNDWebapp

### Inter

*Inter* is the testing version of the app. After developing a number of new features and/or bug fixes, and testing them on stage, we deploy the latest `/build` code to http://inter.fastnd.com.

Repository: https://github.com/FinforeOrg/fastndwebapp-inter

### Production

*Production* is the stable version of the app, and is deployed to http://fastnd.com. After deploying to *Inter*, testing and bug-fixing, we deploy the latest build version to http://fastnd.com.

Repository: https://github.com/FinforeOrg/fastndwebapp-production

*Notes:* 

* The Inter and Production repositories only contain the packaged `/build` app, and not the `/dev` development, unpackaged, code. This allows these repositories to be directly deployed with the rest of the Rail API, on the same server.
* After updating the code in the Inter and Production respositories, please contact the API developer for deployment to the actual servers.
* **Make sure to change the `finforeBaseUrl` variable in `/webapp/config.js`, in each version, to point to the proper address for the API, based on the version: http://inter.fastnd.com or http://fastnd.com.**



## Technical details

Dependencies:

* jQuery UI Sortable - Sorting the columns on the desktop UI
* mediaelement.js
* iScroll4
* jquery.impromptu
* jquery.toastmessage

### CSS

* `base.css` - Desktop + Tablet
* `small-screen.css` - Mobile
* `shared.css` - Shared accross UIs

### Templates

Templates use jQuery.tmpl, have the .tmpl extension and are parsed by JavascriptMVC using $.View.

### FastND Web Service API

(refer to Rails API docs)


## 3rd Party APIs

### Bing API
http://www.bing.com/developers/s/APIBasics.html


# TODO

(When there are no other planned sprints)

* Replace jQuery UI Sortable with 
	http://farhadi.ir/projects/html5sortable/
	or
	http://mikeplate.github.com/jquery-drag-drop-plugin/ (merge si cu touch)
	
* Convert tmpl template to ej, better performance
* Better, native, notifications https://github.com/kbjr/Notifications
* Manegement, use collapsile sets for each one of the columns. This will allow mobile management.
* Implement new, canvas-based marquee, for much better performance.