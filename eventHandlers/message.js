const {serverDB,channelDB,userDB}= require('../core/gearbox.js'),
      async     = require('async');

const subroutineHandler = require('../core/subroutines.js');
const commandHandler = require('../core/commandFire.js');
const command$Handler = require('../core/donFire.js');
const Nightwatch = require ('../core/supermodules/nightwatch.js');


let GREYLIST=[],BLACKLIST=["219406074242007040"],WHITELIST=[]

let REDLIST=["484316735290212365","280330855791198208","284845361934106625"];
let YELLOWLIST=["311745466134036481"];

async function dataChecks(type,ent,m){
  return new Promise(async resolve =>{
    if(type==="user"){
      userDB.findOne({id:ent.id},{_id:0,audits:0,_v:0,'modules.build':0,'modules.statistics':0,'modules.bgInventory':0,'modules.medalInventory':0,'modules.audits':0,'modules.inventory':0}).then(user=>{
        if(!user || user===null  ) return resolve(userDB.new(ent));
        return resolve(user);
      });
    };
    if(type==="server"){
      serverDB.findOne({id:ent.id},{_id:0,'modules.PREFIX':1,'modules.DISABLED':1,'event':1,'modules.AUTOROLES':1,'modules.SELFROLES':1,'modules.LANGUAGE':1,'globalPrefix':1,'modules.UPFACTOR':1,'modules.LVUP':1}).then(server=>{
        if((server===null||JSON.stringify(server)=="null"||!server)  &&(m.startsWith("p!")||m.startsWith("+")||m.startsWith("+"))  ) return resolve(serverDB.new(ent));
        return resolve(server);
      });
    };
    if(type==="channel"){
      channelDB.findOne({id:ent.id},{_id:0,audits:0,_v:0,'modules.statistics':0}).then(channel=>{
        if(channel===null  &&(m.startsWith("p!")||m.startsWith("+")||m.startsWith("+"))  ) return resolve(channelDB.new(ent));
        return resolve(channel);
      });
    }; 
  });
};

async function levelUps(message,servData,chanData,USER,userData){
    let levelup;
    if(!chanData.modules)return;  
    if(!chanData.modules.LVUP){
      levelup = (await channelDB.set(message.channel.id,{$set:{'modules.LVUP':true}})).modules.LVUP;
    }else{
      levelup = chanData.modules.LVUP;
    };
   // if (levelup){
        //let xp=userData.modules.exp;
        //if(message.content.toLowerCase().includes('pick')) xp-=10;
        //if(message.content.toLowerCase().includes('+lv')) xp-=10;
      if(message.content.length>=26){
        userDB.updateOne({id:message.author.id},{$inc:{'modules.exp':1}});
      }        
        delete require.cache[require.resolve('../core/subroutines.js')];
        subroutineHandler.levelChecks(message,servData,userData);
   // };
};

async function localExpIncrement(message,servData,chanData,USER,userData){

    let channel_exp;

  if(!chanData.modules)return; 
    if(!chanData.modules.EXP){
      channel_exp = (await channelDB.set(message.channel.id,{$set:{'modules.EXP':true}})).modules.EXP;
      
    }else{
      channel_exp = chanData.modules.EXP;
    };
  
    if (channel_exp){         
         await serverDB.set({id:message.guild.id},{$inc:{['modules.LOCALRANK.'+USER.id+'.exp']:1}});
    };
};
async function randomDrops(CHANNEL,chanData){

    let random_drops;
    if(!chanData.modules)return;
    if(!chanData.modules.EXP){
      random_drops = (await channelDB.findOneAndUpdate({id:CHANNEL.id},{$set:{'modules.DROPS':true}})).modules.DROPS;
    }else{
      random_drops = chanData.modules.DROPS;
    };
    if (random_drops){

      //processDrops();

    };
};
async function spamBuster(bot,message,servData){
  //delete require.cache[require.resolve('../core/supermodules/nightwatch.js')];
    let spam_buster;
    let global_buster;
    if(!servData.modules)return;
    if(servData.modules.BUSTER){
      spam_buster = servData.modules.BUSTER;
    }else{
      return;
    };

      if(spam_buster.switches.flood===true) Nightwatch.floodBuster(message,bot,servData);
      if(spam_buster.switches.links===true) Nightwatch.linksBuster(message,bot,servData);
      if(spam_buster.switches.invites===true) Nightwatch.invitesBuster(message,bot,servData);
      if(spam_buster.switches.words===true) Nightwatch.wordsBuster(message,bot,servData);
      if(spam_buster.switches.mentionSpam===true) Nightwatch.mentionBuster(message,bot,servData);
  };

async function serverLanguageSets(message, servData){
    if(!servData.modules)return;
     if (servData.modules.LANGUAGE) {
       let langua = servData.modules.LANGUAGE;
      // if (message.guild.region === 'brazil') langua = "pt-BR";
       message.lang = [langua, 'dev'];
     } else {
       let langua = "en"
      // if (SERVER.region === 'brazil') langua = "pt-BR";
       message.lang = [langua, 'dev'];
       serverDB.set(message.guild.id, {$set: {'modules.LANGUAGE': langua}});
     };
   };

//----------------------------------------------------------

exports.run = async function(bot, message){
  
  //if(message.guild.members.size > 100000) {
  //if(message.content === "p!help") return message.reply("Servers over capacity. Abnormally large servers has been suspended.");
  //return console.log("denied");  
 // }

    //const checkRegex = /^_.*|^p!catch|^pick\b|^.!.*\s+|^.\/.*\s+|^\+.*\s+|^<.*[0-9]>$|^(.[A-Za-z]{10,})+$|(.)\2{4,}|(. ){4,}|(.{1,5})\4{3,}/g
    //if(message.content.match(checkRegex)) return message=null;
  

    

  
  if(process.env.MONITOR){
    let PEV = process.env.MONITOR
    if([message.channel.id,message.guild.id,message.author.id,"all"].includes(PEV)) console.log(message.content);
  }

  const USER   = message.author,
        SERVER = message.guild,
        CHANNEL= message.channel,
        TARGET = message.mentions.users.first();

  if (SERVER){
    

    
  if (USER.bot) return;
  dataChecks( 'channel',CHANNEL, message.content ).then(async chanData=>{
    if(!chanData)return null;
    if(chanData.ignored === true && !message.content.includes("unignore"))return;
    


   dataChecks( 'server', SERVER, message.content  ).then(async servData=>{
    if(!servData)return null;
    message.botUser = bot
    //CHECK SERVER LANG
    serverLanguageSets(message, servData);

    //CHECK CHANNEL LANG
    if(chanData.LANGUAGE){
      message.lang = [chanData.LANGUAGE || servData.LANGUAGE, 'dev'];
    };
     spamBuster(bot,message,servData);
    
     dataChecks( 'user',   USER, message.content    ).then(async userData=>{

     if(!userData) return;
     let targData = TARGET ? (await dataChecks( 'user',   TARGET, message.content  )) : userData;  
    
      
    if(userData && (!userData.blacklisted || userData.blacklisted=='false')){
      
      
    if(message.content.toLowerCase() =="pick"){
      if(message.channel.natural === true)
      console.log(("PICK   ::   "+message.author.id+"    ::    ----").bgGreen);
      if(message.channel.natural !== true)
      console.log(("PICK   ::   "+message.author.id+"    ::    ----").bgRed);
    }
      
      Promise.all([        
       localExpIncrement(message,servData,chanData,USER,userData),
       randomDrops(CHANNEL,chanData),
       levelUps(message,servData,chanData,USER,userData)
      ]);
    }

     delete require.cache[require.resolve('../core/subroutines.js')];
      subroutineHandler.runAll(message,servData,userData,chanData);
    
    if (typeof (servData.modules.PREFIX) !== 'undefined' && servData.modules.PREFIX && servData.modules.PREFIX !== '') {
        message.botUser = bot;
      
        let parsedData = {servData,userData,chanData,targData};
        if (command$Handler.run(message,parsedData)===true)return;

        if (message.content.startsWith(servData.modules.PREFIX)) message.prefix=servData.modules.PREFIX;
        if (servData.globalPrefix!==false){
        if(message.content.startsWith("p!")) message.prefix = "p!";
        };
        if(message.content.startsWith("plx!")) message.prefix = "plx!";
        if(message.prefix){
          if(SERVER.members.filter(memb=>REDLIST.includes(memb.id)).size>0) return message.reply("This server is Suspended. Please Contact Support");
          if(YELLOWLIST.includes(SERVER.ownerId)||YELLOWLIST.includes(SERVER.id)) return message.reply("This server is Suspended. Please Contact Support");
          if(userData.blacklisted && userData.blacklisted!='false' && !message.content.includes('whyblacklisted')){
            message.reply("https://youtu.be/JLJWzwKkv4k");
          } //message.react(':BLACKLISTED_USER:406192511070240780');
          else{          subroutineHandler.runOnCMD(message,servData,userData,chanData);
          commandHandler.run(message,parsedData);
          }
          
          userData = null;
          servData = null;
          chanData = null;
          targData = null;
          message = null;
          parsedData = null;
    
          
          if(global.gc)global.gc();
          
         
        };
    };

    //---SPAM BUSTER

    //---NIGHTWATCH SUBROUTINES

    //---REACTIONS
    });//USR
    });//SRV
    });//CHN
  }

}

