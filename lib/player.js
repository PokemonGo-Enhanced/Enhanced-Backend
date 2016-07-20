class Player {
  contructor(proto, authInfo) {
    if (!proto) proto = {};
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
  

}


module.exports = Player;
