/*
 * @Author: your name
 * @Date: 2022-03-28 15:58:49
 * @LastEditTime: 2022-04-15 18:29:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\runServer.ts
 */
import { ipcMain,BrowserWindow } from "electron";
import { createServer } from "../../net/net";
export function RunSever(mainWindow:BrowserWindow){
    ipcMain.on("app start",()=>{
       createServer()
    })
}