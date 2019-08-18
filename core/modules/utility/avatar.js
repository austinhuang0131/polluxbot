const gear = require("../../gearbox.js");
const cmd = 'avatar';
const init = async function (message) {
const Target = await gear.getTarget(message);
  console.log(Target)
message.channel.send(Target.displayAvatarURL()) // Nitro avatars don't work 'cause this
}
module.exports = {
pub:true,
cmd: cmd,
perms: 3,
init: init,
cat: 'util'
};
