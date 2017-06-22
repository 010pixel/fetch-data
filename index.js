'use strict';

var server_port = process.env.PORT || 8080;
server_port = 9000;
 
var http = require('http');
var fetchUrl = require("fetch").fetchUrl;
var url = require("url");

var server = http.createServer(function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	var url_parts = url.parse(req.url,true);
	var google_sheet_id = url_parts.query.google_sheet_id;
	var gid = url_parts.query.gid;
	var load_type = url_parts.query.load_type;

	if ( !google_sheet_id || !gid || !load_type ) {

		res.write("Please pass necessary parameters.");
		res.end();

	} else {

		var feedUrl = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=' + google_sheet_id + '&single=true&gid=' + gid + '&output=' + (load_type == "json" ? "csv" : load_type) + '';

		if ( load_type == "tsv" ) {
			res.setHeader('content-type', 'text/tsv');
		} else if ( load_type == "csv" ) {
			res.setHeader('content-type', 'text/csv');
		} else if ( load_type == "json" ) {
			res.setHeader('content-type', 'application/json');
		}

		// "https://docs.google.com/spreadsheets/d/1lgIw2Q-RfjdmYsDziAM8CZem3Gruy-YR_khMY6_Q4Qk/pub?gid=537679121&single=true&output=tsv"

		if ( load_type == "json" ) {

			var csvjson = require('csvjson');

			fetchUrl(feedUrl, function(error, meta, body){
				var result = csvjson.toObject(body.toString(), {});
					result = JSON.stringify(result);

				res.writeHead(200);
				res.write(result);
				res.end();
			});

		} else {

			// source file is iso-8859-15 but it is converted to utf-8 automatically
			fetchUrl(feedUrl, function(error, meta, body){
				res.writeHead(200);
				res.write(body);
				res.end();
			});

		}

	}
});
server.listen(server_port);

// var fetch = require('node-fetch');
// if you are on node v0.10, set a Promise library first, eg. 
// fetch.Promise = require('bluebird'); 
// plain text or html 
// fetch('https://github.com/')
//	 .then(function(res) {
//		 return res.text();
//	 }).then(function(body) {
//		 console.log(body);
//	 });



// var afterLoad = require('after-load');
// afterLoad('http://letmesuggest.info', function(html){
//   res.end(html);
// });