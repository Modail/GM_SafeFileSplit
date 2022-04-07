/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:05
 * @LastEditTime: 2022-04-03 18:29:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\index.ts
 */
import {BrowserWindow} from "electron";
import { RunClient } from "./runClient";
export function RunApp(mainWindow:BrowserWindow){
       RunClient(mainWindow);
}
