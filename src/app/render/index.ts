/*
 * @Author: your name
 * @Date: 2022-02-12 14:24:18
 * @LastEditTime: 2022-05-14 21:21:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GM_SafeFileSplit\src\app\render\index.ts
 */
import { ipcRenderer } from "electron";

class FilesJSON{
    filename:string[]=[];
    filedata:Buffer[]=[];
    sender:string[]=[]
}

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
            if(targetElements[i].value.length){
                values.push(targetElements[i].valueAsNumber);
            }
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
              if(targetElements[i].value.length){
                values.push(targetElements[i].value);
              }
          }
        }
    }
    return values;
}

const getSelectUers=function(){
    let userCheckboxs=document.getElementsByName("contact_people") as NodeListOf<HTMLInputElement>;
    let postlist=[];
    for(let i=0;i<userCheckboxs.length;++i){
        if(userCheckboxs[i].checked){
           postlist.push(userCheckboxs[i].value);
        }
    }
    return postlist;
}

const click_encryptBtn =function(){
    let message_placeholder=<HTMLElement>document.getElementById("message_placeholder");
    let btn =<HTMLButtonElement>document.getElementById("encrypt_btn");
    btn.addEventListener("click",()=>{
        let encrypt_args:Array<Array<string>|string|number> =getFormValue("encrypt");
        let postlist=getSelectUers();
        let nikename=document.getElementById("nikename").innerText;
        let id=sessionStorage.getItem("id");
        if(postlist.length){
            ipcRenderer.send("click to encrypt",...encrypt_args,nikename,id,postlist);
        }
        else{
            ipcRenderer.send("click to encrypt",...encrypt_args);
        }
    })
    ipcRenderer.on("encrypt ok",(event,args)=>{
        message_placeholder.innerHTML=`<span>????????????:${args}</span>`;
        //DB.getKey()????????????promise;
        setTimeout(()=>renderList(),100);
    })
    ipcRenderer.on("encrypt and split ok",(event,args)=>{
        message_placeholder.innerHTML=`<span>????????????:${args}</span>`;
        //DB.getKey()????????????promise;
        setTimeout(()=>renderList(),100);
    })
    ipcRenderer.on("encrypt error",(event,args)=>{
        message_placeholder.innerHTML=`<span>????????????:${args}</span>`;
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
        message_placeholder.innerHTML=`<span>????????????:${args}</span>`;
    })
    ipcRenderer.on("decrypt and recovery ok",(event,args)=>{
        message_placeholder.innerHTML=`<span>????????????:${args}</span>`;
    })
    ipcRenderer.on("decrypt error",(event,args)=>{
        message_placeholder.innerHTML=`<span>????????????:${args}</span>`;
     })
}

const renderList=function(){
    let fileList =<HTMLElement>document.getElementById("table_conntianner");
    let tableEmptyContainner=<HTMLElement>document.getElementById("table_empty_containner");
    ipcRenderer.send("render list");
    ipcRenderer.once("fresh data",(event,args)=>{ 
         //?????????????????????
        let nodes =fileList.childNodes;
        if(nodes.length!==0){
            for(let i=nodes.length-1;i>=0;i--){
                fileList.removeChild(nodes[i]);
             }      
        }
        if(args.length===0){
                tableEmptyContainner.style.display="flex";
        }else{
                 tableEmptyContainner.style.display="none";
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
                     let listItem_class =document.createAttribute("class");  
                     let listItem_name_class =document.createAttribute("class");
                     let listItem_btnDel_class =document.createAttribute("class");
                     let listItem_btnDownload_class =document.createAttribute("class");
                     listItem_class.value="list_DB";                 
                     listItem_name_class.value="listItem_name";
                     listItem_btnDel_class.value=`listItem_btnDel`;
                     listItem_btnDownload_class.value=`listItem_btnDownload`;
                     listItem.setAttributeNode(listItem_class);
                     listItem_name.setAttributeNode(listItem_name_class);
                     listItem_btnDel.setAttributeNode(listItem_btnDel_class);
                     listItem_btnDownload.setAttributeNode(listItem_btnDownload_class);
                     listItem_name.innerHTML=args[i];
                     listItem_btnDel.innerHTML="??????";
                     listItem_btnDownload.innerHTML="??????";
                     listItem.appendChild(listItem_name);
                     listItem.appendChild(listItem_btnDel);
                     listItem.appendChild(listItem_btnDownload);
                     listUl.appendChild(listItem);
                     listItem_btnDel.addEventListener("click",()=>baseDBop(args[i],"del"));
                     listItem_btnDownload.addEventListener("click",()=>baseDBop(args[i],"download"));
                 }
                 listContianner.appendChild(listUl);
                 fileList.appendChild(listContianner);
            }
        })
}

const  downloadFile=function(content:any, filename:string) {
    var a = document.createElement('a')
    var blob = new Blob([content])
    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  
  }

//???????????????????????????client??????????????????
const baseDBop=function(key:string,op:string){
   if(op==="del"){
    if(confirm("???????????????????????????")){
        ipcRenderer.send("delete file",key);
        ipcRenderer.once("delete ok",()=>renderList());
    }
   }else{
       ipcRenderer.send("download file",key);
       ipcRenderer.once("download ready",(event,...args)=>{
           downloadFile(args[0],args[1]);
       })
   }
   
}

const goTosystem=function(){
    let registerBtn=<HTMLButtonElement>document.getElementById("register_btn");
      registerBtn.addEventListener("click",()=>{
        let nikenameInput=<HTMLInputElement>document.getElementById("nikename_input");
        let registerContainer=<HTMLDivElement>document.getElementById("register_container");
        let homeContainer=<HTMLDivElement>document.getElementById("home_container");
        let nikename=nikenameInput.value;
        let id=(Math.random()*100000).toString();
        sessionStorage.setItem("id",id);
        if(nikename.length!==0){
            registerContainer.style.display="none";
            homeContainer.style.display="block";
            ipcRenderer.send("app start");
            ipcRenderer.send("client start",id,nikename);
          } 
        })
        //??????enter ?????????
        document.addEventListener("keydown",(event)=>{
            if(event.code==='Enter'){
                registerBtn.click()
            }
            })
}
const initPage=function(){
    //?????????????????????li??????
    let menuUl=<HTMLUListElement>document.querySelector(".menu_ul");
    for(let i=0;i<menuUl.children.length;i++){
        let li=menuUl.children[i];
        li.addEventListener("click",()=>{
            for(let j=0;j<menuUl.children.length;j++){
                menuUl.children[j].className="menu_li";
            }
            li.className="menu_li menu_li_selected";
            })
    }
    //?????????????????????????????????
    let cryptoContainer=<HTMLAnchorElement>document.getElementById("crypto_container_link");
    cryptoContainer.click();
    //???????????????input file ???click???????????????????????????
    let encryptFileBtn=<HTMLButtonElement>document.getElementById("encryptFile_btn");
    let decryptFileBtn=<HTMLButtonElement>document.getElementById("decryptFile_btn");
    let priv_pem_fileBtn=<HTMLButtonElement>document.getElementById("priv_pem_file_btn");
    let selectFile=<HTMLElement>document.getElementById("selected_file");
    let selectFiles=<HTMLElement>document.getElementById("selected_files");
    let pemFile=<HTMLElement>document.getElementById("pem_file");
    encryptFileBtn.addEventListener("click",()=>{
        let encryptFile=<HTMLInputElement>document.getElementById("encryptFile");
        encryptFile.click();
        encryptFile.addEventListener("change",()=>{
            if(encryptFile.files.length!==0){
                selectFile.innerText=`???????????????:${encryptFile.files[0].path.split("\\")[encryptFile.files[0].path.split("\\").length-1]}`;
            }
          })
    })
    decryptFileBtn.addEventListener("click",()=>{
        let decryptFile=<HTMLInputElement>document.getElementById("decryptFile");
        decryptFile.click();
        decryptFile.addEventListener("change",()=>{
          if(decryptFile.files.length!==0){
              let files=[];
              for(let i=0; i<decryptFile.files.length;i++){
                  files.push(decryptFile.files[i].path.split("\\")[decryptFile.files[i].path.split("\\").length-1])
              }
            selectFiles.innerText=`???????????????:${files.join(",")}`;
          }
        })
    })
    priv_pem_fileBtn.addEventListener("click",()=>{
        let priv_pem_file=<HTMLInputElement>document.getElementById("priv_pem_file");
        priv_pem_file.click();
        priv_pem_file.addEventListener("change",()=>{
            if( priv_pem_file.files.length!==0){
                pemFile.innerText=`???????????????:${priv_pem_file.files[0].path.split("\\")[priv_pem_file.files[0].path.split("\\").length-1]}`;
            }
        })
    })
    //?????????????????????????????????
    let contactPeople=<HTMLElement>document.getElementById("contact_people");
    let contactPeopleCheckbox=<HTMLElement>document.getElementById("contact_people_checkbox");
    let upIcon=document.getElementById("up_icon");
    let downIcon=document.getElementById("down_icon")
    contactPeople.addEventListener("click",()=>{
        //??????????????????????????? youug
        if(contactPeopleCheckbox.style.display==="none"){
            contactPeopleCheckbox.style.display="block";
            upIcon.style.display="none";
            downIcon.style.display="inline-block";
        }else{
            contactPeopleCheckbox.style.display="none";
            upIcon.style.display="inline-block";
            downIcon.style.display="none";   
        
        }
    })
    //?????????session??????files??????;
    let filesJSON=new FilesJSON();
    sessionStorage.setItem("filesJSON",JSON.stringify(filesJSON));

    ipcRenderer.send("init page");
    ipcRenderer.once("init ok",()=>renderList())
}
const initUserlist=function(userlist:string[][]){
    //userlist:[[user.id,user.nikename]];
    let contactPeopleEmpty=document.getElementById("contact_people_empty");
    let contactPeopleUl=document.querySelector(".contact_people_ul");
    if(!userlist.length){
        //?????????????????????
        contactPeopleEmpty.style.display="flex";

    }else{
        contactPeopleEmpty.style.display="none";
        //?????????????????????
        let nodes =contactPeopleUl.childNodes;
        if(nodes.length!==0){
            for(let i=nodes.length-1;i>=0;i--){
                contactPeopleUl.removeChild(nodes[i]);
            }      
        }
    userlist.forEach(user=>{
        let contactPeopleli=document.createElement("li");
        let contactPeopleCheackbox=document.createElement("input");
        let contactPeopleNikename=document.createElement("span");
        contactPeopleli.setAttribute("class","checkbox_li")
        contactPeopleCheackbox.setAttribute("type","checkbox");
        contactPeopleCheackbox.setAttribute("name","contact_people");
        contactPeopleCheackbox.setAttribute("value",user[0]);
        contactPeopleli.appendChild(contactPeopleCheackbox);
        contactPeopleNikename.innerText=user[1];
        contactPeopleli.appendChild(contactPeopleNikename)
        contactPeopleUl.appendChild(contactPeopleli)
    })
    }
      
}
const renderAcceptList=function(file:(string|Buffer)[],senderName:string){
      let fileName=file[0];
      let fileBuffer=file[1];
      let filesJSON=JSON.parse(sessionStorage.getItem("filesJSON"));
      //??????????????????session???
      if(fileName!==''&&fileBuffer!==''){
        filesJSON.filename.push(fileName);
        filesJSON.filedata.push(fileBuffer);
        filesJSON.sender.push(senderName);
        sessionStorage.setItem("filesJSON",JSON.stringify(filesJSON));
      }
      //????????????
      let acceptList=document.getElementById("accept_list_box");
      let acceptEmptyContainner=document.getElementById("accept_empty_containner");
      //?????????????????????
      let nodes =acceptList.childNodes;
      if(nodes.length!==0){
          for(let i=nodes.length-1;i>=0;i--){
            acceptList.removeChild(nodes[i]);
          }      
      }
      //??????filesJSON??????
      if(filesJSON.sender.length===0){
        acceptEmptyContainner.style.display="flex";
      }else{
        acceptEmptyContainner.style.display="none";
        let acceptListUL=document.createElement("ul");
        for(let i=0;i<filesJSON.sender.length;++i){
            let acceptListLi =document.createElement("li");
            let acceptListLiSender=document.createElement("div");
            let acceptListLiFilename=document.createElement("div");
            let acceptListLiOperation=document.createElement("div");
            let acceptListLiBtn_Del=document.createElement("button");
            let acceptListLiBtn_Download=document.createElement("button");
  
            acceptListLi.setAttribute("class","accept_li")
            acceptListLiSender.setAttribute("class","accept_li_sender");
            acceptListLiFilename.setAttribute("class","accept_li_filename");
            acceptListLiOperation.setAttribute("class","accept_li_operation");
            
            acceptListLiSender.innerText=filesJSON.sender[i];
            acceptListLiFilename.innerText=filesJSON.filename[i];
            acceptListLiBtn_Del.innerText="??????";
            acceptListLiBtn_Download.innerText="??????";
            
            acceptListLiBtn_Del.addEventListener("click",()=>{
              if(confirm("??????????????????")){
                  let filesJSON=JSON.parse(sessionStorage.getItem("filesJSON"));
                  filesJSON.sender.splice(i,1);
                  filesJSON.filename.splice(i,1);
                  filesJSON.filedata.splice(i,1);
                  sessionStorage.setItem("filesJSON",JSON.stringify(filesJSON));
                  renderAcceptList(["",""],"");
              }
            })
            acceptListLiBtn_Download.addEventListener("click",()=>{
              let filesJSON=JSON.parse(sessionStorage.getItem("filesJSON"));
              downloadFile(filesJSON.filedata[i],filesJSON.filename[i]);
            })
  
            acceptListLiOperation.appendChild(acceptListLiBtn_Del);
            acceptListLiOperation.appendChild(acceptListLiBtn_Download);
            acceptListLi.appendChild(acceptListLiSender);
            acceptListLi.appendChild(acceptListLiFilename);
            acceptListLi.appendChild(acceptListLiOperation);
            acceptListUL.appendChild(acceptListLi);
        }
        acceptList.appendChild(acceptListUL);
    }    
}

ipcRenderer.on("receive server data",(event,args)=>{
    //{userlist:,file:,nikename:}
    let serverDataJSON=JSON.parse(args);
    if(serverDataJSON.userlist.length){
        initUserlist(serverDataJSON.userlist);
    }
    if(!serverDataJSON.file.length){
        let nikenameBox=document.getElementById("nikename");
        nikenameBox.innerText=serverDataJSON.nikename;
       
    }
    if(serverDataJSON.file.length){
        renderAcceptList(serverDataJSON.file,serverDataJSON.nikename);
    }
})

//?????????????????????????????????????????????
const checkDBpw=function(){
    let dbPwInput=<HTMLInputElement> document.getElementById("db_pw_input");
    let dbPwPage=<HTMLElement>document.getElementById("db_pass_page");
    let dbDataPage=<HTMLElement>document.getElementById("db_data_page");
    let dbPwBtn=<HTMLButtonElement>document.getElementById("db_pw_btn");
    dbPwBtn.addEventListener("click",()=>{
        ipcRenderer.send("get password");
        ipcRenderer.once("password data",(event,args)=>{
           let pwValue=dbPwInput.value;
           if(args.length===0){
              ipcRenderer.send("set password",pwValue);
              dbPwPage.style.display="none";
              dbDataPage.style.display="block";
           }else{
              if(pwValue===args){
                  //?????????????????????
                  dbPwPage.style.display="none";
                  dbDataPage.style.display="block";
              }else{
                  //??????alert?????????input????????????
                  ipcRenderer.send("password err");
              }
           }
        })   
    })
}
checkDBpw()
goTosystem();
initPage();
click_encryptBtn();
click_decryptBtn();
