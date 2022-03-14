
function init() {
    // alert("sono la funzione init")

    fetch("./menu.html")
        .then(response => {
            return response.text()
        })
        .then(data => {

            // assegna al tag header il valore di data
            document.querySelector("header").innerHTML = data
        })
}

function array() {

    ret = "<ul>"

    let dati = ["pomodori", "elem2", "elem3", "elem3", 10.5]

    for (i = 0; i < dati.length; i++) {
        ret += "<li>" + dati[i] + "</li>"
    }

    ret += "</ul>"

    return ret
}

function array_img() {

    let v = ["pomodori", "peperoni", "funghi", "piselli"]

    let p = [3.1, 2.5, 1.4, 4.7]

    let tot = 0

    ret = "<table class=\"table table-bordered\"><tr>"
    for (i = 0; i < v.length; i++) {
        ret += "<td class=centra-txt><img src='img/" + v[i] + ".jpg' width=150px></td>"
    }
    ret += "</tr><tr>"
    for (i = 0; i < p.length; i++) {
        ret += "<td class='centra-txt'>" + p[i] + " €</td>"
        tot += p[i]
    }

    ret += "</tr><tr><td class='centra-txt' colspan=" + p.length + ">Totale " + tot + " €</td></tr></table>"

    return ret
}

function tabellina(r, c) {
    ret = "<table class='table  table-bordered table-sm'  >"
    //se scrivo 02 e 10 funziona, se scrivo 2 invece sbaglia il controllo

    for (i = r; i <= c; i++) {
        ret += "<tr>"
        for (j = 1; j <= 10; j++) {

            ret += "<td class='centra-txt'>" + i + "x" + j + "=" + i * j + "</td>"

        }
        ret += "</tr>"
    }
    ret += "</table>"
    return ret
}

function eliminaUtente(id) {
    // alert("ho ricevuto l' id utente "+id+" implementare chiamata ad endpoint server")
    if (confirm("Con la cancellazione dell'utente " + id + " saranno eliminati anche i suoi post. Procedo?") == true)  //confirm da due pulsanti, di ok e di annulla
    {
        $.ajax({
            sync: false,
            method: "DELETE",
            url: "http://localhost:8050/utenti/delete/" + id

        })
            .done(function (dati) {
                console.log(dati)
                alert("record eliminato")
                window.location.reload(true)
                //ricaricare dati per aggiornare la tabella html
                // dopo aver eliminato ricarica la pagina 
            })

    }
}

/*
    1)visualizza il form nascosto
    2)recupera il json utente con l'id 
    3) imposta l'attributo value dei campi input con i dati del json
*/

function modificaUtente(id) {
    // passo 1
    $("#form_modificaUtente").modal('show');
    $("#email").removeClass("bordo_rosso");
    // passo 2 fare chiamata ajax per recuperare i dati
    $.ajax({
        sync: false,
        method: "GET",
        url: "http://localhost:8050/utenti/id/" + id


    })
        .done(function (dati) {
            //console.log(dati)
            // passo 3 passiamo i dati nelf orm

            $("#id").val(id)
            $("#nome").val(dati.nome)  //modo per far arrivare i dati al form
            $("#cognome").val(dati.cognome)
            $("#indirizzo").val(dati.indirizzo)
            $("#cap").val(dati.cap)
            $("#citta").val(dati.citta)
            $("#email").val(dati.email)
            $("#password").val(dati.password)

        })

}

/*
1)legge i dati del form e li valida lato client
2) valida email lato server (per verificare che non esista gia per un id diverso da quello dell'utente modificato)
3)crea il json di dati
4)invoca endpoint utenti/new passando il json di dati
controlla la risposta del server per capire se l'email è duplicata e visualizza un messaggio appropriato
*/
function salvaUtente() {

    let email = $("#email").val()
    let id = $("#id").val()

    let flag = true;

    // validazione lato client
    if (email.length == 0) {
        // assegniamo all'id email una classe css che il bordo rosso
        $("#email").addClass("bordo_rosso")
        $("#label_email").html("Email: digitare indirizzo email")
        flag = false;
    }

    //validazione lato server
    if (flag) {
        $.ajax({
            sync: false,
            method: "GET",
            url: "http://localhost:8050/utenti/id/" + id + "/email/" + email


        })
            .done(function (data) {
                console.log(data)
                if (!data) {
                    $("#email").addClass("bordo_rosso")
                    $("#label_email").html("Email: indirizzo email gia utilizzato da altro utente")
                }
                else {
                    // ok può fare la chiamata ajax per eseguire la modifica dati
                    eseguiModifica();
                }

            })
    }
}
//passo 3
function eseguiModifica() {
    let du = {
        'id': $("#id").val(),
        'nome': $("#nome").val(),
        'cognome': $("#cognome").val(),
        'indirizzo': $("#indirizzo").val(),
        'cap': $("#cap").val(),
        'citta': $("#citta").val(),
        'email': $("#email").val(),
        'password': $("#password").val()

    }
    console.log(du)

    // passo 4: invoca l'endpoint con ajax
    $.ajax({
        sync: false,
        type: "Put",
        data: JSON.stringify(du),
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        url: "http://localhost:8050/utenti/edit",
       
       
        success: function (data) {
            console.log(data);
        }

    })
        .done(function (data) {
            console.log(data)
            // passo 3 passiamo i dati nelf orm

        })

    $("#form_modificaUtente").modal('hide');
    window.location.reload()

}

function visualizzaPost(id) {
    // passo 1

    // passo 1



    $.ajax({
        sync: false,
        method: "GET",
        url: "http://localhost:8050/utenti/id/" + id
    })
        .done(function (dati) {
            document.getElementById("nomeUtente").innerHTML = ""  // per svuotare il paragrafo lo pongo pari ad una stringa vuota

            document.getElementById("nomeUtente").append("Post di " + dati.nome)

        })


    $("#tabellaPost tr").remove();  // ogni volta che clicco su viasualizza post, prima di visualizzare le nuove righe, rimuove tutte le righe precedentemente create
    $("#form_visualizzaPost").modal('show');

    // passo 2 fare chiamata ajax per recuperare i dati
    $.ajax({
        sync: false,
        method: "GET",
        url: "http://localhost:8050/post/idutente/" + id


    })
        .done(function (dati) {

            tabella = document.getElementById("tabellaPost")

            if (dati.length == 0) {
                $("#tabellaPost").addClass("bordo_rosso")

                var row = tabella.insertRow();
                var cell = row.insertCell();
                cell.innerHTML = ("non ci sono post")

            }
            else {
                $("#tabellaPost").removeClass("bordo_rosso")

                $.each(dati, function (i, field) {

                    var row = tabella.insertRow();
                    var cell = row.insertCell();
                    cell.innerHTML = (field.testo)

                })
            }

        })

}


function effettuaAccesso() {


    $("#password").removeClass("bordo_rosso")
    $("#output").html("")
    let email = $("#email").val()
    let password = $("#password").val()
    if (password == "") {
        $("#password").addClass("bordo_rosso")
        $("#output").html("INSERIRE PASSWORD")
    }

    $.ajax({
        sync: false,
        method: "GET",
        url: "http://localhost:8050/utenti/email/" + email + "/password/" + password
    })
        .done(function (dati) {  //la mia url mi ritorna un boolean
            if (dati == true) {
                $("#output").html("Accesso effettuato")
                localStorage.setItem("loggato", "1")  //  setto una coppia chiave valore nel localStorage

            }
            else {
                $("#output").html("Accesso NON effettuato: EMAIL e/o PASSWORD ERRATE")

            }
        })
}