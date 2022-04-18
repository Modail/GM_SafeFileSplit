/*
 * @Author: your name
 * @Date: 2022-03-21 16:28:06
 * @LastEditTime: 2022-04-18 12:42:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\stream.ts
 */

import { User } from "./net"

export const broadcast=function(data:{id:string,nikename:string,postlist:Array<string>,files:Array<string>},users:User[]){
    //对指定客户端发送文件信息
    if(data.postlist.length){
      users.forEach((user)=>{
        let index=data.postlist.findIndex((one)=>one===user.id);
        if(index>data.files.length){
          let serverPostData=`{
              "userlist":[],
              "file":"${data.files[data.files.length]}",
              "nikename":"${data.nikename}"
          }`;
          user.socket.send(serverPostData);
        }else{
          let serverPostData=`{
           "userlist":[],
           "file":"${data.files[index]}",
           "nikename":"${data.nikename}"
          }`;
         user.socket.send(serverPostData);
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
            let serverPostData=`{
                "userlist":${userlist},
                "file":[],
                "nikename":${users[index].nikename}
            }`;
            user.socket.send(serverPostData)
        }else{
            let serverPostData=`{
                "userlist":[],
                "file":[],
                "nikename":${users[index].nikename}
            }`;
            user.socket.send(serverPostData)
        }
      })   
    }
}