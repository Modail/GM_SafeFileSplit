/*
 * @Author: your name
 * @Date: 2022-03-21 16:27:55
 * @LastEditTime: 2022-04-11 18:33:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\net.ts
 */
import net from "net";
import { Socket } from "net";
import { ServerBroadcastStream } from "./stream";
import { getIPAddress } from "../utils/utils";
export function createServer(){
    const broadcastStream =new ServerBroadcastStream();
    const localhost =getIPAddress();
    const server =net.createServer((client)=>{
    //加校验步骤
   // broadcastStream.emit("check","server");
    broadcastStream.addSocket(client);
    broadcastStream.emit("add new client","server");
    client.on("end",()=>{
        broadcastStream.removeSocket(client)
    })
    })
    //这里有问题
    server.listen({ port: 655, host: localhost}, () => {
        broadcastStream.emit("startServer",server.address());
      });
    return {
        broadcastStream,
        server
    }
}

export function createConnection(host:string){
    let conn= net.createConnection({host,port:655});
   conn.once("data",(check)=>{
       if(check.toString() !=="sever"){
          conn.end();
       }
       console.log(check)
   })
   conn.on("end",()=>{
       conn.destroy();
       conn.unref();
   })
   conn.on("timeout",()=>{
    conn.destroy();
    conn.unref();
   })
   return conn;
}