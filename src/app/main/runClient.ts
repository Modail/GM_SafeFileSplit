/*
 * @Author: your name
 * @Date: 2022-03-28 16:01:43
 * @LastEditTime: 2022-04-09 17:08:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\runClient.ts
 */
import { ipcMain,BrowserWindow} from "electron";
import * as fs from "fs";
import * as path from "path";
import { createConnection } from "../../net/net";
import Files from "../../base/file";
import { getIPAddress} from "../../utils/utils";
import { levelDB } from "../../leveldb/leveldb";


export function RunClient(mainWindow:BrowserWindow){
       const DB=new levelDB();
       //连接局域网内的所有在线软件
       ipcMain.on("client start",()=>{
              let ip_prefix=getIPAddress();
              for(let i=1;i<=255;i++){
                     let ip=ip_prefix+"."+i;
                     createConnection(ip)
              }     
       })
       //获取服务器传输数据
      
       ipcMain.on("clien accept data",()=>{

       })
       // 加解密操作
       ipcMain.on("click to encrypt",(event,...args)=>{
              let file=new Files(args[0]);
              if(args[1]>=args[2]){
                event.reply("encrypt error","encrypt error");
                return;
              }
              else{
                file.to_encrypt_file();
                file.to_split_file(args[1],args[2]);
                //添加 存储数据库、发送信息等步骤
                for(let i =0;i<args[2];i++){
                  let datapath=file.paths;
                  if(i<=9){
                    datapath=datapath+`.00${i}`;
                    DB.addData(path.basename(datapath),fs.readFileSync(datapath));
                  }
                  else if(i>9&&i<=99){
                    datapath=datapath+`.0${i}`;
                    DB.addData(path.basename(datapath),fs.readFileSync(datapath));
                  }
                  else {
                    datapath=datapath+`.${i}`;
                    DB.addData(path.basename(datapath),fs.readFileSync(datapath));
                  }
                 
                }
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
       //获取数据库信息，渲染页面
       //可能需要异步
      ipcMain.once("init page",(event)=>{
        event.reply("init ok")
      })
      ipcMain.on("render list",(event)=>{
        const DBlist=DB.getKey();
        DBlist.then((data)=>event.reply("fresh data",data))
       })
       //对数据库信息进行操作
      ipcMain.on("delete file",(event,args)=>{
        DB.deleteData(args);
        event.reply("delete ok")
      })
      ipcMain.on("download file",(event,args)=>{
        DB.getData(args).then((data)=>{
          event.reply("download ready",data,args);
        })
      })
} 