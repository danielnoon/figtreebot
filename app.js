const Discord = require('discord.js');
const client = new Discord.Client();
const fun = require('./commands/funtext');
const util = require('./commands/util');
const monopoly = require('./commands/monopoly');

const commands = {
  ...fun,
  ...util,
  ...monopoly
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let commandArr = msg.content.split(" ");
  if (commandArr.shift() === ':fig') {
    let command = commandArr.shift();
    if (commands[command]) {
      commands[command](commandArr, msg, client);
    }
    else {
      msg.channel.send("Sorry, I don't know what you mean by that. Type `:fig help` for help.")
    }
  }
  let lcMessage = msg.content.toLowerCase().split(" ");
  if (lcMessage.indexOf("thank") != -1 && lcMessage.indexOf("you") - lcMessage.indexOf("thank") == 1) {
    msg.reply("No, thank *you*.");
  }
});

client.login('NDE1NzA4ODUxMTk1ODcxMjMy.DW54mA.wouvd2AlEZ55wZP1DVvIe3-7jO4');

// app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
