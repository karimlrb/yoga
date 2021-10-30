const main = document.querySelector("main");
const basicArray = [
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

let exerciceArray = [];

// Si user vient pour la première fois, exerciceArray = basicArray, sinon on lui donne la valeur du locale storage
//  On récupère le tableau stocké
// syntaxe d'une fct anonyme qui se lance seule une fois après elle se relance plus
(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = basicArray;
  }
})();

class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }
  updateCountdown() {
    // Sans le return ça nous renvoyé undifined
    // condition ? exprSiVrai : exprSiFaux -> ternaire
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 10);

    return (main.innerHTML = `
      <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="./img/${exerciceArray[this.index].pic}.png" />
        <div>${this.index + 1}/${exerciceArray.length}</div>
      </div>`);
  }
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

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
            this.storage();
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
            page.lobby();
            this.storage();
          } else {
            position++;
          }
        });
      });
    });
  },

  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Attention à ne pas utiliser la méthode delete de js car on supprime l'entrée(index + valeur)
        // donc on ne peut pas supprimer 2 fois la meme position sur la vue
        let newArray = [];
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            newArray.push(exo);
            exerciceArray = newArray;
            console.log(exerciceArray);
            page.lobby();
            this.storage();
          }
        });
      });
    });
  },

  reboot: function () {
    exerciceArray = basicArray;
    page.lobby();
    this.storage();
  },

  storage: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
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
    utils.deleteItem();
    // un id btn, input[type="checkbox"], i pas besoin de déclarer en js
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => this.routine());
  },

  routine: function () {
    const exercice = new Exercice();

    utils.pageContent("Routine", exercice.updateCountdown(), null);
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
