var cash = document.getElementById("cash").innerHTML;
var totalSpent = 0;
var balance = 0;
var interestRate = 0.1;
var jackpots = false;
var audio = true;
var bankLimit = 1000;

var winAudio = new Audio('win.mp3');
winAudio.volume = 0.1;

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function updateCashLabel() {
  document.getElementById("cash").innerHTML = numberWithCommas(+((cash).toFixed(2)));
  document.getElementById("totalSpent").innerHTML = "Total Gambled: $" + totalSpent;
}

function updateBalance() {
  document.getElementById("balance").innerHTML = "Balance: $" + +((balance).toFixed(2));
}

function buttonClick(cost, reward) {
  if (cash >= cost) {
    cash -= cost;
    totalSpent += cost;
    if (Random(1000) == 1 && jackpots == true) { // Jackpot
      cash += reward*10;
      if (audio == true) {
        winAudio.play();
      }
    } else if (Random(100) >= 95) { // Win
      cash += reward;
      if (audio == true) {
        winAudio.play();
      }
    }
    updateCashLabel();
  }
}

function deposit(amount) {
  if (cash >= amount) {
    cash -= amount;
    balance += amount;
    updateCashLabel();
    updateBalance();
  }
}

function withdraw(amount) {
  if (balance >= amount) {
    cash += amount;
    balance -= amount;
    updateCashLabel();
    updateBalance();
  }
}

function unlockNext() {
  if (document.getElementById("unlockButton").innerHTML == "$150") { // Jackpot Price
    var price = 150;
    if (cash >= price) {
      cash -= price;
      updateCashLabel();
      jackpots = true;
      document.getElementById("chanceText").innerHTML += " | Jackpot Chance: 1%";
      document.getElementById("unlockText").innerHTML = "0.2% Interest";
      document.getElementById("unlockButton").innerHTML = "$5,000";
    }
  } else if (document.getElementById("unlockButton").innerHTML == "$5,000") {
    var price = 5000;
    if (cash >= price) {
      cash -= price;
      updateCashLabel();
      interestRate = 0.2;
      document.getElementById("interestRate").innerHTML = "Interest Rate: "+interestRate+"%";
      document.getElementById("unlockText").innerHTML = "Theme Manager";
      document.getElementById("unlockButton").innerHTML = "$20,000";
    }
  } else if (document.getElementById("unlockButton").innerHTML == "$20,000") {
    var price = 20000;
    if (cash >= price) {
      cash -= price;
      updateCashLabel();
      document.getElementById("themes").style.display = "block";
      document.getElementById("unlockText").innerHTML = "0.5% Interest";
      document.getElementById("unlockButton").innerHTML = "$150,000";
    }
  } else if (document.getElementById("unlockButton").innerHTML == "$150,000") {
    var price = 150000;
    if (cash >= price) {
      cash -= price;
      updateCashLabel();
      interestRate = 0.5;
      document.getElementById("interestRate").innerHTML = "Interest Rate: "+interestRate+"%";
      document.getElementById("upgrades").outerHTML = "";
    }
  }
}

function loserButton() {
  if (cash < 1 && balance < 1) {
    cash += 5;
    updateCashLabel();
  }
}

function changeTheme(themeId) {
  if (themeId == 1) { // Default
    document.body.style.background = "#222"
  } else if (themeId == 2) { // Blue
    document.body.style.background = "#659AE0"
  } else if (themeId == 3) { // Green
    document.body.style.background = "#82C43A"
  } else if (themeId == 4) { // Yellow
    document.body.style.background = "#EFEC40"
  } else if (themeId == 5) { // Orange
    document.body.style.background = "#FAA407"
  } else if (themeId == 6) { // Red
    document.body.style.background = "#C46A6A"
  }
  document.body.style.backgroundImage = "repeating-linear-gradient(45deg, transparent 100px, rgba(0,0,0,.05) 200px)"
}

function soundEffects() {
  if (audio == true) {
    audio = false;
    document.getElementById("audioButton").innerHTML = "Off";
    document.getElementById("audioButton").className = "button red";
  } else {
    audio = true;
    document.getElementById("audioButton").innerHTML = "On";
    document.getElementById("audioButton").className = "button green";
  }
}

//Gain Interest
setInterval(function() {
    balance += balance*(interestRate/100);
    updateBalance();
}, 1000);
