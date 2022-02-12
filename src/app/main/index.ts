/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:05
 * @LastEditTime: 2022-02-12 22:34:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\index.ts
 */
import {ipcMain} from "electron";
import Files from "../../base/file";

export function RunApp(){
    ipcMain.on("click to encrypt",(event,...args)=>{
        let file=new Files(args[0]);
        file.to_encrypt_file();
        file.to_split_file(3,5);
      })
}
