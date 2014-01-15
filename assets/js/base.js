var S = (function(doc, win, $) {

	S.init = function() {
		console.log("S is ready");
		doc.on("hest", function() {
			console.log("hest is triggered");
		});
		$(".hest").on("click", function(e) {
			doc.trigger("hest");
		});
	}

	return S;

}(document, this, $, S = S || {}));

S.init();
