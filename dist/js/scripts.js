/********** Global **********/
let pageType = document.querySelector('body').id;
let pageClasses = document.querySelector('body').classList;

/********** Initializations **********/
setTheme();
setSize();

/********** Window Click **********/
document.querySelector('.invisibleEl').addEventListener('click', e => {
	document.querySelector('.nav--popout').classList.remove('is-open');
	document.querySelector('.button--menu').classList.remove('is-open');
	e.target.classList.remove('menu-open');
});