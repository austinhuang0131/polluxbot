const g=require('./gearbox.js');
const Discoin = require("./archetypes/discoin.js");
const cfg = require("../config.json")
const fs = require("fs")
const discoin = new Discoin(cfg.discoin);
const gear = g
const eko = require ('./archetypes/ekonomist.js')
const coinbase = JSON.parse(fs.readFileSync("./resources/lists/discoin.json", "utf8"));
const CronJob = require('cron').CronJob;
Promise = require('bluebird');

async function resolveExchange(exchange_itm,bot){    
              let usr = exchange_itm.user + "";
              let ts = Date(exchange_itm.timestamp); // iso
              let src = exchange_itm.from.id;
              let amt = Number(Math.floor(exchange_itm.payout));
              let inv = exchange_itm.id;
              let taxes =  0 //Math.ceil(amt*0.1837)
              let coinfee =  0 //Math.floor(amt*(coinbase[src]||{rbnRate:0.005}).rbnRate)
              let newAmt = Math.floor(amt - taxes - coinfee);

            // WARNING: Reverse is gone
    
            if (newAmt < 1) {
              discoin.reverse(inv);
              return bot.fetchUser(usr)
                .then(u => u.send(`:warning: Transaction Reversed :: Amount of Rubines below Zero`)
                      .catch(e=>console.warn(`User ${u.id} cannot receive DMs`)));
            };

            g.userDB.findOne({id: usr}).then(async USDATA => {
              if (!USDATA) {
                discoin.reverse(inv)
                bot.fetchUser(usr)
                  .then(u => u.send(`Transaction Reversed :: Not in Pollux Database`)
                        .catch(e=>console.warn(`User ${u.id} cannot receive DMs`)))
                  .catch(e => console.log(e));                
                return;
              };
              g.audit(usr,newAmt,"discoin","RBN","+","DISCOIN_"+src).then(ok=>ok);
              g.userDB.findOneAndUpdate({id: usr}, {
                  $inc: {
                    'modules.rubines': newAmt                    
                  }
                }).then(ok=>{
                  function aN(inc,ref=amt){
                    let len  = ref.toString().length
                    let len2 = inc.toString().length
                    let spaces = ""
                    for (i=0;i<len-len2;i++){
                     spaces += " "
                    }
                    return spaces+inc
                  }
                bot.fetchUser(usr).then(u => {
                  discoin.process(inv);
                u.send(`
\`${src}\` ${coinbase[src].icon}:currency_exchange: ${gear.emoji('rubine')} \`RBN\`
**Exchange Processed!**

Inbound  : ${gear.emoji('rubine')} × **${amt}**
Fees         : ${gear.emoji('rubine')} × **${taxes+coinfee}**
\`\`\`diff
+Inbound Amount   :  ${aN(amt)}
-Transaction Fee  :  ${aN(taxes)}
-Exg. Tax for ${src} :  ${aN(coinfee)}
---------------------------
 Net Income       :  ${aN(newAmt)}
\`\`\`
Received **${newAmt}** **RBN**(*Pollux Rubines*) converted from **${src}**(*${coinbase[src].bot+" "+coinbase[src].name}*)!
---
*Transaction Receipt:*
\`${ts}\`
\`\`\`${inv}\`\`\`

`).catch(e=>console.warn("[DISCOIN] User can't recveive DMs"));
              }).catch(e => console.log(e,"\n\nERROR ON FETCH"))
                 })
            })
  }

//======================================================================================
//======================================================================================
//======================================================================================
//======================================================================================
//======================================================================================


exports.run = async function(bot){
  
//new CronJob('*/10 * * * * *', ()=> {
// SEK
//},null,true);
  
new CronJob('*/5  * * * *', ()=> {
  // EVERY 5
  let gchange = gear.gamechange();
  bot.user.setPresence({status:'online',game:{name:gchange[0],type:gchange[1]}});  
},null,true);
  
new CronJob('0 0 * * *', ()=> {
  // EVERY MIDNIGHT
  
   g.userDB.updateMany(
     {'limits.slots':{$gt:40}},
     {$set:{'limits.slots':0}}
   );
   g.userDB.updateMany(
     {'limits.blackjack':{$gt:40}},
     {$set:{'limits.blackjack':0}}
   );
   g.userDB.updateMany(
     {'limits.receive':{$gt:40}},
     {$set:{'limits.receive':0}}
   );
   g.userDB.updateMany(
     {'limits.give':{$gt:40}},
     {$set:{'limits.give':0}}
   );  
  
},null,true);

new CronJob('*/1 * * * *', ()=> {
  // EVERY 1 MINUTE
  
//======================================================================================
        /* UNMUTE USERS */
//======================================================================================

        gear.serverDB.find({
          'modules.MUTEDUSERS': { $exists: true, $gt: [] }
        }).then(arr => {
          arr.forEach(async sv => {
            try {
              if (!sv) return;
              if (!sv.modules.MUTEROLE){
                await gear.serverDB.set(sv.id,{$set:{'modules.MUTEDUSERS':[]}});
                return;
              };
              let date = Date.now();
              let SV = bot.guilds.get(sv.id);
              if (!SV) return;
              sv.modules.MUTEDUSERS.filter(mtu=>mtu.expires <= date).forEach(toUnmute=>{
                let ME = SV.members.get(toUnmute.id);
                if (!ME)return;
                ME.removeRole(sv.modules.MUTEROLE).then(async x=>{
                  if(!x.guild)return;
                  await  gear.serverDB.set(sv.id,{$pull:{'modules.MUTEDUSERS':{id:toUnmute.id}}});
                  if (x.guild.dDATA&&x.guild.dDATA.logging) {
                          //delete require.cache[require.resolve('./modules/dev/logs_infra.js')]
                          let log = require('./modules/dev/logs_infra.js');
                          log.init({
                            bot,
                            server: x.guild,
                            member: x,
                            user:   x.user,
                            logtype: "usrUnmute"
                          });
                    }
               }).catch(async e=>{
                 console.log(`
==================================
UNMUTE ERROR: Bad Muterole
Muterole value: ${sv.modules.MUTEROLE}
Server: ${sv.id} (${sv.name})
==================================
`);
await  gear.serverDB.set(sv.id,{$set:{'modules.MUTEDUSERS':[]}});
               });
             })
            } catch (e) {}
          })
        });
    
//======================================================================================  
        /* Exchange Currency */
//======================================================================================  

  discoin.fetch().then(trades => {
    trades = JSON.parse(trades)
    if (!trades.length || trades.length === 0) return;
    //let tle = trades.length;
    Promise.all(trades.map(td=>resolveExchange(td,bot)));
  });
  
},null,true);
  
  
  
  
}

