const gear = require("../../gearbox.js");
const eko = require("../../archetypes/ekonomist.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'give';

const init = async function (message, userDB, DB) {


//if (message.author.id!='88120564400553984')return;

  const Author = message.author;
  const Target = message.mentions.users.first() || Author;
  const bot = message.botUser
  const args = message.content.split(/ +/).slice(1)
  const LANG = message.lang;
  let P = {
    lngs: LANG,
    interpolation: {
      'escapeValue': false
    }
  };

 

 
  //HELP TRIGGER

  if (gear.autoHelper([mm("helpkey", P), 'noargs', ''], {
      cmd,
      message,
      opt: this.cat
    })) return;
  //------------
  if (args.length < 2 || args[0].includes("<")) return gear.autoHelper('force', {
    cmd,
    message,
    opt: this.cat
  });


let USERDATA = await gear.userDB.findOne({id:Author.id});


  if(USERDATA.modules.level < 5){
    return message.reply("so, you must be level 5 or above to give Rubines away. Just be wary that spamming to level up faster will get your account banned.");
  }
  if(USERDATA.modules.bgInventory.length < 5){
    return message.reply("you cannot send away Rubines with a fresh account! Be advised that abusing new / alt accounts to send items to your main is bannable and will get both acounts deleted.");
  }  
  if(USERDATA.modules.medalInventory.length < 5){
    return message.reply("you cannot send away Rubines with a fresh account! Be advised that abusing new / alt accounts to send items to your main is bannable and will get both acounts deleted.");
  } 
  if(USERDATA.modules.dyStreakHard < 10){
    return message.reply("giving away Rubines will only be allowed once you complete a 10-day daily streak.");
  }
  
  if (await gear.manageLimits('give', 10, USERDATA, message)) return;

  let YES = {r:":yep:339398829050953728",id:'339398829050953728'}
  let NOP =  {r:":nope:339398829088571402",id:'339398829088571402'}

  let donate = parseInt(Math.round(args[0]));
  donate = Math.abs(donate);
  
  
  if(USERDATA)
  

  if (args.lenght < 2 || isNaN(donate) || message.mentions.size === 0) {
    return gear.usage(cmd, message, this.cat)
  }
  if (gear.checkGoods(donate, Author) == true) {

    await message.react(YES.r);
          message.react(NOP.r)

    P.icon = gear.emoji('yep');
    let confirm = await message.channel.send(Target + mm('CMD.acceptDec', P));
    let reacts = await message.awaitReactions(react =>
      react.users.has(Target.id), {
        maxEmojis: 1,
        time: 8000
      }
    );
    if (reacts.size === 0) {
      message.delete()
      confirm.delete()
    } else {
      confirm.delete()
      let rea = reacts.first()
      if ((rea.emoji.id == YES.id) && rea.count > 1) {
        if (await gear.manageLimits('receive', 5, message.target.dDATA, message)) return;
        
        await eko.pay(donate, Author.id, {
          target: Target.id
        });
        
        await gear.audit(message.author.id,donate,"give","RBN","-",Target.id);
        await gear.audit(Target.id,donate,"give","RBN","+",message.author.id);
        
        P.donate = donate
        P.target = Target.username
        P.author = Author.username
        return message.channel.send(gear.emoji('rubine') + mm('$.giveGoods', P)).then(function (c) {
          message.delete({timeout:5000}).catch();
        });
      } else {
        P.user = Target
        await message.channel.send(mm('CMD.declinedTrans', P)).then(m => m.delete({timeout:5000}));
        message.delete()
      }
    };
  } else {
    message.reply(mm('$.noFundsGeneric', P))
  }

}
module.exports = {
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: '$'
};