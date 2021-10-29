const main = document.querySelector("main");

let exerciceArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];

class Exercice {}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },

  handleEventMinutes: function () {
    document.querySelectorAll("input[type='number']").forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          // Attention avec le === ca ne marche pas, RIP les 30 min à débuguer.. string!=number (e.target.id est une string)
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            // console.log(exerciceArray);
          }
        });
      });
    });
  },

  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            // J'arrive pas a stoper position quand il trouve il continu..
            // Facon de faire pour intervetir deux elements dans un tableau [x,y] = [y,x]
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            console.log(exerciceArray);
          } else {
            position++;
          }
        });
      });
    });
  },
};

const page = {
  lobby: function () {
    let mapArray = exerciceArray
      .map((exo) => {
        // Quand on fait un map avec {} ne pas oublier le return SANS ESPACE a la guillemet
        // data-pic est un dataset, on peut le récupérer comme un iden faisant dataset.pic ( ici l'id est déja utilser donc on use dataset)
        return `
      <li>
        <div class="card-header">
          <input type="number" id=${exo.pic} min='1' max='10' value=${exo.min}>
          <span>min</span>
        </div>
        <img src="./img/${exo.pic}.png">
        <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
        <i class='fas fa-times-circle deleteBtn' data-pic=${exo.pic}></i>
      </li>
    `;
      })
      .join("");

    utils.pageContent(
      "Paramétrage <i id= 'reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'> Commencer <i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
  },

  routine: function () {
    utils.pageContent("Routine", "Exercie avec chrono", null);
  },

  finish: function () {
    utils.pageContent(
      "C'est terminer",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinitialiser <i class='fas fa-times-circle'></i></button>"
    );
  },
};

page.lobby();
