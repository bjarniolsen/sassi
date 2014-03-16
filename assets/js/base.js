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
