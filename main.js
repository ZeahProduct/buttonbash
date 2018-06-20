if (!localStorage.cash) {
  localStorage.cash = 5;
}
if (!localStorage.totalSpent) {
  localStorage.totalSpent = 0;
}
if (!localStorage.balance) {
  localStorage.balance = 0;
}
if (!localStorage.interestRate) {
  localStorage.interestRate = 0.1;
}
if (!localStorage.jackpots) {
  localStorage.jackpots = false;
}
if (!localStorage.audio) {
  localStorage.audio = true
}
if (!localStorage.bankLimit) {
  localStorage.bankLimit = 1000;
}
if (!localStorage.themeId) {
  localStorage.themeId = 0;
}
if (!localStorage.settingsTier) {
  localStorage.settingsTier = 0;
}
if (!localStorage.casinoTier) {
  localStorage.casinoTier = 0;
}
if (!localStorage.timePlayed) {
  localStorage.timePlayed = 0;
}

var winAudio = new Audio('win.mp3');
winAudio.volume = 0.05;

function abbreviateNumber(num, digits) {
    num = parseFloat(num);
    var units = ['K', 'M', 'B', 'T', 'Q', 'Qt', 'S', ' St', 'O', 'N', 'D'],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return roundTo(num, 2);
}

const numberWithCommas = (x) => {
  return roundTo(parseFloat(x), 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}

function Random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function updateCashLabel() {
  document.getElementById("cash").innerHTML = abbreviateNumber(localStorage.cash, 2);
  document.getElementById("totalSpent").innerHTML = "Total Gambled: $" + numberWithCommas(localStorage.totalSpent).slice(0, -3);;
}

function updateBalance() {
  document.getElementById("balance").innerHTML = "Balance: $" + numberWithCommas(localStorage.balance);
}

function updateSettings(tier) {
  if (tier >= 1) {
    document.getElementById("themes").style.display = "inline-block";
    document.getElementById("settingsUpgrades").style.display = "none";
  } else {
    document.getElementById("settingsUpgrades").style.display = "inline-block";
  }
}

function updateCasino(tier) {
  if (tier >= 1) {
    localStorage.jackpots = true;
    document.getElementById("casinoUpgrades").style.display = "none";
  } else {
    document.getElementById("casinoUpgrades").style.display = "inline-block";
  }
}

function buttonClick(cost, reward) {
  if (parseFloat(localStorage.cash) >= cost) {
    localStorage.cash = parseFloat(localStorage.cash) - cost;
    localStorage.totalSpent = parseInt(localStorage.totalSpent) + cost;
    if (Random(1000) == 1 && String(localStorage.jackpots).toLowerCase() === 'true') { // Jackpot
      localStorage.cash = parseFloat(localStorage.cash) + reward*10;
      if (String(localStorage.audio).toLowerCase() === 'true') {
        winAudio.play();
      }
    } else if (Random(100) >= 90) { // Win
      localStorage.cash = parseFloat(localStorage.cash) + reward;
      if (String(localStorage.audio).toLowerCase() === 'true') {
        winAudio.play();
      }
    }
    updateAchievements();
    updateCashLabel();
  }
}

function deposit(amount) {
  if (amount == "*" || amount == "") {
    if (parseFloat(localStorage.cash) + parseFloat(localStorage.balance) <= parseFloat(localStorage.bankLimit))
    {
      var depositAmount = parseFloat(localStorage.cash);
      localStorage.balance = parseFloat(localStorage.balance) + depositAmount;
      localStorage.cash -= depositAmount;
    } else {
      var depositAmount = parseFloat(localStorage.bankLimit) - parseFloat(localStorage.balance);
      localStorage.balance = parseFloat(localStorage.balance) + depositAmount;
      localStorage.cash -= depositAmount;
    }
    updateCashLabel();
    updateBalance();
  } else if (parseFloat(localStorage.cash) >= parseFloat(amount) && parseFloat(localStorage.balance) < parseFloat(localStorage.bankLimit)) {
    localStorage.cash = parseFloat(localStorage.cash) - parseFloat(amount);
    localStorage.balance = parseFloat(localStorage.balance) + parseFloat(amount);
    updateCashLabel();
    updateBalance();
  }
}

function withdraw(amount) {
  if (amount == "*" || amount == "") {
    var depositAmount = parseFloat(localStorage.balance);
    localStorage.balance = parseFloat(localStorage.balance) - depositAmount;
    localStorage.cash = parseFloat(localStorage.cash) + depositAmount;
    updateCashLabel();
    updateBalance();
  } else if (parseFloat(localStorage.balance) >= parseFloat(amount)) {
    localStorage.cash = parseFloat(localStorage.cash) + parseFloat(amount);
    localStorage.balance = parseFloat(localStorage.balance) - parseFloat(amount);
    updateCashLabel();
    updateBalance();
  }
}

function upgradeSettings() {
  if (parseInt(localStorage.settingsTier) <= 0 && parseFloat(localStorage.cash) >= 5000) {
    localStorage.cash = parseFloat(localStorage.cash) - 5000;
    localStorage.settingsTier = 1;
    localStorage.themeId = 1;
    updateCashLabel();
    updateSettings(1);
  }
}

function upgradeCasino() {
  if (parseInt(localStorage.casinoTier) <= 0 && parseFloat(localStorage.cash) >= 1500) {
    localStorage.cash = parseFloat(localStorage.cash) - 1500;
    localStorage.casinoTier = 1;
    updateCashLabel();
    updateCasino(1);
  }
}

function updateCapacityLabel() {
  var price = parseFloat(localStorage.bankLimit)*2.5;
  document.getElementById("bankUpgrade").innerHTML = "Increased Capacity<br/>$" + abbreviateNumber(price, 2);
}

function upgradeCapacity() {
  if (parseFloat(localStorage.cash) >= parseFloat(localStorage.bankLimit)*2.5) {
    localStorage.cash = parseFloat(localStorage.cash) - parseFloat(localStorage.bankLimit)*2.5;
    localStorage.bankLimit = parseFloat(localStorage.bankLimit) * 10;
    updateCapacityLabel();
    updateCashLabel();
  }
}
function updateInterestLabel() {
  var price = Math.pow(Math.pow(parseFloat(localStorage.interestRate) + 10, 2), 4) - 108035670.56;
  document.getElementById("bankUpgrade2").innerHTML = "Increased Interest<br/>$" + abbreviateNumber(price, 2);
  document.getElementById("interestRate").innerHTML = "Interest Rate: " + numberWithCommas(parseFloat(localStorage.interestRate)) + "%";
}

function upgradeInterest() {
  if (parseFloat(localStorage.cash) >= Math.pow(Math.pow(parseFloat(localStorage.interestRate) + 10, 2), 4) - 108035670.56) {
    localStorage.cash = parseFloat(localStorage.cash) - (Math.pow(Math.pow(parseFloat(localStorage.interestRate) + 10, 2), 4) - 108035670.56);
    localStorage.interestRate = parseFloat(localStorage.interestRate) * 1.1;
    updateInterestLabel();
    updateCashLabel();
  }
}

function loserButton() {
  if (parseFloat(localStorage.cash) < 1 && parseFloat(localStorage.balance) < 1) {
    localStorage.cash = parseFloat(localStorage.cash) + 5;
    updateCashLabel();
  }
}

function changeTheme(themeId) {
  localStorage.themeId = themeId;
  if (themeId == "1" || themeId == "0") { // Default
    document.body.style.background = "#222";
  } else if (themeId == "2") { // Blue
    document.body.style.background = "#659AE0";
  } else if (themeId == "3") { // Green
    document.body.style.background = "#82C43A";
  } else if (themeId == "4") { // Yellow
    document.body.style.background = "#EFEC40";
  } else if (themeId == "5") { // Orange
    document.body.style.background = "#FAA407";
  } else if (themeId == "6") { // Red
    document.body.style.background = "#C46A6A";
  }
  document.body.style.backgroundImage = "repeating-linear-gradient(45deg, transparent 100px, rgba(0,0,0,.05) 200px)";
  if (themeId == "0") {
      document.getElementById("themes").style.display = "none";
  }
}

function soundEffects() {
  if (String(localStorage.audio).toLowerCase() === 'true') {
    localStorage.audio = false;
    document.getElementById("audioButton").innerHTML = "Off";
    document.getElementById("audioButton").className = "button button2 red";
  } else {
    localStorage.audio = true;
    document.getElementById("audioButton").innerHTML = "On";
    document.getElementById("audioButton").className = "button button2 green";
  }
}

function updateAchievements() {
  if (parseInt(localStorage.timePlayed) >= 3600) {
    document.getElementById("addict").className = "button button2 green";
  } else {
    document.getElementById("addict").className = "button button2 red";
  }
  if (parseInt(localStorage.timePlayed) >= 3600*10) {
    document.getElementById("addict2").className = "button button2 green";
  } else {
    document.getElementById("addict2").className = "button button2 red";
  }
  if (parseInt(localStorage.timePlayed) >= 3600*24) {
    document.getElementById("addict3").className = "button button2 green";
  } else {
    document.getElementById("addict3").className = "button button2 red";
  }
  if (parseInt(localStorage.totalSpent) >= 1000000) {
    document.getElementById("spender1").className = "button button2 green";
  } else {
    document.getElementById("spender1").className = "button button2 red";
  }
  if (parseInt(localStorage.totalSpent) >= 1000000000) {
    document.getElementById("spender2").className = "button button2 green";
  } else {
    document.getElementById("spender2").className = "button button2 red";
  }
  if (parseInt(localStorage.totalSpent) >= 1000000000000) {
    document.getElementById("spender3").className = "button button2 green";
  } else {
    document.getElementById("spender3").className = "button button2 red";
  }
}

function resetSave() {
  localStorage.cash = 5;
  localStorage.totalSpent = 0;
  localStorage.balance = 0;
  localStorage.interestRate = 0.1;
  localStorage.jackpots = false;
  localStorage.audio = true;
  localStorage.bankLimit = 1000;
  localStorage.themeId = 0;
  localStorage.settingsTier = 0;
  localStorage.casinoTier = 0;
  localStorage.timePlayed = 0;
  updateCashLabel();
  updateCapacityLabel();
  updateInterestLabel();
  updateBalance();
  soundEffects();
  soundEffects();
  changeTheme(0);
  updateCasino(0);
  updateSettings(0);
  updateAchievements();
}

updateCapacityLabel();
updateCashLabel();
updateBalance();
soundEffects();
soundEffects();
updateInterestLabel();
updateCasino(parseInt(localStorage.casinoTier));
updateSettings(parseInt(localStorage.settingsTier));
changeTheme(localStorage.themeId);
updateAchievements();

//Gain Interest
setInterval(function() {
    if (parseFloat(localStorage.balance) < parseFloat(localStorage.bankLimit)) {
      localStorage.balance = parseFloat(localStorage.balance) + parseFloat(localStorage.balance)*(parseFloat(localStorage.interestRate)/100);
      updateBalance();

      if (parseFloat(localStorage.balance) > parseFloat(localStorage.bankLimit)) {
        localStorage.balance = parseFloat(localStorage.bankLimit);
        updateBalance();
      }
    }
    localStorage.timePlayed = parseInt(localStorage.timePlayed) + 1;
    updateAchievements();
}, 1000);
