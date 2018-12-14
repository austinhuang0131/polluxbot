var gear = require("../../gearbox.js");
var paths = require("../../paths.json");
var fs = require("fs");
var cmd = 'craft';
const eko = require("../../archetypes/ekonomist.js")
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();




const init = async function (message) {
  try{
    
  setTimeout(f=>  message.author.crafting = false, 25000)
    //HELP TRIGGER
    let P={lngs:message.lang,}
    if(gear.autoHelper([mm("helpkey",P),'noargs'],{cmd,message,opt:this.cat}))return;
  //------------
      
    
    
if(message.author.crafting)return;
message.author.crafting = true;
  function noteno(item,extra){
    message.reply("")
  }
  
    //message.reply("pos: 127, cfstatus: 1")
  let noteno_feed = []
  
  let ITEMS = await gear.items.getAll();
    
  let embed = new gear.RichEmbed
  embed.description=""
  embed.setColor('#71dbfa')
  
  let arg = message.content.split(/ +/).slice(1)[0];
  if (!arg)return;
  let crafted_item = ITEMS.find(itm=>itm.id==arg||itm.code==arg);
  embed.setTitle((crafted_item||{emoji:0}).emoji+" Crafting `: "+crafted_item.name+"`")
    
    
  const userData = await gear.userDB.findOne({id:message.author.id},{"modules.sapphires":1,"modules.jades":1,"modules.rubines":1,"modules.inventory":1});
  //message.reply("`console res`")
  if(crafted_item){
    let ID = crafted_item.id
    let NAME = crafted_item.name
    
    let ICON = crafted_item.icon || '';
    embed.setThumbnail("http://pollux.fun/build/items/"+ICON+".png")
    
    let CODE = crafted_item.code
    let MAT = crafted_item.materials
    let GC = crafted_item.gemcraft
    let fails = 0
        
    
    async function breakit(item,message){
      gear.userDB.findOneAndUpdate({
      'id':message.author.id,
      'modules.inventory':item
      },{$set:{'modules.inventory.$':'DRAGGE'}}).then(async x=>{        
        await gear.userDB.findOneAndUpdate({'id':message.author.id},{$pull:{'modules.inventory':'DRAGGE'}});
      })
    };

    
    
    if(GC.jades){
      let afford = userData.modules.jades >= GC.jades;
      let icona='yep';
      if(!afford){
        icona='nope'
        fails+=1
      }
      embed.description+="\n"+gear.emoji(icona)+" | "+gear.emoji('jade')+"**"+gear.miliarize(GC.jades,true)+'** x Jades';
    }
      
      
    
    if(GC.rubines){
      let afford = userData.modules.rubines >= GC.rubines;
      let icona='yep';
      if(!afford){
        icona='nope'
        fails+=1
      }
      embed.description+="\n"+gear.emoji(icona)+" | "+gear.emoji('rubine')+"**"+gear.miliarize(GC.rubines,true)+'** x Rubines';
    }
      
      
    
    if(GC.sapphires){
      console
      let afford = userData.modules.sapphires >= GC.sapphires;
      let icona='yep';
      if(!afford){
        icona='nope'
        fails+=1
      }
      embed.description+="\n"+gear.emoji(icona)+" | "+gear.emoji('sapphire')+"**"+gear.miliarize(GC.sapphires,true)+'** x Sapphires';
    }
      
      
    
    MAT.forEach(material=>{
      let icona='yep';
      if (userData.modules.inventory&&userData.modules.inventory.includes(material)){
        //message.reply('ok')
        
      }else{
        icona='nope';
        fails+=1
      }
        embed.description+="\n"+gear.emoji(icona)+" | "+ITEMS.find(x=>x.id==material).emoji+ITEMS.find(x=>x.id==material).name;               
    })
    if (fails > 0 ) {
      embed.setColor('#ed3a19');
      embed.description+="\n\nThere are missing materials in your inventory, I cannot craft this."
      message.author.crafting = false;
      message.channel.send({embed})
    }else{
      embed.description+="\n\nAll materials are available in your inventoru, proceed with the crafting?"
      message.channel.send({embed}).then(async m=>{

          let YA = {r:":yep:339398829050953728",id:'339398829050953728'}
          let NA = {r:":nope:339398829088571402",id:'339398829088571402'}

          await m.react(YA.r);
            m.react(NA.r);

          const reas = await m.awaitReactions(react =>
            react.users.has(message.author.id), {
              maxEmojis: 1,
              time: 15000
            }
          ).catch(e => {
            m.delete({timeout:1000});
            message.author.crafting = false;
            return message.channel.send("<"+NA.r+"> Timeout").then(mm=>mm.delete({timeout:5000}));
          });


          if (reas.size === 0 ||reas.size === 1&&reas.first().emoji.id==NA.id) {
            m.delete({timeout:1000});
            message.author.crafting = false;
            return message.channel.send("<"+NA.r+"> Cancelled").then(mm=>mm.delete({timeout:5000}));
          }
          if (reas.size === 1&&reas.first().emoji.id==YA.id) {
            await gear.audit(message.author.id,GC.rubines,"crafting","RBN");
            await gear.userDB.set(message.author.id,{$inc:{'modules.rubines': -GC.rubines}});
            await gear.audit(message.author.id,GC.jades,"crafting","JDE");
            await gear.userDB.set(message.author.id,{$inc:{'modules.jades': -GC.jades}});
            await gear.audit(message.author.id,GC.sapphires,"crafting","SPH");
            await gear.userDB.set(message.author.id,{$inc:{'modules.sapphires': -GC.sapphires}});
            
            MAT.forEach(async itm=>{
              await breakit(itm,message);
            })
            await m.delete({timeout:1000});
            
            await gear.userDB.set(message.author.id,{$push:{'modules.inventory': crafted_item.id}});
            
            message.author.crafting = false;
            return message.channel.send("<"+YA.r+"> Item Crafted!").then(mm=>mm.delete({timeout:5000}));
          }

      
      })
      
      
      
      
      
      
    }
    
  }else{
    message.author.crafting = false;
    message.reply("Invalid Craft Code")
  }
  
  
  
  }catch(e){
    message.author.crafting = false;
    console.error(e)
  }
}

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'cosmetics'
};



        