const { exec } = require("child_process");
const request = require('request');
const express = require('express');
const { JSDOM } = require("jsdom");
const zlib = require('zlib');
const _url = require('url');
const fs = require('fs');
const app = express();
const port = 8080;


const sendBody = (res) => (page, zipped) => {
    
    console.log("proxy: HTTP intercept response: MODIFIED RESPONSE BODY");
    if(zipped){
	console.log("Send Zipped");
	zlib.gzip(page, function (err, archive) {
		if (err){return res.send(page);}
		res.header('Content-Encoding', 'gzip');
		res.header('vary', 'Accept-Encoding');
		res.header('access-control-allow-origin', '*');
		res.header('content-type', 'text/html; charset=utf-8');
		res.send(archive);
		return;
	});
    } else {
	res.send(page);
    }
}

const process = (req, origin, send) => (body, zipped) => {
	const dom = new JSDOM(body);
	body = dom.window.document.documentElement.outerHTML
	const page = body.replace(/<head>/g, '<head><base href="' + origin + '">');

        fs.writeFileSync('./input.html', page, 'utf-8')
        const vmPath = "/usr/lib/jvm/graalvm-ce-java11-20.0.0/bin/html"
	let command =         "export ADAPTABLE_HTML_ENERGY="+req.params.energy;
	command = command + "; export ADAPTABLE_HTML_ACCURACY="+req.params.accuracy;
	command = command + "; " + vmPath + " ./input.html --conditional-loading --loop-perforation";

	console.log("VM start");
	//console.log(page);
        exec(command, (error, stdout, stderr) => { // --conditional-loading --loop-perforation --degrade-image --degrade-image.folder=\"/home/ImageDegradation/\"
        if (error) {
            console.log(`error: ${error.message}`);
            //send(page);
            //return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            //send(page);
            //return
        }
        send(stdout, zipped);
        });
}

app.get('/uncarbonize/:energy/:accuracy/:url', (req, res) => {

    const uri = decodeURIComponent(req.params.url);
    const url = new _url.URL(uri);
    const origin = url.origin;

    const send = sendBody(res);
    const callback = process(req, origin, send);

    request({url:uri, headers:{"Accept-Encoding":"gzip"}, encoding: null}, (err, response, body) => {
        if (err) { return console.log(err); }

        console.log("PROXY : " + uri);

	const zipped = response.headers["content-encoding"] && response.headers["content-encoding"].includes("gzip");

	console.log("Zipped : " + zipped);

	if(!zipped){
		callback(body.toString(), zipped);
	} else {
		zlib.gunzip(body, function(err, dezipped) {
			if(err){
				console.log("Unzip Errpr");
				callback(body.toString(), zipped);
			} else {
				callback(dezipped.toString(), zipped);
			}
		});
	}
    });
});

app.get('/img/:url', (req, res) => {
    const uri = decodeURIComponent(req.params.url);
    console.log("IMAGE : " + uri);
    res.sendFile(uri);
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
});


