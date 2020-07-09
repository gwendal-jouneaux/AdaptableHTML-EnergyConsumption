const request = require('request');
const proc = require("process")

function requestNTimes(n){
	request("http://127.0.0.1:8080/uncarbonize/100/0/https%3A%2F%2Fwww.tripadvisor.com%2FRestaurant_Review-g187103-d1322161-Reviews-Le_Galopin-Rennes_Ille_et_Vilaine_Brittany.html", (err, response, body) => { 
		if(n > 1){
			requestNTimes(n-1);
		} else {
			proc.exit(0);
		} 
	});
}

requestNTimes(10)
