/*
 * @Author: your name
 * @Date: 2022-01-29 08:07:03
 * @LastEditTime: 2022-02-08 17:34:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\utils\utils.ts
 */
import  * as fs from "fs";
import  * as path from "path";

export const makedir =(file_path:string,type:string)=>{
    let dirpath:string;
    if(type==="encrypt"){
        if(!fs.existsSync("encrypted")){
            fs.mkdirSync("encrypted")
        }
        dirpath=path.dirname(file_path)+'/encrypted/';
    }
    else{
        if(!fs.existsSync("decrypted")){
            fs.mkdirSync("decrypted")
        }
        dirpath=path.dirname(file_path)+'/decrypted/';
    }
    return dirpath;
}

export const write_key_pem=(pem_val:string,dir_path:string)=>{
    fs.writeFileSync(dir_path,pem_val);   
}

export const get_key_pem =(pem_path:string)=>{
    let val:string;
    val=fs.readFileSync(pem_path,'utf-8');
    return val;
}