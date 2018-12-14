const gear = require("../../gearbox.js");
const cmd = 'skatefy';

const init = async function (message, userDB, DB) {

message.channel.messages.fetch({before: message.id, limit: 1}).then(async mcl=>{
  
  
  try {
    let pre= mcl.first().content.toLowerCase().split(/ +/)
try{
  
if(message.content.split(/ +/)[1]) pre = message.content.toLowerCase().split(/ +/).slice(1);
}catch(e){}

      let sktphrase = [
        "ir de SKATE",
        "andar de SKATE",
        "fazer SKATE",
        "xXx SKATE",
      ]
    for(i=0;i<pre.length;i++){
  let rand = gear.randomize(0,sktphrase.length-1)
      pre[i]=pre[i].endsWith("ar")?sktphrase[rand].replace("xXx",pre[i]):pre[i];
      rand = gear.randomize(0,sktphrase.length-1)
      pre[i]=pre[i].endsWith("er")?sktphrase[rand].replace("xXx",pre[i]):pre[i];
      rand = gear.randomize(0,sktphrase.length-1)
      pre[i]=pre[i].endsWith("ir")?sktphrase[rand].replace("xXx",pre[i]):pre[i];

      pre[i]=(pre[i-1]||" ") == ("para")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("pra")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("pro")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("o")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("um")?"SKATE":pre[i]
      //pre[i]=(pre[i-1]||" ") == ("a")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("muito")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("mais")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("bem")?"SKATE":pre[i]
      pre[i]=(pre[i-1]||" ") == ("com")?"SKATE":pre[i]
      //pre[i]=(pre[i-1]||" ") == ("de")?["SKATE",pre[i]][gear.randomize(0,1)]:pre[i]

    }
    message.channel.send(" **"+pre.join(' ')+"**")
  } catch (e) {
    //Catch Statement
    message.reply(e.message)
  }
  
})
  
  
  
  
  
}

module.exports = {
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'eastereggs'
};