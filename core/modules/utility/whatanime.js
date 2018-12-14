const paths = require("../../paths.json");
const gear = require("../../gearbox.js");
const rq = require("request");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = 'whatanime';

const init = async function (msg) {

  const moment = require("moment");
  const P = {
    lngs: msg.lang
  }
  let lang = msg.lang[0]
  if (lang == 'cz') lang = 'cs';
  moment.locale(lang);

  const DAY = 600000
  const now = Date.now();
  const userDaily = msg.author.animeDaily || 1;

  const dailyAvailable = now - userDaily >= DAY;

  if (!dailyAvailable && msg.author.id != "88120564400553984") {

    let r = userDaily + DAY;
    let remaining = moment.utc(r).fromNow(true)
    let prompt = `
${gear.emoji('time')   } You can only use this command every 10 minutes | **Remaining: ${remaining}**}
    `;

    return msg.channel.send(prompt);

  } else {


    delete require.cache[require.resolve('../../../config.json')];
    const CFG = require('../../../config.json');
    const TOKEN = CFG.whatanimega;
    const i2b = require("imageurl-base64");
    let imgUrl = await gear.getImg(msg);

    await i2b(imgUrl, async function (err, img) {
      if (err) {
        console.error(err)
        return msg.channel.send("INVALID IMAGE PROVIDED");
      }


      let b64 = img.base64
      let T = TOKEN


      let formData = {
        "image": b64
      }

      let rqOptions = {
        url: `https://whatanime.ga/api/search?token=${T}`,
        method: 'POST',
        formData
      };


      msg.author.animeDaily = now;
      rq(rqOptions, function (err, response, body) {
        if (err) {
          msg.reply("API Error, check logs");
          console.error(err)
        }
        let parsedBody = {};
        try {
          parsedBody = JSON.parse(body);
        } catch (err) {

        }

        if (!parsedBody.docs) {
          return msg.channel.send("```tex\n" + body + "```");
        }
        const res = JSON.parse(body).docs[0];

        let woowoo = `

Name: ${res.title_english || res.title_native}
Original Name: ${res.title_native}
Episode: ${res.episode}
Season: ${res.season}
Timestamp: 
mal id : ${res.mal_id}
+18 : ${res.is_adult}
API QUOTA ${parsedBody.quota}
`

        let embed = new gear.RichEmbed;
        embed.setTitle(res.title_english || res.title_native);
        embed.setColor('#17c9e0')
        embed.addField("Episode", res.episode, true)
        embed.addField("Timestamp", `${Math.floor(res.at/60)}:${Math.floor(res.at%60)}`, true);
        //embed.addField("Season",res.season,false)

        let escapelink = `https://whatanime.ga/preview.php?anilist_id=${res.anilist_id}&file=${encodeURIComponent(res.filename)}&t=${res.at}&token=${res.tokenthumb}`.replace(/\)/g, "\\)");
        embed.description = `
Original Name: **${res.title_native}**
\\⭐ **[MAL Link](https://myanimelist.net/anime/${res.mal_id})**
\\🎥 **[Scene Preview](${escapelink})**
`
        embed.setImage(`https://whatanime.ga/thumbnail.php?anilist_id=${res.anilist_id}&file=${encodeURIComponent(res.filename)}&t=${res.at}&token=${res.tokenthumb}`)


        msg.reply({
          embed
        })

      });

    });

  }
}

module.exports = {
  cool: 1000,
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'util'
};