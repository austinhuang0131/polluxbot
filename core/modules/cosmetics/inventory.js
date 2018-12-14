var gear = require("../../gearbox.js");
var paths = require("../../paths.json");
var fs = require("fs");
var cmd = 'inventory';
const eko = require("../../archetypes/ekonomist.js")
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
const Canvas = require("canvas");

var init = async function (message, userDB, DB) {
  
  
 const canvas = new Canvas.createCanvas(800, 493);
  const ctx = canvas.getContext('2d');
  
  ///=================
  
  const _bkg = gear.getCanvas(paths.BUILD+'invent/inventframe.png');
    
  const menuCanvas = {   
     boosterpack_on: gear.getCanvas(paths.BUILD+'invent/boosterpack_on.png')
    ,key_on: gear.getCanvas(paths.BUILD+'invent/key_on.png')
    ,box_on: gear.getCanvas(paths.BUILD+'invent/box_on.png')
    ,material_on: gear.getCanvas(paths.BUILD+'invent/material_on.png')
    ,junk_on: gear.getCanvas(paths.BUILD+'invent/junk_on.png')
    
    ,boosterpack_off: gear.getCanvas(paths.BUILD+'invent/boosterpack_off.png')
    ,key_off: gear.getCanvas(paths.BUILD+'invent/key_off.png')
    ,box_off: gear.getCanvas(paths.BUILD+'invent/box_off.png')
    ,material_off: gear.getCanvas(paths.BUILD+'invent/material_off.png')
    ,junk_off: gear.getCanvas(paths.BUILD+'invent/junk_off.png')
  }
  
  const _avi = gear.getCanvas(message.author.displayAvatarURL({format:'png'}));
  
  const _txt = gear.tag(ctx,"TEXT");
  
  ///=================
  
  
  
  //const ITEMS = await gear.items.find({type:"box"})
  var args = message.content.split(/ +/).slice(1)
  
  let ruby = gear.emoji("rubine")
  const y = message.botUser.emojis.get("339398829050953728")
  const n = message.botUser.emojis.get("339398829088571402")
  let inventory = (await gear.userDB.findOne({id:message.author.id},{"modules.inventory":1})).modules.inventory;
  

  let possibleitems = await gear.items.find({id:{$in: inventory}});
  let inventoryParse = inventory.map(itm=>possibleitems.find(x=>x.id==itm)).filter(x=>!!x)

  //let boosters = await gear.cosmetics.find({id:{$in: inventory},type:"boosterpack"});

  //inventoryParse= boosters.concat(inventoryParse)
  inventoryParse.reverse()
  /*
  inventory.forEach(it=> {
    if(ITEMS[it])inventoryParse.unshift(ITEMS[it]);
  });
  */

  let invent = "ml\n"

  let typeColle = inventoryParse.map(itm=>itm.type);
  let types =  Array.from(new Set(typeColle));
  let typecount = []
  types.forEach(type=> typecount.push(typeColle.filter(y=>y==type).length)) 
  let len = types.length 
  if(types.length==0){
    invent = "No Items to Display"
  }
  //console.log(types)
  
  for (i=0;i<len;i++){
    invent+=`• [${i+1}] :: ${gear.capitalize(types[i])} × ${typecount[i]}`+"\n"
  }
  
  let inv = "```"+invent+"```"
  
  
  const invMenu = [ "box","boosterpack","material","key","junk" ];
  const menuPos = [ {x:325,y:140},{x:525,y:140},{x:125,y:295},{x:325,y:300},{x:525,y:300} ];
  
  
  
  ///=== === === === 
  ///=== === === === 
  
  
  ctx.drawImage(await _bkg,0,0);
  ctx.drawImage(await _avi,700,104,68,68);
  let key = 0
  for (let i=0;i<invMenu.length;i++){
    let item = invMenu[i]
    if(types.includes(item)) {
      ctx.drawImage(await menuCanvas[item+"_on"],menuPos[i].x,menuPos[i].y);
      let _tx = await gear.tag(ctx,"["+key+"]","900 24px Whitney HTF","#332f41");
      let _qt = await gear.tag(ctx,"x"+typecount[key],"900 24px Whitney HTF","#332f41");
      ctx.drawImage(_qt.item,menuPos[i].x+180-(_tx.width),menuPos[i].y+90);
      key++
    }
    else {ctx.drawImage(await menuCanvas[item+"_off"],menuPos[i].x,menuPos[i].y);}
  }
  
  
  ///=== === === === 
  ///=== === === === 
  
  
  let instructions = mm(['interface.inventory.instro',"Send *just the number* for the items you wish to see."],{lngs:message.lang})
  
  let embed = new gear.RichEmbed;
    embed.attachFiles({
      attachment: await canvas.toBuffer(),
      name: "inv.png"
    });
    //embed.setImage("attachment://inv.png");
    embed.setTitle(":package: Inventory");
    embed.setDescription(inv+`
    • ${instructions}
`);
  embed.setColor("#fc91e7")
   message.channel.send({embed});
  
    const responses = await message.channel.awaitMessages(msg =>
              msg.author.id === message.author.id && ((!isNaN(Number(msg.content))&&Number(msg.content)<=len)||types.includes(msg.content)), {
                  maxMatches: 1,
                  time: 20000
              });
  if (responses.size === 0) return message.channel.send("`TIMEOUT`");
      let check = isNaN(parseInt(responses.first().content));
      let responseSel = responses.first().content;
      let itmSel
  //console.log(check,"check")

    if(!check){
    let index= parseInt(responseSel)-1
    itmSel = types[index]
       }else{
         itmSel = responseSel
       }
    
    delete require.cache[require.resolve('../inventory/'+itmSel+'.js')]
    require('../inventory/'+itmSel+'.js').init(message)
    //message.reply(types[index])
  
}

module.exports = {
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'cosmetics',
   botperms:["MANAGE_MESSAGES","ATTACH_FILES","EMBED_LINKS"]
};
