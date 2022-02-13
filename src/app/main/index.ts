/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:05
 * @LastEditTime: 2022-02-13 17:56:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\index.ts
 */
import {ipcMain,webContents,BrowserWindow} from "electron";
import Files from "../../base/file";
import * as path from "path";
export function RunApp(mainWindow:BrowserWindow){
    ipcMain.on("click to encrypt",(event,...args)=>{
        let file=new Files(args[0]);
        if(args[1]>=args[2]){
          event.reply("encrypt error","encrypt error");
          return;
        }
        else{
          file.to_encrypt_file();
          file.to_split_file(args[1],args[2]);
          event.reply("encrypt ok","encrypt ok");  
        }

      })
    ipcMain.on("click to decrypt",(event,...args)=>{
      let [files,priv_pem_path,threshold,recovery_name]=args;
      let file= new Files(files[0]);
      if(files.length<threshold){
        event.reply("decrypt error","decrypt error");
          return;
      }
      else{
         file.to_recovery_file(threshold,recovery_name,files);
         
          file.to_decrypt_file(recovery_name,priv_pem_path);
         event.reply("decrypt ok","decrypt ok");  
      }
    })
}
