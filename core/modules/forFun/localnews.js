const fs = require("fs");
const Canvas = require("canvas");

const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'localnews';

const init = async function (message) {

  try{
  const canvas = new Canvas.createCanvas(700, 520);
  const ctx = canvas.getContext('2d');

    const headbl = new Canvas.createCanvas(470, 40);
    const ctx2 = headbl.getContext('2d');
    
  const P = {
    lngs: message.lang
  }
    
    let pre = message.content.split(/ +/).slice(1).join(' ')
    let regex = /^(.*[A-z])/
    
    let pre2 = pre.match(regex)[0]
    let spot =pre2.indexOf('http')
    let headline_tx =   spot<0 ? pre2 : pre2.slice(0,spot);

      let img_link    =   spot>-1 ? pre2.slice(spot) : ((message.attachments.first()||{url:false}).url)||(message.mentions.users.first()||message.author).displayAvatarURL({format:'png'});


    
  let newspap = await gear.getCanvas(paths.BUILD+'localman.png');

  let headline = await gear.tag(ctx, headline_tx||"Local Lorem Ipsum Dolor sit amet Consectetur", "900 30px Serif", "#242020");

  let pic = await gear.getCanvas(img_link||paths.BUILD+'localman.png');

    
    
  await ctx.drawImage(newspap, 00, 0);
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.7
    let w = headline.width > 470 ? 470 : headline.width;    
  await ctx2.drawImage(headline.item, 0,0,w,headbl.height);
  await ctx.save()
    
    await ctx.setTransform(1, 0, -Math.tan(0.1321214), 1, 0, 0);
   //                                            % A X Y H W
    

  await ctx.rotate(0.296706)
  await ctx.drawImage(headbl, 170,110 )
    
  await ctx.rotate(-0.296706)
  await ctx.restore()
    //img
  await ctx.save()
    
    
      let new_width = 357
    //let new_height =  pic.width / new_width 

    
      
    let new_height = pic.height/(pic.width/357)
   
    await ctx.setTransform(1, 0, -Math.tan(0.1321214), 1, 0, 0);
    
    
  await ctx.rotate(0.296706)
  await ctx.drawImage(pic, 290,170,357,new_height);

  await ctx.rotate(-0.296706)
    
  await ctx.restore()
    
    //rotate 17 deg >> 0.296706 Rad
    // 100 X 194 Y
    
    pic.width 
    pic.height 
    
  
    

  await message.channel.send({
    files: [{
      attachment: await canvas.toBuffer(),
      name: "localman.png"
                    }]
  })
    
    message.delete()

}catch(e){
  console.error(e)
}
}

module.exports = {
  pub: false,
  cmd: cmd,
  perms: 3,
  init: init,
  cat: 'fun'
};
