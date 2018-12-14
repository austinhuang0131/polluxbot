 const fs = require("fs");
 const gear = require("../core/gearbox.js");
 const paths = require("../core/paths.json");
 const locale = require('./multilang_b');
 const mm = locale.getT();

 exports.run= function (SERVER, AUTHOR) {



     const Server = SERVER
     const Author = AUTHOR;
     const LANG = SERVER.lang;

     const P = {
       lngs: LANG
     }
     const v = {}
     v.newAccOut = mm("event.newAccOut", P)
     v.newServer = mm("event.newServer", P)
     v.newJoin = mm("event.newJoin", P)

     if (Author.id != Server.ownerID) return gear.emoji("nope") + " Server-Owner Only";


     let creation = Author.createdAt.getTime()
     let nowe = Date.now()


     let uMDL = Author.dDATA
     let now = new Date().getTime();
     let day = 86400000
     let servborn = Server.createdTimestamp
     let mejoin = Server.joinedTimestamp
     let thres = 1506842371000

     let WHITELIST = JSON.parse(fs.readFileSync('./eventwhitelist.json'))
     let BLACKLIST = JSON.parse(fs.readFileSync('./eventblacklist.json'))

     if (!WHITELIST.includes(Server.id)) {
       if (thres - mejoin < 0 && Server.members.size < 10) return v.newJoin;
       if (thres - servborn < 0 && Server.members.size < 10) return v.newServer;
     } else if (BLACKLIST.includes(Server.id)) {
       return "BLACKLISTED";
     }

     let x = Math.floor(Server.members.size / 100)
     let comboxes = x > 15 ? 15 : x

     return false;
 }