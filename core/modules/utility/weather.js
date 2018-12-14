const Canvas = require("canvas");
const weather = require("yahoo-weather");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();
const cmd = "weather";

const init= async function run(msg,target,chan) {
const ISO = require('../../../utils/world_ISO.json');


  
  
args=(msg.content.split(/ +/).slice(1).join(' ')||'melbourne australia').normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
//HELP TRIGGER
P={lngs:msg.lang}
if(gear.autoHelper([mm("helpkey",P),'noargs',''],{cmd,msg,opt:this.cat}))return;
if(args.includes("?"))return gear.autoHelper('force',{cmd,msg,opt:this.cat});
//------------
  
  chan=msg.channel
  
    const canvas = new Canvas.createCanvas(800, 480);
    const ctx = canvas.getContext('2d');

  let se=args
  if(args=='hong kong'||args=='hongkong') se= 'hong kong hk';
  if(args.includes('vatican')) se = 'rome italy';
  
   const info = await weather(se);
  

  
  let finder 
  let finder2  
  let ccodes 
  let inf = {}
  let frame
  let place
  let icon
  
  
  
let yahooCodes=[
  
  "tornado",
"tornado",
"tornado",
"Thunderstorms",
"Thunderstorms",
"snow",
"snow",
"snow",
"snow",
"lightrain",
"snow",
"showers",
"showers",
"storm",
"snow",
"storm",
"snow",
"heavy snow",
"snow",
"wind",
"fog",
"fog",
"fog",
"wind",
"wind",
"flake",
"cloudy",
"night cloudy",
"cloudy",
"night cloudy",
"overcast",
"clear",
"sunny",
"clear",
"sunny",
"snow showers",
"sunny",
"Thunderstorms",
"Thunderstorms",
"Thunderstorms",
"partly cloudy with rain",
"thundersnow",
"snow",
"thundersnow",
"overcast",
"Thunderstorms",
"snow",
"Thunderstorms",
"droplets"  
]
  
frame = await gear.getCanvas(paths.BUILD+"weather/mainframe.png");
   
  
  if(info){
    
    finder = info? info.location? info.location.country : 'none ':'none'
   finder2 = info? info.location? info.location.region : 'none ':'none'
    console.log(finder)
  ccodes = info? ISO.find(c=> c.iso==finder2||c.country==finder ||c.country.includes(finder)) : {iso:'X',country:'X'};
    
    
  ccodes.country = ccodes.country.includes(',')? ccodes.country.split(',')[1]+" "+ccodes.country.split(',')[0]:ccodes.country
inf.status  =   info.item.condition.text
inf.temp    =   info.item.condition.temp
inf.city    =   info.location.city
inf.code    =   info.item.condition.code
    
    if(args.includes('vatican')) {
      inf.city='Vatican City';
      ccodes=ISO.find(c=>c.iso=="VA");
    }
    
inf.iso    =ccodes.iso
inf.country    =   ccodes.country
place = await gear.getCanvas(paths.BUILD+"world/"+ccodes.iso.toLowerCase()+"/512.png");
    

    if(info.location.country=="Brazil"&&info.location.region==" RS"){

        inf.country="República Riograndense"
        inf.iso="RGS"
      place = await gear.getCanvas(paths.BUILD+"weather/eggs/provincia.png");
    }
    
  } 

  
  switch(true){

    case  ['antarctica','antartica','antartida','south pole','polo sul'].includes(args):
      inf={        
        status: "Freezing"  ,
        temp:   (await weather('Ushuaia')).item.condition.temp - 26,
        city: "South Pole",
        country: "Antarctica",
        iso: "UN",
        code: 25
      }
      place = await gear.getCanvas(paths.BUILD+"weather/eggs/southpole.png");
      break;  
      
    case  ['area 51'].includes(args):
      let q=await weather('las vegas');
      inf={        
        status: q.item.condition.text,
        temp:   q.item.condition.temp,
        city: "Area 51",
        country: "United States",
        iso: "US",
        code: "F"
      }
      place = await gear.getCanvas(paths.BUILD+"weather/eggs/area51.png");
      break;  
      
    case  ['atlantis','atlantida'].includes(args):
      let u=await weather('seattle');
      inf={        
        status: "Wet",
        temp:   u.item.condition.temp,
        city: "Atlantis",
        country: "Atlantic Ocean",
        iso: "UN",
        code: 48
      }
      place = await gear.getCanvas(paths.BUILD+"weather/eggs/atlantis.png");
      break;    

      
           }
  let flag = await gear.getCanvas(paths.BUILD+"flags/"+inf.iso+".png");
icon = await gear.getCanvas(paths.BUILD+"weather/icons/"+(yahooCodes[inf.code]||'overcast')+".png");
let sky = await gear.getCanvas(paths.BUILD+"weather/skylines/"+(yahooCodes[inf.code]||'cloudy')+".png");
  
  let whatpol
  let nibok
  switch(true){
      case ["tornado","thunderstorms","storm"].includes((yahooCodes[inf.code]||'default').toLowerCase()):
        whatpol = 'heavyrain';
        break;
    case inf.city =="Nibok":
        inf.city = 'Ni🅱ok'
        whatpol = 'nibok'
        nibok= true;
        break;      
    case Number(inf.temp) > 25:
        whatpol = 'heat'
        break;      
    default:
      whatpol='default'
         }
  
let pollux = await gear.getCanvas(paths.BUILD+"weather/polluxes/"+whatpol+".png");
  
  ctx.drawImage(frame,25,25)
  ctx.globalCompositeOperation='overlay'
  ctx.globalAlpha = 0.5
  ctx.drawImage(sky,385,60)
  ctx.drawImage(place,100,100,300,300)
  ctx.globalCompositeOperation='source-over'
  ctx.globalAlpha = 1
  
  ctx.shadowColor = 'rgba(37, 51, 87, 0.4)';
  ctx.shadowOffsetY = -5;
  ctx.drawImage(pollux,25,25)
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 10;
  
  ctx.drawImage(icon,45,45,130,130)

  let status = await gear.tag(ctx,inf.status,"900 32px 'Whitney HTF'","#fff");
  ctx.drawImage(status.item,180,90)

  let temp = await gear.tag(ctx,inf.temp+"°C","900 110px 'Whitney HTF'","#fff");
  ctx.drawImage(temp.item,65,255)

  let city = await gear.tag(ctx,inf.city,"900 46px 'Whitney HTF'","#fff");
  ctx.drawImage(city.item,70,373)
  
  if (nibok) {
    nibok = await gear.tag(ctx,"🅱","900 46px 'Whitney HTF'","#c00");
    nibo2k = await gear.tag(ctx,"🅱","900 46px 'Whitney HTF'","#fff");
    nibo3k = await gear.tag(ctx,"B","900 40px 'Whitney HTF'","#fff");
    ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
    ctx.drawImage(nibo2k.item,114,380)
    ctx.drawImage(nibok.item,114,380)
    ctx.drawImage(nibo3k.item,125,378)
    ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 10;
  }
  
  let country = await gear.tag(ctx,inf.country,"28px 'Whitney HTF'","#fff");
  ctx.drawImage(country.item,125,428)

  
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 1;
  ctx.drawImage(flag,70,430,45,30)
  
  await chan.send({
                    files: [{
                        attachment: await canvas.toBuffer(),
                        name: "wtt.png"
                    }]
                })
  };

  module.exports = {
     pub:true,
     cmd: cmd,
     perms: 3,
     init: init,
     cat: 'util' 
 };
