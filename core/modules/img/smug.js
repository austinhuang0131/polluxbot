var cmd = 'smug';
var gear = require("../../gearbox.js");
var fs = require("fs");
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




  fs.readdir(paths.BUILD+"frenes/smug/", function (err, files) {
    
      let rand = gear.randomize(0,files.length-1);
    let file = files[rand]
    if(message.args[0]){
      file = files.find(x=>x.includes(" "+message.args[0])) || files[rand];
    }
    
      var filepath = paths.BUILD+"frenes/smug/"+file

      let embed = new gear.RichEmbed;
    embed.setColor("#f25686");
    embed.attachFiles({
      attachment: filepath,
      name: "smug.png"
    });
    embed.setImage("attachment://smug.png");
 
    embed.setFooter("Smug Anime Girl #"+file.split(" ")[1].split(".")[0]);
      
    message.channel.send({embed})
    //message.channel.send({files:[filepath]})
    })


};

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'img', botperms: ["ATTACH_FILES","EMBED_LINKS"],};


