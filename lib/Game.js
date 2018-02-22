const Player = require('./Player');

module.exports = class Game {
  constructor(id, starter) {
    this.id = id;
    this.players = {};
    this.playerList = [];
    this.started = false;
    this.firstJoin = false;
    this.starter = starter;
    this.currentPlayer = starter.id;
  }

  addPlayer(id, cash, user, piece) {
    this.players[id] = new Player(cash, piece, user);
    this.playerList.push(id);
  }

  startGame(msg) {
    this.started = true;
  }

  getPlayer(id) {
    return this.players[id] || false;
  }

  nextPlayer() {
    const currentIndex = this.playerList.indexOf(this.currentPlayer);
    this.currentPlayer = this.playerList[currentIndex + 1] ?
      this.playerList[currentIndex + 1] :
      this.playerList[0];
  }
}