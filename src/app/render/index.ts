/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:18
 * @LastEditTime: 2022-02-13 17:56:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\render\index.ts
 */
import { ipcRenderer } from "electron";
const getFormValue=function(type:string):Array<Array<string>|string|number>{
    let values=[];
    if(type==="encrypt"){
        let form= document.getElementById("encryptForm");
        let targetElements = form.getElementsByTagName("input");
        for(let i =0; i<targetElements.length;i++){
          if(targetElements[i].files){
            values.push(targetElements[i].files[0].path)
          }
          else{
            values.push(targetElements[i].valueAsNumber);
          }
        }
    }
    else{
        let form= document.getElementById("decryptForm");
        let targetElements = form.getElementsByTagName("input");
        for(let i =0; i<targetElements.length;i++){
          if(targetElements[i].files){
              let files_array=[];
             if(i!==0){
                values.push(targetElements[i].files[0].path);
             }
             else{
                for(let l =0;l<targetElements[i].files.length;l++){
                    files_array.push(targetElements[i].files[l].path)
                }
                values.push(files_array);
             }

          }
          else{
            values.push(targetElements[i].value);
          }
        }
    }
    return values;
}
const click_encryptBtn =function(){
    let message_placeholder=<HTMLElement>document.getElementById("message_placeholder");
    let btn =<HTMLButtonElement>document.getElementById("encrypt_btn");
    
    btn.addEventListener("click",()=>{
        let encrypt_args:Array<Array<string>|string|number> =getFormValue("encrypt");
        ipcRenderer.send("click to encrypt",...encrypt_args);
    })
    ipcRenderer.on("encrypt ok",(event,args)=>{
        message_placeholder.innerHTML=`<span>提示信息:${args}</span>`;
    })
    ipcRenderer.on("encrypt error",(event,args)=>{
        message_placeholder.innerHTML=`<span>提示信息:${args}</span>`;
     })
}

const click_decryptBtn =function(){
    let message_placeholder=<HTMLElement>document.getElementById("message_placeholder");
    let btn =<HTMLButtonElement>document.getElementById("decrypt-btn");
    
    btn.addEventListener("click",()=>{
        let encrypt_args:Array<Array<string>|string|number> =getFormValue("decrypt");
        ipcRenderer.send("click to decrypt",...encrypt_args);
    })
    ipcRenderer.on("decrypt ok",(event,args)=>{
        message_placeholder.innerHTML=`<span>提示信息:${args}</span>`;
    })
    ipcRenderer.on("decrypt error",(event,args)=>{
        message_placeholder.innerHTML=`<span>提示信息:${args}</span>`;
     })
}

click_encryptBtn();
click_decryptBtn();