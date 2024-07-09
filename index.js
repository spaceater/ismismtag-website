let ism_detial_list = document.getElementsByClassName("ism");
let info_box = document.getElementById("info_box")
let ism_data = null;
let ism_pinned = null;

document.getElementById("ism_name").textContent = "数据正在加载中\n\n若长时间未刷新\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)"
window.onscroll=()=>{
    info_box.style.left = -window.scrollX + "px";
}

let xhr = new XMLHttpRequest()
xhr.open("GET","/ism.json",true)
xhr.send(null);
xhr.onload = ()=>{
    if(xhr.status === 200){
        ism_data=JSON.parse(xhr.responseText)
        for(let i=0;i<ism_detial_list.length;i++){
	        let ism_node = ism_detial_list[i]
            let ism_name = ism_data[ism_node.getAttribute("ism_tag")]["ch_name"].split('/')[0].replace('“','"').replace('”','"')
            if(ism_name.length!=0){
                ism_node.firstChild.textContent = ism_name
                if(ism_name.length<=4)
    	            ism_node.style.fontSize = "1rem"
	            else
    	            ism_node.style.fontSize = "0.75rem"
            }
	        ism_node.addEventListener("mouseenter",function(){selectISM(ism_node)})
	        ism_node.addEventListener("mouseleave",function(){unselectISM(ism_node)})
            ism_node.addEventListener("click",function(){pinISM(ism_node)})
            document.getElementById("search_button").addEventListener("click",function(){searchISM(document.getElementById("search_box").value)})
            document.getElementById("clear_search_button").addEventListener("click",function(){searchISM(""),document.getElementById("search_box").value=""})
            document.getElementById("axis_label").addEventListener("mouseenter",function(){showIntroduction()})
            document.getElementById("ism_name").textContent = "数据加载成功"
            showIntroduction()
        }
    }
    else{
        console.log("ism.json load failed")
        document.getElementById("ism_name").textContent = "数据加载失败\n\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)"
    }
}

function selectISM(ism_node){    
    setISMInfo(ism_node)
    let ism_tag = ism_node.getAttribute("ism_tag")
    let ism_length=ism_tag.length
    let ism_data_list_length = ism_detial_list.length
    for(let i=0;i<ism_data_list_length;i++){
        let ism_node = ism_detial_list[i]
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.add("selected")
            if(ism_node.getAttribute("ism_tag").length==3){
                document.getElementById(ism_tag).classList.add("selected")
            }
        }
    }
}

function unselectISM(ism_node){
    if(ism_pinned != null){
        setISMInfo(ism_pinned)
    }
    else{
        removeISMInfo()
    }
    let ism_tag = ism_node.getAttribute("ism_tag");
    let ism_length=ism_tag.length;
    let ism_data_list_length = ism_detial_list.length;
    for(let i=0;i<ism_data_list_length;i++){
        let ism_node = ism_detial_list[i];
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.remove("selected");
            if(ism_node.getAttribute("ism_tag").length==3){
                document.getElementById(ism_tag).classList.remove("selected")
            }
        }
    }
}

function setISMInfo(ism_node){
    let ism_tag = ism_node.getAttribute("ism_tag");
    document.getElementById("ism_name").textContent = ism_tag + '\n' + ism_data[ism_tag]["ch_name"] + '\n' + ism_data[ism_tag]["en_name"];
    let axis_list_length = ism_data[ism_tag]["axis_list"].length;
    document.getElementById("ism_axis").textContent = "";
    for(let i=0;i<axis_list_length;i++){
        document.getElementById("ism_axis").textContent += ism_data[ism_tag]["axis_list"][i] + '\n' 
    }
    let feature_list_length = ism_data[ism_tag]["feature_list"].length;
    document.getElementById("ism_features").textContent = "";
    for(let i=0;i<feature_list_length;i++){
        document.getElementById("ism_features").textContent += ism_data[ism_tag]["feature_list"][i] + '\n';
    }
    document.getElementById("ism_counterpart").textContent = ism_data[ism_tag]["figure"] + '\n' + ism_data[ism_tag]["guise"] + '\n' + ism_data[ism_tag]["group"];
    document.getElementById("ism_link").textContent = ism_data[ism_tag]["link"];
    document.getElementById("ism_link").innerHTML = document.getElementById("ism_link").innerHTML.replace(ism_data[ism_tag]["link"].split('：')[1],"<span style='text-decoration:underline;'>$&</span>");
    document.getElementById("ism_link").href = ism_data[ism_tag]["link"].split('：')[1];
    if(document.getElementById("search_box").value!="")
        renewInfo(document.getElementById("search_box").value);
}

function removeISMInfo(){
    document.getElementById("ism_name").textContent = ""
    document.getElementById("ism_axis").textContent = ""
    document.getElementById("ism_features").textContent = ""
    document.getElementById("ism_counterpart").textContent = ""
    document.getElementById("ism_link").textContent = ""
}

function renewInfo(target){
    let reg = new RegExp(target,'gi')//全局且忽略大小写
    document.getElementById("ism_name").innerHTML = document.getElementById("ism_name").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_axis").innerHTML = document.getElementById("ism_axis").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_features").innerHTML = document.getElementById("ism_features").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_counterpart").innerHTML = document.getElementById("ism_counterpart").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
}

function pinISM(ism_node){
    for(let i=0;i<ism_detial_list.length;i++){
        let ism_node = ism_detial_list[i]
        ism_node.classList.remove("pinned")
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned")
        }
    }
    if(ism_pinned == ism_node){
        ism_pinned = null
    }
    else{
        ism_pinned = ism_node;
        setISMInfo(ism_node);
        let ism_tag = ism_node.getAttribute("ism_tag");
        let ism_length=ism_tag.length;
        let ism_data_list_length = ism_detial_list.length;
        for(let i=0;i<ism_data_list_length;i++){
            let ism_node = ism_detial_list[i];
            if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
                ism_node.classList.add("pinned");
                if(ism_node.getAttribute("ism_tag").length==3){
                    document.getElementById(ism_tag).classList.add("pinned")
                }
            }
        }
    }
}

function searchISM(target){
    ism_pinned = null;
    for(let i=0;i<ism_detial_list.length;i++){
        let ism_node = ism_detial_list[i]
        ism_node.classList.remove("pinned")
        ism_node.classList.remove("searched");
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned")
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("searched")
        }
    }
    if(target != ""){
        let reg = new RegExp(target,'i')//忽略大小写
        let ism_data_list_length = ism_detial_list.length;
        for(let i=0;i<ism_data_list_length;i++){
            let ism_node = ism_detial_list[i];
            let ism_tag = ism_node.getAttribute("ism_tag");
            if(ism_data[ism_tag]["ch_name"].search(reg)!=-1 || ism_data[ism_tag]["en_name"].search(reg)!=-1 || ism_data[ism_tag]["figure"].search(reg)!=-1 || ism_data[ism_tag]["guise"].search(reg)!=-1 || ism_data[ism_tag]["group"].search(reg)!=-1){
                ism_node.classList.add("searched")
                if(ism_tag.length==3){
                    document.getElementById(ism_tag).classList.add("searched")
                }
            }
            else{
                let axis_list_length = ism_data[ism_tag]["axis_list"].length;
                for(let i=0;i<axis_list_length;i++){
                    if(ism_data[ism_tag]["axis_list"][i].search(reg)!=-1){
                        ism_node.classList.add("searched");
                        if(ism_tag.length==3){
                            document.getElementById(ism_tag).classList.add("searched")
                        }
                        break;
                    } 
                }
                let feature_list_length = ism_data[ism_tag]["feature_list"].length;
                for(let i=0;i<feature_list_length;i++){
                    if(ism_data[ism_tag]["feature_list"][i].search(reg)!=-1){
                        ism_node.classList.add("searched");
                        if(ism_tag.length==3){
                            document.getElementById(ism_tag).classList.add("searched")
                        }
                        break;
                    }
                }
            }
        }
        document.getElementById("ism_name").textContent = "检索完成"
    }
}

function showIntroduction(){
    searchISM("")
    document.getElementById("search_box").value=""
    document.getElementById("ism_name").textContent = ism_data["introduction"].ch_name + '\n' + ism_data["introduction"].en_name
    let introduction_length = ism_data["introduction"]["axis_list"].length
    document.getElementById("ism_axis").textContent = ""
    for(let i=0;i<introduction_length;i++){
        document.getElementById("ism_axis").textContent += ism_data["introduction"]["axis_list"][i] + '\n'
    }
    introduction_length = ism_data["introduction"]["feature_list"].length
    document.getElementById("ism_features").textContent = ""
    for(let i=0;i<introduction_length;i++){
        document.getElementById("ism_features").textContent += ism_data["introduction"]["feature_list"][i] + '\n'
    }
    document.getElementById("ism_counterpart").textContent = ism_data["introduction"]["guise"]
    document.getElementById("ism_link").textContent = ism_data["introduction"]["group"] + '\n' + ism_data["introduction"]["link"];
    document.getElementById("ism_link").innerHTML = document.getElementById("ism_link").innerHTML.replace(ism_data["introduction"]["link"].split('：')[1],"<span style='text-decoration:underline;'>$&</span>");
    document.getElementById("ism_link").href = ism_data["introduction"]["link"].split('：')[1];
}
