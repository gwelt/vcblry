module.exports = Hook;
var config = require('./config.json');

function Hook () {}

Hook.prototype.sendToDisk = function (diskid,msg) {
	// SEND TO DISK
	let body = {diskid:diskid,command:'write',block:msg};
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
	fetch((config.server_URL||'http://localhost')+'/disk/', {
		method: 'post',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' }
	})
	.catch(err => {console.error(err); return;})
	.then(res => res.text())
	.then(text => {}); //console.log('RESPONSE: '+text)
}

Hook.prototype.readFromDisk = function (diskid,callback) {
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
	fetch((config.server_URL||'http://localhost')+'/disk/'+diskid, {method: 'get'})
	.catch(err => {console.error(err); return;})
	.then(res => res.text())
	.then(text => {callback(text)});
}
