// initModal função que é ativada ao clicar no botão de adicionar tarefa, sendo responsavel por ativar o modal.
function initModal() {

    let modal = document.getElementById("modal")
    modal.style.display = "block"

    document.getElementById("num").value = ""
    document.getElementById("desc").value = ""
    document.getElementById("data").value = ""
    document.getElementById("status").value = ""
   
    document.getElementById("transformEdit").innerHTML = "Adicionar Tarefa:"
    
}

//Função para cancelar o modal
function cancelModal() {

    let modal = document.getElementById("modal")
    modal.style.display = "none"
      document.getElementById("obrigatoryOne").innerHTML = ""
      document.getElementById("obrigatoryTwo").innerHTML = ""
      document.getElementById("obrigatoryThree").innerHTML = ""
      document.getElementById("obrigatoryFour").innerHTML = ""

}

//Função responsavel por salvar os dados preenchidos nos inputs do modal.
async function addTask() {

    let num = document.getElementById("num").value
    let des = document.getElementById("desc").value
    let dat = document.getElementById("data").value
    let statuus = document.getElementById("status").value
    

    if (num === "") {
        document.getElementById("obrigatoryOne").innerHTML = "Requerimento obrigatório!"
        let modal = document.getElementById("modal")
        modal.style.display = "block"
    } else if (des === "") {
        document.getElementById("obrigatoryTwo").innerHTML = "Requerimento obrigatório!"
        let modal = document.getElementById("modal")
        modal.style.display = "block"
    } else if (dat === "") {
        document.getElementById("obrigatoryThree").innerHTML = "Requerimento obrigatório!"
        let modal = document.getElementById("modal")
        modal.style.display = "block"
    } else if (statuus === "") {
        document.getElementById("obrigatoryFour").innerHTML = "Requerimento obrigatório!"
        let modal = document.getElementById("modal")
        modal.style.display = "block"
    } else if (num && des && dat && statuus !== "") {

        dados = {  //-> as variaveis do meu objetoestao em portugues porforça maior sei que nao éboa pratica usar o portugues e menosainda usar dois ou mais idiomas. Por isso ja deixo a justuficativa aqui.
            numero: parseInt(num),
            descricao: des,
            data: dat,
            stato: statuus,
        }

        await fetch("http://localhost:3000/dados", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dados),
        })
        cancelModal()
        await printTasks()
    }
   
}

//Função responsavel por salvar os dados após  no arquivo json (API). Após editalos atraves da função editTesk.
async function saveEdit(element) {

    let Calling = await fetch(`http://localhost:3000/dados/${element}`)
    let Stores = await Calling.json() 
    let num = document.getElementById("num").value
    let des = document.getElementById("desc").value
    let dat = document.getElementById("data").value
    let statuus = document.getElementById("status").value


    dados = {
        numero: parseInt(num),
        descricao: des,
        data: dat,
        stato: statuus,
    }

    await fetch(`http://localhost:3000/dados/${element}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(dados),
    })

    document.getElementById("save").onclick = () => {
        addTask(element)
    }

    await printTasks(element)
    cancelModal()
}

 // Função assincrona onde os dados do arquivo json se comunica com a tabela html sendo exibido em tepo real dentro da tabela.
 // exibindo os dados na pagina html na (tabela), usando o formato de (template string) concatenando asb variaveis js com tag html.
async function printTasks() {

    let searchAPI = await fetch("http://localhost:3000/dados")
    let returnAPI = await searchAPI.json()
    let linne = ""
    let color = ""

    returnAPI.forEach(element => {

        if (element.stato == "Concluído") {
            color = "green"
        } else if (element.stato == "Em andamento") {
            color = "orange"
        } else {
            color = "red"
        }

        linne = linne + `<tr 
        id='linne${element.id}'>
        <td id="numero${element.id}">${element.numero}</td>
        <td id="descricao${element.id}">${element.descricao}</td>
        <td id="data${element.id}">${element.data.split('-').reverse().join('-')}</td>
        <td class="${color}" id="status${element.id}">${element.stato}</td>
        <td><img style="cursor:pointer" id="edit${element.id}" src="assets/img/edit-icon.png"  width="15px" height="15px" onclick="editTask('${element.id}')">
        <img style="cursor:pointer" id="delete${element.id}" src="assets/img/delete-icon.png" width="15px" height="15px" onclick="deleteTask('${element.id}')"></td>
        </tr>`
    });

    document.getElementById("bodyTable").innerHTML = linne
    
}

//Função responsavel por deletar dados preenchidos direto no arquivo json (API).
async function deleteTask(element) {

    await fetch(`http://localhost:3000/dados/${element}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
    })
    await printTasks()

}

//Função responsavel por chamar os dados salvos no arquivo json (API),para poder editalos no modal.
async function editTask(element) {

    modal.style.display = "block"
    let wait = await fetch(`http://localhost:3000/dados/${element}`)
    let task = await wait.json()

    document.getElementById("num").value = task.numero
    document.getElementById("desc").value = task.descricao
    document.getElementById("data").value = task.data
    document.getElementById("status").value = task.stato

    document.getElementById("save").onclick = () => {
        saveEdit(element)
    }

    document.getElementById("transformEdit").innerHTML = "Editar Tarefa:"
    await printTasks()

}

printTasks()