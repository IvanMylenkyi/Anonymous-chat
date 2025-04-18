let port = window.location.port != "" ? ":" + window.location.port : "";
const websocket = io("http://" + window.location.hostname + ":8080");

function getCookie(name){
    let cookies = document.cookie.split("; ");
    let ans = null;
    for (let cookie of cookies){
        if (cookie.split("=")[0] == name){
            ans = cookie.split("=")[1];
            break;
        }
    }
    return ans
}

function updateSocketID(){
    let xml = new XMLHttpRequest();
    xml.open("POST","http://" + window.location.hostname + port + "/updateSocketID");
    xml.setRequestHeader("Content-Type", "application/json");
    xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xml.send(JSON.stringify({sessionID: getCookie("sessionID"), socketID: websocket.id}))
}


websocket.on("connect", (socket)=>{
    updateSocketID()
})

let inp = document.querySelector("#input")
inp.addEventListener("keyup", (event)=>{
    if(event.key == "Enter"){
        websocket.emit("message", {data: { session: getCookie("sessionID"),  message: inp.value.trim(), websocketID: websocket.id}});
        inp.value = "";
    }
});
let button = document.querySelector("#send");
button.addEventListener("click", ()=>{
    console.log(JSON.stringify({data: { session: getCookie("sessionID"),  message: inp.value.trim()}}))
    websocket.emit("message", {data: { session: getCookie("sessionID"),  message: inp.value.trim(), websocketID: websocket.id}});
    inp.value = "";
});

const endChatButton = document.querySelector("#end-chat");
endChatButton.addEventListener("click", (event)=>{
    websocket.emit("endchat", {sessionID: getCookie("sessionID")})
})

const endbg = document.querySelector(".endbg");
websocket.on("endchat", (event)=>{
    endbg.style.display = "flex";
})

// Chat visual

const chatDiv = document.querySelector(".chat")
let myCookie = getCookie("sessionID")
for (let mes of chatDiv.children){
    if (mes.classList.length != 0){
        if (mes.classList.contains("session_" + myCookie)){
            mes.classList.add("my-mes")
        } else if (mes.classList[0].includes("session_")){
            mes.classList.add("mes")
        }
        
    }
}



websocket.on("message", (event)=>{
    let mesDiv = document.createElement("div");
    mesDiv.classList.add("session_" + event["owner"]);
    mesDiv.classList.add("mes");
    let mesP = document.createElement("p");
    mesP.classList.add("mes-text");
    mesP.textContent = event["message"]
    mesDiv.appendChild(mesP);
    let button = chatDiv.children[chatDiv.children.length-1]
    chatDiv.removeChild(chatDiv.children[chatDiv.children.length-1])
    chatDiv.appendChild(mesDiv);
    chatDiv.appendChild(button)
    chatDiv.scrollTop = chatDiv.scrollHeight;
})

websocket.on("message_is_sended", (event)=>{
    let mesDiv = document.createElement("div");
    mesDiv.classList.add("session_" + myCookie);
    mesDiv.classList.add("my-mes");
    let mesP = document.createElement("p");
    mesP.classList.add("mes-text");
    mesP.textContent = event["message"]
    mesDiv.appendChild(mesP);
    let button = chatDiv.children[chatDiv.children.length-1]
    chatDiv.removeChild(chatDiv.children[chatDiv.children.length-1])
    chatDiv.appendChild(mesDiv);
    chatDiv.appendChild(button)
    chatDiv.scrollTop = chatDiv.scrollHeight;
})


const toDownButton = document.querySelector(".to-down");
toDownButton.addEventListener("click", (event)=>{
    chatDiv.scrollTop = chatDiv.scrollHeight;
})

chatDiv.addEventListener("scroll", (event)=>{
    if (chatDiv.scrollTop + chatDiv.clientHeight >= chatDiv.scrollHeight-5) {
        toDownButton.style.display = "none";
    } else {
        toDownButton.style.display = "flex";
    }
})