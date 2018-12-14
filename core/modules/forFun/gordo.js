const Discord = require('discord.js');
const gear = require("../../gearbox.js");
const cmd = 'gordo';
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const init = function (message,userDB,DB) {


    //HELP TRIGGER
    let helpkey = mm("helpkey",{lngs:message.lang})
if (message.content.split(/ +/)[1]==helpkey || message.content.split(/ +/)[1]=="?"|| message.content.split(/ +/)[1]=="help"){
    return gear.usage(cmd,message,this.cat);
}
//------------
//    if (message.author.id != '88120564400553984') return message.reply('Only my master can send me direct orders. now begone!');
    try{

        var fausto=[
            "CE QUEBRO MINHA MESA MANO",
          "Some daqui meu, **some daqui**!"
        ]
        
        let rand = gear.randomize(0,fausto.length-1);
let f= "https://cdn.discordapp.com/attachments/488142034776096772/503544935396409345/images.png"
message.channel.createWebhook('João Gordo',{avatar:"https://cdn.discordapp.com/attachments/488142034776096772/503544935396409345/images.png"})
 .then(async w => {
    await w.edit("João Gordo",f);
  await   w.send(fausto[rand]);
    w.delete().catch()
    
})
 .catch(e=>{

})
    }catch(e){gear.hook.send(e.error)}

}
 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3, 
    init: init,
    cat: 'fun'
};


