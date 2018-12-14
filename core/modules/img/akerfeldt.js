var cmd = 'akerfeldt';
var fs = require("fs");
var gear = require("../../gearbox.js");
var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

var init = function (message,userDB,DB) {
    var Server = message.guild;
    var Channel = message.channel;
    var LANG = message.lang;
    var MSG = message.content
    //-------MAGIC----------------


//HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (MSG.split(" ")[1]==helpkey || MSG.split(" ")[1]=="?"|| MSG.split(" ")[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------
try{
  fs.readdir(paths.BUILD+"frenes/akerfeldt/", function (err, files) {
      let rand = gear.randomize(0,files.length-1);
      var filepath = paths.BUILD+"frenes/akerfeldt/"+files[rand]
    message.channel.send({files:[filepath]}).catch(e=>console.warn(e));
  })

}catch(err){console.log(err)}


};

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'memes'};


