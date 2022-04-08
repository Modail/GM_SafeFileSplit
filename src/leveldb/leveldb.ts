import { rejects } from "assert";
import { resolve } from "path";

/*
 * @Author: your name
 * @Date: 2022-03-22 14:15:32
 * @LastEditTime: 2022-04-08 21:01:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\leveldb\leveldb.ts
 */
const  levelup =require("levelup");
const leveldown =require("leveldown");


export class levelDB{
   private db:any;
   constructor(){
     this.db =levelup(leveldown("./DB"));
   }
   deleteData(key:string){
     this.db.del(key,function(err:Error){
       if(err){
         console.log(err)
       }
     })
   }
   addData(key:string,value:string|Buffer){
     this.db.put(key,value);
   }
   getData(key:string){
     return new Promise((resolve,rejects)=>{
      this.db.get(key,function(err:Error,value:string|Buffer){
        if(err){
         rejects(err);
        }
       resolve(value);
      })
     })
   }
  getKey(){
     let keyArr:Array<string>=[];
     return new Promise((resolve,reject)=>{
      this.db.createKeyStream().on("data",(data:Buffer|string)=>{
        keyArr.push(data.toString());
     }).on("end",()=>resolve(keyArr))
     })
   }
} 

