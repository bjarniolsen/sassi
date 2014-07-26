var fs = require('fs');
var pagedown = require("pagedown");
var converter = new pagedown.Converter();
var safeConverter = pagedown.getSanitizingConverter();
var newsFile = __dirname + '/assets/json/news.json';
var news = [];

fs.readFile(newsFile, 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}
	news = JSON.parse(data);
});

exports.getLatestNewsRaw = function(req, res) {
	var result = [];
    for ( var i=0; i < news.length; i++ ) {
    	result.push(news[i]);
    }
    return result;
}

exports.getLatestNewsConverted = function(req, res) {
	var result = [], newContent = [];
    for ( var i=0; i < news.length; i++ ) {
    	newContent[i] = converter.makeHtml(news[i].content);
		news[i].content = newContent[i];
    	result.push(news[i]);
    }
    return result;
}

exports.updateNews = function(req, res) {
    for ( var i=0; i < news.length; i++ ) {
    	if (news[i].id == 0) {
    		news[i].content = req.body.content;
    	}
    }
	fs.writeFile(newsFile, JSON.stringify(news, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("news updated");
		}
	});
}
