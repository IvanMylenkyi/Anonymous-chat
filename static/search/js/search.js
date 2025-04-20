let searchButton = document.querySelector("#search-button");

let searchTimer = document.querySelector(".timer")
let timerSpan = document.querySelector(".timer-text")
let error = document.querySelector(".error")

function onButtonClick(){
    let xml = new XMLHttpRequest();
    xml.open("POST", "");
 
    xml.onreadystatechange = ()=>{
     if (xml.readyState == 4 && xml.status == 201){
         let port = window.location.port != "" ? ":" + window.location.port : ""
         window.location.href = window.location.protocol + "//" + window.location.hostname + port + "/chat"
     }
    };
    xml.send();
 }

searchButton.addEventListener("click", ()=>{
    onButtonClick();
    error.style.display = "none"
    searchButton.style.display = "none";
    let time = 0;
    let timerInter = setInterval(()=>{
        searchTimer.style.width = `${(30-(time/10)) / (30/100)}%`;
        timerSpan.textContent = `${Math.round(30-(time/10))}с`;
        time++ 
    }, 100)
    setTimeout(()=>{
        clearInterval(timerInter);
        searchButton.style.display = "flex";
        error.style.display = "block"
    }, 30000)
});