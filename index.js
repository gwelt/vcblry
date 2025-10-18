const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
var config = {};
try {config=require('./config.json')} catch(err){};
const port = config.PORT || process.env.PORT || 3000;
try {const Hook=require('./hook.js'); var hook = new Hook();} catch(err){};
server.listen(port, function () {console.log('Server listening at port %d', port)});

var list_of_Challenges = [];
var examples = [ {"id" : "Tiere / animals", "list" : [ {"A" : "Hund", "B" : "dog"}, {"A" : "Katze", "B" : "cat"}, {"A" : "Maus", "B" : "mouse"} ]}, {"id" : "Fahrzeuge / vehicles", "list" : [ {"A" : "Auto", "B" : "car"}, {"A" : "Flugzeug", "B" : "plane"} ]} ];
if (hook) {hook.readFromDisk('vcblry',(r)=>{let rx; try {rx=JSON.parse(r)} catch (e) {} if (rx) {let loc=[]; let ids=[]; while (rx.length) {let e=rx.pop(); if (!ids.includes(e.id)) {ids.push(e.id); if (e.list.length) {loc.push(e)}}} list_of_Challenges=loc;}})}

app.use(bodyParser.json({ strict: true }));
app.use(function (error, req, res, next){next()}); // don't show error-message, if it's not JSON ... just ignore it
app.use(express.static(path.join(__dirname, 'public')));
app.use('(/vcblry)?/:command', function (req, res, next) {
    if (req.method=='GET') {
        switch (req.params.command) {
            case '':
            case 'vcblry':
                res.sendFile('index.html',{root:path.join(__dirname,'public')});
                break;
            case 'api':
            case 'API':
                if (list_of_Challenges.length==0) {list_of_Challenges=examples};
                res.send(list_of_Challenges);
                break;
            default:
                fs.access(path.join(__dirname,'public')+'/'+req.params.command, fs.F_OK, (err) => {
                    if (err) {res.sendStatus(404)} else {
                        res.sendFile(req.params.command,{root:path.join(__dirname,'public')});
                    }
                })
        }
    }
    if (req.method=='POST') {
        switch (req.params.command) {
            case 'api':
            case 'API':
                if (hook) {hook.sendToDisk('vcblry',JSON.stringify(req.body))}
                list_of_Challenges=list_of_Challenges.filter((i)=>{return (req.body.id!=i.id) && (i.list) && (i.list.length>0) });
                if (req.body.list.length>0) {list_of_Challenges.push(req.body)}
                res.sendStatus(201);
                break;
            default:
                res.sendStatus(404);
        }
    }
})

process.on('SIGINT', function(){console.log('SIGINT'); process.exit()});
process.on('SIGTERM', function(){console.log('SIGTERM'); process.exit()});
