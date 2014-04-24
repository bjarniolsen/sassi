var S = (function(doc, win, $, _) {

	_.init = function() {
		// Only get device state if the browser cuts the mustard
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {
			_.getDeviceState();

			doc.on("hest", function() {
				console.log("hest is triggered");
				var xhr = get('/api/get_all_images', function (err, result) {
    				if (err) {
        				console.log("something went wrong");
        				return;
    				}
					for (var i = 0, len = result.length; i < len; i++) {
						console.log(result[i].imageurl);
					}
				});
			});

			$(".hest").on("click", function(e) {
				doc.trigger("hest");
			});
		}
	}

	_.getDeviceState = function() {
		/*
 	 	 * Experimental Device State Detection with CSS Media Queries and JavaScript
 	 	 * See this from David Walsh:
 	 	 * http://davidwalsh.name/device-state-detection-css-media-queries-javascript
 	 	 *
 	 	 *  if(S.getDeviceState() == 'tablet') {
     	 *		Do whatever
	 	 *  }
 	 	 */

		// Create the state-indicator element
		var indicator = document.createElement('div');
		indicator.className = 'state-indicator';
		document.body.appendChild(indicator);
		// Get state
		var state = window.getComputedStyle(document.querySelector('.state-indicator'), ':before').getPropertyValue('content');
		console.log(state);
    	return state;
	}

	return S;

}(document, this, $, S = S || {}));

S.init();


/* The Grand Mobile test
 *
if (document.compatMode == "BackCompat" && document.documentMode) {
	_.quirksmode = true;
}
//This test determines if panel is shown or not
// If client (device) is a touch screen, then opt out now and return.
//var agent = navigator.userAgent.toLowerCase();
var scrWidth = screen.width;
//var scrHeight = screen.height;
// The document.documentElement dimensions seem to be identical to
// the screen dimensions on all the mobile browsers I've tested so far
//var elemWidth = document.documentElement.clientWidth;
//var elemHeight = document.documentElement.clientHeight;
// We need to eliminate Symbian, Series 60, Windows Mobile and
// Blackberry browsers for this quick and dirty check. This can be done
// with the user agent.
//var otherBrowser = (
//	(agent.indexOf("series60") != -1) ||
//	(agent.indexOf("symbian") != -1) ||
//	(agent.indexOf("windows ce") != -1) ||
//	(agent.indexOf("blackberry") != -1));
// If the screen orientation is defined we are in a modern mobile OS
var mobileOS = typeof(orientation) != 'undefined';
// If touch events are defined we are in a modern touch screen OS
var touchOS = ('ontouchstart' in document.documentElement);
// Get user agent
var ua = navigator.userAgent.toLowerCase();
// iPhone and iPad can be reliably identified with the
// navigator.platform string, which is currently only available on
// these devices.
var iPhone = ua.indexOf("iphone") != -1;
//var iPad = ua.indexOf("iPad") != -1;
//var iOS = iPhone || iPad;
// If the user agent string contains "android" then it's Android. If it
// doesn't but it's not another browser, not an iOS device and we're in
// a mobile and touch OS then we can be 99% certain that it's Android.
var android = ua.indexOf("android") != -1;
var windowsPhone = ua.indexOf("windows phone") != -1;

// The panel does not actually work on a phone.
_.phone = (iPhone || android || windowsPhone); //&& scrWidth < 700    
*/
