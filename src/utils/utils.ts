/*
 * @Author: your name
 * @Date: 2022-01-29 08:07:03
 * @LastEditTime: 2022-02-13 17:52:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\utils\utils.ts
 */
import  * as path from "path";
import * as fs from "fs";

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