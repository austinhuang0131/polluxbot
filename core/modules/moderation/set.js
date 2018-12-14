const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'set';

const init = async function (message, userDB, DB) {
//HELP TRIGGER
const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
if(gear.autoHelper(['noargs'],{cmd,message,opt:this.cat}));
//------------

  
  const On = gear.emoji("yep")
  const Off = gear.emoji("nope")

  const Server = message.guild;
  const Channel = message.channel;
  const Author = message.author;

  const Member = message.member;
  const Target = message.mentions.users.first() || Author;
  const MSG = message.content;

  const args = MSG.split(' ').slice(1)
  const LANG = message.lang;

 
    const modPass = await gear.hasPerms(Member,gear.serverDB);
      if (!modPass)return message.reply(mm('CMD.moderationNeeded',P)).catch(e=>console.warn);
  
  if(message.args[0]=="ignore"&&message.args[1]=="all"){ 
    channels = Server.channels.map(x=>x.id)
    //console.log(channels)
    await gear.channelDB.updateMany({id:{$in:channels}},{$set:{'ignored':true}});
    return message.reply(On+" Ignoring **all channels**. use `plx!set unignore` to revert");
  }
  if(message.args[0]=="ignore"){ 
    await gear.channelDB.set(Channel.id,{$set:{'ignored':true}});
    return message.reply(On+" Ignoring this channel. use `plx!set unignore` to revert");
  }
  if(message.args[0]=="unignore"&&message.args[1]=="all"){ 
   await gear.channelDB.updateMany({id:{$in:Server.channels.map(x=>x.id)}},{$set:{'ignored':false}});
    return message.reply(On+" Reading all channels. use `plx!set ignore` to revert");
  } 
  if(message.args[0]=="unignore"){ 
   await  gear.channelDB.set(Channel.id,{$set:{'ignored':false}});
   return  message.reply(On+" Reading this channel. use `plx!set ignore` to revert");
  }
}
 module.exports = {pub:true,cmd: cmd, perms: 2, init: init, cat: 'mod'};
