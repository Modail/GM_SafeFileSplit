/*
 * @Author: your name
 * @Date: 2022-03-28 15:58:49
 * @LastEditTime: 2022-04-11 18:21:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\runServer.ts
 */
import { ipcMain,BrowserWindow } from "electron";
import * as stream from "stream";
import { createServer } from "../../net/net";
export function RunSever(mainWindow:BrowserWindow){
    ipcMain.on("app start",()=>{
        const {broadcastStream,server}=createServer();
        broadcastStream.on("startServer",(args)=>{
           mainWindow.webContents.send("init id",args);
        })
        broadcastStream.on("add new client",(args)=>{
           console.log(broadcastStream._sockets)
           for(let i=0;i<broadcastStream._sockets.length;i++){
               broadcastStream._sockets[i].write(args);
           }
        })
    })

    //数据传递
}