class Player {
  contructor(proto = {}, authInfo) {
    this.username = proto.username;
    this.team = proto.team;
    this.avatarDetails = proto.avatar_details;

    this.location = undefined;
    this.authInfo = authInfo;
  }

  updateLocation(location) {
    this.location = location;
    return this;
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
      authInfo: this.authInfo,
    };
  }

}

module.exports = Player;
