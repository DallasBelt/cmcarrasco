var usuario = sessionStorage.getItem("usuario");
$(document).ready(function(){    
    $("#logout").click(function(){
        sessionStorage.removeItem("usuario");
        window.location.href = '../login.html';
    });    
});