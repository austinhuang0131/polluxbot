const gear = require('../../gearbox.js');
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = 'gotcha';

const init = function (message) {
  try{
    
  let embed = new gear.RichEmbed
  embed.setColor('#f8a863')
  //embed.setTitle('GOTCHA!')

  if(message.channel.dDATA.snipe){
    if(Object.keys(message.channel.dDATA.snipe)[1]!=='msg_new'){
      
      embed.setDescription("```"+message.channel.dDATA.snipe.content+"```")
      embed.setFooter(message.channel.dDATA.snipe.author.tag,message.channel.dDATA.snipe.author.displayAvatarURL({format:'png'})|message.channel.dDATA.snipe.author.displayAvatarURL)
      embed.setTimestamp(message.channel.dDATA.snipe.timestamp)
      message.channel.send(embed)
      
    }else if(Object.keys(message.channel.dDATA.snipe)[1]=='msg_new'){
      console.log("KEYS", Object.keys(message.channel.dDATA.snipe) )
      embed.setDescription("``` "+message.channel.dDATA.snipe.msg_old.content+"``` \n**edited to**```"+message.channel.dDATA.snipe.msg_old.msg_new.content+"```")
      embed.setTimestamp(message.channel.dDATA.snipe.timestamp)
    embed.setFooter(message.channel.dDATA.snipe.msg_new.author.tag,message.channel.dDATA.snipe.msg_new.author.displayAvatarURL({format:'png'})|message.channel.dDATA.snipe.msg_new.author.displayAvatarURL)
      message.channel.send(embed)
      
    }else{
    console.log('GOTCHA no typeof')
      
    }
  }else{
    
    console.log('GOTCHA no scope')
  }
   
  message.channel.dDATA.snipe = undefined
  
  }catch(e){
    console.error(e)
  }
};

module.exports = {
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'misc'
};