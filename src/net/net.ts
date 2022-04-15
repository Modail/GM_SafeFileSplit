/*
 * @Author: your name
 * @Date: 2022-03-21 16:27:55
 * @LastEditTime: 2022-04-15 22:04:09
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
                if(!index){
                    //不存在则新建user
                    let user=new User();
                    user.id=dataJson.id;
                    user.nikename=dataJson.nikename;
                    user.socket=client;
                    users.push(user);
                }
            }
            //postdata
            if(dataJson.postlist.length){
                users.forEach((user)=>{
                    broadcast(dataJson,user)
                })
            }
            else{
                let userlist:string[]=[];
                let index=users.findIndex((one)=>one.id===dataJson.id);
                for(let i=0;i<users.length;++i){
                    if(i!==index){
                    userlist.push(users[i].nikename)};
                }
                if(userlist.length){
                    let serverPostData=`{
                        "userlist":${userlist},
                        "file":[],
                        "nikename":${users[index].nikename}
                    }`;
                    client.send(serverPostData)
                }else{
                    let serverPostData=`{
                        "userlist":[],
                        "file":[],
                        "nikename":${users[index].nikename}
                    }`;
                    client.send(serverPostData)
                }

            }
        })
          client.on("close",()=>{
              //重新渲染用户列表
              let leaveClientIndex= users.findIndex((one)=>one.socket===this);
              users.splice(leaveClientIndex,1);
              console.log("下线")
          })
    })
    return server;
}

export function createConnection(host:string,data:{id:string,nikename:string}){
    return new Promise ((resolve,rejects)=>{
        const conn=new WebSocket(`ws://${host}:655`);
        conn.onopen=function(){
                let clientPostData=`{
                    "id":"${data.id}",
                    "nikename":"${data.nikename}",
                    "postlist":[],
                    "files":[]
                }`;
                conn.send(clientPostData);
        }
        conn.onerror=function(err){
            rejects(err);
        }
        resolve(conn)
    })
}