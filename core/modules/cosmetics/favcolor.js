const translate = require('google-translate-api');
var gear = require("../../gearbox.js");
var paths = require("../../paths.json");
const namely = require('name-this-color');
var locale = require('../../../utils/multilang_b');
var mm = locale.getT();
var cmd = 'favcolor';

var init = function (message, userDB, DB) {
    var Channel = message.channel;
    const MSG = message.content
    const Author = message.author
    var bot = message.botUser
    var args = message.content.split(/ +/).slice(1)[0]
    //  var input = args[0].toUpperCase()

    //  console.log(isNaN(parseInt(args.replace(/^#/, ''), 16)))
    var regExp = new RegExp(/[0-9A-Fa-f]{6}/g);

    const v = {}
    v.colorChanged = mm("misc.colorChange", {
        lngs: message.lang
    })
    v.colorError = mm("faile", {
        lngs: message.lang
    })

    try {
        //HELP TRIGGER
        let helpkey = mm("helpkey", {
            lngs: message.lang
        })
        if ( !args || args === undefined || MSG.split(/ +/)[1] == helpkey || MSG.split(/ +/)[1] == "?" || MSG.split(/ +/)[1] == "help") {
            return gear.usage(cmd, message,this.cat);
        }
    } catch (e) {
        console.error(e)

        // gear.hook.send(e.error)
    }
    //------------
  console.log(args)
if(message.mentions.users.size > 0){
    let embed = new gear.RichEmbed;
    let x = message.target.dDATA.modules.favcolor
    embed.setColor("#" + x.replace(/^#/, ''))
        embed.setAuthor("Favcolor for "+message.mentions.users.first().tag, "https://png.icons8.com/paint-brush/dusk/64")
        embed.description = "**"+namely(x)[0].title + "** :: " + x
  
  return message.channel.send({embed})
}
if(args === "check"){
    let embed = new gear.RichEmbed;
    let x = message.author.dDATA.modules.favcolor
    embed.setColor("#" + x.replace(/^#/, ''))
        embed.setAuthor("Favcolor for "+message.author.tag, "https://png.icons8.com/paint-brush/dusk/64")
        embed.description = "**"+namely(x)[0].title + "** :: " + x
  
  return message.channel.send({embed})
}
  if(!args.startsWith("#")||!regExp.test(args) ){
    return gear.usage(cmd, message,this.cat);
  }
    var hex = parseInt((args + "FF").replace(/^#/, ''), 16);

    gear.userDB.set(Author.id, {$set:{"modules.favcolor":args.toUpperCase()}})

    let emb = new gear.RichEmbed;
    emb.setColor("#" + args.replace(/^#/, ''))

    let lang = message.lang[0]
    if (lang === "dev") lang = "pt";

    console.log(namely(args)[0].title);
    translate(namely(args)[0].title, {
        to: lang.split('-')[0]
    }).then(colset => {


        emb.setAuthor(colset.text, "https://png.icons8.com/paint-brush/dusk/64")
        emb.description = gear.emoji("yep") + v.colorChanged

        message.channel.send({
            embed: emb
        })
    })

}
module.exports = {
    pub: true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'cosmetics'
};
