const myTimeout = setInterval(changeImage, 1000);

var maxImage = 4
var currentImage = 1

function changeImage() {
  image = document.getElementById("meimei-image");
  image.setAttribute('src', getImageUrl(currentImage));
  if (currentImage === maxImage) {
    currentImage = 1
  } else {
    currentImage += 1;
  }

}

function getImageUrl(index) {
  return `images/meimei/${index}.jpg`
}

function stop() {
  clearTimeout(myTimeout);
}