function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            afficherEvaluacion(this);
            afficherComisionYCriterias(this);
        }
    };
    xmlhttp.open("GET", "xml/data.xml", true);
    xmlhttp.send();
}

function afficherEvaluacion(xml) {
    var x, i, xmlDoc, table;
    xmlDoc = xml.responseXML;
    table = "";
    x = xmlDoc.getElementsByTagName("evaluacion")
    table += "<tr><td rowspan='4'>"
    table += "<h1>Evaluacion numero " + x[0].getElementsByTagName("id")[0].childNodes[0].nodeValue + " : "
            + x[0].getElementsByTagName("nombre")[0].childNodes[0].nodeValue + "</h1></td></tr>"

    table += "<tr><td>Fecha de entrega : " + x[0].getElementsByTagName("fecha")[0].childNodes[0].nodeValue + "</td></tr>"
    table += "<tr><td>Descripcion : " + x[0].getElementsByTagName("descripcion")[0].childNodes[0].nodeValue + "</td></tr>"
    table += "<tr><td>Tipo : " + x[0].getElementsByTagName("tipo")[0].childNodes[0].nodeValue + "</td></tr>"

    //                for (i = 0; i < x.length; i++) {
    //                    table += "<tr><td>" +
    //                            x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
    //                            "</td><td>" +
    //                            x[i].getElementsByTagName("author")[0].childNodes[0].nodeValue +
    //                            "</td></tr>";
    //                }
    document.getElementById("evaluacion").innerHTML = table;
}


function afficherComisionYCriterias(xml) {
    var x, i, xmlDoc, table;
    xmlDoc = xml.responseXML;
    table = "";
    x = xmlDoc.getElementsByTagName("comision")

    for (i = 0; i < x.length; i++) {
        table += "<tr><td colspan='3'>" +
                x[i].getElementsByTagName("nombre")[0].childNodes[0].nodeValue + " ("
        alumnos = x[i].getElementsByTagName("alumnos")
        for (j = 0; j < alumnos.length; j++) {
            table += alumnos[j].getElementsByTagName("nombre")[0].childNodes[0].nodeValue
                    + " " + alumnos[j].getElementsByTagName("apellido")[0].childNodes[0].nodeValue
                    + " , "

        }
        table += " )</td></tr>"

        criterios = x[i].getElementsByTagName("criterio")
        for (k = 0; k < criterios.length; k++) {
            table += "<tr><td></td><td>" + criterios[k].getElementsByTagName("nombre")[0].childNodes[0].nodeValue + "</td><td>"
                    + criterios[k].getElementsByTagName("nota")[0].childNodes[0].nodeValue + "</td></tr>"

        }
    }



    document.getElementById("grupo_criterias").innerHTML = table;
}


function loadXMLCss() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadCss(this);
        }
    };
    xmlhttp.open("GET", "xml/layout.xml", true);
    xmlhttp.send();
}

function loadCss(xml) {
    var x, i, xmlDoc, table;
    xmlDoc = xml.responseXML;
    x = xmlDoc.getElementsByTagName("layout")

    $('head').append('<link rel="stylesheet" type="text/css" href="' + x[0].getElementsByTagName("css")[0].childNodes[0].nodeValue + '">');
}

function changeStyle(nameFileCss) {
    $.ajax({
        url: '/escogeestilo?style='+nameFileCss,
        type: 'GET',
        success: function (data) {
            window.location.reload();
        },
        
    })
}
