if (!localStorage.cash) {
  localStorage.cash = 0;
}
if (!localStorage.tokens) {
  localStorage.tokens = 0;
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
if (!localStorage.casinoRank) {
  localStorage.casinoRank = 1;
}
if (!localStorage.casinoChance) {
  localStorage.casinoChance = 100;
}
if (!localStorage.loanAmount) {
  localStorage.loanAmount = 5;
}
if (!localStorage.loanTotal) {
  localStorage.loanTotal = 0;
}
if (!localStorage.buttonClicks) {
  localStorage.buttonClicks = 0;
}
if (!localStorage.soundClicks) {
  localStorage.soundClicks = 0;
}
if (!localStorage.jackpotWins) {
  localStorage.jackpotWins = 0;
}

var winAudio = new Audio('win.mp3');
winAudio.volume = 0.05;

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

function abbreviateNumber(num, digits) {
    if (isString(num)) {
      num = parseFloat(num);
    }
    var units = ['K', 'M', 'B', 'T', 'Q', 'Qt', 'S', ' St', 'O', 'N', 'D'],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);
        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return roundTo(num, digits);
}

const numberWithCommas = (x) => {
  return roundTo(parseFloat(x), 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

function roundTo(n, digits) {
    if (isString(n)) {
      n = parseFloat(num);
    }
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
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
  document.getElementById("tokens").innerHTML = parseInt(localStorage.tokens);
  var tokens = parseInt(localStorage.cash.length - 6);
  if (tokens == 1) {
    document.getElementById("rebirthText").innerHTML = "Gives " + tokens + " Token";
  } else {
    document.getElementById("rebirthText").innerHTML = "Gives " + tokens + " Tokens";
  }
  document.getElementById("totalSpent").innerHTML = "Total Gambled: $" + numberWithCommas(localStorage.totalSpent).slice(0, -3);
  for (var i=1; i<100000000000000000000000000000000000;i*=10) {
    if (parseFloat(localStorage.totalSpent) >= i) {
      document.getElementById("gamble"+(i*10)).style.display = "inline-block";
    } else {
      document.getElementById("gamble"+(i*10)).style.display = "none";
    }
  }
}

function updateWinChance() {
  document.getElementById("chanceText").innerHTML = "Win Chance: " + (9+parseInt(localStorage.casinoRank)) + "%";
  document.getElementById("casinoText").innerHTML = "Casino " + localStorage.casinoRank;
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
    document.getElementById("casinoUpgrade").style.display = "none";
  } else {
    document.getElementById("casinoUpgrade").style.display = "table-cell";
  }
}

function buttonClick(cost, reward) {
  if (parseFloat(localStorage.cash) >= cost) {
    localStorage.buttonClicks = parseInt(localStorage.buttonClicks) + 1;
    localStorage.cash = parseFloat(localStorage.cash) - cost;
    localStorage.totalSpent = parseInt(localStorage.totalSpent) + cost;
    if (Random(500) == 1 && String(localStorage.jackpots).toLowerCase() === 'true') { // Jackpot
      localStorage.cash = parseFloat(localStorage.cash) + reward*10;
      localStorage.jackpotWins = parseInt(localStorage.jackpotWins) + 1;
      if (String(localStorage.audio).toLowerCase() === 'true') {
        winAudio.play();
      }
    } else if (Random(100) < (9+parseInt(localStorage.casinoRank))) { // Win
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

function updateLoanButton() {
  var price = parseFloat(localStorage.loanAmount)*parseFloat(localStorage.loanAmount)*parseFloat(localStorage.loanAmount)*200000;
  document.getElementById("bankUpgrade3").innerHTML = "Larger Loans<br/>$" + abbreviateNumber(price, 2);
}

function upgradeLoans() {
  if (parseFloat(localStorage.cash) >= parseFloat(localStorage.loanAmount)*parseFloat(localStorage.loanAmount)*parseFloat(localStorage.loanAmount)*200000) {
    localStorage.cash = parseFloat(localStorage.cash) - parseFloat(localStorage.loanAmount)*parseFloat(localStorage.loanAmount)*parseFloat(localStorage.loanAmount)*200000;
    localStorage.loanAmount = parseFloat(localStorage.loanAmount) + 5;
    updateLoanButton();
    updateCashLabel();
  }
}

function updateInterestLabel() {
  var price = Math.pow(Math.pow(parseFloat(localStorage.interestRate) + 10, 2), 4) - 108035670.56;
  if (parseFloat(localStorage.interestRate) >= 0.5) {
    localStorage.interestRate = 0.5;
    document.getElementById("bankUpgrade2").style.display = "none";
  } else {
    document.getElementById("bankUpgrade2").innerHTML = "Increased Interest<br/>$" + abbreviateNumber(price, 2);
    document.getElementById("bankUpgrade2").style.display = "table-cell";
  }
  document.getElementById("interestRate").innerHTML = "Interest Rate: " + numberWithCommas(parseFloat(localStorage.interestRate)) + "%";
}

function upgradeInterest() {
  if (parseFloat(localStorage.cash) >= Math.pow(Math.pow(parseFloat(localStorage.interestRate) + 10, 2), 4) - 108035670.56 && parseFloat(localStorage.interestRate) < 0.5) {
    localStorage.cash = parseFloat(localStorage.cash) - (Math.pow(Math.pow(parseFloat(localStorage.interestRate) + 10, 2), 4) - 108035670.56);
    localStorage.interestRate = parseFloat(localStorage.interestRate) * 1.1;
    updateInterestLabel();
    updateCashLabel();
  }
}

function loserButton() {
  if (parseFloat(localStorage.cash) < 1 && parseFloat(localStorage.balance) < 1) {
    localStorage.cash = parseFloat(localStorage.cash) + parseFloat(localStorage.loanAmount);
    localStorage.loanTotal = parseFloat(localStorage.loanTotal) + parseFloat(localStorage.loanAmount);
    updateCashLabel();
    updateAchievements();
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
  localStorage.soundClicks = parseInt(localStorage.soundClicks) + 1;
  updateAchievements();
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

  if (parseInt(localStorage.casinoRank) >= 5) {
    document.getElementById("lucky1").className = "button button2 green";
  } else {
    document.getElementById("lucky1").className = "button button2 red";
  }
  if (parseInt(localStorage.casinoRank) >= 10) {
    document.getElementById("lucky2").className = "button button2 green";
  } else {
    document.getElementById("lucky2").className = "button button2 red";
  }
  if (parseInt(localStorage.casinoRank) >= 25) {
    document.getElementById("lucky3").className = "button button2 green";
  } else {
    document.getElementById("lucky3").className = "button button2 red";
  }

  if (parseInt(localStorage.loanTotal) >= 1000) {
    document.getElementById("loan1").className = "button button2 green";
  } else {
    document.getElementById("loan1").className = "button button2 red";
  }
  if (parseInt(localStorage.loanTotal) >= 10000) {
    document.getElementById("loan2").className = "button button2 green";
  } else {
    document.getElementById("loan2").className = "button button2 red";
  }
  if (parseInt(localStorage.loanTotal) >= 100000) {
    document.getElementById("loan3").className = "button button2 green";
  } else {
    document.getElementById("loan3").className = "button button2 red";
  }

  if (parseInt(localStorage.buttonClicks) >= 100) {
    document.getElementById("click1").className = "button button2 green";
  } else {
    document.getElementById("click1").className = "button button2 red";
  }
  if (parseInt(localStorage.buttonClicks) >= 1000) {
    document.getElementById("click2").className = "button button2 green";
  } else {
    document.getElementById("click2").className = "button button2 red";
  }
  if (parseInt(localStorage.buttonClicks) >= 10000) {
    document.getElementById("click3").className = "button button2 green";
  } else {
    document.getElementById("click3").className = "button button2 red";
  }


  if (parseInt(localStorage.soundClicks) >= 25) {
    document.getElementById("secret1").className = "button button2 green";
    document.getElementById("secret1").innerHTML = 'Indecisive<div class="button3">Toggle audio 25 times</div>';
  } else {
    document.getElementById("secret1").className = "button button2 black";
    document.getElementById("secret1").innerHTML = '?<div class="button3">Hidden Achievement</div>';
  }

  if (parseInt(localStorage.jackpotWins) >= 100) {
    document.getElementById("secret2").className = "button button2 green";
    document.getElementById("secret2").innerHTML = 'Lucky<div class="button3">Win 100 jackpots</div>';
  } else {
    document.getElementById("secret2").className = "button button2 black";
    document.getElementById("secret2").innerHTML = '?<div class="button3">Hidden Achievement</div>';
  }

  if (parseFloat(localStorage.balance) >= 1000000000000000) {
    document.getElementById("secret3").className = "button button2 green";
    document.getElementById("secret3").innerHTML = 'Interested<div class="button3">Have a balance of $1Q</div>';
  }
}

function resetSave() {
  if (confirm("Are you sure you want to reset your saved data?")) {
    localStorage.cash = 0;
    localStorage.tokens = 0;
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
    localStorage.casinoRank = 1;
    localStorage.casinoChance = 100;
    localStorage.loanAmount = 5;
    localStorage.loanTotal = 0;
    localStorage.buttonClicks = 0;
    localStorage.soundClicks = 0;
    localStorage.jackpotWins = 0;
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
    updateWinChance();
    updateLoanButton();
    document.getElementById("secret3").className = "button button2 black";
    document.getElementById("secret3").innerHTML = '?<div class="button3">Hidden Achievement</div>';
    document.getElementById("casinoButtonText").innerHTML = localStorage.casinoChance + "% Chance<br/>" + (Math.pow(parseInt(localStorage.casinoRank)+1, 3)+2)+" Tokens</div>";
  }
}

function rebirth() {
  if (parseFloat(localStorage.tokens) >= Math.pow(parseInt(localStorage.casinoRank)+1, 3)+2) {
    localStorage.tokens = parseFloat(localStorage.tokens) - Math.pow(parseInt(localStorage.casinoRank)+1, 3)+2;
    updateCashLabel();
    updateBalance();

    if (Random(100) < parseFloat(localStorage.casinoChance)) {
      localStorage.casinoRank = parseInt(localStorage.casinoRank) + 1;
      if (parseFloat(localStorage.casinoChance) > 5) {
        localStorage.casinoChance = parseFloat(localStorage.casinoChance) - 5;
      }
      document.getElementById("casinoButtonText").innerHTML = localStorage.casinoChance + "% Chance<br/>" + (Math.pow(parseInt(localStorage.casinoRank)+1, 3)+2) +" Tokens</div>";
      updateWinChance();
      updateAchievements();
      if (String(localStorage.audio).toLowerCase() === 'true') {
        winAudio.play();
      }
    } else {
      // Play fail audio
    }
  }
}

function actualRebirth() {
  if (confirm("Are you sure you want to attempt to move on? All cash will be reset!")) {
      localStorage.tokens = parseInt(localStorage.tokens) + localStorage.cash.length / 7;
      localStorage.cash = 0;
      localStorage.balance = 0;
      updateCashLabel();
      updateCapacityLabel();
  }
}

updateCashLabel();
updateCapacityLabel();
updateInterestLabel();
updateBalance();
soundEffects();
soundEffects();
updateCasino(parseInt(localStorage.casinoTier));
updateSettings(parseInt(localStorage.settingsTier));
changeTheme(localStorage.themeId);
updateAchievements();
updateWinChance();
updateLoanButton();
document.getElementById("casinoButtonText").innerHTML = localStorage.casinoChance + "% Chance<br/>" + (Math.pow(parseInt(localStorage.casinoRank)+1, 3)+2) +" Tokens</div>";

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
