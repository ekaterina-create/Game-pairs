document.addEventListener("DOMContentLoaded", function () {
  let numberArray = [];

  function getInputValue() {
    numberArray = [];
    let cardCount = input.value;

    if (cardCount === "") {
      return;
    } else if (cardCount % 2 == 0) {
      cardCount = input.value;
    } else {
      cardCount = 4;
    }
    let inputNumber = (cardCount * cardCount) / 2;

    for (let i = 1; i <= inputNumber; i++) {
      numberArray.push(i);
      numberArray.push(i);
    }

    return numberArray;
  }

  function shuffleArray(arr) {
    for (let c = arr.length - 1; c > 0; c--) {
      var b = Math.floor(Math.random() * (c + 1));
      var a = arr[c];
      arr[c] = arr[b];
      arr[b] = a;
    }
    return arr;
  }

  // создание LI
  function liMaker(content) {
    let item = document.createElement("li");
    let flipper = document.createElement("div");
    let cardFront = document.createElement("div");
    let cardBack = document.createElement("div");

    item.classList.add("flip-container");
    flipper.classList.add("flipper");
    cardFront.classList.add("card__front");
    cardBack.classList.add("card__back");
    cardBack.textContent = content;
    item.setAttribute("data-number", content);

    flipper.append(cardFront);
    flipper.append(cardBack);
    item.append(flipper);

    return {
      item,
      flipper,
      cardFront,
      cardBack,
    };
  }

  // создание поля игры

  function createGameField(arr) {
    const field = document.querySelector(".cards__container");
    const list = document.createElement("ul");

    list.classList.add("cards__list");
    field.append(list);

    arr.forEach((element) => {
      let li = liMaker(element);

      list.append(li.item);
    });
  }

  const cards = document.querySelectorAll(".flip-container");
  const endBtn = document.querySelector(".end");
  const beginBtn = document.querySelector(".begin");
  const field = document.querySelector(".cards__container");

  let hasOpenCard = 0;
  let firstCard;
  let secondCard;
  count = 0;
  disabledCards = false;

  // таймер
  let timer;
  function Timer() {
    let display = document.querySelector("#countdown .display");
    let timeLeft = parseInt(display.innerHTML);

    timer = setInterval(function () {
      if (--timeLeft >= 0) {
        display.innerHTML = timeLeft;
      } else {
        document.querySelector("#countdown h2").innerHTML =
          "Ваше время истекло";
        document.querySelector("#countdown h2").style.color = "red";
        clearInterval(timer);
        cards.forEach((card) => card.classList.remove("open"));
        endBtn.classList.add("active");
      }
    }, 1000);
  }

  function openCard() {
    if (disabledCards) {
      return;
    }
    hasOpenCard++;

    if (hasOpenCard === 1) {
      this.classList.add("open");
      firstCard = this;
    } else if (hasOpenCard === 2) {
      this.classList.add("open");
      hasOpenCard++;
      secondCard = this;
      compareCards();
    } else {
      return;
    }
  }
  const beginGame = () => {
    input.addEventListener("blur", getInputValue);
    let InputValue = getInputValue();
    if (!InputValue) {
      alert("Выберите количество пар");
      return;
    }
    let shuffledArray = shuffleArray(InputValue);

    createGameField(shuffledArray);
    document
      .querySelectorAll(".flip-container")
      .forEach((card) => card.addEventListener("click", openCard));
    field.classList.add("active");

    Timer();
  };

  // кнопка начать игру
  beginBtn.addEventListener("click", beginGame);

  function compareCards() {
    let sumOfPairs = document.querySelectorAll(".flip-container").length;

    if (secondCard.dataset.number === firstCard.dataset.number) {
      hasOpenCard = 0;
      count++;
    } else {
      disabledCards = true;
      setTimeout(function () {
        secondCard.classList.remove("open");
        firstCard.classList.remove("open");
        disabledCards = false;
      }, 400);
      hasOpenCard = 0;

      return;
    }

    if (count === sumOfPairs / 2) {
      setTimeout(function () {
        cards.forEach((card) => card.classList.remove("open"));

        alert("Поздравляю, Вы победили");
        clearInterval(timer);
        endBtn.classList.add("active");
        document.querySelector('.overlay').style.display = "block";
      }, 1000);
    }
  }

  endBtn.addEventListener("click", () => {
    if (timer) {
      clearInterval(timer);
    }
    endBtn.classList.remove("active");

    location.reload();
  });
});
