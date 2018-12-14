const gear = require('../core/gearbox.js'),
async = require('async');

module.exports = {
  run: async function run(bot,error) {
     process.exit(1);
    
      let embed = new gear.RichEmbed
  embed.setDescription(`
**SHARD: ${process.env.SHARD}"**
ERROR: ${error}

`);
  gear.wait(Number(process.env.SHARD)).then(w=>{
    
  gear.auxHook.send(embed)
  })
  }
}
