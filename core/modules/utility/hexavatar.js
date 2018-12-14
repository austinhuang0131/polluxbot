const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Pixly = require("pixel-util");
const Canvas = require("canvas");
const locale = require('../../../utils/multilang_b'); 
const mm = locale.getT();
const arraySort = require("array-sort")
const DB=gear.serverDB;
const userDB=gear.userDB;

  var line = 0;


function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}


const init= async function run(msg) {
  

  try{
  
let propic = msg.author.displayAvatarURL({format:'png',size:512}).replace(/(gif|webp)/g,'png')
  
  async function Hex(size,picture) {
    let globalOffset = 0
    size = size/2
    let x  = size+10
    let y=  -size
    
    let cw=size
    let ch=size

    
    let hex= new Canvas.createCanvas (size*2+20,size*2+20)
    let c=hex.getContext("2d")
    


    c.rotate(1.5708)
    c.save();
    c.beginPath();
    c.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (side=0; side < 7; side++) {
      c.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
    }

     c.fillStyle = "rgb(248, 248, 248)";
    c.fill();    
 if(picture){
    c.clip();
    let a = await gear.getCanvas(picture);
      c.rotate(-1.5708)
      c.drawImage(a, 0, x-size,size*2,size*2);
   
      c.restore()  
   
    
   
c.globalCompositeOperation='xor';

c.shadowOffsetX = 0;
c.shadowOffsetY = 0;
c.shadowBlur = 10;
c.shadowColor = 'rgba(30,30,30,1)';

c.beginPath();
  for (side=0; side < 7; side++) {
      c.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
    }
c.stroke();
c.stroke();
c.stroke();

c.globalCompositeOperation='destination-atop';
   
  
 }else{
    c.shadowColor = "rgba(34, 31, 39, 0.77)"
    c.shadowBlur = 10

 }
       c.fill();    


    
    return hex;
    
  } 
    
    
    
  
    
    
  let x= await Hex(500,propic);
       
    let heax= new Canvas.createCanvas (500,500)
    let ca=heax.getContext("2d")
    
    
let taa = await gear.tag(ca,"Pollux Hex Generator\nwww.pollux.fun/invite","900 10px 'Whitney HTF'","#fff");
await ca.drawImage(x,10 ,0,500,500);
await ca.drawImage(taa.item,0,0);

   await msg.channel.send({
                    files: [{
                        attachment: await heax.toBuffer(),
                        name: "hex.png"
                    }]
                })

  }catch(e){
    console.error(e)
  }

}//end block
  
  
module.exports = {
    pub: false,
    cmd: "profile",
    perms: 3,
    init: init,
    cat: 'social',
    cool:800
};
