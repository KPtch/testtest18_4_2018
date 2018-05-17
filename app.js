

"use strict";
var restify     = require('restify');
var builder     = require('botbuilder');
var data1        = require('./respond.json');
var data2        = require('./Case3.json');
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


bot.dialog('/',function (session,results) {

    
//     var bnt = new fbTemplate.Button('How are you?')
//       .addButton('Awesome', 'AWESOME')
//       .addButton('Great', 'GREAT')
//       .addButton('ðŸŽµðŸŽµðŸŽµ', 'https://youtu.be/m5TwT69i1lU')
//       .get();
    
    // session.send("-------------------------------------------------");
//     session.send(bnt);
    
     // session.send("-------------------------------------------------");
    
//     var hCard = new builder.HeroCard(session)
//           .title('ต้องการเอกสารนี้ใช่ไหม?')
//           .buttons([
//               builder.CardAction.openUrl(session, 'https://www.youtube.com/watch?v=TuhZpAKY7qM', 'ใบ'),
//               builder.CardAction.openUrl(session, 'https://www.youtube.com/watch?v=TuhZpAKY7qM', 'คำแนะนำ')
//           ]);
//     var msg = new builder.Message(session).attachments([hCard]);
//     session.send(msg);
    
    
    
    
    var req = session.message.text;
    if(results){
        req=JSON.stringify(results);
        session.send(req);
    }
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
        
        ref.on("value", function (snapshot) {
            var dddd  = snapshot.val();
            
            for(var i=0;i<dddd.length; i++){
                if(data1[resKey]==dddd[i].key){                    
                    var hCard = new builder.HeroCard(session)
                          .title('ต้องการเอกสารนี้ใช่ไหม?')
                          .buttons([
                              builder.CardAction.postBack(session, dddd[i].link, 'ใบ'+dddd[i].key),
                              builder.CardAction.postBack(session, dddd[i].comment, 'คำแนะนำ')
                          ]);
                    var msg = new builder.Message(session).attachments([hCard]);
                    session.send(msg);
                    
//                     var links = dddd[i].link;
//                     var comments = dddd[i].comment;
//                     var kk = dddd[i].key;
//                     session.send(links);
                }                
            }           
        });  
        
        
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
