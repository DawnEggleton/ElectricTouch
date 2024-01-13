function sendAjax(form, data, discord, successMessage) {
    $(form).trigger('reset');
    
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        dataType: "json", 
        success: function () {
            switch(data.SubmissionType) {
                case `plot-role-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${subplotBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                case `reserve-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${reserveBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                case `subplot-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${reserveBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                case `species-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${speciesBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                case `business-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${businessBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                case `claims-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${sortBot}`, discord.staffTitle, discord.staffMessage, null, discord.groupColor);
                    break;
                default:
                    console.log('Success');
                    break;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            document.querySelector('.form--sort-warning').innerHTML = `Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`;
        },
        complete: function () {
            $('#form-reserve button[type="submit"]').text('Submit');
            
            form.innerHTML = successMessage;

            window.scrollTo(0, 0);
            switch(data.SubmissionType) {
                case `claims-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${publicSortBot}`, discord.publicTitle, discord.publicMessage, null, discord.groupColor);
                    break;
                default:
                    console.log('Complete');
                    break;
            }
        }
    });
}
function sendDiscordMessage(webhook, embedTitle, message, notification = null, color = null) {
    const request = new XMLHttpRequest();
    request.open("POST", webhook);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        "content": notification,
        "embeds": [
            {
            "title": embedTitle,
            "description": message,
            "color": parseInt(color, 16)
            }
        ],
        "attachments": []
	};

    request.send(JSON.stringify(params));
}

function initSectionCount(countInput) {
    let active = document.querySelector('#form-plot-add #roles-clip');
    let currentCount = active.querySelectorAll('.section-wrap').length;
    let newCount = parseInt(countInput.value);
    if (newCount > currentCount) {
        for(let i = currentCount; i < newCount; i++) {
            active.insertAdjacentHTML('beforeend', addRoleFields());
        }
    } else if (currentCount > newCount) {
        let difference = currentCount - newCount;
        for(let i = 0; i < difference; i++) {
            active.querySelectorAll('.section-wrap')[currentCount - i - 1].remove();
        }
    }

    document.querySelectorAll('#form-plot-add .section-role-count input').forEach(sectionInput => {
        initSectionRoles(sectionInput);

        sectionInput.addEventListener('change', e => {
            initSectionRoles(e.currentTarget);
        });
    });
}
function initSectionRoles(sectionInput) {
    let active = sectionInput.closest('.section-wrap');
    let currentCount = active.querySelectorAll('.section-role-count').length;
    let newCount = parseInt(sectionInput.value) + 1;
    if (newCount > currentCount) {
        for(let i = currentCount; i < newCount; i++) {
            active.querySelector('.section-role-group').insertAdjacentHTML('beforeend', addIndividualRole());
        }
    } else if (currentCount > newCount) {
        let difference = currentCount - newCount;
        for(let i = 0; i < difference; i++) {
            active.querySelectorAll('.section-role-count')[currentCount - i - 1].remove();
        }
    }
}
function addRoleFields() {
    return `<div class="section-wrap fullWidth">
        <label class="section-name">
            <b>Section Title</b>
            <span><input type="text" placeholder="Title" required /></span>
        </label>
        <label class="section-role-count">
            <b>Section Role Count</b>
            <span><input type="number" value="1" min="1" required /></span>
        </label>
        <label class="section-overview fullWidth">
            <b>Overview</b>
            <span><textarea placeholder="Overview" required></textarea></span>
        </label>
        <div class="section-role-group fullWidth" data-type="grid" data-columns="2"></div>
    </div>`;
}
function addIndividualRole() {
    return `<label class="section-role-count">
        <b>Section Role</b>
        <span><input type="text" placeholder="Role Name (Max Number)" /></span>
    </label>`;
}
function reloadForm(e) {
	location.reload();
}
function initJoinSelect(data, formId) {
    let plots = [];
    let plotSelect = document.querySelector(`${formId} #plot`);

    data.forEach(item => {
        plots.push({
            title: item.Plot,
            value: item.PlotID,
        });
    });

    plotSelect.innerHTML = formatSelect(plots);
    
    plotSelect.addEventListener('change', e => {
        initSectionSelect(data, plotSelect, formId);
    });
}
function initSectionSelect(data, plotSelect, formId) {
    let sections = [];
    let sectionSelect = document.querySelector(`${formId} #section`);

    data.forEach(item => {
        if(item.PlotID === plotSelect.options[plotSelect.selectedIndex].value) {
            let sectionObjects = item.Sections.split('@').map(each => JSON.parse(each));
            sectionObjects.forEach((section, i) => {
                sections.push({
                    title: section.title,
                    value: i,
                })
            })
        }
    });

    sectionSelect.innerHTML = formatSelect(sections);
    
    sectionSelect.addEventListener('change', e => {
        initRoleSelect(data, plotSelect, sectionSelect, formId);
    });
}
function initRoleSelect(data, plotSelect, sectionSelect, formId) {
    let roles = [];
    let roleSelect = document.querySelector(`${formId} #role`);

    data.forEach(item => {
        if(item.PlotID === plotSelect.options[plotSelect.selectedIndex].value) {
            let sectionObjects = item.Sections.split('@').map(each => JSON.parse(each));

            sectionObjects.forEach(section => {
                if(section.title.toLowerCase().trim() === sectionSelect.options[sectionSelect.selectedIndex].innerText.toLowerCase().trim()) {
                    let rolesArray = section.roles.split(', ')
                            .map(role => {
                                if(role.split('|').length > 1) {
                                    return capitalize(role.split('|')[0]);
                                } else {
                                    return capitalize(role);
                                }
                            });
                    rolesArray.forEach((role, i) => {
                        roles.push({
                            title: role,
                            value: i,
                        });
                    });
                }
            });
        }
    });

    roleSelect.innerHTML = formatSelect(roles);
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
function toggleCharacters(e) {
    e.closest('.claim-member').classList.toggle('is-open');
}
function sortButton(button) {
    let item = button.dataset.sortType;
    let switching = true;
    let rows, shouldSwitch;
    let switchCount = 0;

    while (switching) {
        switching = false;
        rows = button.closest('.claim-wrap').querySelectorAll(`.claim.sortable`);
        console.log(rows);
        for (i = 0; i < rows.length; i++) {
            shouldSwitch = false;

            //set sorting value in a way that works for date, numerical, or alphabetical sorting
            if(rows[i+1]) {
                switch(button.dataset.sortBy) {
                    case 'date':
                        a = Date.parse(rows[i].querySelector(`[data-sort-type="${item}"]`).innerText.toLowerCase().trim());
                        b = Date.parse(rows[i + 1].querySelector(`[data-sort-type="${item}"]`).innerText.toLowerCase().trim());
                        break;
                    case 'number':
                        a = parseInt(rows[i].querySelector(`[data-sort-type="${item}"]`).innerText.toLowerCase().trim());
                        b = parseInt(rows[i + 1].querySelector(`[data-sort-type="${item}"]`).innerText.toLowerCase().trim());
                        break;
                    default:
                        a = rows[i].querySelector(`[data-sort-type="${item}"]`).innerText.toLowerCase().trim();
                        b = rows[i + 1].querySelector(`[data-sort-type="${item}"]`).innerText.toLowerCase().trim();
                }
            }
          
            if (a > b) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          switchCount ++;
        }
    }
    switching = true;
    switchCount = 0;
}
function addCreditFields(i) {
    let html = `<label class="user-name">
        <b>Member</b>
        <span><input type="text" id="user-${i}" placeholder="Member" required /></span>
    </label>
    <label class="user-id">
        <b>Member ID</b>
        <span><input type="text" id="id-${i}" placeholder="Member ID" required /></span>
    </label>`;
    return html;
}
function loadCredits() {
    let active = document.querySelector(`#form-species-add #credit-clip`);
    let count = document.querySelector(`#form-species-add #credit-count`) ? document.querySelector(`#form-species-add #credit-count`).value : 0;
    for(let i = 0; i < count; i++) {
        active.insertAdjacentHTML('beforeend', addCreditFields(i));
    }
}

function submitReserves(form, data, discord, successMessage) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimData) => {
        let created = claimData.filter(item => item.Face === data.face);
        if(created.length > 0) {
            if(form.querySelector('.warning')) {
                form.querySelector('.warning').remove();
            }
            form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! This face is already in play! Maybe we can help you find another option - check the #face-help channel in Discord!</blockquote>`);
        } else {

            fetch(`https://opensheet.elk.sh/${sheetID}/Reserves`)
            .then((response) => response.json())
            .then((reserveData) => {
                let existing = reserveData.filter(item => item.Face === data.face);
                let oldReserves = [];
        
                if(existing.length > 0) {
                    existing.forEach((reserve, i) => {
                        let current = new Date();
                        let time = new Date(reserve.Timestamp);
                        let difference = Math.floor(((current - time) / (1000*60*60*24)));
                        if(difference < 14) {
                            if(form.querySelector('.warning')) {
                                form.querySelector('.warning').remove();
                            }
                            form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! Someone else has an active reservation on that face already. Maybe we can help you find another option - check the #face-help channel in Discord!</blockquote>`);
                        
                            $('#form-reserve button[type="submit"]').text('Submit');
                        } else {
                            oldReserves.push(reserve);
                            existing.splice(i, 1);
                        }
                    });
                    if(existing.length > 0) {
                        if(form.querySelector('.warning')) {
                            form.querySelector('.warning').remove();
                        }
                        form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! Someone else has an active reservation on that face already. Maybe we can help you find another option - check the #face-help channel in Discord!</blockquote>`);
                    
                        $('#form-reserve button[type="submit"]').text('Submit');
                    } else {
                        oldReserves.forEach(reserve => {
                            if(reserve.Member === data.member) {
                                if(form.querySelector('.warning')) {
                                    form.querySelector('.warning').remove();
                                }
                                form.insertAdjacentHTML('afterbegin', `<blockquote class="fullWidth warning">Uh-oh! You've reserved that face before! Reserves at Godly Behaviour are non-renewable. If you don't remember doing this, please reach out to staff via Discord and we can review our records and discuss options with you!</blockquote>`);
                            } else {
                                sendAjax(form, data, discord, successMessage)
                            }
                        });
                    }
                } else {
                    sendAjax(form, data, discord, successMessage)
                }
            });
        }
    });
    
    return false;
}
function handleJobFields(form, field) {
    let active = form.querySelector('#jobs-clip');
    let currentCount = active.querySelectorAll('.job').length;
    let newCount = parseInt(field.value);
    if (newCount > currentCount) {
        for(let i = currentCount; i < newCount; i++) {
            active.insertAdjacentHTML('beforeend', addJobFields(i));
        }
    } else if (currentCount > newCount) {
        let difference = currentCount - newCount;
        for(let i = 0; i < difference; i++) {
            active.querySelectorAll('.employer')[currentCount - i - 1].remove();
            active.querySelectorAll('.job')[currentCount - i - 1].remove();
        }
    }
}
function addJobFields(i) {
	let html = `<label class="employer">
			<b>Employer</b>
			<span><select id="employer-${i}"><option value="">(select)</option><optgroup label="Self-employed"><option value="self-employed">Self-employed</option></optgroup>${businessList}</select></span>
		</label>
		<label class="job">
			<b>Job Title</b>
			<span><input type="text" id="job-${i}" placeholder="Job Title" /></span>
		</label>`;
	return html;
}
function simpleFieldToggle(field, ifclass) {
    if(field.options[field.selectedIndex].value === 'y') {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }
}