// Originally Player class was to be extended to a multi-player setup.
// I don't like how it worked though, how functional stuff was kept with user info
// For now, Player will just be a data wrapper
class Player {
  contructor(proto = {}, authInfo) {
    this.username = proto.username;
    this.team = proto.team;
    this.avatarDetails = proto.avatar_details;
  }

  updateWithProto(proto) {
    this.username = proto.username;
    this.team = proto.team;
    this.avatarDetails = proto.avatar_details;
    return this;
  }

  toJSON() {
    return {
      username: this.username,
      team: this.team,
      avatar_details: this.avatarDetails,
    };
  }

}

module.exports = Player;
