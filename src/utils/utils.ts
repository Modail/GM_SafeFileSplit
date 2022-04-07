/*
 * @Author: your name
 * @Date: 2022-01-29 08:07:03
 * @LastEditTime: 2022-04-02 20:21:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\utils\utils.ts
 */
import  * as path from "path";
import * as fs from "fs";
import * as os from "os";
export const makedir =(file_path:string,type:string)=>{
    let dirpath:string;
    if(type==="encrypt"){
        if(!fs.existsSync(path.dirname(file_path) +"/encrypted")){
            fs.mkdirSync(path.dirname(file_path) +"/encrypted")
        }
        dirpath=path.dirname(file_path)+'/encrypted/';
    }
    else{
        if(!fs.existsSync(path.dirname(file_path) +"/decrypted")){
            fs.mkdirSync(path.dirname(file_path) +"/decrypted")
        }
        dirpath=path.dirname(file_path)+'/decrypted/';
    }
    return dirpath;
}

export const move_file=(oldpath:string)=>{
    let newpath:string =(path.dirname(oldpath)+"/encrypted/"+path.basename(oldpath)).replace(/\\/gi,"/");
    fs.renameSync(oldpath,newpath);
}

export const write_key_pem=(pem_val:string,dir_path:string)=>{
    fs.writeFileSync(dir_path,pem_val);   
}

export const get_key_pem =(pem_path:string)=>{
    let val:string;
    val=fs.readFileSync(pem_path,'utf-8');
    return val;
}

export var getIPAddress = function () {
    var ipv4 = "";
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details, alias) {
        if (dev === "WLAN") {
          //判断需要获取IP的适配器
          if (details.family == "IPv4") {
            //判断是IPV4还是IPV6 还可以通过alias去判断
            ipv4 = details.address; //取addressIP地址
            return;
          }
        }
      });
    }

    return ipv4.split(".",3).join(".");
  };