const Discord = require("discord.js");
const client = new Discord.Client();
// const express = require('express');
// const app = express();

const people = [
  "Sam",
  "Zach",
  "Daniel",
  "Jack Moore",
  "Christiaan",
  "Beni"
]

const commands = {
  "pyr": (params, msg) => {
    msg.channel.send((s => {
      let a = s.split("").map((d, i) => {
        let c = "";
        for (let j = i; j < s.length; j++) c += s[j];
        return c;
      })
      return a.join("\n");
    })(params.join(" "))).then(() => msg.delete());
  },
  "corner": (params, msg) => {
    msg.channel.send((x => x.split("").map((a, b) => ((b == 0) ? x + "\n" : a + "\n")).join(""))(params.join(" "))).then(() => msg.delete());
  },
  "retard": (params, msg) => {
    if (params.length != 0) {
      msg.channel.send((s => ">" + s.split("").map((d, i) => i % 2 ? d.toLowerCase() : d.toUpperCase()).join(""))(params.join(" "))).then(() => msg.delete())
    }
    else {
      let rand = Math.floor(Math.random() * (people.length - 1));
      msg.reply(people[rand] + " is a retard.");
    }
  },
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
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let commandArr = msg.content.split(" ");
  if (commandArr.shift() === ':fig') {
    let command = commandArr.shift();
    if (commands[command]) {
      commands[command](commandArr, msg);
    }
  }
});

client.login('NDE1NzA4ODUxMTk1ODcxMjMy.DW54mA.wouvd2AlEZ55wZP1DVvIe3-7jO4');

// app.get('/', (req, res) => res.send("<a href='/auth'>woop</a>"));
// app.get('/auth', (req, res) => res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=415708851195871232&permissions=204729410&scope=bot"));

// app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
