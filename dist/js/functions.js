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
	return text.replaceAll(' ', '').replaceAll('&amp;', '').replaceAll('&', '').replaceAll(`'`, '').replaceAll(`"`, '').replaceAll(`.`, '').replaceAll(`(`, '').replaceAll(`)`, '').replaceAll(`,`, '').replaceAll(`’`, '').replaceAll(`é`, `e`).replaceAll(`è`, `e`).replaceAll(`ê`, `e`).replaceAll(`ë`, `e`).replaceAll(`ě`, `e`).replaceAll(`ẽ`, `e`).replaceAll(`ē`, `e`).replaceAll(`ė`, `e`).replaceAll(`ę`, `e`).replaceAll(`à`, `a`).replaceAll(`á`, `a`).replaceAll(`â`, `a`).replaceAll(`ä`, `a`).replaceAll(`ǎ`, `a`).replaceAll(`æ`, `ae`).replaceAll(`ã`, `a`).replaceAll(`å`, `a`).replaceAll(`ā`, `a`).replaceAll(`í`, `i`).replaceAll(`ì`, `i`).replaceAll(`ı`, `i`).replaceAll(`î`, `i`).replaceAll(`ï`, `i`).replaceAll(`ǐ`, `i`).replaceAll(`ĭ`, `i`).replaceAll(`ī`, `i`).replaceAll(`ĩ`, `i`).replaceAll(`į`, `i`).replaceAll(`ḯ`, `i`).replaceAll(`ỉ`, `i`).replaceAll(`ó`, `o`).replaceAll(`ò`, `o`).replaceAll(`ȯ`, `o`).replaceAll(`ô`, `o`).replaceAll(`ö`, `o`).replaceAll(`ǒ`, `o`).replaceAll(`ŏ`, `o`).replaceAll(`ō`, `o`).replaceAll(`õ`, `o`).replaceAll(`ǫ`, `o`).replaceAll(`ő`, `o`).replaceAll(`ố`, `o`).replaceAll(`ồ`, `o`).replaceAll(`ø`, `o`).replaceAll(`ṓ`, `o`).replaceAll(`ṑ`, `o`).replaceAll(`ȱ`, `o`).replaceAll(`ṍ`, `o`).replaceAll(`ú`, `u`).replaceAll(`ù`, `u`).replaceAll(`û`, `u`).replaceAll(`ü`, `u`).replaceAll(`ǔ`, `u`).replaceAll(`ŭ`, `u`).replaceAll(`ū`, `u`).replaceAll(`ũ`, `u`).replaceAll(`ů`, `u`).replaceAll(`ų`, `u`).replaceAll(`ű`, `u`).replaceAll(`ʉ`, `u`).replaceAll(`ǘ`, `u`).replaceAll(`ǜ`, `u`).replaceAll(`ǚ`, `u`).replaceAll(`ṹ`, `u`).replaceAll(`ǖ`, `u`).replaceAll(`ṻ`, `u`).replaceAll(`ủ`, `u`).replaceAll(`ȕ`, `u`).replaceAll(`ȗ`, `u`).replaceAll(`ư`, `u`);
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
                name.closest('.claim-wrap').previousElementSibling.classList.add('hidden');
		if (e.dataset.hideWrap === 'true') {
                    name.closest('.claim-wrap').classList.add('hidden');
		}
            } else {
                name.closest('.claim-wrap').previousElementSibling.classList.remove('hidden');
		if (e.dataset.hideWrap === 'true') {
                    name.closest('.claim-wrap').classList.remove('hidden');
		}
            }
        });
    } else {
        e.parentNode.classList.remove('pb');
        headers.forEach(header => header.classList.remove('hidden'));
        names.forEach(name => name.closest('.claim').classList.remove('hidden'));
        wraps.forEach(wrap => wrap.classList.remove('hidden'));
    }
}
function appendSearchQuery(param, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(param, value);
	window.history.replaceState(null, null, url);
}
function initClipboard() {
    let clipboard = new Clipboard('.clipboard');
    clipboard.on('success', function(e) {
        console.log('clipboard success: ' + e);
    });
    clipboard.on('error', function(e) {
        console.log('clipboard error: ' + e);
    });
    let clipcode = new Clipboard('.codeclick', {
        target: function(trigger) {
        return trigger.nextElementSibling;
        }
    });
}
function initCodebox() {
    $("table[id='CODE-WRAP']").each(function() {
        var cc = $(this).find("td[id='CODE']").html();

        $(this).html(
            "<div class='codeblock code--wrapper'><div class='c-title codeclick'>Click to Copy</div><div class='codecon'><pre><code class='scroll'>"
            + cc +
            "</code></pre></div></div>"
        );
    });
}
function initCopyLink() {
    let clippedURL = new Clipboard('.post--permalink');
    document.querySelectorAll('.post--permalink').forEach(link => {
        link.addEventListener('click', e => {
            e.currentTarget.querySelector('.note').style.opacity = 1;
            setTimeout(() => {
                document.querySelectorAll('.note').forEach(note => note.style.opacity = 0);
            }, 3000);
        });
    });
}
function translationSwitch(e) {
        let current = e.innerText;
        let original = e.dataset.original;
        let translation = e.dataset.result;
        if(current === original) {
            e.innerText = translation;
        } else {
            e.innerText = original;
        }
}
function htmlencode(str) {
    return str.replace(/[&<>"']/g, function($0) {
        return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
    });
}
function highlightCode() {
    let clipcodeQuick = new Clipboard('.copyQuick', {
        target: function(trigger) {
            if(trigger.nextElementSibling.querySelector('textarea')) {
                return trigger.nextElementSibling.querySelector('textarea');
            } else {
                return trigger.nextElementSibling.querySelector('code');
            }
        }
    });
}
function getAllTextNodes(element) {
    if(element) {
        return Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
    }
}
function getAllTextNodesArray(elements) {
    let array = [];
    if(elements) {
        elements.forEach(element => {
            let nodes = Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
            if(nodes.length > 0) {
                array = [...array, ...nodes];
            }
        });
    }
    return array;
}
function inputWrap(el, next = null, type = 'checkbox') {
    if(next) {
        $(el).nextUntil(next).andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    } else {
        $(el).next().andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    }
}
function fancyBoxes() {
    document.querySelectorAll('.input-wrap.checkbox').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div>`);
    });
    document.querySelectorAll('.input-wrap.radio').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input radio"><i class="fa-solid fa-check"></i></div>`);
    });
}
function read_alerts() {
    $('#recent-alerts').fadeOut();
    $.get( "index.php?recent_alerts=1&read=1", function( data ) {
        $( "#recent_alerts_data" ).html( data );
    });
    document.querySelectorAll('a[title="Alerts"]').forEach(alert => alert.classList.remove('new'));
}
function close_alerts() {
    $('#recent-alerts').fadeOut();
}
function load_alerts() {
    if($('#recent-alerts').is(':visible')) {
        $('#recent-alerts').fadeOut();
    } else {
        $.get( "?recent_alerts=1", function( data ) {
            $( "#recent-alerts-data" ).html( data );
            console.log(document.querySelectorAll('.recent-alerts-msg'));
        });
        $("#recent-alerts").fadeIn();
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
            case 'xl':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('xlFont');
                break;
            case 'large':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.add('lgFont');
                document.querySelector('body').classList.remove('xlFont');
                break;
            case 'small':
            default:
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('smFont');
                document.querySelector('body').classList.remove('xlFont');
                break;
        }
    } else {
        document.querySelector('body').classList.remove('xlFont');
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
    } else if(localStorage.getItem('size') === 'large') {
        localStorage.setItem('size', 'xl');
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
function toggleUCPMenu(e) {
    e.closest('#ucpmenu').classList.toggle('is-open');
}

/****** Carousel Functions ******/
function carouselArrowIndex(e) {
    let {bullets, slides} = carouselVariableSetup(e);
    let index;
    bullets.forEach((bullet, i) => {
        if(bullet.classList.contains('is-active')) {
            index = i;
        }
    });
    
    //remove all active
    bullets.forEach(bullet => bullet.classList.remove('is-active'));
    slides.forEach(slide => slide.classList.remove('is-active'));

    return index;
}
function carouselVariableSetup(e, level = 0) {
    let wrapper;
    if(level === 1) {
        wrapper = e.parentNode.parentNode.parentNode;
    } else {
        wrapper = e.parentNode.parentNode;
    }

    let bullets = wrapper.querySelectorAll('.post--carousel-bullet');
    let slides = wrapper.querySelectorAll('.post--carousel-slide');

    return {bullets, slides, wrapper};
}
function carouselArrowAct(index, bullets, slides, wrapper) {
    //add active as needed
    bullets[index].classList.add('is-active');
    slides[index].classList.add('is-active');

    //move slides
    slides.forEach(slide => {
        slide.style.left = `${index * -100}%`;
    });
    
    //handle image
    if(index !== 0) {
        wrapper.classList.remove('is-image');
    } else {
        wrapper.classList.add('is-image');
    }
}
function carouselLeft(e) {
    //set up variables
    let index = carouselArrowIndex(e);
    let {bullets, slides, wrapper} = carouselVariableSetup(e);

    //determine new index
    if(index === 0) {
        index = bullets.length - 1;
    } else {
        index--;
    }

    //act on new index
    carouselArrowAct(index, bullets, slides, wrapper);
}
function carouselRight(e) {
    //set up variables
    let index = carouselArrowIndex(e);
    let {bullets, slides, wrapper} = carouselVariableSetup(e);

    //determine new index
    if(index === bullets.length - 1) {
        index = 0;
    } else {
        index++;
    }

    //act on new index
    carouselArrowAct(index, bullets, slides, wrapper);
}
function carouselPage(e) {
    let {bullets, slides, wrapper} = carouselVariableSetup(e, 1);
    let bulletsArray = Array.from(bullets);
    let index = bulletsArray.indexOf.call(bulletsArray, e);
    
    //remove all active
    bullets.forEach(bullet => bullet.classList.remove('is-active'));
    slides.forEach(slide => slide.classList.remove('is-active'));

    //act on new index
    carouselArrowAct(index, bullets, slides, wrapper);
}

/****** Global Initialization ******/
function initQuickLogin() {
    if($('#quick-login').length) {
        $('#quick-login').appendTo('#quick-login-clip');
        document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
        document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
    } else {
        var main_url = location.href.split('?')[0];
        $.get(main_url, function (data) {
            $('#quick-login', data).appendTo('#quick-login-clip');
            document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
            document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
        });
    }
}
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

    let markdownSafe = `.postcolor tag-content, .postcolor tag-msg, .postcolor tag-action, .profile [data-key="#details"] .scroll, .profile [data-key="#plotting"] .scroll, tl, et-content, et-msg, et-action, .member--item .scroll`;

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
    if(rating.value === 'Any') {
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

/****** Topic Initialization ******/
function initTopicDescription(selector) {
    document.querySelectorAll(selector).forEach(desc => {
        desc.innerHTML = desc.innerHTML.replaceAll('[', '<tag-highlight>').replaceAll(']', '</tag-highlight>');
    });
}
function initTopicsWrap() {
    $(`.macro--header`).each(function (index) {
        $(this).nextUntil(`.macro--header`).wrapAll(`<div class="topiclist--section"></div>`);
    }); 
}

/****** Post Initialization ******/
function initPostRowDescription() {
    let descript = $('.topic-desc').html();
    if (descript != undefined) {
        var newDescript = descript.replace(", ", "");
        $('.topic-desc').html(newDescript);
    }
    let desc = document.querySelector('.maintitle .topic-desc');
    if(desc.innerText) {
        if(desc.innerText.includes('[')) {
            desc.classList.add('no-border');
        }
        initTopicDescription('.topic-desc');
    } else {
        desc.remove();
        document.querySelector('.postlinksbar').classList.add('no-descript');
    }
}
function initPostContentAlter() {
    document.querySelectorAll('.post--content .postcolor').forEach(post => {
        if(!post.querySelector('* > tag-wrap') && !post.querySelector('* > tag-comm') && !post.querySelector('* > tag-social') && !post.querySelector('* > et-wrap') && !post.querySelector('* > et-comm') && !post.querySelector('* > et-social') && !post.querySelector('.spyder--outershell')) {
            post.classList.add('no-template');
        }
    });
    document.querySelectorAll('.post.g-4 .charOnly, .post.g-6 .charOnly, .post.g-26 .charOnly, .post.g-28 .charOnly, .post.g-3.type-Member .charOnly').forEach(item => item.remove());
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

    document.querySelector(menuClass).classList.remove('is-open');

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

/****** Members Initialization ******/
function initMembers() {
    initAccordion();
}
function formatMemberRow(type, data, extraFilters = '') {
    let mainInfo = ``;
    let tagList = ``;
    if(type === 'character') {
        tagList = `${type} ${data.aliasClass} ${data.type} g-${data.groupID} ${data.speciesClass} ${data.ageClass} ${data.relationshipClass} ${data.locationClass} ${extraFilters}`;
        mainInfo = `<div class="member--item">
                <strong>Age</strong>
                <span>${data.age} years old</span>
            </div>
            <div class="member--item">
                <strong>Pronouns</strong>
                <span>${data.pronouns}</span>
            </div>
            <div class="member--item">
                <strong>Lives In</strong>
                <span>${data.location}</span>
            </div>
            <div class="member--item">
                <strong>Played By</strong>
                <span>${data.alias}</span>
            </div>
            <div class="member--item fullWidth">
                <strong>Species</strong>
                <span>${data.species}</span>
            </div>
            <div class="member--item fullWidth">
                <strong>Overview</strong>
                <span class="scroll">${data.overview}</span>
            </div>`;
    } else {
        tagList = `${type} ${data.aliasClass} ${data.type} g-${data.groupID} ${extraFilters}`;
        mainInfo = `<div class="member--item">
                <strong>Pronouns</strong>
                <span>${data.memberPronouns}</span>
            </div>
            <div class="member--item">
                <strong>Timezone</strong>
                <span>${data.timezone}</span>
            </div>
            <div class="member--item">
                <strong>Posts</strong>
                <span>${data.postCount} posts</span>
            </div>
            <div class="member--item">
                <strong>Joined</strong>
                <span>${data.dates.joined}</span>
            </div>
            <div class="member--item fullWidth">
                <strong>Last Post</strong>
                <span>${data.dates.lastPost}</span>
            </div>
            <div class="member--item fullWidth">
                <strong>Please Avoid</strong>
                <span class="scroll">${data.triggers}</span>
            </div>`;
    }
    return `<div class="grid-item ml--item ${tagList} m-${data.id}">
        <div class="member">
            <div class="member--image">
                <img src="${data.imageTall}" class="tall" loading="lazy" />
                <img src="${data.imageWide}" class="wide" loading="lazy" />
            </div>
            <div class="member--main">
                <div class="member--header">
                    <div class="member--group-icon"><span>${data.groupName[0]}</span></div>
                    <a href="?showuser=${data.id}">${data.name}</a>
                </div>
                <div class="member--info">
                    ${mainInfo}
                </div>
            </div>
        </div>
        <div class="hidden">
            <span class="mem--name">${data.nameClean}</span>
            <span class="mem--age">${data.age}</span>
            <span class="mem--posts">${data.postCount}</span>
            <span class="mem--join">${data.dates.joined}</span>
        </div>
    </div>`;
}
function populatePage(array) {
    let html = ``;
    let members = [], membersClean = [];
    let speciesList = [], speciesClean = [];

    for (let i = 0; i < array.length; i++) {
        //Make Member Array
        let member = {raw: array[i].alias, clean: array[i].aliasClass};
        if(jQuery.inArray(member.clean, membersClean) == -1 && member.clean != '') {
            membersClean.push(member.clean);
            members.push(member);
        }
        //Make Species Array
        let species = {raw: array[i].speciesRaw, clean: array[i].speciesClass};
        if(jQuery.inArray(species.clean, speciesClean) == -1 && species.clean != '') {
            speciesClean.push(species.clean);
            speciesList.push(species);
        }

        switch(array[i].groupID) {
            //member only
            case 4:
            case 6:
            case 26:
            case 28:
                html += formatMemberRow('writer', array[i]);
                break;
            //depends
            case 3:
                if(array[i].type === 'character') {
                    html += formatMemberRow('character', array[i]);
                } else {
                    html += formatMemberRow('writer', array[i]);
                }
                break;
            //character only
            default: 
                html += formatMemberRow('character', array[i], 'active');
                break;
        }
    }
    document.querySelector('#ml--rows').insertAdjacentHTML('beforeend', html);


    //sort member array
    members.sort((a, b) => {
        if(a.clean < b.clean) {
            return -1;
        } else if (a.clean > b.clean) {
            return 1;
        } else {
            return 0;
        }
    });
    //sort member array
    speciesList.sort((a, b) => {
        if(a.clean < b.clean) {
            return -1;
        } else if (a.clean > b.clean) {
            return 1;
        } else {
            return 0;
        }
    });

    //Append Arrays
    members.forEach(member => {
        document.querySelector('.ml--filter-group[data-filter-group="member"]').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${member.clean}"/>${member.raw}</label>`);
    });

    //Append Arrays
    speciesList.forEach(species => {
        document.querySelector('.ml--filter-group[data-filter-group="species"]').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${species.clean}"/>${species.raw}</label>`);
    });
}
function setCustomFilter() {
    //get search value
    qsRegex = document.querySelector(typeSearch).value;
    
    //add show class to all items to reset
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(memName).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    let checkFilters;
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    groups.forEach(group => {
        let tagString = group.selected.join('_');
        appendSearchQuery(group.group, tagString);
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    filter = filter.join(', ');

    // bind sort button click
    let currentSort = document.querySelector('.ml--sort.is-checked');
        
    //render isotope
    $container.isotope({
        filter: filter,
        sortBy: currentSort.dataset.sort,
    });
    $container.isotope('layout');
}
function debounce(fn, threshold) {
    var timeout;
    return function debounced() {
        if (timeout) {
        clearTimeout(timeout);
        }

        function delayed() {
        fn();
        timeout = null;
        }
        setTimeout(delayed, threshold || 100);
    };
}

/****** UserCP/Messages ******/
function initUCPMenu() {
    document.querySelector('#ucpmenu').innerHTML = `<button class="onlyMobile" onclick="toggleUCPMenu(this)">
        <div class="menu-bar menu-top"></div>
        <div class="menu-bar menu-middle"></div>
        <div class="menu-bar menu-bottom"></div>
    </button>
    <div class="accordion scroll">
        <div class="accordion--trigger" data-category="account"><b>Account</b></div>
        <div class="accordion--content" data-category="account">
            <a href="?act=UserCP&CODE=01">Edit Profile</a>
            <a href="?act=UserCP&CODE=24">Update Avatar</a>
            <a href="?act=UserCP&CODE=54">Sub-accounts</a>
            <a href="?act=UserCP&CODE=52">Edit Username</a>
            <a href="?act=UserCP&CODE=28">Change Password</a>
            <a href="?act=UserCP&CODE=08">Update Email</a>
        </div>
        <div class="accordion--trigger" data-category="messages"><b>Messages</b></div>
        <div class="accordion--content" data-category="messages">
            <a href="?act=Msg&CODE=01">Inbox</a>
            <a href="?act=Msg&CODE=04">Send Message</a>
        </div>
        <div class="accordion--trigger" data-category="tracking"><b>Tracking</b></div>
        <div class="accordion--content" data-category="tracking">
            <a href="?act=UserCP&CODE=alerts">Alerts</a>
            <a href="?act=UserCP&CODE=50">Forums</a>
            <a href="?act=UserCP&CODE=26">Topics</a>
        </div>
        <div class="accordion--trigger" data-category="settings"><b>Settings</b></div>
        <div class="accordion--content" data-category="settings">
            <a href="?act=UserCP&CODE=04">Board</a>
            <a href="?act=UserCP&CODE=alerts_settings">Alerts</a>
            <a href="?act=UserCP&CODE=02">Emails</a>
        </div>
    </div>`;

    initAccordion();
    initAccordionActive();


    let textNodes = getAllTextNodesArray(document.querySelectorAll('#UserCP.code-01 #ucpcontent td.pformleft'));
    textNodes.forEach(node => {
        const paragraph = document.createElement('span');
        node.after(paragraph);
        paragraph.appendChild(node);
    });
}
function initAccordionActive() {
    if(pageType === 'Msg') {
        document.querySelectorAll('[data-category="messages"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'UserCP' && (pageClasses.contains('code-alerts') || pageClasses.contains('code-50') || pageClasses.contains('code-26'))) {
        document.querySelectorAll('[data-category="tracking"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'UserCP' && (pageClasses.contains('code-alerts_settings') || pageClasses.contains('code-04') || pageClasses.contains('code-02'))) {
        document.querySelectorAll('[data-category="settings"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'UserCP') {
        document.querySelectorAll('[data-category="account"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store' && (pageClasses.contains('store-inventory') || pageClasses.contains('store-donate_money') || pageClasses.contains('store-donate_item'))) {
        document.querySelectorAll('[data-category="personal"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store' && (pageClasses.contains('store-fine') || pageClasses.contains('store-do_edit_points') || pageClasses.contains('store-edit_points') || pageClasses.contains('store-do_staff_inventory') || pageClasses.contains('store-edit_inventory'))) {
        document.querySelectorAll('[data-category="staff"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store' && pageClasses.contains('store-home')) {
        document.querySelectorAll('[data-category="home"]').forEach(item => item.classList.add('is-active'));
    } else if (pageType === 'store') {
        document.querySelectorAll('[data-category="shop"]').forEach(item => item.classList.add('is-active'));
    }
    if(window.location.search) {
        if(document.querySelector(`#ucpmenu a[href="${window.location.search}"]`)) {
	    document.querySelector(`#ucpmenu a[href="${window.location.search}"]`).classList.add('is-active');
	}
    } else if (document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/usercp/')[1]}"]`)) {
        document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/usercp/')[1]}"]`).classList.add('is-active');
    } else if (document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/store/')[1]}"]`)) {
        document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/store/')[1]}"]`).classList.add('is-active');
    }
}
function cpShift() {
	let imageType = document.querySelector(toggleFields[1]).value,
	    account = document.querySelector(toggleFields[0]).value,
        species = document.querySelector(toggleFields[2]).value,
        relationships = document.querySelector(toggleFields[3]).value,
	    showFields = [],
	    hideFields = characterFields
                    .concat(defaultImages)
                    .concat(gridImages)
                    .concat(mosaicImages)
                    .concat(singleRelFields)
                    .concat(sectionRelFields),
	    showHeaders = allHeaders;

	if(account == 'character') {
        if(imageType === 'grid') {
            showFields = characterFields
                        .concat(defaultImages)
                        .concat(gridImages);
            hideFields = mosaicImages;
            showHeaders = allHeaders
                        .concat(charHeaders);
            document.querySelector(defaultImages[0]).classList.remove('fullWidth');
        } else if (imageType === 'mosaic') {
            showFields = characterFields
                        .concat(defaultImages)
                        .concat(gridImages)
                        .concat(mosaicImages);
            hideFields = [];
            showHeaders = allHeaders
                        .concat(charHeaders);
            document.querySelector(defaultImages[0]).classList.remove('fullWidth');
        } else {
            showFields = characterFields
                        .concat(defaultImages);
            hideFields = gridImages
                        .concat(mosaicImages);
            showHeaders = allHeaders
                        .concat(charHeaders);
            document.querySelector(defaultImages[0]).classList.add('fullWidth');
        }

        specialSpecies.forEach(special => {
            if (special.species === species) {
                showFields = showFields.concat(special.fields);
            } else {
                hideFields = hideFields.concat(special.fields);
            }
        });

        if (relationships === 'a') {
            showFields = showFields.concat(singleRelFields);
            hideFields = hideFields.concat(sectionRelFields);
        } else {
            hideFields = hideFields.concat(singleRelFields);
            showFields = showFields.concat(sectionRelFields);
        }
    } else {
        specialSpecies.forEach(special => {
            hideFields = hideFields.concat(special.fields);
        });
    }
    
    adjustCP(showFields, hideFields, showHeaders);
}
function adjustCP(show, hide, headers) {
	show.forEach(field => {
		showAccField(field);
	});
	hide.forEach(field => {
		hideAccField(field);
	});
	document.querySelectorAll('.ucp--header').forEach(header => {
		header.remove();
	});
	headers.forEach(header => {
		insertCPHeader(header['title'], header['insertBefore']);
	});
}
function hideAccField(field) {
	if(document.querySelector(field)) {
		document.querySelector(field).classList.add('hidden');
	}
}
function showAccField(field) {
	if(document.querySelector(field)) {
		document.querySelector(field).classList.remove('hidden');
	}
}
function insertCPHeader (title, field) {
	$(field).before(`<tr class="pformstrip ucp--header"><td>${title}</td></tr>`);
}

/****** Store ******/
function initStoreMenu() {
    document.querySelector('#ucpmenu').innerHTML = `<button class="onlyMobile" onclick="toggleUCPMenu(this)">
        <div class="menu-bar menu-top"></div>
        <div class="menu-bar menu-middle"></div>
        <div class="menu-bar menu-bottom"></div>
    </button>
    <div class="accordion scroll">
        <a href="?act=store" class="accordion--trigger" data-category="home">Home</a>
        <div class="accordion--trigger" data-category="shop"><b>Shop</b></div>
        <div class="accordion--content" data-category="shop">
            <a href="?act=store&code=shop&category=9">Appreciation Badges</a>
            <a href="?act=store&code=shop&category=10">Event Badges</a>
            <a href="?act=store&code=shop&category=3">Hobby Badges</a>
            <a href="?act=store&code=shop&category=8">Loyalty Badges</a>
            <a href="?act=store&code=shop&category=5">Player Badges</a>
            <a href="?act=store&code=shop&category=11">Premium Features</a>
            <a href="?act=store&code=shop&category=6">Relationship Badges</a>
            <a href="?act=store&code=shop&category=7">Species Badges</a>
            <a href="?act=store&code=shop&category=1">Trait Badges</a>
            <a href="?act=store&code=shop&category=4">Zodiac Badges</a>
        </div>
        <div class="accordion--trigger" data-category="personal"><b>Personal</b></div>
        <div class="accordion--content" data-category="personal">
            <a href="?act=store&CODE=inventory">Inventory</a>
            <a href="?act=store&code=donate_money">Send Money</a>
            <a href="?act=store&code=donate_item">Send Item</a>
        </div>
        <div class="accordion--trigger staffOnly" data-category="staff"><b>Staff</b></div>
        <div class="accordion--content staffOnly" data-category="staff">
            <a href="?act=store&code=fine" class="staffOnly">Fine</a>
            <a href="?act=store&code=edit_points" class="staffOnly">Edit Points</a>
            <a href="?act=store&code=edit_inventory" class="staffOnly">Edit Inventory</a>
        </div>
    </div>`;

    initAccordion();
    initAccordionActive();
}