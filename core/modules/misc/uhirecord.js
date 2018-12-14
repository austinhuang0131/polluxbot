const gear = require("../../gearbox.js");

const cmd = 'uhirecord';
const init = async function (message) {
 
  let userdata = await gear.userDB.findOne({id:(message.mentions.users.first()||message.author).id});
  
  let embed = new gear.RichEmbed;
  
  if(!userdata.modules.statistics)return message.reply("No Data for this user");
  
  embed.setThumbnail(userdata.meta.avatar)
  embed.setTitle("Spam Buster Record")
  embed.setDescription(`**Total Score:** ${userdata.modules.statistics.healthIndex.toFixed(2)}`);
  if(userdata.modules.statistics.buster){
    
  for(i in userdata.modules.statistics.buster)
  embed.addField(i,userdata.modules.statistics.buster[i],true)
  }
  
  message.channel.send({embed})
  
  
  
  
}
 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
