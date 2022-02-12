/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:18
 * @LastEditTime: 2022-02-12 22:36:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\render\index.ts
 */
import { ipcRenderer } from "electron";
const getFilePath=function():string{
    let input_box:HTMLInputElement;
    let file:string;
    input_box =<HTMLInputElement>document.getElementById("encryptFile");
    file=input_box.files[0].path;
    return file;
}
    let btn:HTMLButtonElement;
    btn =<HTMLButtonElement>document.getElementById("encrpt-btn");
    btn.addEventListener("click",()=>{
        let filepath:string =getFilePath();
        ipcRenderer.send("click to encrypt",filepath);
    })
