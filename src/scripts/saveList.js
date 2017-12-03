 document.getElementById("dynamic-form").addEventListener("submit", function (e) {
  console.log(e);
  let formLength = document.getElementById("dynamic-form").elements.length,
      item = {},
      cpf = e.target[1].value,
      keeperSaved = localStorage.document ? JSON.parse(localStorage.getItem(cpf)) : [];
  
  for (i = 0; i < formLength; i++){
    item[e.target[i].id] = e.target[i].value;
  }

  keeperSaved.push({item});
  localStorage.setItem(cpf, JSON.stringify(keeperSaved));

  console.log(keeperSaved);
});
