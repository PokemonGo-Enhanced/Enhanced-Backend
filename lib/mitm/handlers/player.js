module.exports = mitmServer => {
  mitmServer.addResponseHandler('GetPlayer', (data, action) => {
    data = _.cloneDeep(data);
    var localPlayer = data.local_player;
    if (!localPlayer) {
      return data;
    }

    app.locals.player.updateWithProto(localPlayer);
    console.log('PLAYER COMING THRU');
  });
};
