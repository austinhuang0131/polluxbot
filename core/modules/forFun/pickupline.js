const gear = require('../../gearbox.js');
const init = function (message) {
 
let arg = message.content.split(/ +/).slice(1).join(' ');
 
let MEMBER = message.member.displayName;
let stuff = [
"Did it hurt when you fell from the vending machine? 'Cause you lookin like a SNACC"
,"Are you Luke? 'Cause I'm your Daddy ;)"
,"Your mom must be chicken cause you look eggcellent!"
,"If you were a flower you’d be a damnnndelion"
,"Your to-do list: Me"
,"You are almost as hot as my mom"
,"Your body is 75% water, and I’m thirsty"
,"You make me wish I weren’t gay"
,"You MUST have a nice personality"
,"I wish I was your derivative so I could lie tangent to your curves"
,"I'm a muggle on the streets but a wizard in the sheets"
,"You're hotter than the bottom of my laptop"
,"I know Halloween is over, but do you wanna be my boo?"
,"If you were a fruit, you'd be a FINEapple. If you were a vegetable, I'd visit you in the hospital every day."
,"Tonight, let's not leave room for Jesus between us"
,"Do you have any raisins? How about a date?"
,"Was your ass forged by Sauron? 'Cause it looks precious"
,"If I were to ask you out on a date, would your answer be the same as the answer to this question?"
,"If it’s true that we are what we eat, then I could be you by tomorrow morning."
,"Do you know what my shirt is made of? Boyfriend material."
,"If you were a Transformer, you'd be Optimus Fine"
,"If you were a phaser on Star Trek, you'd be set to stun"
,"Hey, my name's Windows. Can I crash at your place tonight?"
,"If you were a burger at McDonald's, you'd be named the McGorgeous"
,"If you were a chicken, you'd be impeccable"
]

 let rand = gear.randomize(0, stuff.length - 1);
 stuff = gear.shuffle(stuff)
 stuff = gear.shuffle(stuff)
 let thing =stuff[rand] 
 let m;
 

 message.channel.send(thing)

};
module.exports = {
 cool: 1000,
 pub: true,
 cmd: 'pickupline',
 perms: 3,
 init: init,
 cat: 'fun'
};