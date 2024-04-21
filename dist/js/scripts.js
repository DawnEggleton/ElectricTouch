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

//Capitalize member name
document.querySelector('.profile-link').setAttribute('title', `View ${capitalize(`<!-- |name| -->`)}`);
document.querySelector('.mobile-profile-link').innerText = capitalize(`<!-- |name| -->`);

//remove empty tooltips
$('*[title=""]').removeAttr('title');
$('*[tooltip=""]').removeAttr('tooltip');
if (typeof tippy === 'function') {
    tippy(document.querySelectorAll('[title]'), {
        content: (reference) => {
	    function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	    }
	    if(!reference.querySelector('.macro--button')) {
                const title = reference.getAttribute('title');
                reference.removeAttribute('title');
		const stringified = JSON.stringify({title: title});
		
		if(reference.classList.contains('profile-link')) {
                    return capitalize(htmlDecode(title));
		} else {
                    return htmlDecode(title);
		}
	    }
        },
        theme: 'godlybehaviour',
        arrow: false
    });
}

//quick login
if(document.querySelector('body').classList.contains('g-2')) {
    initQuickLogin();
} else {
    if($('#quick-login').length) {
        $('#quick-login').remove();
    }
    $('#quick-login-clip').remove();
}

//init clipboards
let clipboards = document.querySelectorAll('tag-code');
let codes = document.querySelectorAll(`table[id='CODE-WRAP']`);
if (clipboards.length > 0) {
    initClipboard();
}
if (codes.length > 0) {
    initCodebox();
}

//handle translations
document.querySelectorAll('tag-translation').forEach(translation => {
    translation.dataset.result = translation.innerText;
});

/********** Initializations **********/
setTheme();
setSize();
initModals();
initMarkdown();
initCopyLink();
highlightCode();

/********** Window Click **********/
document.querySelector('.invisibleEl').addEventListener('click', e => {
	document.querySelector('.nav--popout').classList.remove('is-open');
	document.querySelector('.button--menu').classList.remove('is-open');
	e.target.classList.remove('menu-open');
});

/********** Index & Category View Only **********/
if(pageType === 'idx' || pageType === 'SC') {
	initForums();

    document.querySelector('.stats--recent').innerHTML = document.querySelector('#recent-topics table').outerHTML;
    document.querySelector('#recent-topics').remove();

    let names = document.querySelectorAll('.stats--today a');
    names.forEach(name => {
	    name.innerText = capitalize(name.innerText);
    });
}

/********** Topic List Only **********/
if(pageType === 'SF') {
	initForums();
    initTopicsWrap();
    initTopicDescription('.topic--description');
}

/********** Post View Only **********/
if(pageType === 'ST') {
    initPostRowDescription();
    initPostContentAlter();

    let channels = ``, users = ``;
    taggingChannels.forEach(channel => channels += `<option value="${channel.hook}">${channel.name}</option>`);
    taggingUsers.sort((a, b) => {
	if(a.name < b.name) {
	    return -1;
	} else if (a.name > b.name) {
	    return 1;
	} else {
	    return 0;
	}
    }).forEach(user => users += `<option value="${user.id}">${user.name}</option>`);

    document.querySelector('#ST main > table').insertAdjacentHTML('afterend', `<div class="alert-options">
	<select id="alert-channel">
		<option value="">-- None --</option>
		${channels}
	</select>
	<select id="alert-user">
		<option value="">-- None --</option>
		${users}
	</select>
	<input type="button" name="sendAlert" id="sendAlert" value="Send Alert" />
</div>`);

    document.querySelector('#sendAlert').addEventListener('click', e => {
        let channel = document.querySelector('#alert-channel');
        let user = document.querySelector('#alert-user');
        let topic = document.querySelector('.topic-title').innerText;
        let url = `${window.location.origin}${window.location.search}view=getnewpost`;
        var characters = document.querySelector('.topic-title').innerText;
        var includes = [...new Set(Array.from(document.querySelectorAll('.post--header > a')).map(item => item.dataset.fullName))];
        var characterList = ``;
        includes.forEach((character, i) => {
            if(includes.length > 2 && i < includes.length && i !== 0) {
                characterList += `, `;
            }
            if(includes.length === 2 && i !== 0) {
                characterList += ` `;
            }
            if ((includes.length === 2 && i !== 0) || (includes.length > 2 && i === includes.length - 1)) {
                characterList += `and `;
            }
            characterList += capitalize(character.toLowerCase()).trim();
        });
        let triggerBlock = document.querySelectorAll('.post--main');
        let triggers = triggerBlock.length > 0 && triggerBlock[triggerBlock.length - 1].querySelector('.profile--warning span') ? triggerBlock[triggerBlock.length - 1].querySelector('.profile--warning span').innerText : false;
        let message = `Featuring ${characterList}`;
        if(triggers) {
            message += `\n**TW:** ${triggers}`;
        }

        if(channel.options[channel.selectedIndex].value !== '' && user.options[user.selectedIndex].value !== '') {
            sendDiscordTag(channel.options[channel.selectedIndex].value, `You've been tagged!`, `[${capitalize(topic.toLowerCase(), [` `, `-`])}](<${url}>)
    ${message}`, `<@${user.options[user.selectedIndex].value}>`);
        }

        document.querySelector('#alert-channel').value = '';
        document.querySelector('#alert-user').value = '';
        document.querySelector('#sendAlert').value = 'Sent!';
        setTimeout(function () {
            document.querySelector('#sendAlert').value = 'Send Alert';
        }, 1000);
    });
}

/********** Member List Only **********/
if(pageType === 'Members') {
	initMembers();
}

/********** UCP Menu **********/
if(pageType === 'UserCP' || pageType === 'Msg') {
	initUCPMenu();

    //move contents of ucpcontent into something for styling purposes
    if((pageType === 'UserCP' &&
        ($('body.code-24').length > 0 ||
        $('body.code-54').length > 0 ||
        $('body.code-52').length > 0 ||
        $('body.code-28').length > 0 ||
        $('body.code-08').length > 0 ||
        $('body.code-alerts').length > 0 ||
        $('body.code-50').length > 0 ||
        $('body.code-04').length > 0 ||
        $('body.code-alerts_settings').length > 0 ||
        $('body.code-02').length > 0 ||
        $('body.code-26').length > 0)) ||
        (pageType === 'Msg' &&
        ($('body.code-01').length > 0 || 
        $('body.code-03').length > 0))) {
        document.querySelector('#ucpcontent').innerHTML = `<div class="ucp--content-inner"><div class="scroll">${document.querySelector('#ucpcontent').innerHTML}</div></div>`;
    }

	//Edit Profile Edits
	if($('body.code-01').length > 0 && pageType === 'UserCP') {
        cpShift();

        //UCP Sliders
        var sliders = [
            $('#field_49_input'),
            $('#field_51_input'),
            $('#field_53_input'),
            $('#field_55_input')
        ];
        var vals = sliders.map(item => item.val());

        for (var i = 0; i < sliders.length; i++) {
            sliders[i].prop('type','range').attr({min:0,max:100,step:1});
            sliders[i].next().attr('id',sliders[i].attr('id')).text(vals[i]);
            if(vals[i] == '') {
                sliders[i].next().text('n/a');
            }

            $(sliders[i]).on('change', function(){
                this.setAttribute('value',this.value);
                vals[i] = this.value;
                this.nextSibling.innerHTML = vals[i];
            });
            
        }
        
        toggleFields.forEach(toggle => {
            document.querySelector(toggle).addEventListener('change', () => {
                cpShift();
            });
        });
    }

    //subaccounts
    if($('body.code-54').length > 0 && pageType === 'UserCP') {
        document.querySelectorAll('input[name="sub_ids[]"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }

    //alerts
    if($('body.code-alerts').length > 0 && pageType === 'UserCP') {
        document.querySelectorAll('input[name="alert_id[]"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }

    //forum and topic subscriptions
    if ((pageClasses.contains('code-50') || pageClasses.contains('code-26')) && pageType === 'UserCP') {
        document.querySelectorAll('.tableborder > table > tbody > tr').forEach(row => {
            if(row.querySelectorAll('th, td').length === 1) {
                row.classList.add('ucp--header', 'pformstrip');
            }
        });

        if(pageClasses.contains('code-26')) {
            document.querySelectorAll(`.tableborder input[type="checkbox"]`).forEach(input => inputWrap(input));
            fancyBoxes();
        }
    }
    
    //board settings
    if (pageClasses.contains('code-04') && pageType === 'UserCP') {
        inputWrap(document.querySelector(`input[name="DST"]`));
        fancyBoxes();
    }
    
    //alert settings
    if ((pageClasses.contains('code-alerts_settings') || pageClasses.contains('code-02')) && pageType === 'UserCP') {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }
    
    //send message
    if (pageClasses.contains('code-04') && pageType === 'Msg') {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }
}

/********** Member List Only **********/
if(pageType === 'store') {
    initStoreMenu();
    
    if(!pageClasses.contains('store-edit_points') && !pageClasses.contains('store-donate_item') && !pageClasses.contains('store-donate_money') && !pageClasses.contains('store-fine') && !pageClasses.contains('store-edit_inventory') && !pageClasses.contains('store-useitem') && !pageClasses.contains('store-do_edit_points')) {
        document.querySelector('#ucpcontent').innerHTML = `<div class="ucp--content-inner"><div class="scroll">${document.querySelector('#ucpcontent').innerHTML}</div></div>`;
    }
    
    //edit inventory settings
    if (pageClasses.contains('store-do_staff_inventory') && pageType === 'store') {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }
}

/********** New Post/Reply Only **********/
if(pageType === 'Post') {
    let textNodes = getAllTextNodes(document.querySelector('#post-options .pformright'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }

    inputWrap(`input[name="enableemo"]`, 'br');
    inputWrap(`input[name="enablesig"]`, 'br');
    inputWrap(`input[name="enabletrack"]`, 'br');
    document.querySelectorAll('input[name="iconid"]').forEach(icon => {
        inputWrap(icon, `input`, 'radio');
    });
    fancyBoxes();
}

/********** Online List Only **********/
if(pageType === 'Online') {
    let nameRows = document.querySelectorAll('#Online main > .tableborder:nth-of-type(2) .maintitle + table > tbody > tr > td');
    nameRows.forEach(row => row.innerHTML = row.innerHTML.replaceAll('(', '').replaceAll(')', ''));
}

/********** Reg Only **********/
if(pageType === 'Reg') {
    let textNodes = getAllTextNodes(document.querySelector('main > form'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }
    let textNodesArray = getAllTextNodesArray(document.querySelectorAll('fieldset'));
    textNodesArray.forEach(node => {
        const paragraph = document.createElement('span');
        node.after(paragraph);
        paragraph.appendChild(node);
    });

    document.querySelectorAll(`main > .tableborder .row2 input[type="checkbox"]`).forEach(input => inputWrap(input));
    document.querySelectorAll(`fieldset input[type="checkbox"]`).forEach(input => inputWrap(input));
    fancyBoxes();
    if(document.querySelector('input[name="agree"][type="checkbox"]')) {
        $('input[name="agree"][type="checkbox"]').wrap('<label class="input-wrap tos"></label>');
        $('.input-wrap.tos').append('<div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div> <p>I agree to the terms of this registration, <b>I am at least 18 years of age,</b> and wish to proceed.</p>');
    }

    if($('#Reg main > form .tablepad > table > tbody > tr:first-child > td:last-child > div > table > tbody > tr > td:first-child')) {
        $('#Reg main > form .tablepad > table > tbody > tr:first-child > td:last-child > div > table > tbody > tr > td:first-child').append($('#Reg main > form .tablepad > table > tbody > tr:first-child > td:first-child fieldset:last-child'));
    }
}

/********** Login Only **********/
if(pageType === 'Login') {
    let textNodes = getAllTextNodes(document.querySelector('main'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }
    $("main > p").nextUntil("div.tableborder").andSelf().wrapAll("<div class='container'></div>");
    $(`input[name="UserName"]`).attr('placeholder','Username');
    $(`input[name="PassWord"]`).attr('placeholder','Password');
}

/********** Search Only **********/
if(pageType === 'Search') {
    let names = document.querySelectorAll('.normalname a');
    names.forEach(name => {
	    name.innerText = capitalize(name.innerText);
    });
}

/********** Overriding Functions **********/
function read_alerts() {
    $('#recent-alerts').fadeOut();
    $.get( "index.php?recent_alerts=1&read=1", function( data ) {
        $( "#recent_alerts_data" ).html( data );
    });
    document.querySelectorAll('a[data-alerts]').forEach(alert => alert.dataset.new = 0);
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
        }).done(function() {
            document.querySelectorAll('.recent-alerts-msg').forEach(alert => {
		if(alert.querySelectorAll('a').length === 1) {
			alert.classList.add('reg-alert');
		}
	    });
	});
        $("#recent-alerts").fadeIn();
    }
}