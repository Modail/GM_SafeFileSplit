/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:05
 * @LastEditTime: 2022-04-12 10:52:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\index.ts
 */
import {BrowserWindow} from "electron";
import { RunClient } from "./runClient";
import { RunSever } from "./runServer";
export function RunApp(mainWindow:BrowserWindow){
       RunSever(mainWindow);
       RunClient(mainWindow);
}
