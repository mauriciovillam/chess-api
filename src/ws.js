const { getGameById, updateMultiplayerGameById } = require('./services/game.service');

const registerWebSocketRoutes = (app) => {
  const webSockets = [];

  app.ws('/ws/:gameId', async function (ws, req) {
    const identifier = req.params.gameId;
    if (!webSockets[req.params.gameId]) {
      webSockets[identifier] = [];
    }

    webSockets[identifier].push(ws);

    ws.on('message', async (msg) => {
      const data = JSON.parse(msg);
      if (!data || !data.move) {
        return;
      }

      const game = await getGameById(identifier);
      if (!game) {
        ws.send(JSON.stringify({ error: 'The game ID was not found in the database.' }));
        return;
      }

      if (game.mode === 'LOCAL') {
        ws.send(JSON.stringify({ error: 'This is a local game and can not be used with WebSockets.' }));
        return;
      }

      const board = game.chessBoard;
      if (!board.move(data.move)) {
        ws.send(JSON.stringify({ error: 'The move is not valid or illegal.' }));
        return;
      }

      await updateMultiplayerGameById(identifier, { pgn: board.pgn() });

      webSockets[identifier].forEach((socket) => {
        if (socket !== ws) {
          socket.send(
            JSON.stringify({
              move: data.move,
            })
          );
        }
      });
    });
  });
};

module.exports = registerWebSocketRoutes;
