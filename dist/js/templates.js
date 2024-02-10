if(document.querySelector('tag-palette')) {
    document.querySelectorAll('tag-palette').forEach(palette => {
        palette.querySelectorAll('tag-color').forEach(color => {
            color.style.background = color.dataset.hex;
        });
    });
}
let imagesArrows = `<button data-direction="left" onclick="imagesLeft(this)"><i class="fa-solid fa-angle-left"></i></button><button data-direction="right" onclick="imagesRight(this)"><i class="fa-solid fa-angle-right"></i></button>`;
document.querySelectorAll('et-images').forEach(imageSet => {
    let images = imageSet.querySelectorAll('img');
    if(images.length > 1) {
        imageSet.insertAdjacentHTML('afterend', imagesArrows);
    }
});
function setImagesVariables(e) {
    let currentPosition = 0;
    let images = e.parentNode.querySelectorAll('et-images img');
    if(parseInt(e.parentNode.querySelector('et-images img').style.left)) {
        currentPosition = parseInt(e.parentNode.querySelector('et-images img').style.left) / -100;
    }
    return {currentPosition, images};
}
function imagesLeft(e) {
    let {currentPosition, images} = setImagesVariables(e);

    if(currentPosition === 0) {
        currentPosition = images.length - 1;
    } else {
        currentPosition--;
    }
    images.forEach(image => {
        image.style.left = `${-100 * currentPosition}%`;
    });
}
function imagesRight(e) {
    let {currentPosition, images} = setImagesVariables(e);

    if(currentPosition === images.length - 1) {
        currentPosition = 0;
    } else {
        currentPosition++;
    }
    images.forEach(image => {
        image.style.left = `${-100 * currentPosition}%`;
    });
}