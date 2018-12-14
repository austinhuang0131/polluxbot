const gear = require("../../gearbox.js");

const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const yt = require('ytdl-core');
const rq = require('request');
const cmd = 'youtube';
const EventEmitter = require("events").EventEmitter;
const body = new EventEmitter();

const init = async function (message, userDB, DB) {

    const v = {}
    v.playing = mm("music.playing", {
      lngs: message.lang
    })
    v.comingnext = mm("music.comingnext", {
      lngs: message.lang
    })




    var Server = message.guild;
    var Channel = message.channel;
    var Author = message.author;
    if (Author.bot) return;
    var Member = Server.member(Author);
    var Target = message.mentions.users.first() || Author;
    var MSG = message.content;
    var bot = message.botUser
    var args = MSG.split(/ +/).slice(1).join(' ')
    var LANG = message.lang;

    //-------MAGIC----------------


    //if(Author.id === "282546525836541963") return message.send("Elevation too low");//

    var search = require('youtube-search');
    const embed = new gear.RichEmbed
    embed.setColor("#ff3d00")
    
    
    var opts = {
      maxResults: 10,
      type: "video",
      videoSyndicated: true,
      key: 'AIzaSyB459p_ith_k86GLNPUHaq6EfsfEOOOKoU'
    };

    await search(args, opts, async function (err, results) {
      if (err) return console.log(err);
      message.channel.startTyping()
      var list = ""
      var playle = []
      var link = []
      var mini = []
      var T = []
      let r
      results.length > 10 ? r = 10 : r = results.length
      embed.description="```🔎 "+args+"```"
      embed.setTitle(gear.emoji('youtube')+" YouTube Search")
      for (let i = 0; i < r; i++) {
        
        embed.description+=":small_orange_diamond:\u2000**" + (i + 1) + "**\u2003"+(i==9?"`:`":"`::`")+"\u2003" + results[i].title.replace('`',"'")+"\n"
        playle.push(results[i].title)
        link.push(results[i].link)

      }
        embed.description+= "\n:small_blue_diamond:\u2000**C**\u2003`::`\u2003**Cancel** \n"



      message.delete();
      
      message.channel.send({embed}).then(async msg => {
        message.channel.stopTyping(true)

          const responses = await Channel.awaitMessages(msg2 =>
            msg2.author.id === Author.id && msg2.author === Author && ((
                parseInt(msg2.content) > 0 &&
                parseInt(msg2.content) < 11 &&
                !isNaN(parseInt(msg2.content))) ||
              msg2.content === "c"), {
              max: 1,
              timeout: 20000
            }
          );

          if (responses.size === 0) {
            
            Channel.send("timeout");

          } else {

            if (responses.first().content === "c") {
              Channel.send(gear.emoji('nope')+" **CANCEL**");

            }else{
              
            let a = link[parseInt(responses.first().content) - 1]
            let b = playle[parseInt(responses.first().content) - 1]
            Channel.send(gear.emoji('yep')+a).then(m=>m.edit(gear.emoji('youtube')+` **${b}** | \`${Author.tag}\` \n ${a} `,m.embeds[0]));
            
            }

          }
            msg.delete().catch()
            responses.first().delete()




      })
    })
}


    module.exports = {
      pub: false,
      cmd: cmd,
      perms: 3,
      init: init,
      cat: 'music'
    };