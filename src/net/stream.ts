/*
 * @Author: your name
 * @Date: 2022-03-21 16:28:06
 * @LastEditTime: 2022-04-15 17:47:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\net\stream.ts
 */

import { fileURLToPath } from "url";
import { User } from "./net"

export const broadcast=function(data:{id:string,nikename:string,postlist:Array<string>,files:Array<string>},user:User){
    //对指定客户端发送文件信息
    if(data.postlist.length){
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
    }
}