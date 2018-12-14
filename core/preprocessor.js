const gear = require("./gearbox.js");
const fs = require('fs');
const cfg = require('../config.json');

module.exports = {
    determine: function determine(msg) {
        let query = msg.content.substr(msg.prefix.length).split(' ')[0];

        let imgreactions = require("./imgreactions.js").out;

        if(imgreactions[query]){
          let rea
          if(imgreactions[query].constructor == Array){
            rea = imgreactions[query][gear.randomize(0,imgreactions[query].length-1)];
          }else{
            rea = imgreactions[query]
          }
            return {
                reaction: rea,
                path: null,
                module: "img",
                cat: "instant"
            }
        }


        let aliases = JSON.parse(fs.readFileSync("./core/aliases.json", 'utf8'));

        let command;
        if (aliases[query]) command = aliases[query].toLowerCase();
        else command = query.toLowerCase();

        let path = ""
        let files = fs.readdirSync(__dirname + "/modules")

        for (i = 0; i < files.length; i++) {
            let filedir = __dirname + "/modules/" + files[i]

            let morefiles = fs.readdirSync(filedir  )
            if (morefiles.indexOf(command + ".js") > -1) {


                let pathTo = filedir + "/" + command + ".js";

                let comm = require(pathTo)

                return {
                    path: pathTo,
                    cat: comm.cat,
                    module: files[i],
                    reaction: false
                }

            }
        }
        return false

    },
    checkModule: function checkModule(DTMN) {

        return DTMN.module
    },
    checkCategory: function checkCategory(DTMN) {

        return DTMN.cat
    },
    checkUse: function checkUse(DTMN, DB, msg) {

        try {
            let commandFile = require(DTMN.path);
          //console.log(DB.chanData.modules.DISABLED.includes(commandFile.cmd))
            switch (true) {
              case !msg.channel.nsfw && commandFile.cat.toLowerCase() == "nsfw" :
                    return "NONSFW";
                    break;
                case  DB.chanData.modules.DISABLED.includes(commandFile.cat):
                case  DB.chanData.modules.DISABLED.includes(DTMN.module):
                case  DB.chanData.modules.DISABLED.includes(commandFile.cmd):
                    return "DISABLED";
                    break;
                case msg.author.PLXpems > commandFile.perms:
                    return "NO ELEVATION";
                    break;
                default:
                    return true;
                    break;
            }
        } catch (err) {
            return true;
            console.log((err.stack).red)
        }
    },
    run: async function run(file, message, final_payload) {
        try {

            delete require.cache[require.resolve(file)];
            let command = require(file)

            try{
            let rand=gear.randomize(0,6)
            let exp = (command.exp || 4)-rand;
            gear.userDB.set(message.author.id,{$inc:{'modules.exp':exp}});
            }catch(e){
              console.error(e)
            }
          
            require('./minibuster.js').up(message,command.positive||2);
          
            let cooldown = command.cool || 2000;
               if(message.author.id==cfg.owner){
                 cooldown=0
               }else if(message.author.id=="200044537270370313"){
                 cooldown=8000;
                  await gear.userDB.set(message.author.id,{$inc:{'modules.exp':-1}});
               }
            let now = Date.now();
            if (message.author.cd_timer && (now - message.author.cd_timer)<cooldown){
              return message.reply(":hourglass_flowing_sand: Cooldown: `"+Math.abs((message.author.cd_timer+cooldown)-now )+"ms`").then(m=>m.delete(Math.abs((message.author.cd_timer+cooldown)-now )))
            }

            message.author.cd_timer = Date.now();
            Promise.all([
            gear.globalDB.set({
              $inc: {
                    ['data.statistics.commandUsage.CMD.' + command.cmd]: 1,
                    ['data.statistics.commandUsage.CAT.' + command.cat.replace('$','cash')]: 1
              }
            }),
            gear.userDB.set(message.author.id,{
              $inc: {
                    ['modules.statistics.commandUsage.CMD.' + command.cmd]: 1,
                    ['modules.statistics.commandUsage.TOTAL']: 1,
                    ['modules.statistics.commandUsage.CAT.'+command.cat.replace('$','cash')]: 1
              }
            }),
            gear.serverDB.set(message.guild.id,{
              $inc: {
                    ['modules.statistics.commandUsage.CMD.' + command.cmd]: 1,
                    ['modules.statistics.commandUsage.TOTAL']: 1,
                    ['modules.statistics.commandUsage.CAT.'+command.cat.replace('$','cash')]: 1
              }
            })
            ]
            )
          
            /*
            let cmdtrak = (await userDB.findOne({id:message.author.id})).modules.statistics.commandsUsed[command.cmd]
            if(cmdtrak == undefined)(await userDB.findOne({id:message.author.id})).modules.statistics.commandsUsed[command.cmd]=0;
            (await userDB.findOne({id:message.author.id})).modules.statistics.commandsUsed[command.cmd]++

            let SVcmdtrak = (await DB.findOne({id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]
            if(SVcmdtrak == undefined)(await DB.findOne({id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]=0;
            (await DB.findOne({id:message.guild.id})).modules.statistics.commandsUsed[command.cmd]++
            */

            

            let commandname = message.content.split(/ +/)[0]

            message.target={};
            message.args=message.content.split(/ +/).slice(1);
            message.botUser.dDATA=final_payload.Database_bot;
            message.author.dDATA=final_payload.userData;
            message.target.dDATA=final_payload.targData;
            message.guild.dDATA=final_payload.servData;
            message.channel.dDATA=final_payload.chanData;
          try{
            
            if (command.cat){
              let perms = command.botperms
              
              delete require.cache[require.resolve('./catcheck.js')];      
              let permchk = require('./catcheck.js').run(command.cat,message,perms)
              if (permchk!=='ok') return console.log(permchk);              
            }
            
            
            await command.init(message);

              
               
          }catch(e){
            console.error(e)
          }


          if(!message.author.id==process.env.WATCHCMD || process.env.WATCHCMD == "all"){
            console.log("SHARD "+(process.env.SHARD).black.bgYellow+("  --== " + commandname.toUpperCase() + " ==--   " + " || "+message.guild.name+" || "+message.author.tag+"  "+message.author.id).bgMagenta)
            console.log(" \x1b[37;1;91m |"+message.content+"| \x1b[0m "+(new Date()))
            console.log(message.guild.id + " S || C "+message.channel.id )
            }
        } catch (e) {
            console.error(e);
        }
        
  
                message= null;
                final_payload= null;
                command= null;
       
        
    }
};
console.log("Preprocessor OK!")
