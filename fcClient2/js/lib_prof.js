
function init()
{
    // alert("sono la funzione init")

    fetch("./menu.html")
        .then(response => {
            return response.text()
        })
        .then(data =>{

            // assegna al tag header il valore di data
            document.querySelector("header").innerHTML = data
        })
}

function array()
{

    ret = "<ul>"

    let dati = ["pomodori","elem2","elem3","elem3", 10.5]

    for(i=0; i < dati.length; i++)
    {
        ret += "<li>" + dati [i] + "</li>"
    }

    ret += "</ul>"

    return ret
}

function array_img()
{

    let v = ["pomodori", "peperoni", "funghi", "piselli"]

    let p = [3.1, 2.5, 1.4, 4.7]

    let tot = 0

    ret = "<table class=\"table table-bordered\"><tr>"
    for (i=0; i < v.length; i++)
    {
        ret += "<td class=centra-txt><img src='img/"+ v[i] + ".jpg' width=150px></td>"
    }
    ret += "</tr><tr>"
    for (i=0; i < p.length; i++)
    {
        ret += "<td class='centra-txt'>" + p[i] + " €</td>"
        tot += p[i]
    }

    ret += "</tr><tr><td class='centra-txt' colspan=" +  p.length + ">Totale " + tot + " €</td></tr></table>"

    return ret
}

// restituisce una stringa con la tabella html con le tabelline da r fino a c per 10 colonne
function tabellina(r, c)
{
    return "ciao"
}

function eliminaUtente(id)
{
    if(confirm("Con la cancellazione dell'utente " + id +  " saranno eliminati anche i suoi post. Procedo?"))
    {
    
        // alert("ho ricevuto l'id utente " + id + " implementare chiamata ad enpoint elimina del webService...")
        $.ajax({
            sync: false,
            method: "DELETE",
            url: "http://localhost:8050/utenti/delete/"+id
        })
        .done(function(dati){                
            console.log(dati);
            alert("Record eliminato")
            // ricaricare i dati per aggiornare la tabella html
            
        })
    }
}

/*
    1) visualizza il form nascosto + reset bordo email + reset label_email
    2) recupera il json utente con l'id
    3) imposta l'attributo value dei campi input con i dati del json
*/
function modificaUtente(id)
{
    // 1
    $("#form_modificautente").modal("show");
    $("#email").removeClass("bordo_rosso")
    $("#label_email").html("Email:")
    
    console.log("http://localhost:8050/utenti/id/"+id)
    // 2
    $.ajax({
        sync: false,
        method: "GET",
        url: "http://localhost:8050/utenti/id/"+id
    })
    .done(function(data){                
        console.log(data);
        // 3
        $("#id").val(id)
        $("#nome").val(data.nome)
        $("#cognome").val(data.cognome)
        $("#indirizzo").val(data.indirizzo)
        $("#cap").val(data.cap)
        $("#citta").val(data.citta)
        $("#email").val(data.email)
        $("#password").val(data.password)
        
    })
    
    
}

/*
    1) legge i dati del form e li valida lato client
    2) valida email lato server (per verificare che non esista di già email per un id diverso da quello dell'utente che stiamo modificando)
    3) crea il json di dati
    4) invoca endpoint utenti/new passando il sjon di dati
       
*/
function salvaUtente()
{
    
    let email = $("#email").val()
    let id    = $("#id").val()

    // validazione lato client
    let flag = true
    if(email.length==0)
    {
        // assegniamo all'id email una class css chedà il bordo rosso
        $("#email").addClass("bordo_rosso")
        $("#label_email").html("Email: Digitare l'indirizzo email")
        flag = false
    }

    //validazione lato server dell'email
    if(flag)
    {
        $.ajax({
            sync: false,
            method: "GET",
            url: "http://localhost:8050/utenti/id/"+id+ "/email/"+email
        })
        .done(function(data){ 
            console.log(data)
            if(!data)
            {
                $("#email").addClass("bordo_rosso")
                $("#label_email").html("Email: Indirizzo email già utilizzato da altro utente!")
            }
            else
            {
                // ok può fare la chiamata ajax per eseguire la modifica dati
                eseguiModifica()
            }
        })   
    }
}

function eseguiModifica()
{
    // alert("eseguiModifica")
    // 3
    let du = {
                id:        $("#id").val(),
                nome:      $("#nome").val(),
                cognome:   $("#cognome").val(),
                indirizzo: $("#indirizzo").val(),
                cap:       $("#cap").val(),
                citta:     $("#citta").val(),
                email:     $("#email").val(),
                password:  $("#password").val()
            }
    console.log(du)

    $.ajax({
        type: 'PUT',
        url: "http://localhost:8050/utenti/edit",
        data: JSON.stringify(du),
        success: function(data) {
            console.log(data);
        }
    });        

    $("#form_modificautente").modal("hide");
    // ricarica la pagina
    window.location.reload();

    // 4. da rivedere

    /*
    
    $.ajax({
        sync: false,
        type: "PUT",
        url: "http://localhost:8050/utenti/edit",
        data: du,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:8050/utenti/edit",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },       
    })
    .done(function(data){                
        
        console.log(data);
        $("#form_modificautente").modal("hide");

        // ricarica la pagina
       
        
    })
    */
    

    
}

