// Conta connessioni WebSocket attive. Nessun identificativo applicativo o archivio.
const SITE = 'https://michelebottino-autor.github.io';
const SOCKET_LIMIT = 5000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/presence' || url.search) return new Response(null, {status: 404});
    if (request.headers.get('Origin') !== SITE) return new Response(null, {status: 403});
    if (request.method !== 'GET' || request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response(null, {status: 426});
    }
    const stub = env.PRESENCE.get(env.PRESENCE.idFromName('adc-global-live'));
    return stub.fetch(request);
  }
};

export class Presence {
  constructor(ctx) {
    this.ctx = ctx;
  }

  sockets() {
    return this.ctx.getWebSockets().filter(socket => socket.readyState === 1);
  }

  async fetch() {
    if (this.sockets().length >= SOCKET_LIMIT) return new Response(null, {status: 503});
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    this.sendCount(server);
    return new Response(null, {status: 101, webSocket: client});
  }

  webSocketClose(socket) {
    socket.close(1000);
  }

  webSocketError(socket) {
    socket.close(1011);
  }

  sendCount(socket) {
    socket.send(JSON.stringify({total: this.sockets().length}));
  }

  webSocketMessage(socket, message) {
    if (message !== 'count') {
      socket.close(1008, 'Unsupported message');
      return;
    }
    this.sendCount(socket);
  }
}
