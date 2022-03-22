/*
 * @Author: your name
 * @Date: 2022-03-21 16:27:55
 * @LastEditTime: 2022-03-22 09:02:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\net.ts
 */
import net from "net";
import { ServerBroadcastStream } from "./stream";

export function createServer(){
    const broadcastStream =new ServerBroadcastStream();
    const server =net.createServer((client)=>{
    //加校验步骤
    broadcastStream.emit("check","server");
    broadcastStream.addSocket(client);
    client.on("end",()=>{
        broadcastStream.removeSocket(client)
    })
    })
    server.listen({ port: 0, host: "0.0.0.0" }, () => {
        //broadcastStream.emit("startServer");
      });
    return {
        broadcastStream,
        server
    }
}

export function createConnection({host,port}:{host:string,port:number}){
   const conn= net.createConnection({host,port});
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