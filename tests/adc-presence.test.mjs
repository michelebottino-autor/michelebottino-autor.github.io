import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { Presence } from '../infrastruttura/presenza/worker.js';

const origin = 'https://michelebottino-autor.github.io';
const endpoint = 'https://worker.example/presence';

test('presence routes only a site WebSocket with no query parameters', async () => {
  const requests = [];
  const stub = {fetch: async request => { requests.push(request); return new Response(); }};
  const env = {PRESENCE: {get: name => {assert.equal(name, 'adc-global-live'); return stub;}, idFromName: name => name}};
  const make = (url, headers) => new Request(url, {headers});
  assert.equal((await worker.fetch(make(endpoint, {Origin: 'https://other.example', Upgrade: 'websocket'}), env)).status, 403);
  assert.equal((await worker.fetch(make(endpoint + '?id=value', {Origin: origin, Upgrade: 'websocket'}), env)).status, 404);
  assert.equal((await worker.fetch(make(endpoint, {Origin: origin}), env)).status, 426);
  assert.equal((await worker.fetch(make(endpoint, {Origin: origin, Upgrade: 'websocket'}), env)).status, 200);
  assert.equal(requests.length, 1);
});

test('presence counts open sockets only and never stores a client identifier', () => {
  const messages = [];
  const first = {readyState: 1, send: value => messages.push(JSON.parse(value)), close: code => messages.push(code)};
  const second = {readyState: 1};
  const tracker = new Presence({getWebSockets: () => [first, second]});
  tracker.webSocketMessage(first, 'count');
  second.readyState = 3;
  tracker.webSocketMessage(first, 'count');
  tracker.webSocketMessage(first, 'arbitrary data');
  assert.deepEqual(messages, [{total: 2}, {total: 1}, 1008]);
});
