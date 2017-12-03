
document.addEventListener("DOMContentLoaded", function () {
  const dynamicForm = document.getElementById('dynamic-form'),
        request = new XMLHttpRequest(),
        url = 'http://private-da937a-izitest1.apiary-mock.com/fields';

  function getFormFields() {
    return new Promise(function(resolve, reject){
      request.open("GET", url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          resolve(JSON.parse(request.responseText));
        }
        else {
          reject(Error('Nenhum campo de formulário foi encontrado'));
        }
      }

      request.onerror = function () {
        reject(Error('Erro na conexão com a API'));
      };

      request.send();
    });
  }

  let fields = getFormFields();

  fields.then(function(data) {
    for(let form in data) {
      let input = document.createElement('input');
      input.name        = data[form].name,
      input.id          = data[form].id,
      input.placeholder = data[form].placeholder,
      input.type        = data[form].type;
      input.required    = true

      dynamicForm.appendChild(input);
    }
  })
  .catch(function(erro){
    alert('Um erro inesperado ocorreu.')
  })
});
