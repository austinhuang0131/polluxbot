//NEED FIX
const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = 'clear';

const init = function (message,userDB,DB) {
  

const Channel = message.channel;
const Author = message.author;
const Target = message.mentions.users.first() || Author;
const MSG = message.content;
const bot = message.botUser
const args = MSG.split(/ +/).slice(1).join(' ')
const LANG = message.lang;

//-------MAGIC----------------

const P = {lngs:message.lang};
if(gear.autoHelper([mm("helpkey",P),'noargs',''],{cmd,message,opt:this.cat}))return;

    const noperms     =   mm('CMD.moderationNeeded', {lngs:LANG})
    const noPermsMe   =   mm('CMD.unperm', {lngs:LANG})
    const justasec    =   mm('CMD.jas', {lngs:LANG})
    const lerror    =   mm('CMD.genericInvalid', {lngs:LANG})




   const modPass = gear.hasPerms(message.member,message.guild.dDATA)

    if (!modPass) {
        return message.reply(mm('CMD.moderationNeeded', P)).catch(console.error);
    }
  
  
  if (!message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) {
    return message.reply(
      mm("error.iNeedThesePerms", {
        lngs: LANG,
        PERMSLIST:`:small_orange_diamond: **MANAGE MESSAGES**`
      })

    )
  }
  


            if (args) {
                let number = 0;
                try {
                    number = parseInt(args);
                } catch (e) {
                    return message.reply(lerror);
                }
                if (isNaN(number)) {
                    return message.reply(lerror);
                }
                if (number < 2) {
                    return message.reply(lerror +" Must be 2 or more").then(m=> {
                      m.delete({timeout:15000}).catch();
                      message.delete().catch();
                })
                }
                if (number > 100) {

                  let iters = Math.floor(number / 100)
                      message.reply(":hourglass:").then(m=>m.delete({timeout:25000}))
                  let alpha;
                  for(i=0;i<iters;i++){
                    alpha?alpha.delete().catch():false;
                    Channel.messages.fetch({before: message.id, limit: 100}).then(mbk => {
                      Channel.bulkDelete(mbk,true).then(()=>alpha =message.channel.send(":fire:x**"+(100*(i))+"**").then(x=>x.delete({timeout:2000}).catch(e=>false))).catch(e=>false);
                    }).catch(e=>false);
                  }    
                
                }
              if (number > 2000) {
                  message.reply(gear.emoji('nope'))
                } else {
                   Channel.messages.fetch({before: message.id, limit: number}).then(mbk => {
                        Channel.bulkDelete(mbk,true).then(() => {
                           const burn = mm('CMD.incinerate', {lngs: LANG,amt: number,amtB: (number*2)})
                            message.reply(":fire:  "+burn).then(m=> {m.delete({timeout:5000}).catch();message.delete().catch()});
                        }).catch(err => {
                            message.reply(lerror).catch();
                        });
                    }).catch();
                }
            } else {
                message.reply(lerror);
            }


};
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 1,
    init: init,
    cat: 'mod'
};
