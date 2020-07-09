const request = require('request');
const proc = require("process")

function requestNTimes(n){
	request("http://127.0.0.1:8080/uncarbonize/100/0/https%3A%2F%2Fwww.playstation.com%2Fen-us%2F", (err, response, body) => { 
		if(n > 1){
			requestNTimes(n-1);
		} else {
			proc.exit(0);
		} 
	});
}

requestNTimes(10)
