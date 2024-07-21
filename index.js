let ism_detial_list = document.getElementsByClassName("ism")
let info_box = document.getElementById("info_box")
let ism_data = null
let ism_pinned = null
let axis_color = ["red","green","blue","darkorange"]

document.getElementById("ism_name").textContent = "数据正在加载中\n\n若长时间未刷新\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)"
window.onscroll=()=>{
    info_box.style.left = -window.scrollX + "px"
}

let xhr = new XMLHttpRequest()
xhr.open("GET","/ism.json",true)
xhr.send(null)
xhr.onload = ()=>{
    if(xhr.status === 200){
        ism_data=JSON.parse(xhr.responseText)
        for(let i=0;i<ism_detial_list.length;i++){
	        let ism_node = ism_detial_list[i]
            let ism_name = ism_data[ism_node.getAttribute("ism_tag")]["ch_name"].split('/')[0].replace('“','"').replace('”','"')
            ism_node.firstChild.textContent = ism_name
            if(ism_name.length<=4)
    	        ism_node.style.fontSize = "1rem"
            else
    	        ism_node.style.fontSize = "0.75rem"
            if(ism_data[ism_node.getAttribute("ism_tag")]["en_name"]=="")
                ism_node.classList.add("no_data")
	        ism_node.addEventListener("mouseenter",function(){selectISM(ism_node)})
	        ism_node.addEventListener("mouseleave",function(){unselectISM(ism_node)})
            ism_node.addEventListener("click",function(){pinISM(ism_node)})
            document.getElementById("search_button").addEventListener("click",function(){searchISM(document.getElementById("search_box").value)})
            document.getElementById("clear_search_button").addEventListener("click",function(){searchISM(""),document.getElementById("search_box").value=""})
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
        showIntroduction()
    }
    let ism_tag = ism_node.getAttribute("ism_tag")
    let ism_length=ism_tag.length
    let ism_data_list_length = ism_detial_list.length
    for(let i=0;i<ism_data_list_length;i++){
        let ism_node = ism_detial_list[i]
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.remove("selected")
            if(ism_node.getAttribute("ism_tag").length==3){
                document.getElementById(ism_tag).classList.remove("selected")
            }
        }
    }
}

function setISMInfo(ism_node){
    let ism_tag = ism_node.getAttribute("ism_tag")
    let ism_tag_data = ism_data[ism_tag]
    //设置ism_name标签
    if(ism_tag.length>=1)
        document.getElementById("ism_name").innerHTML = "<b style='color:red;border:solid black 0.05rem'>"+ism_tag[0]+"</b>"
    if(ism_tag.length>=3)
        document.getElementById("ism_name").innerHTML += "-<b style='color:green;border:solid black 0.05rem'>"+ism_tag[2]+"</b>"
    if(ism_tag.length>=5)
        document.getElementById("ism_name").innerHTML += "-<b style='color:blue;border:solid black 0.05rem'>"+ism_tag[4]+"</b>"
    if(ism_tag.length>=7)
        document.getElementById("ism_name").innerHTML += "-<b style='color:darkorange;border:solid black 0.05rem'>"+ism_tag[6]+"</b>"
    document.getElementById("ism_name").innerHTML += '\n' + "<b>" + ism_tag_data["ch_name"] + '\n' + ism_tag_data["en_name"] + "</b>"
    //设置ism_axis标签
    let axis_list_length = ism_tag_data["axis_list"].length
    document.getElementById("ism_axis").textContent = ""
    for(let i=0;i<axis_list_length;i++)
        document.getElementById("ism_axis").innerHTML += "<b style='color:" + axis_color[i] + "'>" + ism_tag_data["axis_list"][i].slice(0,3) + "</b>" + ism_tag_data["axis_list"][i].slice(3) + '\n' 
    //设置ism_features标签
    let feature_list_length = ism_tag_data["feature_list"].length
    document.getElementById("ism_features").textContent = ""
    for(let i=0;i<feature_list_length;i++)
        document.getElementById("ism_features").innerHTML += "<b>" + ism_tag_data["feature_list"][i].slice(0,1) + "</b>" + ism_tag_data["feature_list"][i].slice(1) + '\n'
    //设置ism_counterpart标签
    document.getElementById("ism_counterpart").textContent = ""
    if(ism_tag_data["figure"]!=""){
        let split_index = ism_tag_data["figure"].indexOf('：')
        document.getElementById("ism_counterpart").innerHTML += "<b>" + ism_tag_data["figure"].slice(0,split_index) + "</b>" + ism_tag_data["figure"].slice(split_index) + '\n'
    }
    if(ism_tag_data["guise"]!=""){
        let split_index = ism_tag_data["guise"].indexOf('：')
        document.getElementById("ism_counterpart").innerHTML += "<b>" + ism_tag_data["guise"].slice(0,split_index) + "</b>" + ism_tag_data["guise"].slice(split_index) + '\n'
    }
    if(ism_tag_data["group"]!=""){
        let split_index = ism_tag_data["group"].indexOf('：')
        document.getElementById("ism_counterpart").innerHTML += "<b>" + ism_tag_data["group"].slice(0,split_index) + "</b>" + ism_tag_data["group"].slice(split_index) + '\n'
    }
    //设置ism_link标签
    let split_index = ism_tag_data["link"].indexOf('：')
    document.getElementById("ism_link").innerHTML = "<b>" + ism_tag_data["link"].slice(0,split_index) + "</b>：<i style='text-decoration:underline'>" + ism_tag_data["link"].slice(split_index+1) + "</i>"
    document.getElementById("ism_link").href = ism_tag_data["link"].slice(split_index+1)
    //设置搜索关键字加背景色
    if(document.getElementById("search_box").value!="")
        renewInfo(document.getElementById("search_box").value)
}

function renewInfo(target){
    let reg = new RegExp(target,'gi')//全局且忽略大小写
    document.getElementById("ism_name").innerHTML = document.getElementById("ism_name").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
    document.getElementById("ism_axis").innerHTML = document.getElementById("ism_axis").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
    document.getElementById("ism_features").innerHTML = document.getElementById("ism_features").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
    document.getElementById("ism_counterpart").innerHTML = document.getElementById("ism_counterpart").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
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
        ism_pinned = ism_node
        setISMInfo(ism_node)
        let ism_tag = ism_node.getAttribute("ism_tag")
        let ism_length=ism_tag.length
        let ism_data_list_length = ism_detial_list.length
        for(let i=0;i<ism_data_list_length;i++){
            let ism_node = ism_detial_list[i]
            if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
                ism_node.classList.add("pinned")
                if(ism_node.getAttribute("ism_tag").length==3){
                    document.getElementById(ism_tag).classList.add("pinned")
                }
            }
        }
    }
}

function searchISM(target){
    ism_pinned = null
    for(let i=0;i<ism_detial_list.length;i++){
        let ism_node = ism_detial_list[i]
        ism_node.classList.remove("pinned")
        ism_node.classList.remove("searched")
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned")
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("searched")
        }
    }
    if(target != ""){
        let reg = new RegExp(target,'i')//忽略大小写
        let ism_data_list_length = ism_detial_list.length
        for(let i=0;i<ism_data_list_length;i++){
            let ism_node = ism_detial_list[i]
            let ism_tag = ism_node.getAttribute("ism_tag")
            if(ism_data[ism_tag]["ch_name"].search(reg)!=-1 || ism_data[ism_tag]["en_name"].search(reg)!=-1 || ism_data[ism_tag]["figure"].search(reg)!=-1 || ism_data[ism_tag]["guise"].search(reg)!=-1 || ism_data[ism_tag]["group"].search(reg)!=-1){
                ism_node.classList.add("searched")
                if(ism_tag.length==3){
                    document.getElementById(ism_tag).classList.add("searched")
                }
            }
            else{
                let axis_list_length = ism_data[ism_tag]["axis_list"].length
                for(let i=0;i<axis_list_length;i++){
                    if(ism_data[ism_tag]["axis_list"][i].search(reg)!=-1){
                        ism_node.classList.add("searched")
                        if(ism_tag.length==3){
                            document.getElementById(ism_tag).classList.add("searched")
                        }
                        break
                    } 
                }
                let feature_list_length = ism_data[ism_tag]["feature_list"].length
                for(let i=0;i<feature_list_length;i++){
                    if(ism_data[ism_tag]["feature_list"][i].search(reg)!=-1){
                        ism_node.classList.add("searched")
                        if(ism_tag.length==3){
                            document.getElementById(ism_tag).classList.add("searched")
                        }
                        break
                    }
                }
            }
        } 
    }
    showIntroduction()
}

function showIntroduction(){
    let introduction = ism_data["introduction"]
    //设置ism_name标签
    document.getElementById("ism_name").innerHTML = introduction.ismismcube
    //设置ism_axis标签
    let introduction_length = introduction["ismismcube_introduction"].length
    document.getElementById("ism_axis").innerHTML = '\t'
    for(let i=0;i<introduction_length;i++)
        document.getElementById("ism_axis").innerHTML += introduction["ismismcube_introduction"][i]
    //设置ism_features标签
    document.getElementById("ism_features").innerHTML = introduction.ismism
    //设置ism_counterpart标签
    introduction_length = introduction["ismism_introduction"].length
    document.getElementById("ism_counterpart").innerHTML = '\t'
    for(let i=0;i<introduction_length;i++)
        document.getElementById("ism_counterpart").innerHTML += introduction["ismism_introduction"][i]
    //设置ism_link标签
    document.getElementById("ism_link").innerHTML = introduction["warning"] + '\n' + introduction["group"] + '\n' + introduction["link"]
    document.getElementById("ism_link").href = ""
}
