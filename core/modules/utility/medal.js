var cmd = 'medal';
const paths = require("../../paths.json");
const gear = require("../../gearbox.js");
var fs=require('fs')

var init = async function (message) {

let args = message.content.split(/\s+/)[1]
try{
  
const  embed= new gear.RichEmbed



let medals = await gear.cosmetics.medals();
  
  
  console.medals 
  console.log('b')
  console.log('b')

if (!args){
  args=medals[gear.randomize(0,medals.length-1)].icon;
  embed.setFooter("Random Medal");
  }
let thismed = medals.filter(m=>m.icon==args) 

embed.setThumbnail("http://www.pollux.fun/medals/"+args+".png")
embed.setColor("#f585e4")
embed.setDescription("MEDAL INFORMATION for **"+(thismed[0]||{name:"."}).name+"**")  

  let ye=gear.emoji("yep")
  let na=gear.emoji("nope")
  
const rars = {
  C: gear.emoji("C")+" Common"
  ,U: gear.emoji("U")+" Uncommon"
  ,R: gear.emoji("R")+" Rare"
  ,SR: gear.emoji("SR")+" Super Rare"
  ,UR: gear.emoji("UR")+" Ultra Rare"
}  
const chart = {
  C: 500
  ,U: 1250
  ,R: 2500
  ,SR: 5000
  ,UR: 12500
}  
  
embed.addField("ID","`"+thismed[0].icon+"`",true)
embed.addField("Rarity",rars[thismed[0].rarity],true)
embed.addField("Droppable?",thismed[0].droppable==true?ye:na,true)
embed.addField("Buyable?",thismed[0].buyable==true?ye:na,true)
embed.addField("Category",":open_file_folder: `"+thismed[0].category+"`",true)
embed.addField(":label: Tags","```"+thismed[0].tags+"```",true)
embed.addBlankField(true)
embed.addField("Price",thismed[0].buyable==true?chart[thismed[0].rarity]+gear.emoji("rubine"):":x:",true)
embed.setFooter('http://pollux.fun/medalshop')  
message.channel.send({embed}).catch(e=>{
  message.channel.send("No such medal in database")
  
})

}catch(e){
  message.channel.send(gear.emoji('nope')+"**ERROR**")
  console.error(e)
}
    }

 module.exports = {pub:true,cmd: cmd, perms: 3, init: init, cat: 'infra'};
