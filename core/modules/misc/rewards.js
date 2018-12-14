const {randomize,userDB,emoji} = require("../../gearbox.js");
const gear = require("../../gearbox.js");
const cmd = 'rewards';
const init = async function (message) {

  
  if(message.guild.id!=="277391723322408960"){
    return message.reply("This command must be used at Pollux's Mansion server.");
  }

  let aluminium   = message.guild.roles.get('364817390061748226');
  let lithium     = message.guild.roles.get("467100151161290762");
  let iridium     = message.guild.roles.get('364817384567078913');
  let carbon      = message.guild.roles.get("467100086330195998");
  let palladium   = message.guild.roles.get('364817388106940427');
  let zircon      = message.guild.roles.get("467100376777228298");
  let uranium     = message.guild.roles.get('369149163453284352');
  let astatine    = message.guild.roles.get('467032160763772948');
  let antimatter  = message.guild.roles.get("466737702772015144");  
  
  const useroles = message.member.roles
  let tier = false;
 
  switch(true){    
    case useroles.has("466737702772015144")===true:
      tier = "antimatter";      
      break;
    case useroles.has("467032160763772948")===true:
      tier = "astatine";
      break;
    case useroles.has("369149163453284352")===true:
      tier = "uranium";
      break;
    case useroles.has("467100376777228298")===true:
      tier = "zircon";
      break;
    case useroles.has("364817388106940427")===true:
      tier = "palladium";
      break;
    case useroles.has("467100086330195998")===true:
      tier = "carbon";
      break;
    case useroles.has("364817384567078913")===true:
      tier = "iridium";
      break;
    case useroles.has("467100151161290762")===true:
      tier = "lithium";
      break;
    case useroles.has("364817390061748226")===true:
      tier = "aluminium";
      break;
  };
      
  console.log(useroles.has("466737702772015144"))
  console.log(tier)
  if(!tier){
    return message.reply("You're not eligible for any rewards");
  }  
    
    
  const MONTHNAME = "December"
  const MONTHCHECK = 11
  const STICKERS = [
    "porujuisu"
    ,"poruchai"
    ,"porupix"
    ,"porubarcode"
    ,"summerlux"
    ,"hallux18"
    ,"dedpollux"
    ,"polluxsanta"
  ]
  
    if(message.author.dDATA.rewardsMonth >= MONTHCHECK && message.author.dDATA.donator == tier){
      return message.reply("You already claimed this month's rewards!");
    }
    if(!useroles.has("421181998439333901")){
      return message.reply("Your donation status is unconfirmed.");
    }

    
  let d6mo  = message.guild.roles.get('418887056262037505');
  let d5mo  = message.guild.roles.get('418887120896393217');
  let d4mo  = message.guild.roles.get('418887153662164996');
  let d3mo  = message.guild.roles.get('418887192790958090');
  let d2mo  = message.guild.roles.get('418887224642502668');
  let d1mo  = message.guild.roles.get('418887258699988992');
  
  let demodemo = [d6mo,d5mo,d4mo,d3mo,d2mo,d1mo]
   


  let dasveritas= message.guild.roles.get('421181998439333901');
  

  
  let last = STICKERS[STICKERS.length-1]
  let seclast = STICKERS[STICKERS.length-2]
  let thirdlast = STICKERS[STICKERS.length-3]
  let randompretwo = STICKERS[randomize(STICKERS.length-2)]
  let all = STICKERS
  
  let embed = new gear.RichEmbed;
    
    embed.setTitle(MONTHNAME+" Donators rewards");
    embed.setColor("#32363c");
    
  
  const TIERS = {    
    aluminium:{
      stickers: []
      ,boxes: ["lootbox_C_O","lootbox_C_O","lootbox_C_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      ,title: "aluminium"
      ,SPH: 0
      ,JDE: 5000
    },    
    lithium:{
      stickers: []
      ,boxes: ["lootbox_C_O","lootbox_C_O","lootbox_C_O","lootbox_C_O","lootbox_C_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      ,title: "lithium"
      ,SPH: 1
      ,JDE: 5000
    },    
    iridium:{
      stickers: [last]
      ,boxes: ["lootbox_U_O","lootbox_U_O","lootbox_U_O","lootbox_U_O","lootbox_U_O"]
      ,medals: ["patreon","paypal",]
      ,flairs: []
      ,title: "iridium"
      ,SPH: 2
      ,JDE: 10000
    },    
    carbon:{
      stickers: [last,randompretwo]
      ,boxes: ["lootbox_R_O","lootbox_R_O","lootbox_R_O","lootbox_R_O","lootbox_R_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      //,title: "carbon"
      ,title: "iridium"
      ,SPH: 4
      ,JDE: 15000
    },    
    palladium:{
      stickers: [last,seclast]
      ,boxes: ["lootbox_R_O","lootbox_R_O","lootbox_SR_O","lootbox_SR_O","lootbox_SR_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      ,title: "palladium"
      ,SPH: 8
      ,JDE: 25000
      ,customComm: "UNCLAIMED"
      
    },    
    zircon:{
      stickers: [last,seclast,thirdlast]
      ,boxes: ["lootbox_SR_O","lootbox_SR_O","lootbox_SR_O","lootbox_SR_O","lootbox_SR_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      ,title: "palladium"
      //,title: "zircon"
      ,SPH: 12
      ,JDE: 45000
      ,customComm: "UNCLAIMED"
      ,customMod: "UNCLAIMED"
    },    
    uranium:{
      stickers: [last,seclast,thirdlast,randompretwo]
      ,boxes: ["lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      ,title: "uranium"
      ,SPH: 24
      ,JDE: 100000
      ,customComm: "UNCLAIMED"
      ,customMod: "UNCLAIMED"
    },    
    astatine:{
      stickers: [last,seclast,thirdlast,randompretwo,randompretwo]
      ,boxes: ["lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O",
               "lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      //,title: "astatine"
      ,title: "uranium"
      ,SPH: 48
      ,JDE: 150000
      ,customComm: "UNCLAIMED"
      ,customMod: "UNCLAIMED"
    },    
    antimatter:{
      stickers: all
      ,boxes: ["lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O",
               "lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O",
               "lootbox_UR_O","lootbox_UR_O","lootbox_UR_O","lootbox_UR_O"]
      ,medals: ["patreon","paypal"]
      ,flairs: []
      ,title: "antimatter"
      ,SPH: 64
      ,JDE: 250000
      ,customComm: "UNCLAIMED"
      ,customMod: "UNCLAIMED"
    },
    
  }
  
  
  
  
  
  let T = TIERS[tier] 
  let pushmo = T.stickers
  console.log(pushmo)
  let stickernames = await gear.cosmetics.find({id:{$in:pushmo},type:"sticker"},{name:1,_id: 0 });
    console.log(stickernames)
  let tiere = T.boxes[0].replace("lootbox_","").replace("_O","");
  embed.setThumbnail("https://pollux.fun/build/"+T.title+".png");
  embed.setDescription(`
**${gear.capitalize(T.title)}**

${gear.emoji('sapphire')} x ${T.SPH}
${gear.emoji('jade')} x ${gear.miliarize(T.JDE)}
${gear.emoji('loot')} x ${T.boxes.length} ${gear.emoji(tiere)}

**STICKERS**
${stickernames.map(f=>f.name).join(" • ")}

*Enable profile frame with \`p!profile frame on\`*



`);
    embed.setFooter(message.author.tag,message.author.avatarURL)
    let ts= new Date();
    embed.setTimestamp(ts)
   // embed.setImage('https://pollux.fun/stickers/'+STICKERS[STICKERS.length-1]+'.png')
    
  
var querystring = {

    $set:       { donator:  T.title , rewardsMonth: MONTHCHECK }
    ,$addToSet: { 
      "modules.stickerInventory": {$each:pushmo} 
      ,"modules.medalInventory":  {$each:T.medals} 
      ,"modules.flairsInventory": {$each:T.flairs} 
    }
    ,$push:    { "modules.inventory": {$each:T.boxes} }
    ,$inc:     { 
      "modules.sapphires": T.SPH 
      ,"modules.jades":    T.JDE 
    }

}



await userDB.set(message.author.id,querystring);
  
  message.channel.send(emoji('yep')+" All set! Rewards added!",{embed});
  
}
 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
