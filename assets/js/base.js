var S = (function(doc, win, $) {

	S.init = function() {
		console.log("S is ready");
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

	return S;

}(document, this, $, S = S || {}));

S.init();
