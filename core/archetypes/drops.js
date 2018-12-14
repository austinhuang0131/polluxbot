const gear = require("../gearbox.js");
const paths = require("../paths.json");
const locale = require('../../utils/multilang_b');
const mm = locale.getT();

function eventChecks(svDATA){
  if (!svDATA.event) return 1;
  if (!svDATA.event.enabled) return 1;
  if (!svDATA.event.channel) return 1;
  if (!svDATA.event.iterations) return 1;
  let I = Math.round(svDATA.event.iterations)
  return I||1;
};



var EVENT = true
var EVENTBOX = "event_s3"
var EVENTICON = "solstice"


function convertToEvent(i,box) {
    box.id   = box.id.replace("O", EVENTBOX)
    box.text = box.text += "\n" + i.eventDrop
    //box.pic  = EVENTICON+"_chest.png"
    box.pic  = "chest.png"
    return box;
}

module.exports = {
  lootbox: async function loot(trigger) {
    
 
    
if(trigger.content=="pick" &&  !trigger.channel.natural){
 return    gear.userDB.set(trigger.author.id,{$inc:{'modules.exp':-1000}});
}

     const checkRegex = /^_.*|^p!catch|^pick|\$w|\$m\b|^.!.*\s+|^.\/.*\s+|^\+.*\s+|^<.*[0-9]>$|^(.[A-Za-z]{10,})+$|(.)\2{4,}|(. ){4,}|(.{1,5})\4{3,}/g
  const msg = trigger.content.toLowerCase();
    
    if(msg.match(checkRegex)) return;
    
      
    
    const SVR = trigger.guild;
    const CHN = trigger.channel;
    const serverDATA = await gear.serverDB.findOne({id:SVR.id},{"modules.LOCALRANK":0});
    let prerf = serverDATA.modules.PREFIX || "+";
    const _DROPMIN   = 1
    const _DROPMAX   = 1000;
    const _RAREMAX   = 129
    const P = {
      lngs: trigger.lang,
      prefix:prerf
    }
    
    
    const v = {
      dropLoot: mm("loot.lootDrop." + (gear.randomize(1, 5)), P) + mm("loot.lootPick", P).replace(prerf, ""),
      disputing: mm("loot.contesting", P),
      oscarGoesTo: mm("loot.goesTo", P),
      gratz: mm("loot.congrats", P),
      morons: mm("loot.morons", P),
      eventDrop: mm("loot.eventDrop", P),
      suprareDrop: mm("loot.suprareDrop", P)+ mm("loot.lootPick", P),
      rareDrop: mm("loot.rareDrop", P)+ mm("loot.lootPick", P),
      ultraRareDrop: mm("loot.ultraRareDrop", P)+ mm("loot.lootPick", P)
    }
    
    let droprate = 777;
    droprate = gear.randomize(_DROPMIN,_DROPMAX);
    
    let BOX = { id:'lootbox_C_O', text:v.dropLoot, pic:"chest.png"}
    //console.log(droprate)
    
    
    let iterations = eventChecks(serverDATA);
    for (i=0;i<iterations/5;i++){
      droprate = gear.randomize(_DROPMIN , _DROPMAX);
      if(droprate == 777) break;
    };  
    
    if (EVENT){
      let dropevent = gear.randomize(1, 5);
      if (dropevent >= 2) BOX = convertToEvent(false,BOX);
    }
    
    let rarity = gear.randomize(0,_RAREMAX);
    switch (true){
      case rarity <=8:
        BOX.id  = "lootbox_UR_O";
        BOX.text= v.ultraRareDrop;
        break;
      case rarity <= 16:
        BOX.id  = "lootbox_SR_O";
        BOX.text= v.suprareDrop;
        break;
      case rarity <= 32:
        BOX.id  = "lootbox_R_O";
        BOX.text= v.rareDrop;
        break;
      case rarity <= 64:
        BOX.id  = "lootbox_U_O";
        BOX.text= v.dropLoot;
        break;
      case rarity <= 128:
        BOX.id  = "lootbox_C_O";
        BOX.text= v.dropLoot;
        break;
      default:
        BOX.id  = "lootbox_C_O";
        BOX.text= v.dropLoot;
    };
    
   // if(trigger.channel.id=="426308107992563713") droprate= 777;
    let dropcondition = droprate===777 || (trigger.content=="fdrop" && trigger.author.id==='88120564400553984');
    
    dropcondition ? console.log((`>> DROPRATE [${droprate}] >> ${trigger.guild.name} :: #${trigger.channel.name} `+"").red.bgYellow) : false;
    if(dropcondition){      
      
    console.log(("DROPPE!!!").green)

      if (!BOX) return;
      trigger.channel.natural = true
      
      let lootMessage = await CHN.send(BOX.text,{
        files:[paths.BUILD + (BOX.pic || "chest.png")]
      }).catch(e=>false);
      if(!lootMessage) return;
      
      let ballotMessage = await CHN.send(v.disputing).catch(e=>false);
      if(!ballotMessage) return CHN.send("An error has occurred at `LOOT_BALLOT.get`");  
      
      //COLLECT PICKERS
      let pickers = [];
      let bal_content = ballotMessage.content;      
      const responses = await CHN.awaitMessages(pickMsg=>{
        
        if( !pickMsg.author.bot
            && !pickers.find(u=>u.id==pickMsg.author.id)
            && pickMsg.content.toLowerCase().includes('pick') ){          
              if(ballotMessage){
                ballotMessage.edit(bal_content + "\n" + pickMsg.author.username).then(newmsg=>{
                  bal_content=newmsg.content;
                });                  
              };
              pickMsg.react(':loot:339957191027195905').catch(e=>{});

              pickers.push({id:pickMsg.author.id, name:pickMsg.author.username, mention:`<@${pickMsg.author.id}>`});          
              return true;
            }else{
              //pickMsg.delete().catch();
            };
        }, {time: 15000});
      
      if (pickers.length === 0) {
        CHN.send(v.morons);
        return;
      };      
      
      try{
        CHN.bulkDelete(responses,true).catch(e=>false);
      }catch(e){
        if(responses.first()) responses.first().delete().catch(e=>false);
      }
      
      lootMessage.delete().catch(e=>{});
      ballotMessage.delete().catch(e=>{});
      
      let p_sz = pickers.length-1;
      let rand =  gear.randomize(0,p_sz);
          rand = gear.randomize(0,p_sz);
          rand = gear.randomize(0,p_sz);
      pickers=gear.shuffle(pickers)
      
      let luckyOne = pickers[rand];
      
      let drama = pickers.map(user=>user.name);
      let ids = pickers.map(user=>user.id);
      let drama_message = "• "+drama.join('\n• ');
      let mention = pickers.map(user=>user.mention);
      drama[rand] = mention[rand];
      let mention_message = "• "+drama.join('\n• ');
      
      let goesto = await CHN.send(v.oscarGoesTo);
      let dramaMsg = await CHN.send(drama_message);
                    console.log(("WINNER PICKED!!!").green)
      await gear.wait(2);
      
      dramaMsg.edit(mention_message);
      await gear.wait(2);
      
            
      gear.dropHook.send("---\nLootbox Drop at **"+trigger.guild.name+"** ("+trigger.guild.id+") - `#"+trigger.channel.name+"` ("+trigger.channel.id+") \n Message to trigger: ```"+trigger.content+"```" +`
Participants: 
\`\`\`
${pickers.map(x=>x.name+" - "+x.id).join("\n")}
 \`\`\`
Winner:\`${JSON.stringify(luckyOne)}\
---

`)
      
      
      await gear.userDB.set(luckyOne.id,{$push:{'modules.inventory':BOX.id}});
                      console.log(("BOX ADDED!!!").green)
      goesto.delete().catch(e=>false);
      dramaMsg.delete().catch(e=>false);
      CHN.send(mention[rand]+", "+v.gratz);
      await gear.userDB.set({id:{$in:ids}},{$inc:{'modules.exp':100}});
      await gear.userDB.set(luckyOne.id,{$inc:{'modules.exp':500}});
      trigger.channel.natural = true
    }
  }  
}












