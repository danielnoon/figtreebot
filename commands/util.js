const secret = Math.round(Math.random() * 10000).toString();
console.log(secret);

module.exports = {
  "ping": (params, msg) => {
    msg.reply("pong");
  },
  "help": (params, msg) => {
    msg.channel.send(`
\`\`\`markdown
Help!
--------------------------------------
So far, there are just a few commands:

* :fig corner  makes the input print horizontally, then vertically, connected at the first letter.
* :fig pyr     print input, shift first letter, repeat
* :fig retard  >PrInTs iNpUt iN ReTaRd sPeAk
* :fig ping    pong.
\`\`\`
    `).then(() => msg.delete())
  },
  [secret]: (params, msg, client) => {
    msg.delete().then(() => {
      client.destroy();
    })
  }
}