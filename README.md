# bilibili-Vtuber-danmaku

Vtuber直播间的弹幕哟

### JSON

```javascript
const { rooms, records, roomsRecords, read } = require('./json')
// 以上全部都是async/Promise
```

#### rooms()

返回Array, 内容是房间列表

```javascript
rooms()
// [
//   "10143",
//   "10209381",
//   "102153",
//   ...
// ]
```

#### records(roomid)

* roomid: 房间号

返回Array, 内容是该房间所有记录的目录

```javascript
records(12235923)
// [
//   '2019-5-10', '2019-5-11',
//   '2019-5-12', '2019-5-13',
//   '2019-5-14', '2019-5-15',
//   ...
// ]
```

#### roomsRecords()

返回Object, 内容是所有房间以及房间目录, rooms+records

```javascript
roomsRecords(12235923)
// {
//   '10143': [
//     '2019-5-17',
//     '2019-5-20',
//     '2019-5-27',
//     '2019-5-29',
//     '2019-5-30',
//     '2019-5-31'
//   ],
//   '10317': [ '2019-5-31', '2019-6-1' ],
//   '14893': [
//     '2019-5-10', '2019-5-11',
//     '2019-5-12', '2019-5-13',
//     '2019-5-14', '2019-5-15',
//     ...
// }
```

#### read(roomid, date)

* roomid: 房间号
* date: 年-月-日

读取TXT并进行一些分析

```javascript
read(12235923, '2019-6-4')
// {
//   danmaku: [
//     { time: 0, mid: 14501198, text: '挤进去打哭她' },
//     { time: 0, mid: 9175795, text: '草，根本挤不进去' },
//     { time: 0, mid: 13586622, text: 'foooooooo' },
//     ...
//   ],
//   raw: ...
//   speakers: {
//     '2514': { speakerNum: 1, uname: 'lostsoul' },
//     '4955': { speakerNum: 55, uname: '纱布丁' },
//     '35712': { speakerNum: 8, uname: 'aLIE_w' },
//     ...
//   },
//   online: [
//     1, 1, 1,
//     1, 1, 1,
//     ...
//   ],
//   speakerNum: 140
// }
```

其中数据的意思:

* danmaku: Array, 文档中的所有弹幕
  * time: 单位分钟, 从今天0:0算起发送弹幕的时间
  * mid: 发送者mid
  * text: 弹幕文本
  * timestamp: 精确到毫秒的时间戳
* speakers: Object, 发过弹幕的人, Key=mid
  * speakerNum: 发了几条弹幕
  * uname: 用户名
* online: Array, 长度为 1440, 记录每分钟的人气, 没开播时为1
* speakerNum: 总发言人数, 其实是 `Object.keys(speakers).length`
* raw: txt的文本

### Socket.io

https://api.vtbs.moe/vds

```javascript
const io = require('socket.io-client')
const socket = io('https://api.vtbs.moe/vds')
```

#### 订阅 (join)

```javascript
socket.emit('join', roomid) // 订阅特定房间
socket.emit('join', 'all')  // 订阅所有房间 
```

#### 取消订阅 (leave)

```javascript
socket.emit('leave', roomid) // 取消订阅特定房间
socket.emit('leave', 'all')  // 取消订阅所有房间 
```

注意：订阅了一部分房间之后取消订阅 `all` 并不会取消所有房间，只会取消之前订阅的 `all`。

#### 弹幕事件

```javascript
socket.on('danmaku', console.log)
// {message: "233", roomid: 12235923, mid: 3499295}
```

### Raw:TXT格式

#### 弹幕

纯文本，记录发送者信息

`[timestamp]:[mid]:[text]`

#### 时间戳

`TIME[x:x]ONLINE[number]`

如 `TIME2:3ONLINE397`: 凌晨2:3, 人气397

#### 发送人数统计

每天结束时在文件结尾统计`SPEAKERNUM[x];[mid]:[uname]:[x], ...`

