const totaux = [
  "calculMensuel",
  "calculCourses",
  "calculSorties",
  "calculRevenus",
  "calculVoyageSicile",
  "calculVoyageMallorca",
  "calculShopping",
  "calculRemboursementMallorca",
  "calculRemboursementSicile"
];
(function() {
  document.addEventListener("keypress", function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      total();
    }
  });
  window.addEventListener("DOMContentLoaded", event => {
    total();
  });
})();

//* _________ UTILITAIRES _________ *//

function parseValue(value) {
  value = value.replace(/,/g, ".");
  if (value === "") {
    value = 0;
  } else if (isNaN(value)) {
    value = 0;
  } else {
    value = parseFloat(value);
  }
  return value;
}

//* _________  CALCULS  _________ *//

function totalList(list) {
  let totalSelector = list.replace("calcul", "total");
  let items = document.getElementById(list).getElementsByTagName("li");
  let title = document.getElementById(totalSelector);
  let total = 0;
  let liste = {};

  for (let i = 0; i < items.length; ++i) {
    let key = items[i].querySelector("input.key");
    if (key.value !== "") {
      let name = key.value.toLowerCase().replace(/\s/g, "-");
      let value = parseValue(items[i].querySelector("input.value").value);
      liste[name] = value;
      total += value;
    }
  }
  total = parseFloat(total.toFixed(2));
  localStorage.setItem(list, JSON.stringify(liste));
  localStorage.setItem(totalSelector, total);

  initListFromStorage(list);
  title.innerHTML = total;
  return total;
}
function partVoyages(list) {
  let nbParts = parseValue(document.getElementById(list.replace("calcul", "nombrePart")).value);
  nbParts === 0 ? (nbParts = 1) : nbParts;
  let partSelector = list.replace("calcul", "part");
  let part = parseFloat((totalList(list) / nbParts).toFixed(2));
  document.getElementById(partSelector).innerHTML = part;
}
function total() {
  let mallorca = partVoyages("calculVoyageMallorca");
  let sicilia = partVoyages("calculVoyageSicile");

  let regex = /revenus|remboursement/gi;
  let debit = totaux
    .filter(tab => !tab.match(regex))
    .map(tab => totalList(tab))
    .reduce((x, y) => x + y);
  let income = totaux
    .filter(tab => tab.match(regex))
    .map(tab => totalList(tab))
    .reduce((x, y) => x + y);

  let total = document.getElementById("total");
  let result = income - debit;
  result = parseFloat(result.toFixed(2));
  localStorage.setItem("total", result);
  total.innerHTML = result;
}

function deleteItem(event) {
  event.target.nextElementSibling.children[0].value = "";
  total();
}
//* _________ LOCALSTORAGE _________ *//

function setValue(event) {
  let id = event.srcElement.id;
  let value = parseValue(event.currentTarget.value);
  localStorage.setItem(id, value);
}

function setTextValue(event) {
  let id = event.srcElement.id;
  let value = event.currentTarget.value;
  localStorage.setItem(id, value);
}

function getListValues() {
  var archive = {},
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    archive[keys[i]] = localStorage.getItem(keys[i]);
  }
  return archive;
}
function appendValues() {
  let archive = getListValues();

  for (const key in archive) {
    if (archive.hasOwnProperty(key)) {
      let item = document.getElementById(key);
      if (item != null) {
        if (item.tagName === "EM") {
          item.innerHTML = archive[key];
        }
        if (item.tagName === "INPUT" || item.tagName === "TEXTAREA") {
          item.value = archive[key];
        }
      }
    }
  }
  totaux.forEach(tab => {
    initListFromStorage(tab);
  });
}
function initListFromStorage(id) {
  let printList = "";
  let ul = document.getElementById(id);
  let list = JSON.parse(localStorage.getItem(id));
  if (list != null && list.length != 0) {
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let value = list[key];
        key = key.replace(/-/gi, " ");
        let li = `<div class="flex">
                    <button onclick="deleteItem(event)"></button>
                    <li>
                      <input type="text" class="key" value="${key}" onclick="show(event)" onblur="hide(event)" /> 
                      <input type="text" class="value" value="${value}" />
                    </li>
                  </div>`;
        printList += li;
      }
    }
    ul.innerHTML = printList;
  }

  appendLi(id);
}
function appendLi(id) {
  let ul = document.getElementById(id);
  ul.innerHTML += ` <div class="flex">
                      <button onclick="deleteItem(event)"></button>
                      <li>
                        <input type="text" class="key" /> 
                        <input type="text" class="value" />
                      </li>
                    </div>`;
}

appendValues();

//* ____________ UI ____________ *//
function show(event) {
  event.target.parentElement.previousElementSibling.classList.add("is-visible");
}
function hide(event) {
  let element = event.target.parentElement.previousElementSibling;
  setTimeout(function() {
    element.classList.remove("is-visible");
  }, 1000);
}
