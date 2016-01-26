# ws-session

# Don't donwload it now, it work currently with **ws-sessions***. Now it in progress.
=====================================================================================

#### **Install**
```
npm install ws-session --save
```
#### **Usage**
#### Connect to server
```
import connect from "ws-session"

let connection = connect("ws://localhost:5000")
```
It return an instance of Web Socket connection.
#### Connected
```
let { connected } = connection

connected(() => {
  // ...
})
```
It can be used when you socket is connected.
#### Send message
```
let { send } = connection

send("to-server", "hello")
```
Send message to **ws-sessions** server.
Supports all data what can be parsed to json:
```
send("to-server", { foo })
```
If you want send an message immediately after your application is started:
```
connected(() => {
  send("user.check", {
    id,
    token
  })
})
```
#### Subscribe
```
let { subscribe } = connection

subscribe("from-server", (data) => {
  // ...
})
```
Subscribe to **ws-sockets** server messages.
It return an **unsubscribe** function for remove subscribe:
```
let unsubscribe = subscribe("from-server", (data) => {
  // ...
})

unsubscribe() // don't subscribe any more
```
Also if you want subscribe to message once, you can use **subscribeOnce** method:
```
let { subscribe, subscribeOnce } = connection

let unsubscribe = subscribe("from-server", (data) => {
  // ...
  unsubscribe()
})

subscribeOnce("from-server", (data) => {
  // ...
})
```
Is the same.
#### Other things
```
let { sessionId } = connection

console.log(sessionId) // current session id
```
Current sessions identifier, is same for all tabs in current browser.
```
const { webSocket } = connection

webSocket.send("Send manually")
```
If you need do some other things what are not included, use **webSocket**. Is pure WebSocket instance.