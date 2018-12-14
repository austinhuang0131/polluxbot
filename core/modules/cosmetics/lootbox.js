const fs = require("fs");
const gear = require('../../gearbox.js')
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();


const cmd = 'lootbox';



const init = async function (message,userDB,DB) {
  if(message.author.id=="88120564400553984") message.author.looting = false;
  delete require.cache[require.resolve("../../archetypes/lootbox.js")];
const LOOT = require("../../archetypes/lootbox.js");
  
  const availBOXES = await gear.items.find({type:'box'});
  const P={lngs:message.lang,prefix:message.prefix}
  
  
  function openSpecBox(me,avlb,inside) {
    const action = me.toUpperCase();
    let A, B;
    if (inside && action.includes("LOOTBOX")||message.author.looting) return message.channel.send(gear.emoji("nope"));
    if (action == "OPEN") {
      A = "C"
    } else {
      A = action.split(/ +/)[1];
      B = action.split(/ +/)[2];
    };
    if ([A] == "B0B") return message.reply("u very indian");
    if (!avlb[A]) return message.reply(mm("loot.notThisbox", P));

    let Ty = A
    let Ev = ""
    let outgoingBoxaher = avlb[A][0]
      
    if (A == "EV") {
      try{
        
      if (B){
       
        let zeBoxe = availBOXES.find(x=>x.rarity==B&&x.event&&x.event!=""&&avlb.EV.includes(x.id));
       
        Ty =  zeBoxe.rarity;
        Ev =  zeBoxe.event.replace(":", "");
        outgoingBoxaher = zeBoxe.id
      }else{        
        let zeBoxe = availBOXES.find(x=>x.id==avlb.EV[0])
        Ty = zeBoxe.rarity
        Ev = zeBoxe.event.replace(":", "")
        outgoingBoxaher = zeBoxe.id
      }
      }catch(err){
        message.reply("There's no such event box in your inventory");
        return console.error(err);
      }
     
    } 

    let mess = message;
    mess.content = "loot " + Ty

    try {
      require("../dev/loot.js").init(mess, {
        issuer: "pollux",
        reducer: 0,
        rarity: Ty,
        event: Ev,
        boxaher: outgoingBoxaher
      })

    } catch (e) {
      message.reply("`UNAVAILABLE`")
      console.error(e)
    }

  }
  
  
  
  
  
  
  
  let args = message.content.split(/ +/).slice(1).join(' ') // nothing || open sr || give @someone 

  try{
  //if(message.author.id!=='88120564400553984') return message.reply("**Lootboxes are temporarily disabled.** Fixing recent issues  ");

if(message.author.looting)return;
//if(banlist.includes(message.author.id))return;

  

  if(!message.guild.member(message.botUser.user).hasPermission(['ATTACH_FILES','EMBED_LINKS'])){
    return message.reply(mm('CMD.noPermsMe', {
                lngs: message.lang,
                prefix: message.prefix
            }));
  };
  
  let inventory = (await gear.userDB.findOne({id:message.author.id},{"modules.inventory":1})).modules.inventory.filter(itm=>itm.includes('lootbox'))
  let boxes = {}


  
  
  for (let i=0;i<inventory.length;i++){
     //console.error(availBOXES.map(x=>x.id))
    if (availBOXES.find(x=>x.id==inventory[i]) && availBOXES.find(x=>x.id==inventory[i]).type =="box"){
      
      boxes[inventory[i]] ? boxes[inventory[i]]++ : boxes[inventory[i]] = 1;
     
    }
  };
    let invent_prompt = ""
    let embed = new gear.RichEmbed
    embed.setColor("#ff527a")
    let avlb = {}

    
    
    //console.error({boxes})
    
    for (i in boxes) {

       let _R = availBOXES.find(x=>x.id==i).rarity
       let cmmde = availBOXES.find(x=>x.id==i).rarity

      if (availBOXES.find(x=>x.id==i).event) {
        cmmde = "EV"
        if (!avlb.EV)avlb.EV = [];
        avlb.EV.push(availBOXES.find(x=>x.id==i).id)
      }else{

        if (!avlb[_R])avlb[_R] = [];
        avlb[_R].push(availBOXES.find(x=>x.id==i).id)
      }
embed.setDescription(gear.emoji('loot')+` **Lootbox Inventory**
These boxes contains many goodies you can use to customise your profile\u200b
`)
      embed.setThumbnail('http://www.pollux.fun/build/chest.png')

      embed.addField(gear.emoji(_R) + (availBOXES.find(x=>x.id==i).altEmoji || "") + ` ${availBOXES.find(x=>x.id==i).name}\u2003\`[x${boxes[i]}]\``,
   //       `${gear.emoji(availBOXES[i].emoji)}` + ` x${boxes[i]}
`Type \`open ${cmmde}\` to open this box.`,
          false
        )

    };

      embed.setFooter(message.author.tag,message.author.displayAvatarURL({format:'png'}))
    if (inventory.length==0){
      embed.setColor("#d84343")
      embed.description=gear.emoji("nope")+" No Lootboxes to Open"
    }

    if(args ==''){
    //intent = 'menuopen'
    }else if (args.startsWith('open')){
    //intent = 'openone'
      if(avlb[args.toUpperCase().split(' ')[1]] || avlb.C && args.toLowerCase() == 'open'){
       return openSpecBox(args,avlb);
      }

    }else if (args.startsWith('give')){

    //intent = 'give'

    }
    
    
    
    
    
    message.channel.send({embed});
      const responses = await message.channel.awaitMessages(msg2 =>
          msg2.author.id === message.author.id && (
               msg2.content.toLowerCase().includes("lootbox")
            || (avlb.U  && msg2.content.toLowerCase() === ("open u")  )
            || (avlb.R  && msg2.content.toLowerCase() === ("open r")  )
            || (avlb.UR && msg2.content.toLowerCase() === ("open ur") )
            || (avlb.SR && msg2.content.toLowerCase() === ("open sr") )
            || (avlb.EV && msg2.content.toLowerCase() === ("open ev") )
            || (avlb.EV && msg2.content.toLowerCase().includes("open ev") )
            || (avlb.C  && msg2.content.toLowerCase() === ("open")    )
            || (avlb.C  && msg2.content.toLowerCase() === ("open c")  )
            || (msg2.content.toLowerCase() === ("open b0b")  )
          ), {
            max: 1,
            time: 30e3
          });

        if (responses.size === 0) return; 
const respmessage = responses.first().content
    
        openSpecBox(respmessage,avlb,true)
    
    
    
          }catch(e){
            message.reply("`UNAVAILABLE`")
            console.error(e)
          }

    }

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 4,
    init: init,
    cat: 'misc',
   botperms:["MANAGE_MESSAGES","ATTACH_FILES","EMBED_LINKS"]
};
