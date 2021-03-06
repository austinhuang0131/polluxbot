﻿Promise = require('bluebird');

Promise.config({
  //longStackTraces: true 
})

//thisShard = Number(process.argv.slice(2)[1])-1;
thisShard = Number(process.env.SHARD)
const cfg = require('./config.json');
const colors = require('colors');
const fs = require('fs');

//const SHARDS = JSON.parse(process.env.SHARDS)
//console.log(typeof SHARDS)
//console.log(SHARDS)
let {Client} =require("discord.js")
const POLLUX = new Client({
  totalShardCount: Number(process.env.TOTAL_SHARDS),
  shards: thisShard,
  //totalShardCount:13,
  //shards:SHARDS,
  //shardCount:1,
    presence:{status:'online'},
    messageCacheMaxSize: 50,
    messageCacheLifetime: 60,
    messageSweepInterval: 600,
    disableEveryone: true, 
    retryLimit:35,
    fetchAllMembers: false,
    //restWsBridgeTimeout: 10250,
    restTimeOffset:0,
   // ws:{compress:true,large_threshold:1000},
    disabledEvents: ['TYPING_START', 'VOICE_SERVER_UPDATE']
});

//POLLUX.on("raw",x=>console.log("[RAW]".yellow,x.t))
//POLLUX.on("debug",x=>console.log("[DEBUG]".blue,x))
POLLUX.login(cfg.token).then(loginSuccess).catch(e=> {console.error(e);process.exit(2)});




//GEARBOX | Boilerplate functions provider.
const {getDirs, userDB,serverDB,errHook,RichEmbed}= require("./core/gearbox.js");

/*
setInterval(f=>{
  if(POLLUX.dbg){ 
   // delete require.cache[require.resolve('./core/overtimes.js')];
 }
  require('./core/overtimes.js').run(POLLUX);
},1000);
*/

//Translation Engine ------------- <
const i18next = require('i18next');
const multilang = require('./utils/multilang_b');
const i18n_backend = require('i18next-node-fs-backend');
const backendOptions = {
    loadPath: './locales/{{lng}}/{{ns}}.json',
    //addPath: './locales/dev/translation.json',
    jsonIndent: 2    
};

getDirs('./locales/', (list) => {
    i18next.use(i18n_backend).init({
        backend: backendOptions,
        lng: 'en',
        fallbackLng:["en","dev"],
        fallbackToDefaultNS: true,
        fallbackOnNull: true,
        returnEmptyString:false,
        preload: list,
        load: 'currentOnly',
        ns:['bot_strings','events','commands','website','translation'],
            defaultNS: 'bot_strings',
            fallbackNS: 'translation',
            interpolation:{
                 escapeValue: false
            }
    }, (err, t) => {
        if (err) {
            console.log(err) 
        }
        multilang.setT(t);
    });
});
//----------------[i18n END]-------<


//=======================================//
//      BOT EVENT HANDLER
//=======================================//



async function loginSuccess() {
  //dawait POLLUX.user.setStatus('idle');
  console.log('LOGGED IN!'.bgGreen.white.bold)
  if(POLLUX.shard){
    console.log('Starting up Shard '+(1+POLLUX.shard.id)+'/'+POLLUX.shard.count);
  }

};

POLLUX.on('ready',async ()=>{
  
  //await POLLUX.user.setStatus('invisible');
let gear = require("./core/gearbox.js");
   let sname = gear.getShardCodename(POLLUX,Number(process.env.SHARD)+1)
    POLLUX.user.setPresence({shardID:Number(process.env.SHARD), status:'online',activity:{name:`+help / p!help - This is ${sname} Shard`,type:0}});
    
  if (POLLUX.shard) {
    POLLUX.user.setStatus('online');
    console.log(("● ".green)+'Shard' + (1 + POLLUX.shard.id) + '/' + POLLUX.shard.count + " [ONLINE]")
  }
console.log("[READY]".blue)
})
  

require('./core/cronjobs_shard.js').run(POLLUX);  

  fs.readdir("./eventHandlers/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      // delete require.cache[require.resolve(`./eventHandlers/${file}`)];
      let eventor = require(`./eventHandlers/${file}`);
      let eventide = file.split(".")[0];
      //if(POLLUX.ready){
      
        POLLUX.on(eventide, (...args) => {
          if(eventor && eventor.run){
          eventor.run(POLLUX, ...args)
          }
        });
      
      //}
      //delete require.cache[require.resolve(`./eventHandlers/${file}`)]
    });
  });


//=======================================//
//      PROCESS EVENT HANDLER
//=======================================/*/

process.on('unhandledRejection', function(reason, p){
  //if (!process.mdebug)
    //return;
/*
  airbrake.notify(reason,ok=>{
      console.log('Airbrake Notified');
      let embed = new RichEmbed();
      embed.setTitle("Unhandled Rejection")
      embed.setColor("#e3e32a")
      try{embed.setDescription(reason.stack)}catch(e){}
      errHook.send(embed).catch(e=>false)
    });
*/

    console.error(".\n\n==================================")
    console.error("Possibly Unhandled Rejection at: Promise \n".red,p);
    //console.log("Possibly Unhandled Rejection at: Promise \n".red,p, "\n\n reason: ".red, reason.stack);
    console.error("==================================\n\n.")
   // gear.sendSlack("Promise Breaker","Promise Rejection: "+reason,reason.stack,"#ffcd25" )
  reason = null;
  p=null;

});


//require('./core/archetypes/cutemon.js').run(POLLUX)


process.on('uncaughtException', function (err) {
   /*
     airbrake.notify(err,ok=>{
      console.log('Airbrake Notified');
    });
  */
      let embed = new RichEmbed();
      embed.setTitle("uncaughtException")
      embed.setColor("#e3e32a")
      try{embed.setDescription(reason.stack)}catch(e){}
      errHook.send(embed)
    console.error("-\n\n==================================")
    console.error('EXCEPTION: \n' + err);
    console.error(err.stack);
    console.error("==================================\n\n-")
    //process.exit(1);
  embed=null;

});

