const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.json");
const Canvas = require("canvas");

const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const eko = require("../../archetypes/ekonomist.js")
const _ASSETS = paths.BUILD + "games/slots/"
const u = require("util")

const cmd = "slots"

const v = {}
module.exports = {
  pub: true,
  cmd: cmd,
  perms: 3,
  cat: 'gambling',
  cool: 4000,

  init: async function run(msg, userDB, DB) {

        
    let helpkey = mm("helpkey", {
      lngs: msg.lang
    })
    if (msg.content.split(" ")[1] == helpkey || msg.content.split(" ")[1] == "?" || msg.content.split(" ")[1] == "help") {
      return gear.usage(cmd, msg, this.cat);
    }
    //------------
    
    
  if(await gear.manageLimits('slots',50,msg.author.dDATA,msg)) return;

    
    const P = {lngs:msg.lang, number :20}
    const M = {lngs:msg.lang, number :2000}
    const X = {lngs:msg.lang, number :msg.author.dDATA.modules.rubines }
    const v = {}
    
    v.noBet   = mm("$.noBet",P)
    v.insuBet = mm("$.insuBet",P)+gear.emoji("rubine")
    v.noFunds = mm("$.noFunds",X)
    v.ceilin        = mm("games.ceilingBet",M).replace("%emj%", gear.emoji("rubine")),
    v.playslots       = mm("games.slots.playslots",P)
    v._minor          = mm("games.slots._minor",P)
    v._mid            = mm("games.slots._mid",P)
    v._major          = mm("games.slots._major",P)
    v.kommunism       = mm("games.slots.kommunism",P)
    v.pollux_jackpot  = mm("games.slots.pollux_jackpot",P)
    v.lucky           = mm("games.slots.lucky",P)
    v.jackpot         = mm("games.slots.jackpot",P)
    v.bonanza         = mm("games.slots.bonanza",P)
    v.potato         = mm("games.slots.potato",P)
        
    v._ultimate = []
    v._ultimate[0]     = mm("games.slots._ultimate_1",P)
    v._ultimate[1]     = mm("games.slots._ultimate_2",P)
    v._ultimate[2]     = mm("games.slots._ultimate_3",P)
    
    v.zero = []
    v.zero[0]          = mm("games.slots.zero_1",P)
    v.zero[1]          = mm("games.slots.zero_2",P)
    v.zero[2]          = mm("games.slots.zero_3",P)

    
    let arg = msg.content.split(/\s/)[1]
    

    
    let bet = arg
    bet = Math.abs(parseInt(arg))
    if(isNaN(Number(arg))) {
      bet = 0;
      msg.channel.send(v.noBet).then(m=>m.delete({timeout:1000}))
    }
    
      
    
    if(bet<20 && bet!=0){
      return msg.channel.send(v.insuBet)
    }
    if(!gear.checkGoods(bet,msg.author)){
      return msg.channel.send(v.noFunds)
    }
    if(bet>2000){
      return msg.channel.send(v.ceilin)
    }
    
    
msg.author.dDATA.modules.exp -= 5;

    //await gear.paramIncrement(msg.author,'rubines',-bet);
    //await gear.paramIncrement(msg.botUser.user,'rubines',bet);
    await eko.pay(bet,msg.author.id, {type: 'gambling'});
await gear.audit(msg.author.id,bet,"gambling_slots","RBN");

    
    let barrels = [0,0,0]
      let rand = gear.randomize(0,999)
      barrels = rand.toString().split("")
for(i=0;i<3;i++){
  barrels[i] = isNaN(Number(barrels[i]))? 0 :Number(barrels[i])
}
    //console.log(barrels)
      let b=barrels
    let xres = `${b[0]}${b[1]}${b[2]}`
      
   let b_res =    rand;
   let res =  Number(b[0]) + Number(b[1]) + Number(b[2]);
    
      
    //let b_res= `${b[0]}${b[1]}${b[2]}`
    
    let finalRes;
    switch (true){
        
      case b_res==999: //triple pollux
        finalRes = 'pollux_jackpot'
        
        break;
      case b_res==888: //triple jackpot
        finalRes = 'jackpot'
        
        break;
      case b_res==777: //lucky seven
        finalRes = 'lucky'
        
        break;
      case b_res==666: //triple rb
        finalRes = 'rubinefest'
        
        break;
      case b_res==555: //triple disc
        finalRes = 'major_prize'
        
        break;
      case b_res==444: //triple bar
        finalRes = 'high_prize'
        
        break;
      case b_res==333: //triple cherry
        finalRes = 'midhi_prize'
        
        break;
      case b_res==222: //triple lemon
        finalRes = 'mid_prize'
        
        break;
      case b_res==111: //potato
        finalRes = 'potato'
        
        break;
      case b_res==000: //kommunist 
        finalRes = 'kommunism'
        
        break;
     case b_res.toString().includes("3"): //cherry any 
        finalRes = 'mid_prize'
        
        break;
      case res > 20: // double pol
        finalRes = 'major_prize'
        
        break;
      case res > 18: // double jackpot
        finalRes = 'high_prize'
        break;
      case res > 16: // double 7
        finalRes = 'midhi_prize'
        break;
        
      case res > 14: // double disc
        finalRes = 'mid_prize'
        break;

      case  res > 12: // double lemon
        finalRes = 'lomid_prize'
        break;
      case  res ==12: // double potato
        finalRes = 'minor_prize'
        break;
      case  res <12 : // double kommu
        finalRes = 'no_prize'
        break;

        }
      
      
    if (res < 16&&
        b[0]!=b[1]&&
        b[1]!=b[2]&&
        b[0]!=b[2]){
          finalRes='no_prize';
        }

    
    let RNG = gear.randomize(0,2)
    
    const prizeType={
                //MULT -  IMG -    PROMPT
pollux_jackpot: [3,    "polluxi"  , v.pollux_jackpot]
,jackpot:       [2.4,  "jackpot"  , v.jackpot]
,lucky:         [2.15, "seven"    , v.lucky]
,rubinefest:    [2,    "bonanza"  , v.bonanza]
,discordia:     [1.8, "discordia", v._ultimate[RNG]]

,major_prize:   [1.5, "congrats", v._major]
,high_prize:    [1.4, "congrats" , v._major]
,midhi_prize:   [1.3, "congrats" , v._mid]
,mid_prize:     [1.2,    "minor"    , v._minor]
,lomid_prize:   [0.9, "minor"    , v._minor]
,minor_prize:   [0.7, "minor"    , v._minor]
    
,potato:        [1.2, "potato"             , v.potato ]
,kommunism:     [3, "komunism"        , v.kommunism ]
,no_prize:      [0, "noprize"          , v.zero[RNG] ]
    }
    
          
    const canvas = new Canvas.createCanvas(440,  330);
    const ctx = canvas.getContext('2d');
    
    
    if (
      finalRes=="pollux_jackpot"||
      finalRes=="jackpot"||
      finalRes=="lucky"||
      finalRes=="rubinefest"||
      finalRes=="kommunism"||
      finalRes=="potato"||
      finalRes=="major_prize"
    ){
      
          const shine = await gear.getCanvas(_ASSETS+"shine.png")
          ctx.drawImage(shine,0,0)
    }
        
      for (let i=0;i<3;i++){
          
        let faceTop = await renderBarrel(b[i]-1);
        let faceMid = await renderBarrel(b[i]);
        let faceBot = await renderBarrel(b[i]+1);
        //console.log(b[i]-1)
        //console.log(b[i])
        //console.log(b[i]+1)
    
        await ctx.drawImage(faceTop,54+(116*i),70+0,100,50);
        await ctx.drawImage(faceMid,54+(116*i),70+50,100,100);
        await ctx.drawImage(faceBot,54+(116*i),70+150,100,50);
     
      }
    
        
    const mainframe = await gear.getCanvas(_ASSETS+"mainframe.png");
    ctx.drawImage(mainframe,0,0)
      
    

    let multiplier = prizeType[finalRes][0]
    let px = await gear.getCanvas(_ASSETS+prizeType[finalRes][1]+".png")
    
    await ctx.drawImage(px,0,0);
    
    //gear.paramIncrement(msg.author,'rubines',-bet)
    //gear.paramIncrement(msg.author,'expenses.gambling',-bet)
    
    
    
    let payback = Math.ceil(bet * multiplier)
    
    if (payback > 0){
      
    
    if(finalRes=="kommunism" && bet){
      
        payback = Math.ceil(bet*3 / 10)
      if(msg.guild.members.size>10){
        payback = Math.ceil(bet*3 / msg.guild.members.size)

        let xpg = msg.guild.members.random(10)
        xpg.forEach(async x=>{
              await eko.receive(payback,msg.author.id, {type: 'comunism'});
          await gear.audit(msg.author.id,payback,"gambling_slots","RBN","+");
          
        })
      }
      
    }
    
              //await gear.paramIncrement(msg.author,'rubines',payback);
              //await gear.paramIncrement(msg.botUser.user,'rubines',-payback);
              await eko.receive(payback,msg.author.id, {type: 'gambling'});
      await gear.audit(msg.author.id,payback,"gambling_slots","RBN","+");
    
    }
    
    
    P.$ = "test"//payback || 0
        
        let intro = mm("games.slots.takePrize",P)
                      .replace("%$%",payback)
                      .replace("%emj%", gear.emoji("rubine"))
        
        let outro = prizeType[finalRes][2]
    
    let takePrize = `${payback !=0 ? intro+", " :""}${outro}`
                    
    
    
     await msg.channel.send({files:[canvas.toBuffer()]})
     if(bet > 0)msg.channel.send(takePrize)
    //msg.channel.send(b[0]+b[1]+b[2])
    
    

    
    
     async function renderBarrel(br){
      
        if(br < 0) br = 9;
        if(br >= 10) br = 0;
         
         //console.log(_ASSETS+br);
      
        let barrl_img = await gear.getCanvas(_ASSETS+br+".png");
        
        return barrl_img;
    
    }
    
    
 
    

  


  }
}