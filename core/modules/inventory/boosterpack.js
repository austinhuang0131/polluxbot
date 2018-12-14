const gear = require('../../gearbox.js');
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'boosterpack'

const init = async function(message,params){
  try{


let inventory = (await gear.userDB.findOne({id:message.author.id},{"modules.inventory":1})).modules.inventory;
let items = (await gear.items.find({id:{$in: inventory}})).filter(itm=>itm.type=='boosterpack' && !itm.name.includes("(SPH)"));
async function iqnt(item){

  return (await gear.userDB.findOne({id:message.author.id},{"modules.inventory":1}) ).modules.inventory.filter(it=>it==item).length;

}
    let arrayargs = message.content.split(/ +/).slice(1)
    if(arrayargs.length == 2 && arrayargs[0] =="open"){
      let message2=message;
      message2.content = arrayargs.join(' ')
     return require("../cosmetics/opbooster.js").init(message2);
    }
  

  let embed = new gear.RichEmbed
  embed.setColor("#48f7c1")
  embed.setDescription(":card_box: **Boosterpacks Pocket**")
  //embed.addBlankField()


  for (i=0;i<items.length;i++){
      let buyer = items[i].buyable? gear.emoji('buyable'): ''
  let breaker = items[i].destroyable? gear.emoji('breakable'): ''
  let trader = items[i].tradeable? gear.emoji('tradeable'): ''

    let itmquant = await iqnt(items[i].id);
   embed.addField(items[i].emoji+" "+items[i].name+" **`[x"+itmquant+"]`**",gear.emoji(items[i].rarity)+"`"+message.prefix+"boosterpack open "+items[i].id.replace("_booster","")+"`")
  }
if (items.length>0) embed.setThumbnail("https://pollux.fun/build/invent/boosterpack_on.png");
else {
  let demotivational = gear.demotiv
    let rand = gear.randomize(1,demotivational.length)
    
  embed.setThumbnail("https://pollux.fun/build/invent/boosterpack_off.png");
  embed.description += "\n\n*"+demotivational[rand-1]+"*"
}
 message.channel.send(embed)


  }catch(e){
    console.error(e)
  }
}

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'inventory'
};
