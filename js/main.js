function calculateRadius(width, height) {
  return Math.min(width, height) * 0.49;
}

function formatTime(milliseconds) {
  var seconds = Math.round(milliseconds/1000);
  var min = Math.floor(seconds / 60);
  var sec = (seconds % 60);
  var m = min < 10 ? " "+min : min;
  var s = sec < 10 ? "0"+sec : sec;
  return m + ":" + s;
}


function drawTimer(ctx, canvas, duration, remaining) {
  // save canvas state
  ctx.save();

  // draw the pie
  var radius = calculateRadius(canvas.width, canvas.height);
  ctx.fillStyle = "#CC0000";
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-90 * Math.PI / 180);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, 0, (duration - remaining) * 2 * Math.PI / duration);
  ctx.lineTo(0, 0);
  ctx.fill();

  // display the time
  ctx.globalCompositeOperation = "xor";
  ctx.fillStyle = "black";
  ctx.font = Math.round(radius * 0.5) + "px monaco";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.rotate(90 * Math.PI / 180);
  ctx.fillText(formatTime(remaining), 0, 0);

  // restore canvas state
  ctx.restore();
}

function drawStoppedTimer() {
  var canvas = document.getElementById("timerCanvas");
  var ctx = canvas.getContext("2d");
  drawTimer(ctx, canvas, 1, 0);
}

function playSound() {
  var audio = new Audio("mp3/Computer_Magic-Microsift-1901299923.mp3");
  audio.play();
}


var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");

function animateTimer(myTimer) {
  var canvas = document.getElementById("timerCanvas");
  var ctx = canvas.getContext("2d");

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // calculate new timer state
  var passed = Date.now() - myTimer.startTime;
  myTimer.remaining = myTimer.duration - passed;
  if(myTimer.remaining <= 0) {
    myTimer.isRunning = false;
    myTimer.isCompleted = true;
    myTimer.remaining = 0;
  }

  // draw
  drawTimer(ctx, canvas, myTimer.duration, myTimer.remaining);

  if(myTimer.isRunning){
    // schedule next animation step
    requestAnimationFrame(function() {
      animateTimer(myTimer);
    });
  } else if (myTimer.isCompleted){
    playSound();
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}


const IN_MILLISECONDS = 60*1000;

var myTimer;

function startTimer() {
  var minutes = document.getElementById("minutes").value;
  myTimer = {
    duration: minutes*IN_MILLISECONDS,
    remaining: minutes*IN_MILLISECONDS,
    startTime: Date.now(),
    isRunning: true,
    isCompleted: false
  };
  animateTimer(myTimer);
  startButton.disabled = true;
  stopButton.disabled = false;
}

function stopTimer() {
  myTimer.isRunning = false;
  startButton.disabled = false;
  stopButton.disabled = true;
}

startButton.onclick = startTimer;
stopButton.onclick = stopTimer;
stopButton.disabled = true;
drawStoppedTimer();
