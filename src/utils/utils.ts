/*
 * @Author: your name
 * @Date: 2022-01-29 08:07:03
 * @LastEditTime: 2022-04-09 16:18:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\utils\utils.ts
 */
import  * as path from "path";
import * as fs from "fs";
import * as os from "os";

export const write_key_pem=(pem_val:string,dir_path:string)=>{
    fs.writeFileSync(dir_path,pem_val);   
}

export const get_key_pem =(pem_path:string)=>{
    let val:string;
    val=fs.readFileSync(pem_path,'utf-8');
    return val;
}

export const getIPAddress = function () {
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

 

