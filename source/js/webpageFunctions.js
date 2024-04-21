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
                case `business-edit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${businessBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                case `claims-edit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${editBot}`, discord.staffTitle, discord.staffMessage);
                    break;
                default:
                    console.log('Success');
                    break;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            form.innerHTML = `Whoops! The sheet connection didn't quite work. Please refresh the page and try again! If this persists, please open the console (ctrl + shift + J) and send Lux a screenshot of what's there.`;
        },
        complete: function () {
            $('#form-reserve button[type="submit"]').text('Submit');
            
            form.innerHTML = successMessage;

            window.scrollTo(0, 0);
            switch(data.SubmissionType) {
                case `claims-submit`:
                    sendDiscordMessage(`https://discord.com/api/webhooks/${publicSortBot}`, discord.publicTitle, discord.publicMessage, `<@&1124161240378392717>`, discord.groupColor);
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
            <span><input type="text" placeholder="Title" /></span>
        </label>
        <label class="section-role-count">
            <b>Section Role Count</b>
            <span><input type="number" value="1" min="1" /></span>
        </label>
        <label class="section-overview fullWidth">
            <b>Overview</b>
            <span><textarea placeholder="Overview"></textarea></span>
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
        <span><input type="text" id="user-${i}" placeholder="Member" /></span>
    </label>
    <label class="user-id">
        <b>Member ID</b>
        <span><input type="text" id="id-${i}" placeholder="Member ID" /></span>
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
function complexFieldToggle(field, ifclass, value) {
    if(field.options[field.selectedIndex].value === value) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }
}
function anyValueToggle(field, ifclass) {
    if(field.options[field.selectedIndex].value !== '') {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }
}
function simpleCheckToggle(field, ifclass) {
    if(field.checked) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }
}
function submitClaims(form, data, discord) {
    fetch(claims)
    .then((response) => response.json())
    .then((claimsData) => {
        let prevCharacter = claimsData.filter(item => item.ParentID === data.ParentID);
        if(prevCharacter.length > 0) {
            data.MemberPronouns = prevCharacter[0].MemberPronouns;
            data.MemberGroup = prevCharacter[0].MemberGroup;
            data.MemberGroupID = prevCharacter[0].MemberGroupID;
        } else {
            let memberPronouns = form.querySelector('#memberpronouns').value.toLowerCase().trim();
            let memberGroupField = form.querySelector('#membergroup');
            let memberGroup = memberGroupField.options[memberGroupField.selectedIndex].innerText.toLowerCase().trim();
            let memberGroupID = memberGroupField.options[memberGroupField.selectedIndex].value;
            data.MemberPronouns = memberPronouns;
            data.MemberGroup = memberGroup;
            data.MemberGroupID = memberGroupID;
        }

        let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
        <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
    
        sendAjax(form, data, discord, successMessage);
    });
}
function editBusinesses(form, data) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Businesses`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.Employer.toLowerCase().trim() === data.Employer.toLowerCase().trim());

        if(existing.length === 1) {
            existing = existing[0];
            let previous = ``;
            let updated = ``;

            if(data.Hiring && data.Hiring !== existing.Hiring) {
                previous += `- Hiring: ${existing.Hiring}\n`;
                updated += `- Hiring: ${data.Hiring}\n`;
                existing.Hiring = data.Hiring;
            }
            if(data.WeekdayHours && data.WeekdayHours !== existing.WeekdayHours) {
                previous += `- Weekday Hours: ${existing.WeekdayHours}\n`;
                updated += `- Weekday Hours: ${data.WeekdayHours}\n`;
                existing.WeekdayHours = data.WeekdayHours;
            }
            if(data.WeekendHours && data.WeekendHours !== existing.WeekendHours) {
                previous += `- Weekend Hours: ${existing.WeekendHours}\n`;
                updated += `- Weekend Hours: ${data.WeekendHours}\n`;
                existing.WeekendHours = data.WeekendHours;
            }

            let staffTitle = `${capitalize(data.member)} (#${data.memberId}) has editted ${capitalize(data.Employer)}`;
            let staffMessage = `**Previously:**\n${previous}\n**Updated to:**\n${updated}`; 

            let sendData = {
                SubmissionType: "business-edit",
                Employer: existing.Employer,
                Category: existing.Category,
                Location: existing.Location,
                LocationID: existing.LocationID,
                Hiring: existing.Hiring,
                Summary: existing.Summary,
                WeekendHours: existing.WeekendHours,
                WeekdayHours: existing.WeekdayHours,
            }

            let discord = {
                staffTitle: staffTitle,
                staffMessage: staffMessage,
            }

            let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
            <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

            sendAjax(form, sendData, discord, successMessage);

        }
            
    });
    
    return false;
}
function editClaims(form, data) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.AccountID === data.AccountID);

        if(existing.length === 1) {
            existing = existing[0]
            let original = {...existing};
            let staffMessage = ``;

            if(data.selectedChanges.includes('alias')) {
                existing.Member = data.Member;
                if(staffMessage !== '') {
                    staffMessage += `\n`
                }
                staffMessage += `**Alias Change:** From ${capitalize(original.Member)} to ${capitalize(existing.Member)}`;
            }
    
            if(data.selectedChanges.includes('name')) {
                existing.Character = data.Character;
                if(staffMessage !== '') {
                    staffMessage += `\n`
                }
                staffMessage += `**Name Change:** From ${capitalize(original.Character)} to ${capitalize(existing.Character)}`;
            }
    
            if(data.selectedChanges.includes('group')) {
                existing.Group = data.Group;
                existing.GroupID = data.GroupID;
                if(staffMessage !== '') {
                    staffMessage += `\n`
                }
                staffMessage += `**Group Change:** From ${capitalize(original.Group)} to ${capitalize(existing.Group)}`;
            }
    
            if(data.selectedChanges.includes('job-add') || data.selectedChanges.includes('job-edit') || data.selectedChanges.includes('job-remove')) {
                let jobsArray = [];
                if (original.Jobs) {
                    jobsArray = original.Jobs.split('+').map(item => JSON.parse(item));
                }
                
                //remove jobs first
                if(data.selectedChanges.includes('job-remove')) {
                    let removedJobs = Array.prototype.slice.call(form.querySelectorAll('[name="remove"]'))
                        .filter(item => item.checked)
                        .map(item => parseInt(item.value.split('-')[1]));
                    removedJobs.forEach(job => {
                        jobsArray[job].employer = 'remove';
                        jobsArray[job].position = 'remove';
                    });
                    jobsArray = jobsArray.filter(item => item.employer !== 'remove' && item.position !== 'remove');
                }

                //then edit existing jobs
                if(data.selectedChanges.includes('job-edit')) {
                    let editedJobs = Array.prototype.slice.call(form.querySelectorAll('#edit-jobs-clip input'))
                    .filter(item => item.value !== '');

                    editedJobs.forEach(editJob => {
                        jobsArray.forEach(job => {
                            if(job.employer === editJob.dataset.employer && job.position === editJob.dataset.position) {
                                job.position = editJob.value;
                            }
                        });
                    });
                }

                //parse back to string
                let jobsString = jobsArray.map(item => JSON.stringify(item)).join('+');

                //then add new jobs
                if(data.selectedChanges.includes('job-add')) {
                    let addedEmployers = form.querySelectorAll('#jobs-clip .employer select');
                    let addedJobs = form.querySelectorAll('#jobs-clip .job input');
                    for(let i = 0; i < addedEmployers.length; i++) {
			            let employer = addedEmployers[i];
                        if(jobsArray.length > 0) {
                            jobsString += `+`;
                        }
                        jobsString += `{"employer": "${employer.options[employer.selectedIndex].innerText.toLowerCase().trim()}", "position": "${addedJobs[i].value.toLowerCase().trim()}"}`;
                        if(i !== addedEmployers.length - 1) {
                            jobsString += `+`;
                        }
                    }
                }

                existing.Jobs = jobsString;

                //now do message
                let originalList = [];
                if (original.Jobs) {
                    originalList = original.Jobs.split('+').map(item => JSON.parse(item));
                }
                let newList = jobsString.split('+').map(item => JSON.parse(item));

                if(staffMessage !== '') {
                    staffMessage += `\n\n`
                }

                staffMessage += `**Jobs Updated From:**`;
                originalList.forEach(job => {
                    staffMessage += `\n${capitalize(job.employer)} - *${capitalize(job.position)}*`;
                });

                staffMessage += `\n\n**Jobs Updated To:**`;
                newList.forEach(job => {
                    staffMessage += `\n${capitalize(job.employer)} - *${capitalize(job.position)}*`;
                })
            }
    
            if(data.selectedChanges.includes('plot-remove')) {
                let plotArray = [];
                if (original.SubplotRoles) {
                    plotArray = original.SubplotRoles.split('@').map(item => JSON.parse(item));
                }

                let removedRoles = Array.prototype.slice.call(form.querySelectorAll('[name="remove-plot"]'))
                    .filter(item => item.checked)
                    .map(item => parseInt(item.value.split('-')[1]));

                removedRoles.forEach(role => {
                    plotArray[role].plotId = 'remove';
                });
                plotArray = plotArray.filter(item => item.plotId !== 'remove');
                console.log(plotArray);

                //parse back to string
                let plotString = plotArray.map(item => JSON.stringify(item)).join('@');

                existing.SubplotRoles = plotString;

                //now do message
                let originalList = [];
                if (original.SubplotRoles) {
                    originalList = original.SubplotRoles.split('@').map(item => JSON.parse(item));
                }
                let newList = plotString.split('@').map(item => JSON.parse(item));

                if(staffMessage !== '') {
                    staffMessage += `\n\n`
                }

                staffMessage += `**Plot Roles Updated From:**`;
                originalList.forEach(role => {
                    staffMessage += `\n${capitalize(role.plot)} - ${capitalize(role.section)} - ${capitalize(role.role)}`;
                });

                staffMessage += `\n\n**Plot Roles Updated To:**`;
                newList.forEach(role => {
                    staffMessage += `\n${capitalize(role.plot)} - ${capitalize(role.section)} - ${capitalize(role.role)}`;
                })
            }
    
            if(data.selectedChanges.includes('group')) {
                staffMessage += `\n\nPlease change the account's member group in the Admin CP before marking this log as reviewed.`;
            }

            let staffTitle = `${capitalize(data.editor)} has made edits to ${capitalize(existing.Character)} (#${data.AccountID})`;

            let discord = {
                staffTitle: staffTitle,
                staffMessage: staffMessage
            }

            let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
            <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

            existing.SubmissionType = data.SubmissionType;

            sendAjax(form, existing, discord, successMessage);
        }
            
    });
    
    return false;
}
function editJobs(form, field) {
    if(field.checked) {
        let id = form.querySelector('#id').value.split('?showuser=').length > 1 ? form.querySelector('#id').value.split('?showuser=')[1].toLowerCase().trim() : form.querySelector('#id').value;
        if(id && id !== '') {
            loadExistingJobs(form, 'edit', id);
        } else {
            form.querySelector('#edit-jobs-clip').innerHTML = `<blockquote class="fullWidth">Please enter the ID of an accepted character first.</blockquote>`;
        }
    } else {
        form.querySelector(`#edit-jobs-clip`).innerHTML = '';
    }
}
function removeJobs(form, field) {
    if(field.checked) {
        let id = form.querySelector('#id').value.split('?showuser=').length > 1 ? form.querySelector('#id').value.split('?showuser=')[1].toLowerCase().trim() : form.querySelector('#id').value;
        if(id && id !== '') {
            loadExistingJobs(form, 'remove', id);
        } else {
            form.querySelector('#remove-jobs-clip').innerHTML = `<blockquote class="fullWidth">Please enter the ID of an accepted character first.</blockquote>`;
        }
    } else {
        form.querySelector(`#remove-jobs-clip`).innerHTML = '';
    }
}
function removePlots(form, field) {
    if(field.checked) {
        let id = form.querySelector('#id').value.split('?showuser=').length > 1 ? form.querySelector('#id').value.split('?showuser=')[1].toLowerCase().trim() : form.querySelector('#id').value;
        if(id && id !== '') {
            loadExistingPlots(form, id);
        } else {
            form.querySelector('#remove-jobs-clip').innerHTML = `<blockquote class="fullWidth">Please enter the ID of an accepted character first.</blockquote>`;
        }
    } else {
        form.querySelector(`#remove-jobs-clip`).innerHTML = '';
    }
}
function loadExistingJobs(form, type, id) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let character = claimsData.filter(item => item.AccountID === id)[0];
        let jobs = [];
        if(character.Jobs) {
            jobs = character.Jobs.split('+').map(item => JSON.parse(item));
        }
        let html = ``;
        if(type === 'edit') {
            jobs.forEach((job, i) => {
                html += `<label>
                    <b>${capitalize(job.employer)}</b>
                    <span><input type="text" id="edit-job-${i}" data-employer="${job.employer}" data-position="${job.position}" placeholder="${capitalize(job.position)}" /></span>
                </label>`;
            });
            if(jobs.length === 0) {
                html = `<blockquote class="fullWidth">This character is not employed</blockquote>`;
            }
            form.querySelector('#edit-jobs-clip').innerHTML = html;
        }
        if(type === 'remove') {
            jobs.forEach((job, i) => {
                html += `<label class="input-wrap">
                    <input type="checkbox" name="remove" id="remove-job-${i}" value="job-${i}">
                    <div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div>
                    <strong>${job.employer} - ${job.position}</strong>
                </label>`;
            });
            if(jobs.length === 0) {
                html = `<blockquote class="fullWidth">This character is not employed</blockquote>`;
            }
            form.querySelector('#remove-jobs-clip').innerHTML = html;
        }
    });
}
function loadExistingPlots(form, id) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let character = claimsData.filter(item => item.AccountID === id)[0];
        let plots = [];
        if(character.SubplotRoles) {
            plots = character.SubplotRoles.split('@').map(item => JSON.parse(item));
        }
        let html = ``;
        plots.forEach((plot, i) => {
            html += `<label class="input-wrap">
                <input type="checkbox" name="remove-plot" id="remove-plot-${i}" value="plot-${i}">
                <div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div>
                <strong>${plot.plot} - ${plot.section} - ${plot.role}</strong>
            </label>`;
        });
        if(plots.length === 0) {
            html = `<blockquote class="fullWidth">This character is not part of any subplots.</blockquote>`;
        }
        form.querySelector('#remove-roles-clip').innerHTML = html;
    });
}
function initBusinesses(businessData) {
    let businessArray = businessData
    .filter(item => item.Hiring !== 'No')
    .sort((a, b) => {
        if (a.Hiring.toLowerCase() === 'yes' && b.Hiring.toLowerCase() !== 'yes') {
            return -1;
        } else if (a.Hiring.toLowerCase() !== 'yes' && b.Hiring.toLowerCase() === 'yes') {
            return 1;
        } else if (a.Employer.toLowerCase().replace('the ', '') < b.Employer.toLowerCase().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().replace('the ', '') > b.Employer.toLowerCase().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });

    businessArray.forEach((business, i) => {
        //First
        if(i === 0) {
            let optgroup = `Ask First`;
            if(business.Hiring.toLowerCase() === 'yes') {
                optgroup = `Actively Hiring`;
            }
            businessList += `<optgroup label="${optgroup}">`;
            businessList += `<option value="${business.Employer}">${capitalize(business.Employer)}</option>`;
        }
        //Different Hiring Status
        else if (businessArray[i - 1].Hiring.toLowerCase() !== business.Hiring.toLowerCase()) {
            let optgroup = `Ask First`;
            if(business.Hiring.toLowerCase() === 'yes') {
                optgroup = `Actively Hiring`;
            }
            businessList += `</optgroup>`;
            businessList += `<optgroup label="${optgroup}">`;
            businessList += `<option value="${business.Employer}">${capitalize(business.Employer)}</option>`;
        } else {
            businessList += `<option value="${business.Employer}">${capitalize(business.Employer)}</option>`;
        }
        if(i === businessArray.length - 1) {
            businessList += `</optgroup>`;
        }
    });

    document.querySelectorAll('#job-count').forEach(jobCount => {
        handleJobFields(jobCount.closest('form'), jobCount);
    })
}
function toggleSection(e) {
    e.parentNode.classList.toggle('is-active');
}