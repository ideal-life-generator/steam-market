# ws-session

## *Don't donwload it now, it work currently with ws-sessions. Now it in progress.*

Simple realization of Web Socket connection with session id.

## Installation

```bash
$ npm install ws-session
```

## Example

```js
import connect from "ws-session"

const { connected, subscribe, send } = connect("ws://localhost:5000")

connected(() => {
  send("greeting", "hi")
})

sibscribe("response", (data) => {
  send("present", "I'm a node.js developer.")
})
```

## Usage

Firstly you must initialize connection to the server:

#### connect(url)

```js
const { connected, send, subscribe, subscribeOnce, sessionId, webSocket } = connect("ws://localhost:5000")
```

Is returns easy functionality to communicate with server, which is described in detail below.

## API

#### connected(callback)

```js
connected(() => {
  // ...
})
```

Callback invoked when a connection is ready.

Must be used if you want to send a message as soon as the application is running:

```js
connected(() => {
  send("user.check", { id, token })
})
```

#### send(event, data...)

```js
send("user.update", user)
```

Send message to the server.

#### subscribe(event, callback)

```js
subscribe("user.updated", (user) => {
  // ...
})
```

Subscribe to an event from the server.

Returns a function to unsubscribe:

```js
const unsubscribe = subscribe("settings.default-language", (language) => {
  // ...
  unsubscribe()
})
```

#### subscribeOnce(event, callback)

```js
subscribeOnce("settings.default-language", (language) => {
  // ...
})
```

Сan be used if you want to subscribe to an event once.

#### sessionId

The session identifier. It is used by the server to communicate with all connections.

#### webSocket

Pure Web Socket instance used in the current connection.


## If the plugin is good

MasterCard: 5300-7211-1281-6316