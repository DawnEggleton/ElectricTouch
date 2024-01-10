/********** Global **********/
let pageType = document.querySelector('body').id;
let pageClasses = document.querySelector('body').classList;

//click to change subaccounts
document.querySelectorAll('#post_as_menu option').forEach(account => {
    account.innerHTML = account.innerHTML.replace(/&nbsp;&nbsp;»/g,'');
});
let switcher = document.querySelector('#account-switch #subaccounts_menu select');
if(switcher !== null) {
    document.querySelectorAll('select[name="sub_id"] option').forEach(account => {
        account.innerHTML = account.innerHTML.replace(/&nbsp;&nbsp;»/g,'');
    });
    initSwitcher();
}

/********** Initializations **********/
setTheme();
setSize();
initModals();

/********** Window Click **********/
document.querySelector('.invisibleEl').addEventListener('click', e => {
	document.querySelector('.nav--popout').classList.remove('is-open');
	document.querySelector('.button--menu').classList.remove('is-open');
	e.target.classList.remove('menu-open');
});

/********** Index & Category View Only **********/
if(pageType === 'idx' || pageType === 'SC') {
	initForums();
}

/********** Webpages Only **********/
if(pageType === 'Pages') {
}