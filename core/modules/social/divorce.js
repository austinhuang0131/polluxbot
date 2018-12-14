const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'divorce';

const init = async function (message, userDB, DB) {
  
 // if(message.author.id!=='88120564400553984')return;
  try{
  const e = gear.emoji
  const Channel = message.channel;
  const Author = message.author;
  const Member = message.member;
  const TargetData = message.target;
  const MSG = message.content;
  const LANG = message.lang;
  const userData = Author.dDATA
  Author.dDATA = null;
  const args = MSG.split(/ +/).slice(1).join(' ');

  const ring   = args.split(' ')[1]
  const Target = message.mentions.users.first() 
    const TGID = args.split(/ +/)[0];
  const person = Target ||  message.botUser.users.get(TGID);
    const marriedperson = userData.married.find(pson => pson.id == TGID )
 Channel.startTyping()
 

  //HELP TRIGGER
    let P={lngs:message.lang}
    if(gear.autoHelper([mm("helpkey",P)],{cmd,message,opt:this.cat}))return;
  //------------

    try{
      
    P.user = message.author.username;
    P.userB = person.username;
    }catch(e){}
    
    
    const confirmdiag = mm('divorce.confirmdiag',P).replace('%EMJ%',gear.emoji('rubine'))    
    const saidnope = mm('divorce.saidnope',P).replace('%EMJ%',gear.emoji('rubine'))    
    const saidnothing = mm('divorce.saidnothing',P).replace('%EMJ%',gear.emoji('rubine'))    
    const saidyep = mm('divorce.saidyep',P)    
    const forced_rej = mm('divorce.forced_rej',P)
    const divinfo = mm('divorce.info',P)
    const divtitle = mm('divorce.divorce_title',P)

  
  let WIFES = userData.married
  
  if(!person && !marriedperson){
    
  
  let embed = new gear.RichEmbed;
    embed.setTitle(divtitle)
    embed.setDescription(divinfo)
  embed.setThumbnail('https://cdn.discordapp.com/attachments/435196699259043851/441373774127038475/broken-heart1.png')
    embed.setColor('#e23939')
    for (i =0; i<WIFES.length;i++){
      if(i>25)break;
      embed.addField(gear.emoji((WIFES[i].ring=='stardust'?'UR':WIFES[i].ring))+WIFES[i].tag,"`p!divorce "+WIFES[i].id+"`",false)
    }
     Channel.stopTyping()
  return message.channel.send({embed});
  }
    

      let targettokun = person||marriedperson;
      
      
      
      
      

let YA = {r:":yep:339398829050953728",id:'339398829050953728'}
let NA = {r:":nope:339398829088571402",id:'339398829088571402'}


 const unfriendly =async function(msg,targettokun,divorcee,reject){

          await msg.react(YA.r);
          msg.react(NA.r);
        const res = await msg.awaitReactions(rea=>rea.users.has(message.author.id),{time:15000,max:1});
         if (res.size === 1&&res.first().emoji.id==YA.id) {
            let newLp_him = divorcee.modules.lovepoints||0;
             let TKID = targettokun.id;             
             if(userData.modules.rubines<15000){
               P.number=15000
               return Channel.send(mm('$.insuFloor',P));
             }
             await gear.userDB.findOneAndUpdate(
               {id:message.author.id},
               {
                $pull: {"married": {id: TKID}},
                $set: {"modules.lovepoints":0},
                 $inc: {"modules.rubines":-15000}
               }
             );          
            await gear.userDB.findOneAndUpdate(
               {id:TKID},
               {
                 $pull: {"married": {id: message.author.id}},
                 $set: {"modules.lovepoints":(reject?0:newLp_him)},
               }               
             );  
              Channel.send(forced_rej)
        
     }else if(res.size === 1&&res.first().emoji.id==NA.id){
              Channel.send(gear.emoji('nope')+"`CANCEL`")
        
      }  else { Channel.send(gear.emoji('nope')+"`CANCEL`") }  

    }


Channel.stopTyping()
       
              let TKID = targettokun.id;
             let divorcee = await gear.userDB.findOne({id:TKID});
             let newLp_me = Math.floor(userData.modules.lovepoints / 2)||0;
             let newLp_him = Math.floor(divorcee.modules.lovepoints / 2)||0;
    
    if(!person){
            let xk = await Channel.send(saidnothing);
             return unfriendly(xk,targettokun,divorcee,false);
    }
    
     Channel.send("<@"+targettokun.id+">, "+ confirmdiag).then(async msg=>{

          await msg.react(YA.r);
          msg.react(NA.r);


        const res = await msg.awaitReactions(rea=>rea.users.has(targettokun.id)||rea.users.has('88120564400553984'),{time:15000,max:1});
       
       
         if (res.size === 1&&res.first().emoji.id==YA.id) {

           try{
      
             
             if(userData.modules.rubines<5000||divorcee.modules.rubines<5000){
               P.number=5000
               return Channel.send(mm('$.insuFloor',P));
             }


             await gear.userDB.findOneAndUpdate(
               {id:message.author.id},
               {
                $pull: {"married": {id: TKID}},
                $set: {"modules.lovepoints":newLp_me},
                 $inc: {"modules.rubines":-5000}
               }
             );          
            await gear.userDB.findOneAndUpdate(
               {id:TKID},
               {
                 $pull: {"married": {id: message.author.id}},
                 $set: {"modules.lovepoints":newLp_me},
                $inc: {"modules.rubines":-5000}
               }               
             );
    
             Channel.send(saidyep)             
           }catch(e){
             Channel.send("ERROR");
             console.error(e)
           }           
         }else if(res.size === 1&&res.first().emoji.id==NA.id){
           msg.delete().catch()
           let xk = await Channel.send(saidnope);
           
             return unfriendly(xk,targettokun,divorcee,true)
           
           
         }else{
           msg.delete().catch()
            let xk = await Channel.send(saidnothing);
             return unfriendly(xk,targettokun,divorcee,false)
         }
      })
    
      
    
    
    
  
  }catch(e){
    console.error(e)
  }
}



module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'social'
};
