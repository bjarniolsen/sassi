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

		$(".nav-toggle").on("click", function(toggle) {
			toggle.preventDefault();
			_.navToggle(toggle);
		});

		$(".image-wrap").on("click", function(image) {
			image.preventDefault();
			_.imageHandler(image);
		});

		$("body > .admin").length > 0 ? _.modalCircleFocus() : null; 

		_.initModal();
	}

	_.navToggle = function(toggle) {
		$("#nav").classList.toggle("is-active");
		//navigation.classList.remove("is-active");
		//navigation.classList.add("is-active", "hest");
		//navigation.classList.contains("is-active");
	}

	_.imageHandler = function(image) {
		var newSrc = image.target.src.replace("thumb/", "", "gi");
		var title = document.createTextNode(image.target.getAttribute("alt"));
		var img = new Image();
		img.onload = function() {
			console.log(this.width, this.height);
		};
		img.src = newSrc;
		_.modal.find(".image-wrap").appendChild(img);
		_.modal.find(".title").appendChild(title);
		_.modal.classList.add("is-active");
	}

	_.initModal = function() {
		_.modal = document.createElement("div");
		_.modal.classList.add("modal");
		_.modal.innerHTML = "<div><button type=\"button\">luk</button><div class=\"image-wrap\"></div><p class=\"title\"></p></div>";
		document.body.appendChild(_.modal);
		_.modal.find("button").on("click", function() {
			_.modal.classList.remove("is-active");
			var img = _.modal.find("img");
			img.parentNode.removeChild(img);
		});
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
