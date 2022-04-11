import { Net } from "electron";

/*
 * @Author: your name
 * @Date: 2022-03-21 16:28:06
 * @LastEditTime: 2022-04-11 12:52:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\stream.ts
 */
import stream from "stream";
import { Socket } from "net";

export class ServerBroadcastStream extends stream.Duplex {
  _sockets:Socket[]
  constructor() {
    super();
    this._sockets = [];
  }
  addSocket(socket:Socket) {
    socket.on("data", (chunk) => {
      if (!this.push(chunk)) {
        socket.pause();
      }
    });
    this._sockets.forEach((one:Socket) => {
      one.pipe(socket);
      socket.pipe(one);
    });
    this._sockets.push(socket);
  }
  removeSocket(socket:Socket) {
    let index = this._sockets.findIndex((one:Socket)=>one===socket);
    this._sockets.splice(index, 1);
    this._sockets.forEach((one:Socket) => {
      one.unpipe(socket);
      socket.unpipe(one);
    });
  }
  findSocket(ip:string) {
    return this._sockets.find((one:Socket) => one.localAddress === ip);
  }
}