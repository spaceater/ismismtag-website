let ism_data = null
let axis_color = ["red","green","blue","darkorange"]
let ism_info_font_size = 1.0;

initial();
const socket = new WebSocket("ws://127.0.0.1:1999");// 此参数在部署时需要修改为"wss://www.maybered.com"，并确认此地址已经在Nginx中反向代理
socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    document.querySelector("#left_part #online_count b").textContent = data["online_count"];
});

function initial(){
    const get_ism_json = new XMLHttpRequest();
    get_ism_json.open("GET","/assets/ism.json",true);
    get_ism_json.send();
    get_ism_json.onload = ()=>{
        if(get_ism_json.status === 200){
            ism_data = JSON.parse(get_ism_json.responseText);
            for(const ism_node of document.querySelectorAll(".ism")){
                let ism_name = ism_data[ism_node.getAttribute("ism_tag")]["ch_name"].split('/')[0].replace('“','"').replace('”','"');
                ism_node.firstChild.textContent = ism_name;
                if(ism_name.length <= 4) ism_node.firstChild.style.fontSize = "1rem";
                else ism_node.firstChild.style.fontSize = "0.75rem";
                if(ism_data[ism_node.getAttribute("ism_tag")]["en_name"] == "") ism_node.classList.add("no_data");
	            ism_node.addEventListener("mouseenter",function(){selectISM(ism_node.getAttribute("ism_tag"));})
	            ism_node.addEventListener("mouseleave",function(){unselectISM(ism_node.getAttribute("ism_tag"));})
                ism_node.addEventListener("click",function(){window.location.hash=(window.location.hash.slice(1)==ism_node.getAttribute("ism_tag")?"":ism_node.getAttribute("ism_tag"));})
            }
            window.onhashchange();
            document.getElementById("return_button").textContent = "更多内容";
            document.getElementById("return_button").addEventListener("click",function(){window.open("https://www.maybered.com","_blank");})
            document.getElementById("search_button").textContent = "检索";
            document.getElementById("search_button").addEventListener("click",function(){searchISM(document.getElementById("search_text").value);})
            document.getElementById("reset_button").textContent = "重置";
            document.getElementById("reset_button").addEventListener("click",function(){
                resetISM();
                document.getElementById("search_text").value="";
                window.onhashchange();
            })
            document.getElementById("increase_fontsize_button").addEventListener("click",function(){
                ism_info_font_size+=0.1;
                document.getElementById("ism_info").style["font-size"]=ism_info_font_size+"rem";
                if(window.location.hash.slice(1)!="") window.onhashchange();
            })
            document.getElementById("decrease_fontsize_button").addEventListener("click",function(){
                ism_info_font_size-=0.1;
                document.getElementById("ism_info").style["font-size"]=ism_info_font_size+"rem";
                if(window.location.hash.slice(1)!="") window.onhashchange();
            })
            document.getElementById("size_indicator").addEventListener("mousedown",function(){setIndicatorActive();})
        }
        else{
            console.log("ism.json load failed");
            document.getElementById("ism_name").textContent = "数据加载失败\n\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)";
        }
    }
    const get_page_view = new XMLHttpRequest();
    get_page_view.open("GET","/api/page_view",true);
    get_page_view.send();
    get_page_view.onload = ()=>{
        if(get_page_view.status === 200){
            document.querySelector("#left_part #page_view b").textContent = JSON.parse(get_page_view.responseText)["page_view"];
        }
    }
}

function selectISM(ism_tag){    
    setISMInfo(ism_tag);
    const ism_length = ism_tag.length;
    for(const ism_node of document.querySelectorAll(".ism")){
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.add("selected");
            if(ism_node.getAttribute("ism_tag").length==3) document.getElementById(ism_node.getAttribute("ism_tag")).classList.add("selected");
        }
    }
}

function unselectISM(ism_tag){
    const ism_length = ism_tag.length;
    for(const ism_node of document.querySelectorAll(".ism")){
        if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
            ism_node.classList.remove("selected");
            if(ism_node.getAttribute("ism_tag").length==3) document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("selected");
        }
    }
    window.onhashchange();
}

window.onhashchange = function(){
    for(const ism_node of document.querySelectorAll(".ism")){
        ism_node.classList.remove("pinned");
        if(ism_node.getAttribute("ism_tag").length==3) document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned");
    }
    const ism_tag = window.location.hash.slice(1);
    if(ism_tag==""){
        document.title = "主义主义魔方";
        showIntroduction();
    }
    else{
        if(ism_tag in ism_data){
            document.title = "主义主义魔方-" + ism_data[ism_tag].ch_name;
            setISMInfo(ism_tag);
            const ism_length = ism_tag.length;
            for(const ism_node of document.querySelectorAll(".ism")){
                if(ism_node.getAttribute("ism_tag").slice(0,ism_length) == ism_tag){
                    ism_node.classList.add("pinned");
                    if(ism_node.getAttribute("ism_tag").length==3) document.getElementById(ism_node.getAttribute("ism_tag")).classList.add("pinned");
                }
            }
        }
        else{
            window.location.hash = "";
        }
    }    
}

function setISMInfo(ism_tag){
    document.getElementById("ism_name").innerHTML = "";
    document.getElementById("ism_axis").innerHTML = "";
    document.getElementById("ism_features").innerHTML = "";
    document.getElementById("ism_related").innerHTML = "";
    const ism_tag_data = ism_data[ism_tag];
    //设置ism_name标签
    if(ism_tag.length>=1) document.getElementById("ism_name").innerHTML += "<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:red;border:solid black "+0.1*ism_info_font_size+"rem;'><b>"+ism_tag[0]+"</b></p>";
    if(ism_tag.length>=3) document.getElementById("ism_name").innerHTML += "-<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:green;border:solid black "+0.1*ism_info_font_size+"rem'><b>"+ism_tag[2]+"</b></p>";
    if(ism_tag.length>=5) document.getElementById("ism_name").innerHTML += "-<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:blue;border:solid black "+0.1*ism_info_font_size+"rem'><b>"+ism_tag[4]+"</b></p>";
    if(ism_tag.length>=7) document.getElementById("ism_name").innerHTML += "-<p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;color:darkorange;border:solid black "+0.1*ism_info_font_size+"rem'><b>"+ism_tag[6]+"</b></p>";
    document.getElementById("ism_name").innerHTML += '\n'+"<b>"+ism_tag_data.ch_name+'\n'+ism_tag_data.en_name+"</b>";
    //设置ism_axis标签
    const axis_list_data = ism_tag_data.axis_list;
    let color_count = 0;
    for(const i of axis_list_data){
        document.getElementById("ism_axis").innerHTML += "<b style='color:"+axis_color[color_count++]+"'>"+i.slice(0,3)+"</b><p style='display:inline-block;width:"+1.1*ism_info_font_size+"rem;height:"+1.1*ism_info_font_size+"rem;line-height:"+1.1*ism_info_font_size+"rem;border:solid black "+0.1*ism_info_font_size+"rem;text-align:center'><b>"+i.slice(3,4)+"</b></p>"+i.slice(4)+'\n';        
    }
    //设置ism_features标签
    const feature_list_data = ism_tag_data.feature_list;
    for(const i of feature_list_data){
        if(i != "") document.getElementById("ism_features").innerHTML += "<b>"+i.slice(0,1)+"</b>"+i.slice(1)+'\n';
    }
    //设置ism_related标签
    const related_list_data = ism_tag_data.related_list;
    for(const i of related_list_data){
        if(i != ""){
            const split_index = i.indexOf('：')+1;
            if(i.search("http") == -1){
                document.getElementById("ism_related").innerHTML += "<b>"+i.slice(0,split_index)+"</b>"+i.slice(split_index)+'\n';
            }else{
                document.getElementById("ism_related").innerHTML += "<b>"+i.slice(0,split_index)+"</b><a href='"+i.slice(split_index)+"' target='_blank'>"+i.slice(split_index)+'</a>\n';
            }
        }
    }
    //设置搜索关键字加背景色
    if(document.getElementById("search_text").value!=""){
        renewInfo(document.getElementById("search_text").value);
    }
}

function renewInfo(target){
    const reg = new RegExp(target,'gi');//全局且忽略大小写
    document.getElementById("ism_name").innerHTML = document.getElementById("ism_name").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_axis").innerHTML = document.getElementById("ism_axis").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_features").innerHTML = document.getElementById("ism_features").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
    document.getElementById("ism_related").innerHTML = document.getElementById("ism_related").innerHTML.replace(reg,"<span style='background-color:rgb(225, 172, 39);'>$&</span>");
}

function searchISM(target){
    history.replaceState(null,null,"/#");
    document.title = "主义主义魔方";
    for(const ism_node of document.querySelectorAll(".ism")){
        ism_node.classList.remove("pinned");
        ism_node.classList.remove("searched");
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned");
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("searched");
        }
    }
    if(target != ""){
        const reg = new RegExp(target,'i');//忽略大小写
        let result_count = 0;
        for(const ism_node of document.querySelectorAll(".ism")){
            const ism_tag = ism_node.getAttribute("ism_tag");
            const ism_tag_data = ism_data[ism_tag];
            if(ism_tag_data.ch_name.search(reg)!=-1 || ism_tag_data.en_name.search(reg)!=-1){
                result_count += 1;
                ism_node.classList.add("searched");
                if(ism_tag.length==3) document.getElementById(ism_tag).classList.add("searched");
                continue;
            }
            let found = false;
            const axis_list_data = ism_tag_data.axis_list;
            for(const i of axis_list_data){
                if(i.search(reg) != -1){
                    result_count += 1;
                    ism_node.classList.add("searched");
                    if(ism_tag.length==3) document.getElementById(ism_tag).classList.add("searched");
                    found = true;
                    break;
                } 
            }
            if(found) continue;
            const feature_list_data = ism_tag_data.feature_list;
            for(const i of feature_list_data){
                if(i.search(reg) != -1){
                    result_count += 1;
                    ism_node.classList.add("searched");
                    if(ism_tag.length==3) document.getElementById(ism_tag).classList.add("searched");
                    found = true;
                    break;
                }
            }
            if(found) continue;
            const related_list_data = ism_tag_data.related_list
            for(const i of related_list_data){
                if(i.search(reg) != -1){
                    result_count += 1;
                    ism_node.classList.add("searched");
                    if(ism_tag.length==3) document.getElementById(ism_tag).classList.add("searched");
                    break;
                }
            }
        }
        document.getElementById("ism_name").innerHTML = "";
        document.getElementById("ism_axis").innerHTML = "<b>检索词：</b><a href='https://www.baidu.com/s?wd="+target+"' target='_blank'>"+target+"</a>";
        document.getElementById("ism_features").innerHTML = "<b style='color:rgb(255,30,30)'>检索完成</b>";
        document.getElementById("ism_related").innerHTML = "总共检索到<b> "+result_count+" </b>个结果";
    }
    else{
        document.getElementById("ism_name").innerHTML = "";
        document.getElementById("ism_axis").innerHTML = "<b style='color:rgb(255,30,30)'>未键入检索词</b>";
        document.getElementById("ism_features").innerHTML = "<b>若要进行检索，请先在左上角的检索栏中键入检索词</b>";
        document.getElementById("ism_related").innerHTML = "";
    }
}

function resetISM(){
    window.location.hash = "";
    for(const ism_node of document.querySelectorAll(".ism")){
        ism_node.classList.remove("pinned");
        ism_node.classList.remove("searched");
        if(ism_node.getAttribute("ism_tag").length==3){
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("pinned");
            document.getElementById(ism_node.getAttribute("ism_tag")).classList.remove("searched");
        }
    }
}

function showIntroduction(){
    document.getElementById("ism_name").innerHTML = "";
    document.getElementById("ism_axis").innerHTML = "";
    document.getElementById("ism_features").innerHTML = "";
    document.getElementById("ism_related").innerHTML = "";
    const introduction = ism_data.introduction;
    //设置ism_name标签
    document.getElementById("ism_name").innerHTML = introduction.ismismcube;
    //设置ism_axis标签
    for(const i of introduction.ismismcube_introduction){
        document.getElementById("ism_axis").innerHTML += i;
    }
    //设置ism_features标签
    document.getElementById("ism_features").innerHTML = introduction.ismism;
    //设置ism_related标签
    for(const i of introduction.ismism_introduction){
        document.getElementById("ism_related").innerHTML += i;
    }
    document.getElementById("ism_related").innerHTML += '\n\n'+introduction.Github+introduction.Github_pages+introduction.group+introduction.link+'\n'+introduction.warning+"\n<HR><p style='text-align:center'><a href='https://beian.miit.gov.cn/' target='_blank' style='font-style:normal;text-decoration:none'>京ICP备2024067574号-1</a><p><p style='text-align:center'><a href='https://beian.mps.gov.cn/#/query/webSearch?code=11010802044945' target='_blank' style='font-style:normal;text-decoration:none'>京公网安备11010802044945</a><p>";
}

function setIndicatorActive(){
    document.getElementById("size_indicator").style.backgroundColor = "gray";
    document.body.onselectstart = ()=>{return false}
    window.addEventListener("mouseup",setOverview);
    window.addEventListener("mousemove",changeSize);
    window.addEventListener("mouseup",closeIndicatorr);
}

function setOverview(){
    document.getElementById("size_indicator").style.backgroundColor = "rgb(200,200,200)";
    document.body.onselectstart = ()=>{return true;}
    window.removeEventListener("mouseup",setOverview);
    window.removeEventListener("mousemove",changeSize);
    window.removeEventListener("mouseup",closeIndicatorr);
    if(document.getElementById("left_part").offsetLeft < 0){
        document.getElementById("left_part").style.cssText = "animation: left_open 1s ease-in-out forwards;";
        document.getElementById("right_part").style.cssText = "animation: right_open 1s ease-in-out forwards;";
    }else{
        document.getElementById("left_part").style.cssText = "animation: left_close 1s ease-in-out forwards;";
        document.getElementById("right_part").style.cssText = "animation: right_close 1s ease-in-out forwards;";
    }
}

function changeSize(event){
    window.removeEventListener("mouseup",setOverview);
    const max = document.getElementById("background_line").offsetHeight;
    let value = event.clientY;
    if(value < 0) value = 0;
    else if(value > max) value = max;
    document.getElementById("size_indicator").style.top = value + "px";
    let size_rate = 1 + value / max * 2;
    if(size_rate >= 1.2){
        size_rate -= 0.2;
        document.getElementById("ismism_cube_box").style.cssText = "transform: scale("+size_rate+")";   
    }else{
        document.getElementById("ismism_cube_box").style.cssText = "transform: scale(1)";   
    }
}

function closeIndicatorr(){
    document.getElementById("size_indicator").style.backgroundColor = "rgb(200,200,200)";
    document.body.onselectstart=()=>{return true};
    window.removeEventListener("mouseup",setOverview);
    window.removeEventListener("mousemove",changeSize);
    window.removeEventListener("mouseup",closeIndicatorr);
}
