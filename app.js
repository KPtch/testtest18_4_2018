

"use strict";
var restify     = require('./restify');
var builder     = require('./botbuilder');
var data1        = require('./respond.json');
var data2        = require('./Case3.json');
var question    = require('./question.json');
var firebase    = require('./firebase');
// const botBuilder = require('claudia-bot-builder');
const fbTemplate = require('./fb-message-builder');
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

function resKeys(req){
    var resKey = null;
    var keys = Object.keys(data1);
    for(var i=0; i<keys.length; i++){
        
        var key = keys[i];
        var regex = new RegExp(key);
        if(req.match(regex)){
            resKey = key;       
            return resKey;
        }
        
    }
}
function resKeys1(req){
    var resKey1 = null;
    var keys1 = Object.keys(data2);
    for(var i=0; i<keys1.length; i++){
        
        var key = keys1[i];
        var regex = new RegExp(key);
        if(req.match(regex)){
            resKey1 = key;       
            return resKey1;
        }
        
    }
}
function sendButton(session,req){
    ref.on("value", function (snapshot) {
            var dddd  = snapshot.val();
            
            for(var i=0;i<dddd.length; i++){
                if(req===dddd[i].key){
                    var hCard = 'ต้องการเอกสารนี้ใช่ไหม?'+'\n';
                    var hh = "\n"+'ใบ'+dddd[i].key+' : ['+dddd[i].link+' ]';
                    var hhh = "\n"+'คำแนะนำ : ['+dddd[i].comment+' ]';
                    hCard += hh+hhh;
//                           .buttons([
                              
                              
//                               builder.CardAction.openUrl(session, dddd[i].link, 'ใบ'+dddd[i].key),
//                               builder.CardAction.imBack(session, dddd[i].comment, 'คำแนะนำ')
                              
//                           ]);
                        
//                     var msg1 = new builder.Message(session).attachments([hCard]);
                    session.send(hCard);
                    
                }                
            }
     });  
}

bot.dialog('/',function (session) {
    
//     var hCard = new builder.HeroCard(session)
//           .title('ต้องการเอกสารนี้ใช่ไหม?')
//           .buttons([
//               builder.CardAction.openUrl(session, 'https://www.youtube.com/watch?v=TuhZpAKY7qM', 'ใบ'),
//               builder.CardAction.postBack(session, 'https://www.youtube.com/watch?v=TuhZpAKY7qM', 'คำแนะนำ')
//           ]);
//     var msg = new builder.Message(session).attachments([hCard]);
//     session.send(msg);
    
    
    var req = session.message.text;
    var resKey = resKeys(req);
    var resKey1 = resKeys1(req);
    
    session.send(resKey);
    
    
    if(resKey){
        sendButton(session,data1[resKey]);
        
    }
    else if(resKey1){
        session.send(resKey1);
        switch(data2[resKey1]) {
            case "ใบลา":
                session.beginDialog('SelectChoice');
                break;
            case "สอบ":
                session.beginDialog('ChooseChoice');
                break;
            case "เทียบ":
                session.beginDialog('PickChoice');
                break;
            default:
                break;
        }
    }
    else {
        
        var res = 'สวัสดีจ้าา เราคือบอท KunSri'+'\n';
        question.forEach(function(questions,index){
            res += "\n"+questions;
            
        });
        session.send(res);
    } 
    
});           

bot.dialog('SelectChoice',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการ", "ใบลาป่วย/กิจ|ใบขอลาออก|ใบขอลาพักการศึกษา", {
            listStyle: 3
//             builder.ListStyle.button
        });
    },
    function (session, results) {
        var rrr= resKeys(results.response.entity);
        sendButton(session,data1[rrr]);
        session.endDialog();
       
    }
]);
bot.dialog('ChooseChoice',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการ", "ใบขอสอบชดใช้|ใบขอสอบชดใช้กรณีป่วย", {
            listStyle: 2
        });
    },
    function (session, results) {
        var rrrr= resKeys(results.response.entity);
        sendButton(session,data1[rrrr]);
        session.endDialog();
        
    }
]);
bot.dialog('PickChoice',[
    function (session) {
        builder.Prompts.choice(session, "เลือกใบที่ต้องการ", "ใบขอเทียบโอนรายวิชา|ใบขอเทียบรายวิชา", {
            listStyle: 2
        });
    },
    function (session, results) {
        var rrrrr= resKeys(results.response.entity);
        sendButton(session,data1[rrrrr]);
        session.endDialog();
        
    }
]);
