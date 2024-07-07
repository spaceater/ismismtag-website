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
            document.getElementById("ism_name").textContent = "数据加载成功";
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
    document.getElementById("ism_name").innerHTML = document.getElementById("ism_name").innerHTML.replaceAll(target,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_axis").innerHTML = document.getElementById("ism_axis").innerHTML.replaceAll(target,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_features").innerHTML = document.getElementById("ism_features").innerHTML.replaceAll(target,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_counterpart").innerHTML = document.getElementById("ism_counterpart").innerHTML.replaceAll(target,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
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
    removeISMInfo()
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
        let ism_data_list_length = ism_detial_list.length;
        for(let i=0;i<ism_data_list_length;i++){
            let ism_node = ism_detial_list[i];
            let ism_tag = ism_node.getAttribute("ism_tag");
            if(ism_tag.indexOf(target)!=-1 || ism_data[ism_tag]["ch_name"].indexOf(target)!=-1 || ism_data[ism_tag]["en_name"].indexOf(target)!=-1 || ism_data[ism_tag]["figure"].indexOf(target)!=-1 || ism_data[ism_tag]["guise"].indexOf(target)!=-1 || ism_data[ism_tag]["group"].indexOf(target)!=-1){
                ism_node.classList.add("searched")
                if(ism_tag.length==3){
                    document.getElementById(ism_tag).classList.add("searched")
                }
            }
            else{
                let axis_list_length = ism_data[ism_tag]["axis_list"].length;
                for(let i=0;i<axis_list_length;i++){
                    if(ism_data[ism_tag]["axis_list"][i].indexOf(target)!=-1){
                        ism_node.classList.add("searched");
                        if(ism_tag.length==3){
                            document.getElementById(ism_tag).classList.add("searched")
                        }
                        break;
                    } 
                }
                let feature_list_length = ism_data[ism_tag]["feature_list"].length;
                for(let i=0;i<feature_list_length;i++){
                    if(ism_data[ism_tag]["feature_list"][i].indexOf(target)!=-1){
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
    document.getElementById("ism_name").textContent = "什么是主义主义魔方？"
    document.getElementById("ism_axis").textContent = "主义主义魔方是将主义主义精简化、文字化和可视化的左翼哲学分类学体系，主要由本网站制作者和兴趣人士制作。\n在主义主义魔方中，将哲学性质更强的前三格（场域、本体、现象）作为上方的主立方体的z（红）、y（绿）、x（蓝）轴，将伦理学性质更强的第四格（目的）单独设置为i（橙）轴。对于其中的思想、哲学和意识形态，可以查看其中英文名称、格的意涵、主要特征、在思想史和意识形态中的对应物以及对应群体。此外还提供检索功能，可以根据文字进行对应主义的检索。\n主义主义魔方旨在，方便主义主义的学习者和参考者总体性地和快速地把握主义主义的基本内容，推荐结合“未明子”账号下的相关视频学习和参考。同时，主义主义魔方目前还有许多不足，比如存在对原意的曲解以及可视化的不足，只是抛砖引玉，请辩证使用。"
    document.getElementById("ism_features").textContent = "什么是主义主义？"
    document.getElementById("ism_counterpart").textContent = "主义主义是一套左翼哲学分类学体系，由哲学家及民间活动家刘思墨首发，其主要内容以视频的形式由bilibili网站的账号“未明子”发布。\n在主义主义中，任何一种思想、主义或意识形态都可以通过4个格定位，此4格分别为：\n\t一：场域、本体论框架、意义存在的维度\n\t二：本体、存在性内容、本体论（存在论）\n\t三：现象、主体性感知、认识论\n\t四：目的、运动方向、伦理学\n其中，一二三格的哲学性质更强，第四格的伦理学性质更强。\n在格中填入1到4的整数可以定位一种思想、主义或意识形态。在4个整数中：\n\t1：表示整全、均质、同一性、一致性、一种无限的循环运动（空转）\n\t2：表示分裂、对抗、外在不一致性、一种冲突分裂的运动（二元分裂）\n\t3：表示妥协、调和、中介性、一种中心化的下坠运动（垂直下坠）\n\t4：表示虚无、不可能性、内在不一致性、开放性、一种敞开的运动（未知）\n在填入数字时，在第一格场域中填入的数字是决定性的，其中：\n\t1：形而下学/实在论，不反思，场域的天然秩序\n\t2：形而上学，不彻底的反思，场域的二重化\n\t3：观念论，彻底的反思，场域的中心化\n\t4：实践，反思的失败，历史的辩证法"
    document.getElementById("ism_link").textContent = "相关人员对主义主义魔方的制作仅出于爱好，并未通过主义主义魔方进行任何牟利行为，如刘思墨本人对此感到冒犯，请联系删除"
    document.getElementById("ism_link").href = "https://b23.tv/ZSur3zx"
    document.getElementById("ism_link").style.textDecoration = "underline"
}
