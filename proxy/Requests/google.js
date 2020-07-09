const request = require('request');
const proc = require("process")

function requestNTimes(n){
	request("http://127.0.0.1:8080/uncarbonize/100/0/https%3A%2F%2Fwww.google.com%2Fsearch%3Fchannel%3Dfs%26q%3DSLE%26ie%3Dutf-8%26oe%3Dutf-8", (err, response, body) => { 
		if(n > 1){
			requestNTimes(n-1);
		} else {
			proc.exit(0);
		} 
	});
}

requestNTimes(10)
