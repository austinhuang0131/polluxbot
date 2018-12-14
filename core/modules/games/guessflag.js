var gear = require("../../gearbox.js");
var fs = require("fs");
var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

const cmd = 'guessflag';

const init = async function (message) {
  
  const P = {lngs:message.lang}
  if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
  //  
  
  if (message.guild.flagging)return message.reply(mm('games.alreadyPlaying',P));
  
   message.guild.flagging = true;
  
  
    fs.readdir(paths.BUILD+"guessflags/", function (err, files) {
      
      files = gear.shuffle(files);
      files = gear.shuffle(files);
      files = gear.shuffle(files);
      
      let rand = gear.randomize(0,files.length-1);
      var filepath ="https://www.pollux.fun/build/guessflags/"+files[rand]

      var name = files[rand].split('.')[0].replace(/-/g," ");

      let embed = new gear.RichEmbed;
      
      
        embed.attachFiles({
          attachment: filepath,
          name: "flag.png"
        });
        let attc = "attachment://flag.png"
      
      
      
      P.interjection = gear.mmrand('responses.verbose.interjections.yatta', mm, P)
      P.interjectionB = gear.mmrand('responses.verbose.interjections.ohmy_negative', mm, P)
      embed.setThumbnail(attc);
      embed.setTitle(mm('games.flags.title',P));
      embed.setColor("#41c0f8")
      embed.setDescription(mm('games.flags.youhave10',P));
      
      
      
      
      
    message.channel.send({embed}).then(async m=>{
      
      const respo = await  message.channel.awaitMessages(msg2 => 
       ( msg2.content+" ").toLowerCase().includes(name),
        {
        max:1,
        time:12000
      }
      );
      message.guild.flagging = false;
      
      if(respo.size === 0 ){
        return message.channel.send(mm('games.flags.noGuess',P))
      }
      
      let Aut = respo.first().member;
       P.user = Aut.displayName
       P.country = gear.capitalize(name)
      
      message.channel.send(mm('games.flags.wellDone',P));
      
      
      })
    })

        
        
  

}

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'games',
   cool: 15000
};
