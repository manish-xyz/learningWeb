const playerText = document.querySelector(".player");
const computerText = document.querySelector(".computer");
const resultText = document.querySelector(".result");
const buttons = document.querySelectorAll(".btn");
let player, computer, result;

buttons.forEach(button => button.addEventListener("click", () => {
    player = button.textContent;
    computerTurn();
    resultIs();

    playerText.textContent = `Player: ${player}`;
    computerText.textContent = `Computer: ${computer}`;
    resultText.textContent = `Result: ${result}`;
}));

if(result == "You Win!"){
    document.getElementById("WinLoss").style.color = "#32DE8A";
}
else if(result == "You Lose!"){
    document.getElementById("WinLoss").style.color = "#DA2C38";
}

function computerTurn () {

    let turn = Math.floor(Math.random() * 3 + 1);
    switch (turn) {
        case 1: 
        computer ="Rock";
        break;
        case 2: 
        computer = "Paper";
        break;
        case 3: 
        computer = "Scissors"

    }
}

function resultIs () {
    if (computer == player){
        result = "Draw";
    }
    else if (computer == "Rock") {
        result = (player == "Paper") ? "You Win!" : "You Lose!";
    }
    else if (computer == "Paper") {
        result = (player == "Scissors") ? "You Win!" : "You Lose!";
    }
    else if (computer == "Scissors") {
        result = (player == "Rock") ? "You Win!" : "You Lose!";
    }
}
