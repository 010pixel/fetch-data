'use strict';

var http = require('http');
var fetchUrl = require("fetch").fetchUrl;
var url = require("url");

var server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.writeHead(200);

	var url_parts = url.parse(req.url,true);
	var google_sheet_id = url_parts.query.google_sheet_id;
	var gid = url_parts.query.gid;
	var load_type = url_parts.query.load_type;

	if ( !google_sheet_id || !gid || !load_type ) {
		res.write("Please pass necessary parameters.");
		res.end();
	} else {
	    var feedUrl = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=' + google_sheet_id + '&single=true&gid=' + gid + '&output=' + load_type + '';

	    // "https://docs.google.com/spreadsheets/d/1lgIw2Q-RfjdmYsDziAM8CZem3Gruy-YR_khMY6_Q4Qk/pub?gid=537679121&single=true&output=tsv"

		// source file is iso-8859-15 but it is converted to utf-8 automatically
		fetchUrl(feedUrl, function(error, meta, body){
			res.write(body);
			res.end();
		});
	}
});
server.listen(9000);

// var fetch = require('node-fetch');
// if you are on node v0.10, set a Promise library first, eg. 
// fetch.Promise = require('bluebird'); 
// plain text or html 
// fetch('https://github.com/')
//     .then(function(res) {
//         return res.text();
//     }).then(function(body) {
//         console.log(body);
//     });



// var afterLoad = require('after-load');
// afterLoad('http://letmesuggest.info', function(html){
//   res.end(html);
// });