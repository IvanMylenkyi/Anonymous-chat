let port = window.location.port != "" ? ":" + window.location.port : "";
const websocket = new WebSocket("ws://" + window.location.hostname + "/" + 8080);
// const io = io()

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

websocket.addEventListener("open", ()=>{
    let inp = document.querySelector("#input")
    inp.addEventListener("keyup", (event)=>{
        if(event.key == "Enter"){
            websocket.send(inp.value.trim());
        }
    });
    let button = document.querySelector("#send");
    button.addEventListener("click", ()=>{
        websocket.send(JSON.stringify({ event: "message", data: { session: getCookie("sessionID"),  message: inp.value.trim()}}));
    });
})

websocket.addEventListener("message", (event)=>{
    console.log(event.data);
})