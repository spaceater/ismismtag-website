const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const express = require("express");
const { error } = require("console");
const app = express();
const http = require("http");
const server = http.createServer(app);

//跨域申请
const cors = require("cors");
app.use(cors());

//设置为静态资源
app.use(express.static("./resources"));

//assets接口
const mime={
    ".css":"text/css",
    ".js":"text/javascript",
    ".html":"text/html",
    ".json":"application/json",
}

// WebSocket连接
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const clients = new Set();
wss.on("connection", (ws) => {
    clients.add(ws);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({"online_count" : clients.size}));
        }
    });
    ws.on("close", () => {
        clients.delete(ws);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({"online_count" : clients.size}));
            }
        });
    });
});

//统计访问量的文件
const PAGE_VIEW_FILE = path.join(__dirname, "page-view.txt");
app.get("/api/page_view", async (req, res) => {
    //禁用强缓存和协商缓存，page_view必须从服务器获取
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    fs.readFile(PAGE_VIEW_FILE, "utf8", (err, data) => {
        if (!err && data) {
            let page_view = parseInt(data);
            page_view ++;
            res.json({"page_view" : page_view});
            fs.writeFile(PAGE_VIEW_FILE, page_view.toString(), (err) => {
                if (err) console.error("Adding page view failed:", err);
            });
        }
        else{
            res.json({"page_view" : -1});
        }
    });
});

//获取一般资源
app.get("/assets/:path", (req, res) => {
    try{
        const file_path = "./resources/" + req.params["path"];
        if(!fs.existsSync(file_path)){
            throw error;
        }
        res.writeHead(200, {"Content-Type": mime[path.extname(file_path)] + ";charset=utf-8"});
        fs.createReadStream(file_path).pipe(res);
    }
    catch(err){
        res.status(500).send("ERROR: " + req.params["path"] + " not found.");
    }
});

//获取图片
app.get("/assets/image/:path(*)", (req, res) => {
    // 支持的图片扩展名列表
    const supported_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
    try{
        let image_path;
        let found = false;
        for (const extension of supported_extensions) {
            image_path = "./resources/" + req.params["path"] + extension;
            if (fs.existsSync(image_path)) {
                found = true;
                break;
            }
        }
        if(!found){
            throw error;
        }
        const accepted_format = req.headers["accept"] || '';
        let image = sharp(image_path);
        let image_extension;
        if (accepted_format.includes("image/avif")) {
            image = image.avif(); // 转换为AVIF
            image_extension = "image/avif";
        }else if (accepted_format.includes("image/webp")) {
            image = image.webp(); // 转换为WebP
            image_extension = "image/webp";
        }else {
            image = image.jpeg({ quality: 85 }); // 默认JPEG
            image_extension = "image/jpeg";
        }
        res.writeHead(200, {"Content-Type": image_extension});
        fs.createReadStream(image_path).pipe(res); // 流式传输
    }
    catch(err){
        res.status(500).send("ERROR: " + req.params["path"] + " not found.");
    }
});

//总路由
app.get("/",(req,res)=>{
    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    fs.createReadStream("./resources/ismismcube.html").pipe(res);
});

//图标匹配
app.get("/favicon.ico",(req,res)=>{
    res.sendFile(path.join(__dirname, "/resources/favicon.ico"));
});

//无路由匹配
app.get("*",(req,res)=>{
    res.writeHead(404, {"Content-Type":"text/html;charset=utf-8"});
    fs.createReadStream("./resources/404.html").pipe(res);
});

//error处理
app.use((err,req,res,next)=>{
    res.writeHead(404, {"Content-Type":"text/html;charset=utf-8"});
    fs.createReadStream("./resources/404.html").pipe(res);
});

//开启服务器实例
server.listen(1999,()=>{
    console.log("server is running at http://127.0.0.1:1999");
});
