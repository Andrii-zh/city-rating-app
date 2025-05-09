
let db;
const cityContainer = document.getElementById("city-container");
const addButton = document.getElementById("add-button");

function renderCityCard(id, data) {
  const card = document.createElement("div");
  card.className = "city-card";
  card.style.backgroundColor = data.color || "#fff";

  const title = document.createElement("h3");
  title.textContent = data.name;

  const score = document.createElement("div");
  score.className = "score";
  score.textContent = "Загальний бал: " + data.total;

  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Редагувати";
  editBtn.onclick = () => editCity(id, data);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Видалити";
  delBtn.onclick = () => firebase.database().ref("cities/" + id).remove();

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  card.appendChild(title);
  card.appendChild(score);
  card.appendChild(actions);

  return card;
}

function addCityForm() {
  const name = prompt("Назва міста:");
  if (!name) return;

  const fields = {
    architecture: +prompt("Архітектура (0-5):", 0) || 0,
    entertainment: +prompt("Розваги (0-5):", 0) || 0,
    friendliness: +prompt("Привітність (0-2):", 0) || 0,
    prices: +prompt("Ціни (0-3):", 0) || 0,
    randomness: +prompt("Випадкові події (0-3):", 0) || 0,
    accessibility: +prompt("Зручність добирання (0-3):", 0) || 0,
    vibe: +prompt("Загальний вайб (0-3):", 0) || 0,
    food: +prompt("Їжа (0-2):", 0) || 0
  };
  const color = prompt("Колір (наприклад, #ffcc00):", "#ffffff") || "#ffffff";

  const total = Object.values(fields).reduce((a, b) => a + b, 0);

  firebase.database().ref("cities").push({ name, ...fields, color, total });
}

function editCity(id, oldData) {
  const name = prompt("Назва міста:", oldData.name) || oldData.name;
  const fields = {
    architecture: +prompt("Архітектура (0-5):", oldData.architecture) || 0,
    entertainment: +prompt("Розваги (0-5):", oldData.entertainment) || 0,
    friendliness: +prompt("Привітність (0-2):", oldData.friendliness) || 0,
    prices: +prompt("Ціни (0-3):", oldData.prices) || 0,
    randomness: +prompt("Випадкові події (0-3):", oldData.randomness) || 0,
    accessibility: +prompt("Зручність добирання (0-3):", oldData.accessibility) || 0,
    vibe: +prompt("Загальний вайб (0-3):", oldData.vibe) || 0,
    food: +prompt("Їжа (0-2):", oldData.food) || 0
  };
  const color = prompt("Колір:", oldData.color) || oldData.color;
  const total = Object.values(fields).reduce((a, b) => a + b, 0);

  firebase.database().ref("cities/" + id).set({ name, ...fields, color, total });
}

addButton.onclick = addCityForm;

firebase.database().ref("cities").on("value", (snapshot) => {
  cityContainer.innerHTML = "";
  const data = snapshot.val();
  for (let id in data) {
    cityContainer.appendChild(renderCityCard(id, data[id]));
  }
});
