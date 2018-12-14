var cmd = 'coffee';
var gear = require("../../gearbox.js");
var fs = require("fs");

var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var init = async function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var LANG = message.lang;
    var MSG = message.content
    //-------MAGIC----------------
const userA = message.author.username
let message2 = message
message2.content=message2.content.replace(/(bb|gg|bg|gb)/,"")
const userB = (await gear.getTarget(message2,{noself:true})||message.mentions.users.first()||{}).username || "everyone"
const userB_meta = message.mentions.users.first() ? message.mentions.users.first() :false;
    
let kissmg = `:hearts: ${userA} kissed ${userB}~` 



var arg = MSG.split(/ +/).slice(1).pop()

var x=["bb","gg","bg","gb"]
x.includes(arg) ? arg = arg : arg = "any";

let variatius = "cute"
let marriedtarget = message.author.dDATA.married.find(us=>us.id == userB_meta.id);
  if ( marriedtarget ){
    let noise = gear.randomize(0,50); 
    let pris = gear.randomize(1,0); 
    pris == 1 ? pris = gear.randomize(1,0) : false;
    variatius = message.author.dDATA.lovepoints < 50 + noise ? "couple" : "wet";
    if (gear.randomize(0,5)==1) variatius = "cute"; 
    await gear.userDB.findOneAndUpdate(
      {id: message.author.id,'married.id':userB_meta.id},
      {$inc:{"modules.lovepoints":pris}}
    ).then(x=>x);
    await gear.userDB.findOneAndUpdate(
      {id: userB_meta.id,'married.id':message.author.id},
      {$inc:{"modules.lovepoints":pris}}
    ).then(x=>x);
  };
   if (gear.randomize(0,5)==1) variatius = "couple"; 
   if (gear.randomize(0,10)==1) variatius = "wet"; 
  
   // return;
  let targettoninokun =  arg == "any" ? paths.BUILD+"frenes/kiss/" : paths.BUILD+"frenes/kiss/"+arg+"/"+variatius;
  
 // console.log(targettoninokun)
  //fs.readdir(, function (err, files) {
  fs.readdir(targettoninokun, function (err, files) {
      let rand = gear.randomize(0,files.length-1);
    if(files[rand].includes('slap')) kissmg = `${userA} tried to kiss ${userB} but got slapped instead... ouch` ;
    
      var filepath = targettoninokun+"/"+files[rand]

    message.channel.send(kissmg,{files:[filepath]}).then(m=>{
      })
    })
  }


 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'img'};


