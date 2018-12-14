const cmd = 'ping';
const init = function (message) {
    const start = Date.now();
    message.channel.send("pongster").then(sendedMessage => {
        const stop = Date.now();
        const diff = (stop - start);
        sendedMessage.edit(`pongster \`${diff}ms\``);
    });
};
module.exports = {cool:800,pub:false,cmd: cmd, perms: 3, init: init, cat: 'infra'};
