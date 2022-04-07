/*
 * @Author: your name
 * @Date: 2022-03-28 15:58:49
 * @LastEditTime: 2022-04-03 20:12:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\runServer.ts
 */
import { ipcMain,BrowserWindow } from "electron";
import * as stream from "stream";
import { createServer } from "../../net/net";

export function RunSever(mainWindow:BrowserWindow){
    createServer();
    //数据传递
    ipcMain.on("download file",()=>{
        
    })
}