module.exports = Hook;
var config = require('./config.json');

function Hook () {}

Hook.prototype.sendToDisk = function (diskid,msg) {
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
	fetch((config.server_URL||'http://localhost')+'/disk/'+diskid, {
		method:  'POST',
		body:    msg,
		headers: { 'Content-Type': 'text/plain' }
	})
	.catch(err => {console.error(err); return;})
	.then(res => {if (res) {return res.text()}})
	.then(text => {}); //console.log('RESPONSE: '+text)
}

Hook.prototype.json_sendToDisk = function (diskid,msg) {
	let body = {diskid:diskid,block:msg};
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
	fetch((config.server_URL||'http://localhost')+'/disk/', {
		method:  'POST',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' }
	})
	.catch(err => {console.error(err); return;})
	.then(res => {if (res) {return res.text()}})
	.then(text => {}); //console.log('RESPONSE: '+text)
}

Hook.prototype.readFromDisk = function (diskid,callback) {
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
	fetch((config.server_URL||'http://localhost')+'/disk/'+diskid, {
		method: 'GET'
	})
	.catch(err => {console.error(err); return;})
	.then(res => {if (res) {return res.text()}})
	.then(text => {callback(text)}); //console.log('RESPONSE: '+text)
}
