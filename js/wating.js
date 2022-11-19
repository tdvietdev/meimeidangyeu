var waitingMei = document.getElementById('waiting'),
  context = waitingMei.getContext('2d');

make_background();
resizeReset();


var totalWaitingDays = countDate(comebackDate, startDate)
var waitingDays = countDate(currentDate, startDate)
var remainingDay = totalWaitingDays - waitingDays

function resizeReset() {
  w = waitingMei.width = window.innerWidth;
  h = waitingMei.height = 300;
}

var maxW = w - 200
var currentPosition = (remainingDay / totalWaitingDays) * maxW;

function make_background()
{
  planeImage = new Image();
  planeImage.src = '../images/waiting/plane.png';
  planeImage.onload = function(){
    context.drawImage(planeImage, currentPosition, 1, 200, 100);
  }


  japanImage = new Image();
  japanImage.src = '../images/waiting/japan.png';
  japanImage.onload = function(){
    context.drawImage(japanImage, w - 200, 100, 200, 100);
  }

  vietnamImage = new Image();
  vietnamImage.src = '../images/waiting/vietnam.png';
  vietnamImage.onload = function(){
    context.drawImage(vietnamImage, 0, 100, 200, 100);
  }
}

var words = ['Anh yêu em!!!', `Chúng ta còn khoảng ${remainingDay} ngày nữa là được gặp nhau rồi em nhỉ?`, 'Cùng nhau đợi nhé ...'],
  part,
  wordIndex = 0,
  offset = 0,
  len = words.length,
  forwards = true,
  skip_count = 0,
  skip_delay = 15,
  speed = 70;
var wordflick = function () {
  setInterval(function () {
    if (forwards) {
      if (offset >= words[wordIndex].length) {
        ++skip_count;
        if (skip_count == skip_delay) {
          forwards = false;
          skip_count = 0;
        }
      }
    }
    else {
      if (offset == 0) {
        forwards = true;
        wordIndex++;
        offset = 0;
        if (wordIndex >= len) {
          wordIndex = 0;
        }
      }
    }
    part = words[wordIndex].substr(0, offset);
    if (skip_count == 0) {
      if (forwards) {
        offset++;
      }
      else {
        offset--;
      }
    }
    $('.waiting-text').text(part);
  },speed);
};

$(document).ready(function () {
  wordflick();
});