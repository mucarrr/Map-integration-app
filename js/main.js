/* console.log(window); bunu incelediginde navigator icinde geolocation var, onun da icinde getcurrentlocation ile kullanicinin mevcut konumunu alabilirsin*/

import { personIcon } from "./constants.js";
import { ui } from "./ui.js";
import { getCategory } from "./helpers.js";
import { getIcon } from "./helpers.js"

let clickedCoords;
let map;
let layer;
let notes = JSON.parse(localStorage.getItem('notes')) || [];
// projede once localstorage get item ile kaydedilen veri olup olmadigini kontrol ederiz. eger kayit yoksa bos veri doner. varsa var olan veriyi cekmis oluruz. yeni note olusturulduktan sonra notes.push/unshift(newnote) yapilip sonra local storage set item yapilir. bu degisiklikleri kaydet anlamina gelir. ilk adim her zaman get itemdir sayfa basinda tanimlanir.
window.navigator.geolocation.getCurrentPosition(
  (e) => {
    console.log(e);

    loadMap([e.coords.latitude, e.coords.longitude], "Current Position");
  },
  (e) => {
    loadMap([41.904843, 12.490665], "Default Position");
  }
);
function loadMap(currentPosition, msg) {
  map = L.map("map", {zoomControl:false}).setView(currentPosition, 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

layer= L.layerGroup().addTo(map);

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);

  map.on("click", onMapClick);
  renderMarkers();
  renderNotes();
}

function onMapClick(e) {
  clickedCoords = [e.latlng.lat, e.latlng.lng];
  ui.aside.classList.add("add");
  console.log(clickedCoords);
}
ui.cancelBtn.addEventListener("click", () => {
  ui.aside.classList.remove("add");
});

ui.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target[0].value;
  const date = e.target[1].value;
  const category = e.target[2].value;

  const newNote = {
    id: new Date().getTime() /*1970den itibaren gecen zamani saniye cinsinden vererek benzersiz bir id olusturuyor*/,
    title,
    date,
    category,
    coords: clickedCoords,
  };
  notes.unshift(newNote); // liste basina ekle demek. notes.push deseydim liste sonuna ekleyecekti.
  localStorage.setItem("notes", JSON.stringify(notes));
  ui.aside.classList.remove("add");
  e.target.reset();
  renderNotes();

});
function renderNotes(){
  ui.list.innerHTML = notes.map((note)=>{
    const date = new Date(note.date).toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return  `
    <li>
                   <div>
                       <p>${note.title}</p>
                       <p>${date}</p>
                       <p>${getCategory(note.category)}</p>
                   </div>
                   <div class="icons">
                       <i data-id="${note.id}" class="bi bi-airplane-fill" id="fly"></i>
                       <i data-id="${note.id}" class="bi bi-trash-fill" id="delete"></i>
                   </div>
               </li>`
  }
  ).join("");
  renderMarkers();
  document.querySelectorAll("#delete").forEach((btn)=>btn.addEventListener("click",()=> {
    const id = btn.dataset.id;
    console.log(btn.dataset.id);
    deleteNotes(id)
  }
    
));
 document.querySelectorAll("#fly").forEach((btn)=>btn.addEventListener("click",()=> {
  const id = btn.dataset.id;
  flyToNote(id)
 }
 
));
};

function deleteNotes(id){
  const res = confirm("Are you sure you want to delete?");
  if(res){
    notes =notes.filter((note)=> note.id !== parseInt(id));
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes()
    renderMarkers()
  }
}
function flyToNote(id){
  const note = notes.find((note)=> note.id === parseInt(id));
  map.flyTo(note.coords, 10);

}

function renderMarkers(){
  layer.clearLayers(); 
  notes.map((note)=>{
    const icon = getIcon(note.category);
    L.marker(note.coords, {icon}).addTo(layer).bindPopup(note.title);
  })
}

console.log(JSON.parse(localStorage.getItem("notes")));


ui.arrow.addEventListener("click", ()=>{
ui.aside.classList.toggle("hide");

})
