const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = 'joined';

const init = function (message) {
  const Server = message.guild;
  const Target = message.mentions.members.first() || message.member;
  const LANG = message.lang;

  //HELP TRIGGER
  let helpkey = mm("helpkey", {
    lngs: message.lang
  })
  if (message.content.split(/ +/)[1] == helpkey || message.content.split(/ +/)[1] == "?" || message.content.split(/ +/)[1] == "help") {
    return gear.usage(cmd, message, this.cat);
  }
  //------------
  let join = Server.member(Target).joinedAt
  let datestamp = `${join.getDate()}-${join.getMonth()+1}-${join.getFullYear()} : ${join.toLocaleTimeString()}`;

  console.log(datestamp)

  message.reply(mm('misc.memberSince', {
    lngs: LANG,
    target: Target.username,
    joinedstamp: datestamp
  }))
};

module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'misc'
};