/****** Utilities ******/
function fixMc(str) {
    return (""+str).replace(/Mc(.)/g, function(m, m1) {
        return 'Mc' + m1.toUpperCase();
    });
}
function fixMac(str) {
    return (""+str).replace(/Mac(.)/g, function(m, m1) {
        return 'Mac' + m1.toUpperCase();
    });
}
function capitalize(str, separators = [` `, `'`, `-`]) {
    separators = separators || [ ' ' ];
    var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    let first = str.split(' ')[0].replace(regex, function(x) { return x.toUpperCase(); });
    let last = fixMac(fixMc(str.split(' ').slice(1).join(' ').replace(regex, function(x) { return x.toUpperCase(); })));
    return `${first} ${last}`;
}
function capitalizeMultiple(selector) {
    document.querySelectorAll(selector).forEach(character => {
        character.innerText = capitalize(character.innerText);
    });
}function setMonth(month) {
    switch(month) {
        case 'January':
            month = 1;
            break;
        case 'February':
            month = 2;
            break;
        case 'March':
            month = 3;
            break;
        case 'April':
            month = 4;
            break;
        case 'May':
            month = 5;
            break;
        case 'June':
            month = 6;
            break;
        case 'July':
            month = 7;
            break;
        case 'August':
            month = 8;
            break;
        case 'September':
            month = 9;
            break;
        case 'October':
            month = 10;
            break;
        case 'November':
            month = 11;
            break;
        case 'December':
            month = 12;
            break;
        default:
            month = -1;
            break;
    }

    return month;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function cleanText(text) {
	return text.replaceAll(' ', '').replaceAll('&amp;', '').replaceAll('&', '').replaceAll(`'`, '').replaceAll(`"`, '').replaceAll(`.`, '').replaceAll(`(`, '').replaceAll(`)`, '');
}
function filterValue(e) {
    let searchValue = e.value.toLowerCase().trim();
    let names = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claim ${e.dataset.objects}`);
    let headers = document.querySelectorAll(`[data-key="${e.dataset.filter}"] ${e.dataset.headers}`);
    let wraps = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claim-wrap`);
    if(searchValue !== '') {
        e.parentNode.classList.add('pb');
        names.forEach(name => {
            let nameValue = name.innerText.toLowerCase().trim();
            if (nameValue.indexOf(searchValue) > -1) {
                name.closest('.claim').classList.remove('hidden');
            } else {
                name.closest('.claim').classList.add('hidden');
            }
            let childrenArray = Array.from(name.closest('.claim-wrap').querySelectorAll('.claim')).filter(item => !item.classList.contains('hidden'));
            if(childrenArray.length === 0) {
                name.closest('.claim-wrap').classList.add('hidden');
                name.closest('.claim-wrap').previousElementSibling.classList.add('hidden');
            } else {
                name.closest('.claim-wrap').classList.remove('hidden');
                name.closest('.claim-wrap').previousElementSibling.classList.remove('hidden');
            }
        });
    } else {
        e.parentNode.classList.remove('pb');
        headers.forEach(header => header.classList.remove('hidden'));
        names.forEach(name => name.closest('.claim').classList.remove('hidden'));
        wraps.forEach(wrap => wrap.classList.remove('hidden'));
    }
}

/****** Settings ******/
function setTheme() {
    if(localStorage.getItem('theme') !== null) {
        switch(localStorage.getItem('theme')) {
            case 'light':
                document.querySelector('body').classList.remove('dark');
                document.querySelector('body').classList.add('light');
                break;
            case 'dark':
            default:
                document.querySelector('body').classList.add('dark');
                document.querySelector('body').classList.remove('light');
                break;
        }
    } else {
        document.querySelector('body').classList.add('dark');
        document.querySelector('body').classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }
}
function setSize() {
    if(localStorage.getItem('size') !== null) {
        switch(localStorage.getItem('size')) {
            case 'large':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.add('lgFont');
                break;
            case 'small':
            default:
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('smFont');
                break;
        }
    } else {
        document.querySelector('body').classList.remove('lgFont');
        document.querySelector('body').classList.add('smFont');
        localStorage.setItem('size', 'small');
    }
}

/****** Toggles ******/
function toggleTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        setTheme();
    } else {
        localStorage.setItem('theme', 'dark');
        setTheme();
    }
}
function toggleSize() {
    if(localStorage.getItem('size') === 'small') {
        localStorage.setItem('size', 'large');
        setSize();
    } else {
        localStorage.setItem('size', 'small');
        setSize();
    }
}
function toggleSideMenu(e) {
    let menu = document.querySelector('.nav--popout');
    if (e.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        e.classList.remove('is-open');
	    document.querySelector('.invisibleEl').classList.remove('menu-open');
    } else {
        menu.classList.add('is-open');
        e.classList.add('is-open');
	    document.querySelector('.invisibleEl').classList.add('menu-open');
    }
}
function toggleWebpageMenu(e) {
    e.closest('.webpage--menu').classList.toggle('is-open');
}

/****** Global Initialization ******/
function initModals() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', () => {
            let modalTag = popup.dataset.modal,
                modals = document.querySelectorAll('.modal'),
                modal;
            for(let i = 0; i < modals.length; i++) {
                if(modals[i].dataset.modalBox === modalTag) {
                    modal = modals[i];
                    modal.classList.add('is-open');
                }
            }
        });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        window.addEventListener('click', e => {
            if(e.target.classList.contains('modal') || e.target.classList.contains('modal--close') || (e.target.parentNode && e.target.parentNode.classList.contains('modal--close')) || (e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains('modal--close'))) {
                modal.classList.remove('is-open');
            }
        });
    });
}
function initSwitcher() {
	let characters = switcher.querySelectorAll('option');
	let newSwitch = `<div class="switch">`;
	characters.forEach((character, i) => {
		if(i !== 0) {
			let characterName = character.innerText.trim();
			let characterId = character.value;
            let siteString = `uploads2/godlybehaviour`;
			newSwitch += `<label class="switch-block">
				<input type="checkbox" value="${characterId}" onchange="this.form.submit()" name="sub_id" />
				<div style="background-image: url(https://files.jcink.net/${siteString}/av-${characterId}.png), url(https://files.jcink.net/${siteString}/av-${characterId}.gif), url(https://files.jcink.net/${siteString}/av-${characterId}.jpg), url(https://files.jcink.net/${siteString}/av-${characterId}.jpeg), url(https://picsum.photos/250);"></div>
				<b>${capitalize(characterName)}</b>
			</label>`;
		}
	});
	newSwitch += `</div>`;
	switcher.insertAdjacentHTML('afterend', newSwitch);
	switcher.remove();
}
function initMarkdown() {
    document.querySelectorAll('tag-spoiler').forEach(spoiler => {
        spoiler.addEventListener('click', e => {e.currentTarget.classList.add('is-visible')});
    });

    let tildelists = document.querySelectorAll('tl');
    if(tildelists.length > 0) {
        tildelists.forEach(tildelist => {
            if(tildelist.innerHTML.split(`~ `).length > 0) {
                tildelist.innerHTML = `<ul>
                    ${tildelist
                    .innerHTML.split(`~ `)
                    .filter(item => item !== '' && item !== '\n')
                    .map(item => `<li>${item}</li>`).join('')}
                </ul>`;
            }
        });
    }
    
    let cheatsheet = document.querySelector('.profile--cheatsheet .scroll');
    let interested = document.querySelector('.profile--interested .scroll');
    let avoiding = document.querySelector('.profile--avoiding .scroll');
    
    if(cheatsheet && cheatsheet.innerHTML.split(`~ `).length > 1 && cheatsheet.innerHTML.split('<ul>').length <= 1) {
        cheatsheet.innerHTML = `<ul>
            ${cheatsheet
            .innerHTML.split(`~ `)
            .filter(item => item !== '')
            .map(item => `<li>${item}</li>`).join('')}
        </ul>`;
    }
    
    if(interested && interested.innerHTML.split(`~ `).length > 1 && interested.innerHTML.split('<ul>').length <= 1) {
        interested.innerHTML = `<ul>
            ${interested
            .innerHTML.split(`~ `)
            .filter(item => item !== '')
            .map(item => `<li>${item}</li>`).join('')}
        </ul>`;
    }
    if(avoiding && avoiding.innerHTML.split(`~ `).length > 1 && avoiding.innerHTML.split('<ul>').length <= 1) {
        avoiding.innerHTML = `<ul>
            ${avoiding
            .innerHTML.split(`~ `)
            .filter(item => item !== '')
            .map(item => `<li>${item}</li>`).join('')}
        </ul>`;
    }

    let markdownSafe = `.postcolor, .profile [data-key="#details"] .scroll, .profile [data-key="#plotting"] .scroll`;

    if(document.querySelectorAll(markdownSafe).length > 0) {
        document.querySelectorAll(markdownSafe).forEach(post => {
        let str = post.innerHTML;
        str = str
                .split(`**`)
                .map((value, index) => {
                    if(index % 2 == 0) {
                    return value;
                    } else {
                    return `<tag-spoken>"${value}"</tag-spoken>`;
                    }
                    }).join("");
        str = str
                .split(`_`)
                .map((value, index) => {
                    if(index % 2 == 0) {
                    return value;
                    } else {
                    return `<tag-thought>${value}</tag-thought>`;
                    }
                    }).join("");
        str = str
                .split(`||`)
                .map((value, index) => {
                    if(index % 2 == 0) {
                    return value;
                    } else {
                    return `<tag-spoiler>${value}</tag-spoiler>`;
                    }
                    }).join("");
        post.innerHTML = str;
        });
    }
}

/****** Profile Initialization ******/
function formatName(name) {
    let nameArray = capitalize(name).split(' ').filter(item => item !== '');
    let formattedName = ``;
    if(nameArray.length > 1) {
        let surnames = [...nameArray];
        surnames.shift();
        formattedName = `<span>${nameArray[0]}</span><strong>${surnames.join(' ')}</strong>`
    } else {
        formattedName = `<strong>${nameArray[0]}</strong>`;
    }
    return formattedName;
}
function formatRating(rating, selectorPrefix = ``) {
    if(rating.value === 'All') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 3;
    } else if(rating.value === 'With Limits') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 2;
    } else if(rating.value === 'Mild') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 1;
    } else {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 0;
    }
}
function initProfile() {
    window.addEventListener('hashchange', function(e){
        //get hash
        let hash = window.location.hash;
        let selected = document.querySelector(`.profile a[href="${hash}"]`);
        let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
        let unsetDefault = Array.from(selected.parentNode.children);
        let tabSiblings = Array.from(hashContent.parentNode.children);
        let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

        //check for tracker category and adjust
        let innerTab = null, tabParent, parentSiblings, parentIndex;
        if(selected.dataset.category) {
            innerTab = selected;
            selected = document.querySelector(`.profile--menu a[href="#${selected.dataset.category}"]`);
            hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
            tabParent = document.querySelector(`tag-tab[data-key="#${innerTab.dataset.category}"]`);
            parentSiblings = Array.from(tabParent.parentNode.children);
            parentIndex = parentSiblings.indexOf.call(parentSiblings, tabParent);
        }

        //find the sub menu/inner menu link with the matching hash
        if (hash) {
            $(selected).trigger('click');
        }
        //select based on this

        //Tabs
        //Remove active from everything
        document.querySelectorAll('.profile--menu a').forEach(label => label.classList.remove('is-active'));
        unsetDefault.forEach(label => label.classList.remove('is-active'));
        document.querySelectorAll('.profile tag-tab').forEach(label => label.classList.remove('is-active'));
        if(innerTab) {
            Array.from(innerTab.parentNode.children).forEach(label => label.classList.remove('is-active'));
        }

        //Add active
        selected.classList.add('is-active');
        hashContent.classList.add('is-active');
        tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        if(innerTab) {
            innerTab.classList.add('is-active');
            tabParent.classList.add('is-active');
            parentSiblings.forEach(sibling => sibling.style.left = `${-100 * parentIndex}%`);
        }
        
        if(tabIndex === 0 && hash !== '#active' && hash !== '#tracker') {
            document.querySelector('.profile').classList.add('is-first');
        } else {
            document.querySelector('.profile').classList.remove('is-first');
        }
    });

    //hash linking
    if (window.location.hash){
        //get hash
        let hash = window.location.hash;
        let selected = document.querySelector(`.profile a[href="${hash}"]`);
        let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
        let unsetDefault = Array.from(selected.parentNode.children);
        let tabSiblings = Array.from(hashContent.parentNode.children);
        let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

        //check for tracker category and adjust
        let innerTab = null, tabParent, parentSiblings, parentIndex;
        if(selected.dataset.category) {
            innerTab = selected;
            selected = document.querySelector(`.profile--menu a[href="#${selected.dataset.category}"]`);
            hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
            tabParent = document.querySelector(`tag-tab[data-key="#${innerTab.dataset.category}"]`);
            parentSiblings = Array.from(tabParent.parentNode.children);
            parentIndex = parentSiblings.indexOf.call(parentSiblings, tabParent);
        }

        //find the sub menu/inner menu link with the matching hash
        if (hash) {
            $(selected).trigger('click');
        }
        //select based on this

        //Tabs
        //Remove active from everything
        document.querySelectorAll('.profile--menu a').forEach(label => label.classList.remove('is-active'));
        unsetDefault.forEach(label => label.classList.remove('is-active'));
        document.querySelectorAll('.profile tag-tab').forEach(label => label.classList.remove('is-active'));
        if(innerTab) {
            Array.from(innerTab.parentNode.children).forEach(label => label.classList.remove('is-active'));
        }

        //Add active
        selected.classList.add('is-active');
        hashContent.classList.add('is-active');
        tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        if(innerTab) {
            innerTab.classList.add('is-active');
            tabParent.classList.add('is-active');
            parentSiblings.forEach(sibling => sibling.style.left = `${-100 * parentIndex}%`);
        }

        if(tabIndex === 0 && hash !== '#active' && hash !== '#tracker') {
            document.querySelector('.profile').classList.add('is-first');
        } else {
            document.querySelector('.profile').classList.remove('is-first');
        }
    } else {
        //Auto-select  tab without hashtag present
        document.querySelector('.profile').classList.add('is-first');
        document.querySelector(`.profile--menu a`).classList.add('is-active');
        document.querySelector(`.profile--main > tag-tabset > tag-tab:first-child`).classList.add('is-active');
        //document.querySelector(`.profile--tracker-menu a`).classList.add('is-active');
        //document.querySelector(`.profile--tracker-content tag-tabset tag-tab:first-child`).classList.add('is-active');
    }
}

/****** Index Initialization ******/
function initForums() {
    //manual links
    document.querySelectorAll('.forum--manual-links').forEach(linkSet => {
        //subforums exist
        if(linkSet.nextElementSibling) {
            if(linkSet.dataset.position === 'start') {
                linkSet.nextElementSibling.insertAdjacentHTML('afterbegin', linkSet.innerHTML);
            } else {
                linkSet.nextElementSibling.insertAdjacentHTML('beforeend', linkSet.innerHTML);
            }
        }
        //subforums don't exist
        else {
            linkSet.classList.remove('forum--manual-links');
            linkSet.classList.add('subforums');
        }
    });
    document.querySelectorAll('.redirect .forum--message').forEach(message => {
        message.closest('.redirect').querySelector('.forum--latest .scroll').innerHTML = message.innerHTML;
    });
    document.querySelectorAll('.forum--image-replace').forEach(image => {
        image.closest('.forum').querySelector('.forum--avatar').innerHTML = image.innerHTML;
    });
}

/****** Webpage Initialization ******/
function initWebpages() {
    //remove staff for non-staff
    if(!document.querySelector('body').classList.contains('g-4')
        && !document.querySelector('body').classList.contains('g-26')
        && !document.querySelector('body').classList.contains('g-28')
        && !document.querySelector('body').classList.contains('account-3')
        && !document.querySelector('body').classList.contains('account-4')
        && !document.querySelector('body').classList.contains('account-10')) {
            document.querySelectorAll('.staffOnly').forEach(item => item.remove());
        }

    //remove loading screen
    document.querySelector('body').classList.remove('loading');
    document.querySelector('#loading').remove();
    initTabs(true, '.webpage', '.webpage--menu', '.webpage--content', 'is-active', '.tab-category', ['.webpage--menu .accordion--trigger', '.webpage--menu .accordion--content', '.webpage--menu .accordion--content a', '.webpage--content .tab-category', '.webpage--content .tab-category tag-tab']);

    //accordions
    initAccordion();
}

function initTabs(isHash = false, wrapClass, menuClass, tabWrapClass, activeClass = 'is-active', categoryClass = null, firstClasses = []) {
    if(isHash) {
        window.addEventListener('hashchange', function(e){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass);
        });

        //hash linking
        if (window.location.hash){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass);
        } else {
            initFirstHashTab(firstClasses, activeClass);
        }
    } else {
        initRegularTabs(menuClass);
    }
}
function initRegularTabs(menuClass) {
    let labels = document.querySelectorAll(`${menuClass} > tag-label`);
    labels.forEach(label => {
        label.addEventListener('click', e => {
            let selected = e.currentTarget;
            let tab = document.querySelector(`tag-tab[data-key="${selected.dataset.key}"]`);
            let tabSiblings = Array.from(tab.parentNode.children);
            let tabIndex = tabSiblings.indexOf.call(tabSiblings, tab);
            
            labels.forEach(label => label.classList.remove('is-active'));
            tabSiblings.forEach(tab => tab.classList.remove('is-active'));
            
            selected.classList.add('is-active');
            tab.classList.add('is-active');
            tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        });
    });
}
function initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass = null) {
    //set variables for categories
    let selectedCategory, hashMain, hashCategory, hashCategoryArray, categorySiblings, categoryIndex, hashTab, submenuSiblings, submenuIndex;

    //get hash and set basic variables
    let hash = $.trim( window.location.hash );
    let selected = document.querySelector(`${menuClass} a[href="${hash}"]`);
    let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`);
    let unsetDefault = Array.from(selected.parentNode.children);
    let tabSiblings = Array.from(hashContent.parentNode.children);
    let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);

    //set category variables document.querySelector(`.webpage--menu a[href="#tab2-2"]`).closest('.tab-category').getAttribute('data-category')
    if(categoryClass) {
        selectedCategory = selected.closest(categoryClass).getAttribute('data-category');

        hashMain = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);

        hashCategory = document.querySelector(`${menuClass} tag-tab[data-category="${selectedCategory}"]`);
        if(!hashCategory) {
            hashCategoryArray = document.querySelectorAll(`${menuClass} [data-category="${selectedCategory}"]`);
        }
        
        hashTab = document.querySelector(`${tabWrapClass} tag-tab[data-category="${selectedCategory}"]`);

        if(hashCategory) {
            categorySiblings = Array.from(hashCategory.parentNode.children);
            categoryIndex = categorySiblings.indexOf.call(categorySiblings, hashCategory);
        }
        submenuSiblings = Array.from(hashTab.parentNode.children);
        submenuIndex = submenuSiblings.indexOf.call(submenuSiblings, hashTab);
    }

    //find the sub menu/inner menu link with the matching hash
    if (hash) {
        $(selected).trigger('click');
    }

    //Tabs
    //Remove active from everything
    document.querySelectorAll(`${menuClass} tag-label`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${menuClass} a`).forEach(label => label.classList.remove(activeClass));
    unsetDefault.forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${wrapClass} tag-tab`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(categoryClass).forEach(item => item.classList.remove(activeClass));

    //Add active
    selected.classList.add(activeClass);
    hashContent.classList.add(activeClass);
    hashCategoryArray.forEach(item => item.classList.add(activeClass));

    //add active for category
    if(categoryClass) {
        hashMain.classList.add(activeClass);
        hashTab.classList.add(activeClass);
    }
    window.scrollTo(0, 0);
}
function initFirstHashTab(firstClasses, activeClass) {
    //Auto-select tab without hashtag present
    firstClasses.forEach(firstClass => {
        document.querySelector(firstClass).classList.add(activeClass);
    });
}
function initAccordion(target = '.accordion') {
    document.querySelectorAll(target).forEach(accordion => {
        let triggers = accordion.querySelectorAll('.accordion--trigger');
        let contents = accordion.querySelectorAll('.accordion--content');
        if(window.innerWidth <= 480) {
            triggers.forEach(trigger => trigger.classList.remove('is-active'));
            contents.forEach(trigger => trigger.classList.remove('is-active'));
        }
        triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                let alreadyOpen = false;
                if(e.currentTarget.classList.contains('is-active')) {
                    alreadyOpen = true;
                }
                triggers.forEach(trigger => trigger.classList.remove('is-active'));
                contents.forEach(trigger => trigger.classList.remove('is-active'));
                if(alreadyOpen) {
                    e.currentTarget.classList.remove('is-active');
                    e.currentTarget.nextElementSibling.classList.remove('is-active');
                    alreadyOpen = false;
                } else {
                    e.currentTarget.classList.add('is-active');
                    e.currentTarget.nextElementSibling.classList.add('is-active');
                }
            });
        })
    })
}