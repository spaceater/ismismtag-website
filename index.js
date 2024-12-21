let ism_detial_list = document.getElementsByClassName("ism")
let ism_data = null
let axis_color = ["red","green","blue","darkorange"]
let ism_info_font_size = 1.0;

let xhr = new XMLHttpRequest()
xhr.open("GET","ism.json",true)
xhr.send(null)
xhr.onload = ()=>{
    if(xhr.status === 200){
        ism_data=JSON.parse(xhr.responseText)
        for(let i=0;i<ism_detial_list.length;i++){
	        let ism_node = ism_detial_list[i]
            let ism_name = ism_data[ism_node.getAttribute("ism_tag")]["ch_name"].split('/')[0].replace('“','"').replace('”','"')
            ism_node.firstChild.textContent = ism_name
            if(ism_name.length<=4)
    	        ism_node.firstChild.style.fontSize = "1rem"
            else
    	        ism_node.firstChild.style.fontSize = "0.75rem"
            if(ism_data[ism_node.getAttribute("ism_tag")]["en_name"]=="")
                ism_node.classList.add("no_data")
	        ism_node.addEventListener("mouseenter",function(){selectISM(ism_node.getAttribute("ism_tag"))})
	        ism_node.addEventListener("mouseleave",function(){unselectISM(ism_node.getAttribute("ism_tag"))})
            ism_node.addEventListener("click",function(){window.location.hash=(window.location.hash.slice(1)==ism_node.getAttribute("ism_tag")?"":ism_node.getAttribute("ism_tag"))})
        }
        showIntroduction()
        document.getElementById("return_button").textContent = "更多内容"
        document.getElementById("return_button").addEventListener("click",function(){window.open("https://www.maybered.com","_blank")})
        document.getElementById("search_button").textContent = "检索"
        document.getElementById("search_button").addEventListener("click",function(){searchISM(document.getElementById("search_text").value)})
        document.getElementById("reset_button").textContent = "重置"
        document.getElementById("reset_button").addEventListener("click",function(){resetISM(),document.getElementById("search_text").value="",window.onhashchange()})
        document.getElementById("increase_fontsize_button").addEventListener("click",function(){ism_info_font_size+=0.1,document.getElementById("ism_info").style["font-size"]=ism_info_font_size+"rem";if(window.location.hash.slice(1)!=""){window.onhashchange()}})
        document.getElementById("decrease_fontsize_button").addEventListener("click",function(){ism_info_font_size-=0.1,document.getElementById("ism_info").style["font-size"]=ism_info_font_size+"rem";if(window.location.hash.slice(1)!=""){window.onhashchange()}})
        document.getElementById("size_indicator").addEventListener("mousedown",function(){setIndicatorActive()})
    }
    else{
        console.log("ism.json load failed")
        document.getElementById("ism_name").textContent = "数据加载失败\n\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)"
    }
}

function selectISM(ism_tag){    
    setISMInfo(ism_tag)
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

function unselectISM(ism_tag){
    let ism_length = ism_tag.length
    let ism_data_list_length = ism_detial_list.length
    for(let i=0;i<ism_data_list_length;i++){
        let ism_node = ism_detial_list[i]
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.remove("selected")
            if(ism_node.getAttribute("ism_tag").length==3)
                document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("selected")
        }
    }
    window.onhashchange()
}

window.onhashchange = function(){
    for(let i=0;i<ism_detial_list.length;i++){
        let ism_node = ism_detial_list[i]
        ism_node.classList.remove("pinned")
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned")
        }
    }
    let ism_tag = window.location.hash.slice(1)
    if(ism_tag==""){
        document.title = "主义主义魔方"
        showIntroduction()
    }
    else{
        if(ism_tag in ism_data){
            document.title = "主义主义魔方-"+ism_data[ism_tag].ch_name
            setISMInfo(ism_tag)
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
        else{
            window.location.hash = ""
        }
    }    
}

function setISMInfo(ism_tag){
    let ism_tag_data = ism_data[ism_tag]
    //设置ism_name标签
    if(ism_tag.length>=1)
        document.getElementById("ism_name").innerHTML = "<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:red;border:solid black 0.1rem;'><b>"+ism_tag[0]+"</b></p>"
    if(ism_tag.length>=3)
        document.getElementById("ism_name").innerHTML += "-<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:green;border:solid black 0.1rem'><b>"+ism_tag[2]+"</b></p>"
    if(ism_tag.length>=5)
        document.getElementById("ism_name").innerHTML += "-<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:blue;border:solid black 0.1rem'><b>"+ism_tag[4]+"</b></p>"
    if(ism_tag.length>=7)
        document.getElementById("ism_name").innerHTML += "-<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:darkorange;border:solid black 0.1rem'><b>"+ism_tag[6]+"</b></p>"
    document.getElementById("ism_name").innerHTML += '\n'+"<b>"+ism_tag_data.ch_name+'\n'+ism_tag_data.en_name+"</b>"
    //设置ism_axis标签
    let axis_list_data = ism_tag_data.axis_list
    let axis_list_length = axis_list_data.length
    document.getElementById("ism_axis").innerHTML = ""
    for(let i=0;i<axis_list_length;i++)
        document.getElementById("ism_axis").innerHTML += "<b style='color:"+axis_color[i]+"'>"+axis_list_data[i].slice(0,3)+"</b><p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;border:solid black 0.1rem;text-align:center'><b>"+axis_list_data[i].slice(3,4)+"</b></p>"+axis_list_data[i].slice(4)+'\n' 
    //设置ism_features标签
    let feature_list_data = ism_tag_data.feature_list
    let feature_list_length = feature_list_data.length
    document.getElementById("ism_features").innerHTML = ""
    for(let i=0;i<feature_list_length;i++){
        if(feature_list_data[i]!="")
            document.getElementById("ism_features").innerHTML += "<b>"+feature_list_data[i].slice(0,1)+"</b>"+feature_list_data[i].slice(1)+'\n'
    }
    //设置ism_related标签
    let related_list_data = ism_tag_data.related_list
    let related_list_length = related_list_data.length
    document.getElementById("ism_related").innerHTML = ""
    for(let i=0;i<related_list_length;i++){
        if(related_list_data[i]!=""){
            let split_index = related_list_data[i].indexOf('：')
            if(related_list_data[i].search("http")==-1)
                document.getElementById("ism_related").innerHTML += "<b>"+related_list_data[i].slice(0,split_index+1)+"</b>"+related_list_data[i].slice(split_index+1)+'\n'
            else
                document.getElementById("ism_related").innerHTML += "<b>"+related_list_data[i].slice(0,split_index+1)+"</b><a href='"+related_list_data[i].slice(split_index+1)+"' target='_blank'>"+related_list_data[i].slice(split_index+1)+'</a>\n'
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

function searchISM(target){
    history.replaceState(null,null,"/#")
    document.title = "主义主义魔方"
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
        document.getElementById("ism_axis").innerHTML = "<b>检索词：</b><a href='https://www.baidu.com/s?wd="+target+"' target='_blank'>"+target+"</a>"
        document.getElementById("ism_features").innerHTML = "<b style='color:rgb(255,30,30)'>检索完成</b>"
        document.getElementById("ism_related").innerHTML = "总共检索到<b> "+result_count+" </b>个结果"
    }
    else{
        document.getElementById("ism_name").innerHTML = ""
        document.getElementById("ism_axis").innerHTML = "<b style='color:rgb(255,30,30)'>未键入检索词</b>"
        document.getElementById("ism_features").innerHTML = "<b>若要进行检索，请先在左上角的检索栏中键入检索词</b>"
        document.getElementById("ism_related").innerHTML = ""
    }
}

function resetISM(){
    window.location.hash = ""
    for(let i=0;i<ism_detial_list.length;i++){
        let ism_node = ism_detial_list[i]
        ism_node.classList.remove("pinned")
        ism_node.classList.remove("searched")
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned")
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("searched")
        }
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
    document.getElementById("ism_related").innerHTML += '\n\n'+introduction.Github+introduction.Github_pages+introduction.group+introduction.link+'\n'+introduction.warning+"\n<HR><p style='text-align:center'><a href='https://beian.miit.gov.cn/' target='_blank' style='font-style:normal;text-decoration:none'>京ICP备2024067574号-1</a><p><p style='text-align:center'><a href='https://beian.mps.gov.cn/#/query/webSearch?code=11010802044945' target='_blank' style='font-style:normal;text-decoration:none'>京公网安备11010802044945</a><p>"
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
        document.getElementById("ismism_cube_box").style.cssText = "transform: scale("+size_rate+")"       
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
