

module.exports = {
  run: async function run(bot, oldUser, newUser) {

const {serverDB,channelDB,userDB} = require('../core/gearbox.js'),
  async = require('async');

    bot.guilds.forEach(async Server => {
      if (Server.members.has(newUser.id)) {

        Server.dDATA = await serverDB.findOne({
          id: Server.id
        },{"modules.LOCALRANK":0});

        if (Server.dDATA) {
          if (Server.dDATA.logging == true) {

            let log = require('../core/modules/dev/logs_infra.js')


            const av_A = oldUser.displayAvatarURL({format:'png'});
            const av_B = newUser.displayAvatarURL({format:'png'});
            if (av_A != av_B) {

              log.init({
                bot,
                server: Server,
                old: Server.member(oldUser),
                new: Server.member(newUser),
                user: newUser,
                logtype: "usrPhoto",
                av_A,
                av_B
              });
              Server = null;
      
            }
          }
        }
      }
              Server=null;
             
    })
  }
}
