/*
 * @Author: your name
 * @Date: 2022-03-21 16:28:06
 * @LastEditTime: 2022-04-18 22:28:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\stream.ts
 */

import { User } from "./net"

class ServerDataJSON{
      userlist:string[][]
      file:(string|Buffer)[]
      nikename:string
}

export const broadcast=function(data:{id:string,nikename:string,postlist:Array<string>,files:(string|Buffer)[][]},users:User[]){
     let serverDataJSON=new ServerDataJSON();
    //对指定客户端发送文件信息
    if(data.postlist.length){
      users.forEach((user)=>{
        let index=data.postlist.findIndex((one)=>one===user.id);
        if(index!==-1){
          if(index>data.files.length){
            serverDataJSON.userlist=[];
            serverDataJSON.file=data.files[data.files.length];
            serverDataJSON.nikename=data.nikename;
         
            user.socket.send(JSON.stringify(serverDataJSON));
          }else{
            serverDataJSON.userlist=[];
            serverDataJSON.file=data.files[index];
            serverDataJSON.nikename=data.nikename;
            console.log(serverDataJSON)
            user.socket.send(JSON.stringify(serverDataJSON));
          }       
        }
      })

    }
    //广播用户列表
    else{
      users.forEach((user)=>{
        let userlist:Array<string[]>=[];
        let index=users.findIndex((one)=>one.id===user.id);
        for(let i=0;i<users.length;++i){
            if(i!==index){
            let usersection=[users[i].id,users[i].nikename]
            userlist.push(usersection)};
        }
        if(userlist.length){
          serverDataJSON.userlist=userlist;
          serverDataJSON.file=[];
          serverDataJSON.nikename=users[index].nikename;
          
          user.socket.send(JSON.stringify(serverDataJSON));
        }else{
          serverDataJSON.userlist=[];
          serverDataJSON.file=[];
          serverDataJSON.nikename=users[index].nikename
          user.socket.send(JSON.stringify(serverDataJSON));
        }
      })   
    }
}