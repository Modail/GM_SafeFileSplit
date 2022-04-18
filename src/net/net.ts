/*
 * @Author: your name
 * @Date: 2022-03-21 16:27:55
 * @LastEditTime: 2022-04-18 22:56:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\net.ts
 */

import { WebSocketServer,WebSocket } from "ws";
import {broadcast} from "./stream";

export class User{
    id:string
    nikename:string
    socket:any
}

export class ClientDataJSON{
    id:string
    nikename:string
    postlist:string[]
    files:(string|Buffer)[][]
}
//场景使用websocket更为合适
export function createServer(){
    let users:User[]=[];
    let server=new WebSocketServer({port:655});
    server.on("connection",(client)=>{
          client.on("message",(data)=>{
            //   data:{
            //       Id,nikename,postlist,files
            //   }
            let dataJson=JSON.parse(data.toString());
            if(!users.length){
                //初始化新建user
                let user=new User();
                user.id=dataJson.id;
                user.nikename=dataJson.nikename;
                user.socket=client;
                users.push(user);
            }else{
                let index=users.findIndex((one)=>one.id===dataJson.id);
                if(index===-1){
                    //不存在则新建user
                    let user=new User();
                    user.id=dataJson.id;
                    user.nikename=dataJson.nikename;
                    user.socket=client;
                    users.push(user);
                }
            }
            //postdata
            broadcast(dataJson,users);
        })
          client.on("close",()=>{
              //重新渲染用户列表
              let leaveClientIndex= users.findIndex((one)=>one.socket===this);
              users.splice(leaveClientIndex,1);
              broadcast({id:"",nikename:"",postlist:[],files:[]},users)
          })
    })
    server.once("error",(err)=>{
        //将错误吞掉
    })
    return server;
}

export function createConnection(host:string,data:{id:string,nikename:string}){
    return new Promise ((resolve,rejects)=>{
        const conn=new WebSocket(`ws://${host}:655`);
        conn.onopen=function(){
                let clientdataJSON=new ClientDataJSON();
                clientdataJSON.id=data.id;
                clientdataJSON.nikename=data.nikename;
                clientdataJSON.postlist=[];
                clientdataJSON.files=[];
                conn.send(JSON.stringify(clientdataJSON));
        }
        conn.onerror=function(err){
            rejects(err);
        }
        resolve(conn)
    })
}