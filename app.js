

"use strict";
var restify     = require('restify');
var builder     = require('botbuilder');
var data1        = require('./respond.json');
var question    = require('./question.json');
var firebase    = require('firebase');
// const botBuilder = require('claudia-bot-builder');
const fbTemplate = require('fb-message-builder');
const bbnt = builder.fbTemplate;


var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

// Setup Bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

var msg = server.post('api/messages', connector.listen());


firebase.initializeApp({
        databaseURL: 'https://ksbot-test.firebaseio.com/',
        serviceAccount: 'ksbot-test-dec.json', //this is file that I downloaded from Firebase Console
});

var ref = firebase.database().ref();


bot.dialog('/',function (session) {
    
//     var bnt = {
//         "attachment":{
//             "type":"template",
//             "payload":{
//             "template_type":"button",
//             "text":"เอกสารที่คุณต้องการ ?",
//             "buttons":[
//                   {
//                     "type":"web_url",
//                     "url":"https://www.messenger.com",
//                     "title":"Visit Messenger"
//                   },
//                   {
//                     "type":"web_url",
//                     "url":"https://www.messenger.com",
//                     "title":"Visit Messenger"
//                   },
//                   {
//                     "type":"web_url",
//                     "url":"https://www.messenger.com",
//                     "title":"Visit Messenger"
//                   }
//              ]
//              }
//         }

//     }"https://graph.facebook.com/v2.6/me/messages?access_token=EAABvEnIm4YkBAD3fr1WZCAX8nd8GAhrpZC7tf1dNpnUovg4luVRCtp6p0bVunu01oYlnudF7DD0IQZCzg25ZCNW2E0kAuMb9MQyz1cuS7suZAVHCN0RdZBEW9vb74iPGSZA8enVLotOAIDJh79HXNkEUK4rBXDa80EzomBJOsHxvHjfZAhZCFc7Im"
    
    
//     var bnt = new fbTemplate.Button('How are you?')
//       .addButton('Awesome', 'AWESOME')
//       .addButton('Great', 'GREAT')
//       .addButton('ðŸŽµðŸŽµðŸŽµ', 'https://youtu.be/m5TwT69i1lU')
//       .get();
    
    // session.send("-------------------------------------------------");
//     session.send(bnt);
    var hCard = new builder.HeroCard(session)
          .title('เอกสาร!')
          .buttons([

              builder.CardAction.imBack(session, 'golf', 'Billable'),
              builder.CardAction.imBack(session, '60lf', 'Non-Billable')
          ]);

    var msg = new builder.Message(session).attachments([hCard]);
    session.send(msg);
      
    
    
    
     
    
    

    var req = session.message.text;
    // session.send(req);
    var resKey = null;
    var keys = Object.keys(data1);
    for(var i=0; i<keys.length; i++){
        
        var key = keys[i];
        // session.send(key);
        // session.send("-------------------------------------------------");
        var regex = new RegExp(key);
        if(req.match(regex)){
            resKey = key;       
            break;
        }
        
    }
//     var resKey1 = null;
//     var keys1 = Object.keys(data2);
//     for(var i=0; i<keys1.length; i++){
        
//         var key = keys1[i];
//         // session.send(key);
//         // session.send("-------------------------------------------------");
//         var regex = new RegExp(key);
//         if(req.match(regex)){
//             resKey1 = key;       
//             break;
//         }
        
//     }
    session.send(resKey);
    if(resKey){
        var s = 'นี้จ้า'+"\n";
        ref.on("value", function (snapshot) {
            var dddd  = snapshot.val();
            
            session.send(dddd[0].link);
        
            if(data1[resKey]==dddd[10].key){
                session.send(s+dddd[10].link);
            }
        });
        session.send(s+data1[resKey]);    
        
        
    }
//     else if(resKey1){
        
//     }
    else {
        
        var res = 'สวัสดีจ้าา เราคือบอท KunSri'+'\n';
        question.forEach(function(questions,index){
            res += "\n"+questions;
            
        });
        session.send(res);
    }           
           
});






