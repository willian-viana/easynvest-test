export default function listItens(fn) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/data.json', true);
    xobj.onload = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        jsonresponse = JSON.parse(xobj.responseText);
        console.log(jsonresponse[0].name);
      }
    }
    xobj.send(null);  
};
