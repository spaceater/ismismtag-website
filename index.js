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
        }
        showIntroduction()
        document.getElementById("search_button").addEventListener("click",function(){searchISM(document.getElementById("search_text").value)})
        document.getElementById("reset_button").addEventListener("click",function(){document.getElementById("search_text").value="",searchISM("")})
        document.getElementById("size_indicator").addEventListener("mousedown",function(){setIndicatorActive()})
    }
    else{
        console.log("ism.json load failed")
        document.getElementById("ism_name").textContent = "数据加载失败\n\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)"
    }
}

function selectISM(ism_node){    
    setISMInfo(ism_node)
    let ism_tag = ism_node.getAttribute("ism_tag")
    let ism_length = ism_tag.length
    let ism_data_list_length = ism_detial_list.length
    for(let i=0;i<ism_data_list_length;i++){
        let ism_node = ism_detial_list[i]
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.add("selected")
            if(ism_node.getAttribute("ism_tag").length==3)
                document.getElementById(ism_node.getAttribute("ism_tag")).classList.add("selected")
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
            if(ism_node.getAttribute("ism_tag").length==3)
                document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("selected")
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
    document.getElementById("ism_name").innerHTML += '\n' + "<b>" + ism_tag_data.ch_name + '\n' + ism_tag_data.en_name + "</b>"
    //设置ism_axis标签
    let axis_list_data = ism_tag_data.axis_list
    let axis_list_length = axis_list_data.length
    document.getElementById("ism_axis").innerHTML = ""
    for(let i=0;i<axis_list_length;i++)
        document.getElementById("ism_axis").innerHTML += "<b style='color:" + axis_color[i] + "'>" + axis_list_data[i].slice(0,3) + "</b><b style='border:solid black 0.05rem'>" + axis_list_data[i].slice(3,4) + "</b><b>" + axis_list_data[i].slice(4,5) + "</b>" + axis_list_data[i].slice(5) + '\n' 
    //设置ism_features标签
    let feature_list_data = ism_tag_data.feature_list
    let feature_list_length = feature_list_data.length
    document.getElementById("ism_features").innerHTML = ""
    for(let i=0;i<feature_list_length;i++){
        if(feature_list_data[i]!="")
            document.getElementById("ism_features").innerHTML += "<b>" + feature_list_data[i].slice(0,1) + "</b>" + feature_list_data[i].slice(1) + '\n'
    }
    //设置ism_related标签
    let related_list_data = ism_tag_data.related_list
    let related_list_length = related_list_data.length
    document.getElementById("ism_related").innerHTML = ""
    for(let i=0;i<related_list_length;i++){
        if(related_list_data[i]!=""){
            let split_index = related_list_data[i].indexOf('：')
            if(related_list_data[i].search("http")==-1)
                document.getElementById("ism_related").innerHTML += "<b>" + related_list_data[i].slice(0,split_index+1) + "</b>" + related_list_data[i].slice(split_index+1) + '\n'
            else
                document.getElementById("ism_related").innerHTML += "<b>" + related_list_data[i].slice(0,split_index+1) + "</b><a href='" + related_list_data[i].slice(split_index+1) + "' target='_blank'>" + related_list_data[i].slice(split_index+1) + '</a>\n'
        }    
    }
    //设置搜索关键字加背景色
    if(document.getElementById("search_text").value!="")
        renewInfo(document.getElementById("search_text").value)
}

function renewInfo(target){
    let reg = new RegExp(target,'gi')//全局且忽略大小写
    document.getElementById("ism_name").innerHTML = document.getElementById("ism_name").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
    document.getElementById("ism_axis").innerHTML = document.getElementById("ism_axis").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
    document.getElementById("ism_features").innerHTML = document.getElementById("ism_features").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
    document.getElementById("ism_related").innerHTML = document.getElementById("ism_related").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>")
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
                    document.getElementById(ism_node.getAttribute("ism_tag")).classList.add("pinned")
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
        let result_count = 0
        let reg = new RegExp(target,'i')//忽略大小写
        let ism_data_list_length = ism_detial_list.length
        for(let i=0;i<ism_data_list_length;i++){
            let ism_node = ism_detial_list[i]
            let ism_tag = ism_node.getAttribute("ism_tag")
            let ism_tag_data = ism_data[ism_tag]
            if(ism_tag_data.ch_name.search(reg)!=-1 || ism_tag_data.en_name.search(reg)!=-1){
                result_count += 1
                ism_node.classList.add("searched")
                if(ism_tag.length==3){
                    document.getElementById(ism_tag).classList.add("searched")
                }
            }
            else{
                let axis_list_data = ism_tag_data.axis_list
                let axis_list_length = axis_list_data.length
                for(let i=0;i<axis_list_length;i++){
                    if(axis_list_data[i].search(reg)!=-1){
                        result_count += 1
                        ism_node.classList.add("searched")
                        if(ism_tag.length==3)
                            document.getElementById(ism_tag).classList.add("searched")
                        break
                    } 
                }
                if(!ism_node.classList.contains("searched")){
                    let feature_list_data = ism_tag_data.feature_list
                    let feature_list_length = feature_list_data.length
                    for(let i=0;i<feature_list_length;i++){
                        if(ism_tag_data.feature_list[i].search(reg)!=-1){
                            result_count += 1
                            ism_node.classList.add("searched")
                            if(ism_tag.length==3)
                                document.getElementById(ism_tag).classList.add("searched")
                            break
                        }
                    }
                    if(!ism_node.classList.contains("searched")){
                        let related_list_data = ism_tag_data.related_list
                        let related_list_length = related_list_data.length
                        for(let i=0;i<related_list_length;i++){
                            if(related_list_data[i].search(reg)!=-1){
                                result_count += 1
                                ism_node.classList.add("searched")
                                if(ism_tag.length==3)
                                    document.getElementById(ism_tag).classList.add("searched")
                                break
                            }
                        }
                    }
                }
            }
        }
        document.getElementById("ism_name").innerHTML = ""
        document.getElementById("ism_axis").innerHTML = "<b>检索词：</b><a href='https://www.baidu.com/s?wd=" + target + "' target='_blank'>" + target + "</a>"
        document.getElementById("ism_features").innerHTML = "<span style='background-color:rgb(225,172,39)'>检索完成</span>"
        document.getElementById("ism_related").innerHTML = "总共检索到<b> " + result_count + " </b>个结果"
    }
    else{
        showIntroduction()
    }
}

function showIntroduction(){
    let introduction = ism_data.introduction
    //设置ism_name标签
    document.getElementById("ism_name").innerHTML = introduction.ismismcube
    //设置ism_axis标签
    let introduction_length = introduction.ismismcube_introduction.length
    document.getElementById("ism_axis").innerHTML = ""
    for(let i=0;i<introduction_length;i++)
        document.getElementById("ism_axis").innerHTML += introduction.ismismcube_introduction[i]
    //设置ism_features标签
    document.getElementById("ism_features").innerHTML = introduction.ismism
    //设置ism_related标签
    introduction_length = introduction.ismism_introduction.length
    document.getElementById("ism_related").innerHTML = ""
    for(let i=0;i<introduction_length;i++)
        document.getElementById("ism_related").innerHTML += introduction.ismism_introduction[i]
    document.getElementById("ism_related").innerHTML += '\n\n' + introduction.warning + '\n' + introduction.group + '\n' + introduction.link
}

function setIndicatorActive(){
    document.getElementById("size_indicator").style.backgroundColor = "gray"
    document.body.onselectstart=()=>{return false}
    window.addEventListener("mouseup",setOverview)
    window.addEventListener("mousemove",changeSize)
    window.addEventListener("mouseup",closeIndicatorr)
}

function setOverview(){
    document.getElementById("size_indicator").style.backgroundColor = "rgb(200,200,200)"
    document.body.onselectstart=()=>{return true}
    window.removeEventListener("mouseup",setOverview)
    window.removeEventListener("mousemove",changeSize)
    window.removeEventListener("mouseup",closeIndicatorr)
    if(document.getElementById("left_part").offsetLeft<0){
        document.getElementById("left_part").style.cssText = "animation: left_open 1s ease-in-out forwards;"
        document.getElementById("right_part").style.cssText = "animation: right_open 1s ease-in-out forwards;"
    }
    else{
        document.getElementById("left_part").style.cssText = "animation: left_close 1s ease-in-out forwards;"
        document.getElementById("right_part").style.cssText = "animation: right_close 1s ease-in-out forwards;"
    }
}

function changeSize(event){
    window.removeEventListener("mouseup",setOverview)
    let value = event.clientY
    let max = document.getElementById("background_line").offsetHeight
    if(value<0)
        value=0
    else if(value>max)
        value=max
    document.getElementById("size_indicator").style.top = value + "px"
    let size_rate = 1 + value / max * 2
    if(size_rate >= 1.2){
        size_rate -= 0.2
        document.getElementById("ismism_cube_box").style.cssText = "transform: scale(" + size_rate + ")"       
    }
    else{
        document.getElementById("ismism_cube_box").style.cssText = "transform: scale(1)"       
    }
}

function closeIndicatorr(){
    document.getElementById("size_indicator").style.backgroundColor = "rgb(200,200,200)"
    document.body.onselectstart=()=>{return true}
    window.removeEventListener("mouseup",setOverview)
    window.removeEventListener("mousemove",changeSize)
    window.removeEventListener("mouseup",closeIndicatorr)
}
