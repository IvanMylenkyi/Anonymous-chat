let tableButtons = document.querySelectorAll(".table");
const tableBackgound = document.querySelector(".table-background");

const domain = window.location.protocol + "//" + window.location.host;

function generateForm(modelName, data){
    let columns = JSON.parse(data);
    let formElem = document.createElement("form");
    formElem.method = "post";
    formElem.enctype = "multipart/form-data";
    formElem.action = domain + "/admin/createRecord";
    formElem.classList.add("table-form");
    let title = document.createElement("h1");
    title.textContent = modelName;
    title.classList.add("form-title");
    formElem.appendChild(title);
    let modelNameInp = document.createElement("input");
    modelNameInp.type = "hidden";
    modelNameInp.name = "model-name";
    modelNameInp.value = modelName;
    formElem.appendChild(modelNameInp);
    let formBody = document.createElement("div");
    formBody.classList.add("form-body");
    formElem.appendChild(formBody);
    for (let column of columns){
        if (column.column_name == "__relations"){
            continue;
        }
        let div = document.createElement("div");
        div.classList.add("table-form-column");
        let col = document.createElement("p");
        col.textContent = column.column_name;
        col.classList.add("column-name");
        let inp;
        if (column.data_type == "relation" || column.data_type == "relation-many"){
            inp = document.createElement("select");
            if (column.data_type == "relation-many"){
                inp.multiple = true;
            }
            let optNone = document.createElement("option");
            optNone.value = "None";
            optNone.textContent = "None";
            inp.appendChild(optNone);
            for (let rec of columns[0]["relations"][column.column_name]["data"]){
                let opt = document.createElement("option");
                opt.value = rec["id"]
                opt.textContent = `${columns[0]["relations"][column.column_name]["table"]}(${rec["id"]})`;
                inp.appendChild(opt);
            }
        } else {
            inp = document.createElement("input");
        }
        inp.classList.add("column-input");
        inp.name = column.column_name;
        if (column.data_type == "text"){
            inp.type = "text";
        } else if (column.data_type == "integer"){
            inp.type = "number";
            inp.min = 0;
        } else if (column.data_type == "boolean"){
            inp.type = "checkbox";
        } else if (column.data_type == "timestamp without time zone") {
            inp.type = "datetime-local";
        }

        div.appendChild(col);
        div.appendChild(inp);
        formBody.appendChild(div);
    }
    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Зберегти";
    submitButton.classList.add("submit-form");
    formBody.appendChild(submitButton);
    tableBackgound.innerHTML = "";
    tableBackgound.appendChild(formElem);
}

for (let tablebutton of tableButtons){
    tablebutton.addEventListener("click", ()=>{
        for (let button of tableButtons) {
            button.classList.remove("choosed");
        }
        tablebutton.classList.add("choosed");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = ()=>{
            if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 201)){
                generateForm(tablebutton.id, xhttp.response);
            }
        }
        xhttp.open("POST", domain + "/admin/getSchema");
        xhttp.setRequestHeader("Content-type", "application/xml");
        xhttp.send(`<name>${tablebutton.id}</name>`);
    });
}
