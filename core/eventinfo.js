const paths = require("../../paths.json");
const gear = require('../../gearbox.js')
const Canvas = require("canvas");
const locale = require('../../../utils/multilang_b'); 
const mm = locale.getT();



function XPercent(x,l,f=0.0427899){
  const exptoNex    = Math.trunc(Math.pow((l + 1) / f, 2));
  const exptoThis   = Math.trunc(Math.pow(l / f, 2));

  const frameofact  = exptoNex - exptoThis;
  const levelcoverage = x-exptoThis
  const percent     = levelcoverage/frameofact;
  return percent;
}



const init= async function run(msg) {
    

  
  async function XChart(size, pcent, colorX,pic,lvthis,tx) {
    const color = TColor(colorX); 
    const pi = Math.PI; 
    let startR = pi * 3 / 2, endR = pToR(pcent) * pi;
    if (pcent == "1") { endR = pi * 7 / 2; }
    const rx = size / 2, ry = rx;
    const canvas_proto = new Canvas.createCanvas(size,size);
    const context = canvas_proto.getContext('2d');
    function TColor(rgbColor) {
        rgbColor = rgbColor.replace(/\s/g, "");
        const arrRGB = new Array(3);
        if (rgbColor.indexOf("rgb") > -1) {
            const colorReg = /\s*\d+,\s*\d+,\s*\d+/i;
            const t = colorReg.exec(rgbColor)[0].split(",");
            for (let i = 0; i < arrRGB.length; i++) {
                arrRGB[i] = t[i];
            }
        }
        else if (rgbColor.indexOf("#") > -1) {
            if (rgbColor.length > 4)//"#fc0,#ffcc00" 
            {
                let j = 1;
                for (let i = 0; i < arrRGB.length; i++) {
                    arrRGB[i] = parseInt(rgbColor.substr((i + j), 2), 16);
                    j += 1;
                }
            } else {
                for (let i = 0; i < arrRGB.length; i++) {
                    const t = rgbColor.substr((i + 1), 1);
                    t = t + t;
                    arrRGB[i] = parseInt(t, 16);
                }
            }
        }
        return arrRGB.join(",") ;
    }
    function pToR(p) {
        const r = (p * 2) % 2 + 1.5;
        if (r >= 0 && r <= 2) return r;
        return Math.abs((2 - r) % 2);
    }
  function arcDraw(r, color) {
        context.beginPath();
        context.arc(rx, ry, r, startR, endR, false);
        context.fillStyle = color;
        context.lineTo(rx, ry);
        context.closePath();
        context.fill();
    }
    canvas_proto.width = canvas_proto.height = size;



    context.beginPath();
    context.arc(rx, ry, rx - 5, 0, pi * 2, true);
    context.strokeStyle = 'rgba(' + color + ',0.25)';
    context.lineWidth = 4;
    context.stroke();
    arcDraw(rx - 0, 'rgba(' + color + ',1)');

    context.beginPath();
    context.arc(rx, ry, rx - 7, 0, pi * 2, false);
    context.fillStyle = 'rgba(255,255,255,1)';
    context.lineTo(rx, ry);
    context.closePath();
    context.fill();
    
    if(pic){
      context.clip();
      let picture = await gear.getCanvas(pic);
      context.drawImage(picture, 0, 0,size,size);
      context.restore()  
    }
    
    context.fillStyle = 'rgba(255,255,255,.5)';
    context.fill();
    context.fillStyle = 'rgba(' + color + ',1)'; ;

    
    
    context.font = "900 14px 'Whitney HTF'";

    const t = (pcent * 100).toFixed(0) + "%";
    let WW =  context.measureText(t+"%").width 
    context.fillText(t, size/2+15-WW/2, size-15);
    
  
    
    let label = await gear.tag(context,tx||v.LEVEL.toUpperCase(),"900 10px WhitneyHTF-Black","#222")
    let tg = await gear.tag(context,lvthis,"900 50px 'Whitney HTF'","#363636")
    
    let f = .8
    let lx = (size/2) - (label.width/2/f)
    let ly = (size/2) - (label.height*1.5)
    let lh=label.height/f
    let lw=label.width/f
    
    let x = (size/2) - (tg.width/2)
    let y = (size/2) - (tg.height/2)
    
    await context.drawImage(label.item,lx,15,lw,lh)
    await context.drawImage(tg.item,x,y,tg.width,tg.height)
    
    return canvas_proto

}
      
    //CHART
  
let propic = msg.author.displayAvatarURL.replace('gif','png')

const userEventData = (msg.author.dDATA.eventThing||{}).wintersummer||false;
const P = {lngs : msg.lang , prefix : msg.prefix}
  
let noRegisEvent = mm("event:wintersummer.joinfirst","You're not yet participating in the event, please use `"+P.prefix+"eventjoin` to join;",P)

const EV = require('./clockwork/wintersummer.js');
const factionKit = EV[EV.userFaction(msg)];
  
if(!factionKit){
  return msg.reply(noRegisEvent);
}
  
  let avatarstatus = await require("./avatarcheck.js").init(msg,{check:"CHECK"});
  let increment;
  
  switch(avatarstatus.status){
    case "OK":
      increment = 100
      break;
    case "OPPOSITE":
      increment = -100      
      break;
    case "ERROR":
      increment = 0
      break;
    default:
      increment = 0
  }
    
    
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        fill = true;
        stroke = false;
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
    
    
  
    
    let canvas= new Canvas.createCanvas (800,600)
    let ctx=canvas.getContext("2d")
    
    let avi = await gear .getCanvas(msg.author.avatarURL || msg.author.defaultAvatarURL);
    
    let globalGoal      = await EV.getGlobalGoal(factionKit.TAG);
    let globalCollect   = await EV.globalCollected(factionKit.TAG);
    let globalContrib   = msg.author.dDATA.eventThing.wintersummer.donated || 0
        
    let personalGoal    = msg.author.dDATA.eventThing.wintersummer.currentGoal || 1000
    let personalContrib = msg.author.dDATA.eventThing.wintersummer.donated || 0
    
    let globalContrib_per   = globalContrib/globalGoal*100 + "%"
    let personalContrib_per   = personalContrib/personalGoal*100 + "%"
    
    
    
    //WIDTH * (AMT/TOTAL)
    
    let globar          = 386    * ( globalCollect / globalGoal ) ||1;
    let bar_g_personal  = globar * ( globalContrib / globalCollect ) ||1;
    let bar_p           = 386    * ( personalContrib / personalGoal ) ||1;
    

    
    
    let mainframe = await gear.getCanvas(EV.directory+"framescore.png");
    let contribGlobal = await gear.tag(ctx,globalContrib_per,"900 28px 'Whitney HTF'","#2d2d34");
    let contribPersonal = await gear.tag(ctx,personalContrib_per,"900 28px 'Whitney HTF'","#2d2d34");
    
    ctx.drawImage(avi,20,16,160,160)
    ctx.drawImage(mainframe,0,0)
    //ctx.drawImage(contribGlobal.item,547,8)
    //ctx.drawImage(contribPersonal.item,547,48)
    //ctx.drawImage(contribPersonal.item,547,48)
    
    ctx.fillStyle = "#44a9ff"
    roundRect(ctx,190,41,globar,8)
    ctx.fillStyle = "#404bd0"
    roundRect(ctx,190,41,bar_g_personal,8)
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
    roundRect(ctx,190,41,globar,3)
    
    ctx.fillStyle = "rgba(66, 124, 255, 0.95)"
    roundRect(ctx,190,80,bar_p,8)
    ctx.fillStyle = msg.author.dDATA.modules.favcolor
    roundRect(ctx,191,81,bar_p-2,6)
 
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
    roundRect(ctx,190,80,bar_p,3)

  
  msg.reply({files:[
      {
        attachment: await canvas.toBuffer(),
        name: "eventcontrib.png"
      }
  ]})

}//end block
  
  
module.exports = {
    pub: false,
    cmd: "income",
    perms: 3,
    init: init,
    cat: 'event',
    cool:10
};
