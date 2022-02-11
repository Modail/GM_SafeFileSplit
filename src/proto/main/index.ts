/*
 * @Author: your name
 * @Date: 2022-01-28 22:19:06
 * @LastEditTime: 2022-02-10 13:40:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\proto\main\index.ts
 */

import Files from "../../base/file";

const getFilePath=function(){
       let input_box:HTMLInputElement;
       let file:string;
       input_box =<HTMLInputElement>document.getElementById("encryptFile");
       file=input_box.value;
       console.log(file);
       return file;
}

export const clickButton=function(){
    let btn:HTMLButtonElement;
    btn =<HTMLButtonElement>document.getElementById("encrpt-btn");
    btn.addEventListener("Click",()=>{
        let file=new Files(getFilePath());
        console.log(file);
        file.to_encrypt_file();
        file.to_split_file(3,5)

    })
}