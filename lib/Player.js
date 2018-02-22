module.exports = class Player {
  constructor(cash, piece, user) {
    this.cash = cash;
    this.space = 0;
    this.piece = piece;
    this.user = user;
    this.isInSecondPhase = false;
    this.properties = []
  }
}