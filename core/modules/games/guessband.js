var gear = require("../../gearbox.js");
var fs = require("fs");
var paths = require("../../paths.json");
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();

const cmd = 'guessband';

const init = async function (message) {
  
  const P = {lngs:message.lang}
  if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
  //  
  
  if (message.guild.banding)return message.reply(mm('games.alreadyPlaying',P));
  
   message.guild.banding = true;
  
  
    fs.readdir(paths.BUILD+"guessbands/", function (err, files) {
      
      files = gear.shuffle(files);
      files = gear.shuffle(files);
      files = gear.shuffle(files);
      
      let rand = gear.randomize(0,files.length-1);
      var filepath ="https://www.pollux.fun/build/guessbands/"+files[rand]

      var name = files[rand].split('.')[0].replace(/-/g," ");

      let embed = new gear.RichEmbed;
      
      
        embed.attachFiles({
          attachment: filepath,
          name: "flag.png"
        });
        let attc = "attachment://flag.png"
      
      
      
      P.interjection = gear.mmrand('responses.verbose.interjections.yatta', mm, P)
      P.interjectionB = gear.mmrand('responses.verbose.interjections.ohmy_negative', mm, P)
      embed.setImage(attc);
      embed.setTitle("Guess the Metal band");
      embed.setColor("#41c0f8")
      embed.setDescription("To what band belongs this logo? You have 20 seconds");
      
      
      
      
      
    message.channel.send({embed}).then(async m=>{
      
      const respo = await  message.channel.awaitMessages(msg2 => 
       ( msg2.content+" ").toLowerCase().includes(name),
        {
        max:1,
        time:22000
      }
      );
      message.guild.banding = false;
      
      if(respo.size === 0 ){
        return message.channel.send("Nobody Guessed it!")
      }
      
      let Aut = respo.first().member;
       P.user = Aut.displayName
       name = gear.capitalize(name)
      
      message.channel.send("Yes! that's it! "+name);
      
      
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
