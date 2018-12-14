const cmd = 'donate';
const gear = require("../../gearbox.js");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const init = function (message,userDB,DB) {

  let a = 'CMD.inviteText'
  let b = {lngs:message.lang}

  let embed = new gear.RichEmbed
  embed.setDescription(" :hearts: **Buy Pollux a cup of tea!** \nContribute with a donation to keep me running and get some sweet perks like <:sapphire:367128894307827712> **Sapphires**, <:loot:339957191027195905> **Lootboxes**, and **exclusive Stickers**!\n Check my [Patreon](https://patreon.com/pollux) or my [Donation Page](https://pollux.fun/donate) !");
  embed.setColor("#ea7d7d")
  embed.setThumbnail("https://cdn.discordapp.com/emojis/482436838523404288.gif")

  message.channel.send({embed})
}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 8,
    init: init,
    cat: 'infra'
};
