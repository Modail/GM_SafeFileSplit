/*
 * @Author: your name
 * @Date: 2022-03-22 14:15:32
 * @LastEditTime: 2022-03-22 21:36:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\leveldb\leveldb.ts
 */
const  levelup =require("levelup");
const leveldown =require("leveldown");
import fs from "fs";
import path from "path";

export class levelDB{
    private db:any;
   constructor(){
     this.db =levelup(leveldown("../../DB/baseDB"));
   }
   deleteData(key:string){

   }
   addData(key:string){

   }
   modifyData(key:string){

   }
} 

