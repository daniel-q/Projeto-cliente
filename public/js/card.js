document.addEventListener('DOMContentLoaded', function() {
    const nomeTitularElement = document.getElementById('nome-titular');


    const formulario = document.getElementById('formulario');

    formulario.addEventListener('input', function(event) {
        const inputElement = event.target;
        const inputValue = inputElement.value;

        switch(inputElement.id) {
        
        case 'nome':
            nomeTitularElement.textContent = 'Nome do Titular: ' + inputValue;
            break;
       
        }
    });
});