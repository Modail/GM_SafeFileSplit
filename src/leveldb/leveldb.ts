/*
 * @Author: your name
 * @Date: 2022-03-22 14:15:32
 * @LastEditTime: 2022-03-26 16:15:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\leveldb\leveldb.ts
 */
const  levelup =require("levelup");
const leveldown =require("leveldown");


export class levelDB{
    private db:any;
   constructor(){
     this.db =levelup(leveldown("../../DB/baseDB"));
   }
   deleteData(key:string){
     this.db.del(key,function(err:Error){
       if(err){
         console.log(err)
       }
     })
   }
   addData(key:string){
     this.db.put(key,function(err:Error){
       if(err){
         console.log(err)
       }
     })
   }
   getData(key:string){
     this.db.get(key,function(err:Error){
       if(err){
         console.log(err)
       }
     })
   }
   getKey(){
     let keyArr:Array<string>=[];
     this.db.createKeyStream().on("data",(data:Buffer|string)=>{
        keyArr.push(data.toString());
     })
   }
} 

