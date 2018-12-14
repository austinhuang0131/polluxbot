


const gear = require("../../gearbox.js");
const cmd = 'paspalho';



const init = function (message, userDB, DB) {
  if(gear.randomize(1,19)==10){
      message.channel.messages.fetch({before: message.id, limit: 1}).then(async mcl=>{
     mcl.first().react("🅿");
    await gear.wait(2)
    mcl.first().react("🇦");
    await gear.wait(2)
    mcl.first().react("🇸");
    await gear.wait(2)
    mcl.first().react("5⃣");
    await gear.wait(2)
    mcl.first().react("🅰");
    await gear.wait(2)
    mcl.first().react("🇷");
    await gear.wait(2)
    mcl.first().react("🔼");
    await gear.wait(2)
    mcl.first().react("🇱");
    await gear.wait(2)
    mcl.first().react("🇭");
    await gear.wait(2)
    mcl.first().react("🇴");
  })
    return;
  }
  
  message.channel.messages.fetch({before: message.id, limit: 1}).then(async mcl=>{
     mcl.first().react("🅿");
    await gear.wait(.8)
    mcl.first().react("🇦");
    await gear.wait(.8)
    mcl.first().react("🇸");
    await gear.wait(.7)
    mcl.first().react("🇵");
    await gear.wait(.7)
    mcl.first().react("🅰");
    await gear.wait(.6)
    mcl.first().react("🇱");
    await gear.wait(.6)
    mcl.first().react("🇭");
    await gear.wait(.5)
    mcl.first().react("🇴");
  })
    

  
     

};

module.exports = {
    cmd: cmd,
    perms: 5,
    init: init,
    cat: 'fun'
};
