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
    // xml.setRequestHeader("Accept", "application/xml")
    xml.setRequestHeader("Content-Type", "application/json");
    xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xml.send(JSON.stringify({sessionID: getCookie("sessionID"), socketID: websocket.id}))
    // xml.send(`<request><sessionID>${getCookie("sessionID")}</sessionID><socketID>${websocket.id}</socketID></request>`);
}


// let id;
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

websocket.on("message", (event)=>{
    console.log("Message to you: " + event["message"]);
})

websocket.on("message_is_sended", (event)=>{
    console.log("You send: " + event["message"])
})