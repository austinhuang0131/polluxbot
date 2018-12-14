const i2b = require("imageurl-base64");
const gear = require("../../gearbox.js");
const Vision = require('@google-cloud/vision/')

const cmd = 'isloli';
const init = async function (message, userDB, DB) {
if(message.guild.id!=="277391723322408960"&&message.author.id!="88120564400553984")return;

    let args = message.content.split(/ +/).slice(1)[0]
 
    i2b(args, async function (err, img) {
        if (err){
            let nwurl = await gear.getImg(message)
             if (!nwurl) return message.channel.send("INVALID IMAGE URL");
            return i2b(nwurl,(err,b64)=> vere(b64.base64,message))
        }
        vere(img.base64,message)
    });
  
}

function vere(base64,message){
        const vision = Vision({
            projectId: 'grape-spaceship-123',

            keyFilename: './Pollux-b0f6c7eb29f4.json'
        });
        vision.labelDetection({content:base64}).then(async(results) => {
        vision.webDetection({content:base64}).then(async(results2) => {
                res=JSON.stringify(results[0].labelAnnotations).toLowerCase()+JSON.stringify(results2[0].webDetection).toLowerCase()
                
                //const detections = await results[0].fullTextAnnotation.text
          function ll(x){
            return res.includes(x)?true:false
          }
          
          veredict=ll('loli')||(ll('anime')&&ll('girl')&&(ll('young')||ll('child')||ll('cute')))
          
          
          //console.log(results[0])
          //console.log(results[0].labelDetection)
          //console.log(results2[0].webDetection)
                message.channel.send(`LOLI DETECTION BREAKDOWN
Labels:
loli : ${ll('loli')}
underage : ${ll('underage')}
anime : ${ll('anime')}
girl : ${ll('girl')}
child : ${ll('child')}
kid : ${ll('kid')}
young : ${ll('young')}


Veredict: ${veredict}

`)
            })
            .catch((err) => {
                message.channel.send("Error::Too Much Text")
                console.error('ERROR:', err);
            });
            });

    }



module.exports = {
    pub: false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'util'
};
