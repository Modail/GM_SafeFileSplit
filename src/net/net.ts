/*
 * @Author: your name
 * @Date: 2022-03-21 16:27:55
 * @LastEditTime: 2022-04-10 17:57:23
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
    broadcastStream.emit("check","server");
    broadcastStream.addSocket(client);
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
    let conn:Socket;
    for(let port =650;port<660;port++){
         conn= net.createConnection({host,port});
    }
   conn.once("data",(check)=>{
       if(check.toString() !=="sever"){
          conn.end();
       }
   })
   conn.on("end",()=>{
       conn.destroy();
       conn.unref();
   })
   return conn;
}