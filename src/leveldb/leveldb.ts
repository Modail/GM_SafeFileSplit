/*
 * @Author: your name
 * @Date: 2022-03-22 14:15:32
 * @LastEditTime: 2022-04-30 21:35:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\leveldb\leveldb.ts
 */
const  levelup =require("levelup");
const leveldown =require("leveldown");


export class levelDB{
   db:any;
   constructor(){
     this.db =levelup(leveldown("./DB"));
     this.db.close();
   }
   deleteData(key:string){
     this.db.open();
     this.db.del(key)
     this.db.close();
   }
   addData(key:string,value:string|Buffer){
     this.db.open();
     this.db.put(key,value);
     this.db.close();
   }
   getData(key:string){
     this.db.open();
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
     this.db.open();
     let keyArr:Array<string>=[];
     return new Promise((resolve,reject)=>{
      this.db.createKeyStream().on("data",(data:Buffer|string)=>{
        if(data.toString()!=="password"){{
          keyArr.push(data.toString());
        }}
     }).on("end",()=>resolve(keyArr))
     })
   }
} 

