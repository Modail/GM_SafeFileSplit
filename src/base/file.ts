/*
 * @Author: your name
 * @Date: 2022-01-05 10:42:27
 * @LastEditTime: 2022-02-14 19:36:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\base\file.ts
 */

import * as path from 'path';
const { Encrypt_KEYMGMT_SM2, Decrypt_KEYMGMT_SM2, SecretShareFile, SecretRecoverFile } = require("../../build/Release/addon.node");
import {makedir,move_file,write_key_pem,get_key_pem} from "../utils/utils";
export default class  Files {
    paths:string
    key_pair:{
       priv_key_str:string,
       pub_key_str:string
    }
    constructor(str:string) {
        this.paths=str;
        this.key_pair={
            priv_key_str:"",
            pub_key_str:""
        }   
    }
    to_encrypt_file= ()=>{
        makedir(this.paths,"encrypt");
        this.key_pair=Encrypt_KEYMGMT_SM2(this.paths.replace(/\\/gi,"/"));
        move_file(this.paths);
        write_key_pem(this.key_pair.priv_key_str,(path.dirname(this.paths)+"/encrypted/"+`${path.basename(this.paths)}_private.pem`).replace(/\\/gi,"/"));
        
    }
    to_decrypt_file=(recovery_name:string,pem_path:string)=>{
        this.key_pair.priv_key_str=get_key_pem(pem_path);
        Decrypt_KEYMGMT_SM2((path.dirname(this.paths)+"/decrypted/"+recovery_name).replace(/\\/gi,"/"),this.key_pair.priv_key_str);
    }
    to_split_file =(threshold:number,nshares:number)=>{
            SecretShareFile(threshold,nshares,(path.dirname(this.paths)+"/encrypted/"+path.basename(this.paths)).replace(/\\/gi,"/"));
    }
    to_recovery_file=(threshold:number,recovery_name:string,files:Array<string>)=>{
        makedir(this.paths,"decrypt");
        SecretRecoverFile(threshold,(path.dirname(this.paths)+"/decrypted/"+recovery_name).replace(/\\/gi,"/"),files)
    }
}
