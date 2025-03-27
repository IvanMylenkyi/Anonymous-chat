let searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", ()=>{
   let xml = new XMLHttpRequest();
   xml.open("POST", "");

   xml.onreadystatechange = ()=>{
    if (xml.readyState == 4 && xml.status == 201){
        let port = window.location.port != "" ? ":" + window.location.port : ""
        window.location.href = window.location.protocol + "//" + window.location.hostname + port + "/chat"
    }
   };
   xml.send();
});