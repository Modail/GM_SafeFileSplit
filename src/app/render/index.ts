/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:18
 * @LastEditTime: 2022-04-07 23:13:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\render\index.ts
 */
import { ipcMain, ipcRenderer } from "electron";
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

const renderList=function(){
    let fileList =<HTMLElement>document.getElementById("table_conntianner");
    let formContainner =document.createElement("div");
    let formContainner_class =document.createAttribute("class");
    ipcRenderer.send("render list");
    ipcRenderer.on("fresh data",(event,args)=>{
         //先删除原有节点
        let nodes =fileList.childNodes;
        if(nodes){
            for(let i=nodes.length-1;i>=0;i--){
                fileList.removeChild(nodes[i]);
             }
        }
        if(args.length===0){
            formContainner_class.value="nullContainner";
            formContainner.innerHTML='暂无数据';
            formContainner.setAttributeNode(formContainner_class);
            fileList.appendChild(formContainner);
        }else{
             formContainner_class.value="formContainner";
             let listContianner=<HTMLElement>document.createElement("div");
             let listUl=<HTMLUListElement>document.createElement("ul");
             let listContianner_class=document.createAttribute("class");
             listContianner_class.value="listContianner";
             listContianner.setAttributeNode(listContianner_class);
             for(let i =0 ; i<args.length; i++){
                 let listItem=<HTMLLIElement>document.createElement("li");
                 let listItem_name=<HTMLElement>document.createElement("div");
                 let listItem_btnDel=<HTMLButtonElement>document.createElement("button");
                 let listItem_btnDownload=<HTMLButtonElement>document.createElement("button");
                 let listItem_name_class =document.createAttribute("class");
                 let listItem_btnDel_class =document.createAttribute("class");
                 let listItem_btnDownload_class =document.createAttribute("class");
                 listItem_name_class.value="listItem_name";
                 listItem_btnDel_class.value="listItem_btnDel";
                 listItem_btnDownload_class.value="listItem_btnDownload";
                 listItem_name.setAttributeNode(listItem_name_class);
                 listItem_btnDel.setAttributeNode(listItem_btnDel_class);
                 listItem_btnDownload.setAttributeNode(listItem_btnDownload_class);
                 listItem_name.innerHTML=args[i];
                 listItem_btnDel.innerHTML="删除";
                 listItem_btnDownload.innerHTML="下载";
                 listItem_btnDel.addEventListener("click",()=>baseDBop(args[i],"del"));
                 listItem_btnDownload.addEventListener("click",()=>baseDBop(args[i],"download"));
                 listItem.appendChild(listItem_name);
                 listItem.appendChild(listItem_btnDel);
                 listItem.appendChild(listItem_btnDownload);
                 listUl.appendChild(listItem);
             }
             listContianner.appendChild(listUl);
             formContainner.appendChild(listContianner);
             fileList.appendChild(formContainner);
        }
    })
}

//删除、下载操作，向client端传递参数，
const baseDBop=function(key:string,op:string){
   if(op==="del"){
    if(confirm("是否确认删除该文件")){
        ipcRenderer.send("delete file",key);
        ipcRenderer.on("delete ok",()=>renderList())
    }
   }else{
       ipcRenderer.send("download file",key);
   }
   
}

const initPage=function(){
    ipcRenderer.send("init page");
    ipcRenderer.on("init ok",()=>renderList())
}

click_encryptBtn();
click_decryptBtn();
initPage()