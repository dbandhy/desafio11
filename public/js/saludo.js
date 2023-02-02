    // Obtener el nombre de usuario del formulario
    let firstName = document.querySelector('input[name="firstName"]').value;

    // Compilar la plantilla de Handlebars
    let saludoTemplate = Handlebars.compile(document.querySelector('#saludo').innerHTML);

    // Renderizar la plantilla con el nombre de usuario
    let saludoHTML = saludoTemplate({firstName: firstName});

    // Actualizar el contenido HTML del elemento con el id "saludo"
    document.querySelector('#saludo').innerHTML = saludoHTML;
