var S = (function(doc, win, $, _) {

	_.init = function() {
		// Only get device state if the browser cuts the mustard
		if('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {
			_.getDeviceState();
		}

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

		_.modalCircleFocus();
	}

	_.modalCircleFocus = function() {
		var tabbableElements = 'a[href], area[href], input:not([disabled]),' +
			'select:not([disabled]), textarea:not([disabled]),' +
			'button:not([disabled]), iframe, object, embed, *[tabindex],' +
			'*[contenteditable]';

		var keepFocus = function (context) {
			var allTabbableElements = context.querySelectorAll(tabbableElements);
			var firstTabbableElement = allTabbableElements[0];
			var lastTabbableElement = allTabbableElements[allTabbableElements.length - 1];

			var keyListener = function (event) {
				var keyCode = event.which || event.keyCode; // Get the current keycode
				// Polyfill to prevent the default behavior of events
				event.preventDefault = event.preventDefault || function () {
					event.returnValue = false;
				};
				// If it is TAB
				if (keyCode === 9) {
					// Move focus to first element that can be tabbed if Shift isn't used
					if (event.target === lastTabbableElement && !event.shiftKey) {
						event.preventDefault();
						firstTabbableElement.focus();
						// Move focus to last element that can be tabbed if Shift is used
					} else if (event.target === firstTabbableElement && event.shiftKey) {
						event.preventDefault();
						lastTabbableElement.focus();
					}
				}
			};
			context.addEventListener('keydown', keyListener, false);
		};

		var modal = document.querySelector('.modal');
		keepFocus(modal);
		modal.focus();
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
