/*
 * @Author: your name
 * @Date: 2022-01-05 10:42:27
 * @LastEditTime: 2022-02-08 20:39:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\base\file.ts
 */

import * as path from 'path';
const {SecretShareFile,SecretRecoverFile,Encrypt_KEYMGMT_SM2,Decrypt_KEYMGMT_SM2} =require("../../build/Release/addon.node");
import {makedir,write_key_pem,get_key_pem} from "../utils/utils";
export default class  Files {
    paths:string
    key_pair:{
       priv_key_str:string,
       pub_key_str:string
    }
    constructor(str:string) {
        this.paths=str     
    }
    to_encrypt_file= ()=>{
        makedir(this.paths,"encrypt");
        this.key_pair=Encrypt_KEYMGMT_SM2(path.dirname(this.paths)+"/encrypted/"+path.basename(this.paths));
        write_key_pem(this.key_pair.priv_key_str,path.dirname(this.paths)+"/encrypted/"+"private.pem");
        
    }
    to_decrypt_file=(recovery_path:string,pem_path:string)=>{
        makedir(this.paths,"decrypt");
        this.key_pair.priv_key_str=get_key_pem(pem_path);
        Decrypt_KEYMGMT_SM2(recovery_path,this.key_pair.priv_key_str);
    }
    to_split_file =(threshold:number,nshares:number)=>{
        SecretShareFile(threshold,nshares);
    }
    to_recovery_file=(threshold:number,recovery_name:string,files:Array<string>)=>{
        SecretRecoverFile(threshold,path.dirname(this.paths)+"/decrypted/"+recovery_name,files)
    }
}