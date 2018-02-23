const Game = require('../lib/Game');
const board = require('../lib/board');
const serialize = require('serialize-javascript');

let games = {};

module.exports = {
  "monopoly": (params, msg) => {
    parseCommand(params, msg);
  },
  "m": (params, msg) => {
    parseCommand(params, msg);
  }
};

function parseCommand(params, msg) {
  const game = getGame(msg.channel.id);
  switch (params[0]) {
    case "start":
      start(params, msg);
      break;
    case "log":
      msg.reply("check the console.");
      console.log(games);
      break;
    case "join":
      join(params, msg);
      break;
    case "roll":
      roll(params, msg);
      break;
    case "next":
      next(params, msg);
      break;
    case "buy":
      buyProperty(params, msg, game);
      break;
    case "status":
      status(params, msg);
      break;
    case "end":
      games[msg.channel.id] = null;
      console.log(getGame(msg.channel.id));
      msg.channel.send("Deleted Game");
      break;
    default:
      msg.channel.send("I don't understand what you said. Type `:fig monopoly help` for a list of commands.");
      break;
  }
}

function save() {
  
}

function start(params, msg) {
  msg.channel.send("Starting a game of Monopoly...");
  if (!params[1]) {
    msg.reply("You must specify your pawn name. `:fig monopoly start <pawn-name>`");
    return;
  }
  if (games[msg.channel.id] != null || games[msg.channel.id] !== undefined) {
    msg.reply("Uh, oh! There's already a monopoly game on this channel!");
    return;
  }
  msg.channel.send("Type `:fig monopoly join <pawn-name>` to join the game!");
  games[msg.channel.id] = new Game(msg.channel.id, msg.author);
  games[msg.channel.id].addPlayer(msg.author.id, 1500, msg.author, params[1]);
}

function join(params, msg) {
  if (!params[1]) {
    msg.reply("You must specify your piece. `:fig monopoly join <pawn-name>`");
    return;
  }
  let game = getGame(msg.channel.id);
  if (game.started) {
    msg.channel.send("Sorry, the game is already started.");
  }
  if (game) {
    let player = game.getPlayer(msg.author.id);
    if (player) {
      msg.reply("you have already joined.");
    }
    else {
      game.addPlayer(msg.author.id, 1500, msg.author, params[1]);
      msg.reply("you have joined the game.");
      if (!game.firstJoin) {
        msg.channel.send("type `:fig monopoly roll` when everyone has joined.", {reply: game.starter});
        game.firstJoin = true;
      }
    }
  }
  else {
    msg.channel.send("There is no game started on this channel! Type `:fig monopoly start` to start one");
  }
}

function getGame(id) {
  if (games[id] !== undefined && games[id] != null) return games[id];
  else return false;
}

function roll(params, msg) {
  const game = getGame(msg.channel.id);
  noGame(msg, game, () => {
    if (game.playerList.length > 1) {
      isCP(msg, game, () => {
        const player = game.getPlayer(game.currentPlayer);
        if (player.isInSecondPhase) {
          msg.reply("you have already rolled this turn.");
          return;
        }
        game.startGame();
        const roll = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        const total = roll[0] + roll[1];
        msg.reply(`${roll[0]} + ${roll[1]} = *${total}*`);
        player.space = move(total, true, player.space);
        player.isInSecondPhase = true;
        msg.channel.send("You moved your " + player.piece + " to " + board[player.space].name + ".");
        if (!propertyIsOwnedBySomeoneElse(board[player.space].name, game)) {
          msg.channel.send("You can buy this property for $" + board[player.space].price);
        }
        msg.channel.send("What would you like to do?");
      })
    }
    else {
      msg.channel.send("You need more people to join.");
    }
  })
}

function getOptions(type) {
  switch (type) {
    case "property":
      return ""  
  }
}

function move(to, add, pos) {
  if (add) {
    pos += to;
    if (pos >= board.length) pos -= board.length;
    return pos;
  }
  else {
    if (to <= board.length) return to;
    else return false;
  }
}

function status(params, msg) {
  const game = getGame(msg.channel.id);
  noGame(msg, game, () => {
    const player = game.getPlayer(msg.author.id);
    if (player) {
      msg.channel.send(
        "```markdown\nStatus\n------" +
        "\ncash: $" + player.cash +
        "\npawn: " + player.piece +
        "\nspace: " + board[player.space].name +
        "\n```"
      );
    }
  })
}

function next(params, msg) {
  const game = getGame(msg.channel.id);
  noGame(msg, game, () => {
    if (game.playerList.length > 1) {
      isCP(msg, game, player => {
        if (!player.isInSecondPhase) {
          msg.reply("you need to roll first.");
          return;
        }
        player.isInSecondPhase = false;
        game.nextPlayer();
        let cp = game.getPlayer(game.currentPlayer);
        msg.channel.send("it's your turn!", { reply: cp.user });
        msg.channel.send("You are currently at " + board[cp.space].name);
      })
    }
    else {
      msg.channel.send("You need more people to join.");
    }
  })
}

function noGame(m, g, f) {
  if (g) f();
  else m.channel.send("There is no game started on this channel! Type `:fig monopoly start` to start one");
}

function isCP(m, g, f) {
  if (m.author.id === g.currentPlayer) f(g.getPlayer(m.author.id));
  else m.reply("it's not your turn!");
}

function propertyIsOwnedBySomeoneElse(property, game) {
  for (let player of game.playerList) {
    if (game.players[player].properties.indexOf(property) !== -1) {
      return true;
    }
  }
  return false;
}

function aboutProperty(params, msg, game) {

}

function buyProperty(params, msg, game) {
  noGame(msg, game, () => {
    isCP(msg, game, player => {
      if (propertyIsOwnedBySomeoneElse(board[player.space].name, game)) {
        msg.reply("someone already owns this property.");
        return;
      }
      if (player.cash <= board[player.space].price) {
        msg.reply("you do not have enough money to buy this property.");
        return;
      }
      player.properties.push(board[player.space].name);
      player.cash -= board[player.space].price;
      msg.reply("you bought " + board[player.space].name);
      msg.channel.send("You have $" + player.cash + " remaining.");
    })
  })
}
