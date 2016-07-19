class Player {
  contructor(proto) {
    if (!proto) proto = {};
    this.username = proto.username;
    this.team = proto.team;
    this.avatarDetails = proto.avatar_details;

    this.location = undefined;
  }

  updateLocation(location) {
    this.location = location;
  }
  

}


module.exports = Player;
