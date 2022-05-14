/*
 * @Author: your name
 * @Date: 2022-03-28 16:01:43
 * @LastEditTime: 2022-05-14 21:20:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\main\runClient.ts
 */
import { ipcMain,BrowserWindow, dialog} from "electron";
import * as fs from "fs";
import * as path from "path";
import { createConnection } from "../../net/net";
import Files from "../../base/file";
import { getIPAddress} from "../../utils/utils";
import { levelDB } from "../../leveldb/leveldb";
import { ClientDataJSON } from "../../net/net";


export function RunClient(mainWindow:BrowserWindow){
       const DB=new levelDB();
       //连接局域网内的所有在线软件
       let clientWebsocket:any;
       ipcMain.on("client start",(event,...args)=>{
              // let ip_prefix=getIPAddress().split(".",3).join(".");
              // for(let i=1;i<=255;i++){
              //        let ip=ip_prefix+"."+i;
              //        createConnection(ip);
              // }   
              createConnection(getIPAddress(),{id:args[0],nikename:args[1]}).then((conn)=>{   
                clientWebsocket=conn;
                clientWebsocket.onmessage=function(msg:any){
                   let data=msg.data
                   //获取服务器传输数据
                   mainWindow.webContents.send("receive server data",data);
                }
         
              });
       })
       

       // 加解密操作
       ipcMain.on("click to encrypt",(event,...args)=>{
              let file=new Files(args[0]);
              let clientdataJSON=new ClientDataJSON();
              let files=[];
              let filesection;
              if(args.length===1){
                file.to_encrypt_file();
                DB.addData(path.basename(file.paths),fs.readFileSync(file.paths));
                event.reply("encrypt ok","encrypt ok");  
              }
              else{
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
                      if(args.length>3){
                        filesection=[path.basename(datapath),fs.readFileSync(datapath)];
                        files.push(filesection);
                      }
                    }
                    else if(i>9&&i<=99){
                      datapath=datapath+`.0${i}`;
                      DB.addData(path.basename(datapath),fs.readFileSync(datapath));
                      if(args.length>3){
                        filesection=[path.basename(datapath),fs.readFileSync(datapath)];
                        files.push(filesection);
                      }
                    }
                    else {
                      datapath=datapath+`.${i}`;
                      DB.addData(path.basename(datapath),fs.readFileSync(datapath));
                      if(args.length>3){
                        filesection=[path.basename(datapath),fs.readFileSync(datapath)];
                        files.push(filesection);
                      }
                    }
                  }
                  if(args.length>3){
                    clientdataJSON.files=files;
                    clientdataJSON.postlist=args[5];
                    clientdataJSON.id=args[4];
                    clientdataJSON.nikename=args[3];
                    clientWebsocket.send(JSON.stringify(clientdataJSON)); 
                 }
                  event.reply("encrypt and split ok","encrypt and split ok");  
                }
              } 
            })
      ipcMain.on("click to decrypt",(event,...args)=>{
            let [files,priv_pem_path,threshold,recovery_name]=args;
            let file= new Files(files[0]);
            if(args.length===2){
              file.to_decrypt_file(priv_pem_path);
              event.reply("decrypt ok","decrypt ok"); 
            }else{
              if(files.length<threshold){
                event.reply("decrypt error","decrypt error");
                  return;
              }
              else{
                 file.to_recovery_file(threshold,recovery_name,files);
                 file.to_decrypt_file(priv_pem_path,recovery_name);
                 event.reply("decrypt and recovery ok","decrypt and recovery ok");  
              }
            }
          })
       //初始化数据库密码
       ipcMain.on("set password",(event,args)=>{
         DB.addData("password",args)
       })
       //获取数据库密码，进行验证
       ipcMain.on("get password",(event)=>{
         DB.getData("password").then((data)=>{
           event.reply("password data",data.toString())
         }).catch((err)=>{
           event.reply("password data","")
         })
       })
       //数据库密码错误处理
       ipcMain.on("password err",()=>{
         dialog.showErrorBox("数据库密码错误","密码错误，请重新输入！")
       })
       //获取数据库信息，渲染页面
       //可能需要异步
      ipcMain.once("init page",(event)=>{
        event.reply("init ok")
      })
      ipcMain.on("render list",(event)=>{
        const DBlist=DB.getKey();
        DBlist.then((data)=>{
          event.reply("fresh data",data);
        })
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