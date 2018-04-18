'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = "<FB_PAGE_ACCESS_TOKEN>"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})





// var firebase = require('firebase');
// firebase.initializeApp({
//     databaseURL: 'https://ksbot-test.firebaseio.com/',
//     serviceAccount: 'ksbot-test-dec.json', //this is file that I downloaded from Firebase Console
// });

// var ref = firebase.database().ref();

// ref.on("value", function (snapshot) {
//     data  = snapshot.val();
// //     console.log(data);
// });

// //--------------



// var restify = require('restify');
// var builder = require('botbuilder');
// // var data = require('./respond.json');
// // var question = require('./question.json');

// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function(){
//     console.log('%s listening to %s', server.name, server.url);

// });

// // Setup Bot
// var connector = new builder.ChatConnector({
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });
// var bot = new builder.UniversalBot(connector);


// var timeout = undefined;

// var msg = server.post('api/messages', connector.listen());

// function timeout(text) {
	
//     setTimeout(function(){ session.send(text); }, 500);
// }
// bot.dialog('/', function (session) {
    
//     var req = session.message.text;
//     if(req){
        session.send("ok");
//        setTimeout(function(){ 
//              session.send("ok");
//        }, 500);
    }

    // var resKey = null;
    // var keys = Object.keys(data);
    // for(var i=0; i<keys.length; i++){
    //     var key = keys[i];
    //     var regex = new RegExp(key);
    //     if(req.match(regex)){
    //         resKey = key;            
    //         break;
    //     }
        
    // }
    // if(resKey){
    //     var s = 'นี้จ้า'+"\n";
    //     session.send(s+data[resKey]);
        
    // } else {
        
    //     var res = 'สวัสดีจ้าา เราคือบอท KunSri'+'\n';
    //     question.forEach(function(questions,index){
    //         res += "\n"+questions;
            
    //     });
    //     session.send(res);
    // }           
           
});
