const gear = require("../../gearbox.js");
const cmd = 'avatar';
const init = async function (message) {
const Target = await gear.getTarget(message);
  console.log(Target)
message.channel.send(Target.displayAvatarURL({format:'png'}))
}
module.exports = {
pub:true,
cmd: cmd,
perms: 3,
init: init,
cat: 'util'
};
