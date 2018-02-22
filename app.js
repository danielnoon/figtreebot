const Discord = require('discord.js');
const client = new Discord.Client();
const fun = require('./commands/funtext');
const util = require('./commands/util');

const commands = {
  ...fun,
  ...util
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
  }
});

client.login('NDE1NzA4ODUxMTk1ODcxMjMy.DW54mA.wouvd2AlEZ55wZP1DVvIe3-7jO4');

// app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
