$(document).ready(function(){
    var usuario = sessionStorage.getItem("usuario");
    if(usuario === "null"){
        window.location.href = 'iniciarsesion.html';
    }
    let screenH = screen.height;
    let alto = screenH;
    $(".list").height(alto);
    let listElements = document.querySelectorAll('.list-button-click');
    listElements.forEach(listElement =>{
        listElement.addEventListener('click',()=>{        
            listElement.classList.toggle('arrow');
            let heightA = 0;
            let menu = listElement.nextElementSibling;
            if(menu.clientHeight == "0"){
                heightA = menu.scrollHeight;
            }
            menu.style.height = `${heightA}px`;
        })
    });
});
