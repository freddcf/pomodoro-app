// Getting inputs
const inFocusTimeInput = document.querySelector("#inFocusTime");
const inBreakTimeInput = document.querySelector("#inBreakTime");
const inLongBreakTimeInput = document.querySelector("#inLongBreakTime");
// clock
const clock = document.querySelector(".clock");
// Sounds
const alarm = document.querySelector(".alarm");
// Get duration
const minutesTime = document.querySelector(".mins");
const secondsTime = document.querySelector(".secs");
const configBtn = document.querySelectorAll(".config-btn button");
// Get buttons play, sound, stop
const playBtn = document.querySelector(".play");
const soundBtn = document.querySelector(".sound");
const stopBtn = document.querySelector(".stop");
// Sounds options
const song = document.querySelector(".song");
const pomo = "./sounds/pomodoro_sound.mp3";
const rain = "./sounds/rain.mp3";
const none = "./sounds/none.mp3";
const beach = "./sounds/beach.mp3";
// Get the time-select buttons
const shortBreakSet = document.querySelector(".short-break");
const focusSet = document.querySelector(".focus");
const longBreakSet = document.querySelector(".long-break");
// Set LOCALSTORAGE
localStorage.setItem("button", "inFocus");

// Variables for the timer
let beginning, minutes, seconds, pause, totalSecs, perc;

// Saving settings
document.querySelector(".forms").addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("inFocusTime", inFocusTimeInput.value);
  localStorage.setItem("inBreakTime", inBreakTimeInput.value);
  localStorage.setItem("inLongBreakTime", inLongBreakTimeInput.value);
});

const alwaysCheck = () => {
  const circle = document.querySelector(".moving-outline_circle");
  let btn = localStorage.getItem("button");
  configBtn.forEach((option) => {
    if (btn === "inFocus") {
      option.classList.add("allred");
      option.classList.remove("allgreen");
      option.classList.remove("allblue");
      focusSet.style.background = "#FA504F";
      shortBreakSet.style.background = "none";
      longBreakSet.style.background = "none";
      circle.style.stroke = "#FA504F";
    }
    if (btn === "inBreak") {
      option.classList.remove("allred");
      option.classList.add("allgreen");
      // option.classList.remove('allblue');
      focusSet.style.background = "none";
      shortBreakSet.style.background = "#05EC8C";
      longBreakSet.style.background = "none";
      circle.style.stroke = "#05EC8C";
    }
    if (btn === "inLongBreak") {
      option.classList.remove("allred");
      option.classList.remove("allgreen");
      option.classList.add("allblue");
      focusSet.style.background = "none";
      shortBreakSet.style.background = "none";
      longBreakSet.style.background = "#0BBDDB";
      circle.style.stroke = "#0BBDDB";
    }
  });
};

alwaysCheck();

// Play button / Start timer
playBtn.addEventListener("click", () => {
  mainPLayFunction();
});

function mainPLayFunction() {
  alwaysCheck();
  if (beginning === undefined) {
    dataCheck();
    setTimeout(decrementTime(), 60);
    pause = false;
    playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    song.play();
  } else {
    if (pause === false) {
      clearTimeout(beginning);
      pause = true;
      playBtn.innerHTML = `<i class="fas fa-play"></i>`;
      song.pause();
    } else {
      beginning = setTimeout("decrementTime()", 60);
      pause = false;
      playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      song.play();
    }
  }
}

function dataCheck() {
  let button = localStorage.getItem("button");

  // Checking if the button is in focus or it's break time
  if (button === "inFocus") {
    minutes = +localStorage.getItem("inFocusTime") || 1;
  } else if (button === "inBreak") {
    minutes = +localStorage.getItem("inBreakTime") || 1;
  } else {
    minutes = +localStorage.getItem("inLongBreakTime") || 1;
  }

  // Convert minutes to seconds
  seconds = minutes * 60;
  totalseconds = minutes * 60;
}

function decrementTime() {
  // The time will be set in minutes and seocnds before start decrementTime
  let maskedMinutes = Math.floor(seconds / 60);
  if (maskedMinutes < 10) {
    maskedMinutes = `0${maskedMinutes}`;
  }
  minutesTime.textContent = maskedMinutes;
  secondsTime.textContent =
    seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`;
  // If the sequence is greater than 0
  if (seconds > 0) {
    // Calculate the percentage
    // Math.ceil to make sure if the number is between 0 and 100
    perc = Math.floor(((totalseconds - seconds) / totalseconds) * 100);
    setProgress(perc);
    seconds--;
    // To use later for pausing and reseting
    beginning = setTimeout("decrementTime()", 1000);
  } else {
    // When the time reach 0
    minutes = 0;
    seconds = 0;
    setProgress(100);
    alarm.play();
    let button = localStorage.getItem("button");

    // Look for something new and change if it's necessary
    if (button === "inFocus") {
      localStorage.setItem("button", "inBreak");
    } else if (button === "inBreak") {
      localStorage.setItem("button", "inLongBreak");
    } else if (button === "inLongBreak") {
      localStorage.setItem("button", "inFocus");
    }
    // if (button === 'inFocus') {
    //     localStorage.setItem('button', 'inBreak');
    // } else if (button === 'inBreak') {
    //     localStorage.setItem('button', 'inLongBreak');
    // } else {
    //     localStorage.setItem('button', 'inFocus')
    // }
    dataCheck();
    alwaysCheck();
    mainPLayFunction();
    setTimeout("setProgress(0)", 1000);
  }
}

// Sounds
soundBtn.addEventListener("click", () => {
  song.pause();
  let audio = song.getAttribute("src");

  if (audio == pomo) {
    song.src = rain;
    audio = rain;
    soundBtn.innerHTML = `<i class="fas fa-cloud-showers-heavy"></i>`;
  } else if (audio == rain) {
    song.src = beach;
    audio = beach;
    soundBtn.innerHTML = `<i class="fas fa-tint"></i>`;
  } else if (audio == beach) {
    song.src = none;
    audio = none;
    soundBtn.innerHTML = `<i class="fas fa-ban"></i>`;
  } else if (audio == none) {
    song.src = pomo;
    audio = pomo;
    soundBtn.innerHTML = `<i class="far fa-clock"></i>`;
  }
  if (beginning != undefined && pause === false) {
    song.play();
  }
});

// Clear option
stopBtn.addEventListener("click", () => {
  clearTimeout(beginning);
  setProgress(0);
  minutesTime.textContent = `00`;
  secondsTime.textContent = `00`;
  pause = false;
  // playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  dataCheck();
  if (pause === false) {
    clearTimeout(beginning);
    pause = true;
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    song.pause();
  } else {
    beginning = setTimeout("decrementTime()", 60);
    pause = false;
    playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    song.play();
  }
});
