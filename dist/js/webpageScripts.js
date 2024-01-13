//Plot Role Section Count Change
initSectionCount(document.querySelector('#form-plot-add #section-count'));
document.querySelector('#form-plot-add #section-count').addEventListener('change', e => {
    initSectionCount(e.currentTarget);
});

//Submit Subplot
document.querySelector('#form-plot-add').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;

    let title = form.querySelector('#title').value.toLowerCase().trim();
    let id = form.querySelector('#id').value.toLowerCase().trim();
    let tagline = form.querySelector('#tagline').value.toLowerCase().trim();
    let overview = form.querySelector('#overview').value.trim();
    let sections = [];

    form.querySelectorAll('#roles-clip .section-wrap').forEach(section => {
        let sectionTitle = section.querySelector('.section-name input').value.toLowerCase().trim();
        let sectionOverview = section.querySelector('.section-overview textarea').value.trim();
        let roles = Array.from(section
            .querySelectorAll('.section-role-group .section-role-count'))
            .map(item => item.querySelector('input').value.toLowerCase().trim())
            .join(', ');
        let sectionObject = {
            title: sectionTitle,
            overview: sectionOverview,
            roles: roles,
        }
        sections.push(sectionObject);
    });
    let formattedSections = sections.map(section => JSON.stringify(section)).join('@');

    let data = {
        "SubmissionType": "add-plot-submit",
        Plot: title,
        PlotID: id,
        Tagline: tagline,
        Overview: overview,
        Sections: formattedSections,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    sendAjax(form, data, null, successMessage);
});

//Add to Subplot
document.querySelector('#form-join-plot').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;

    let id = form.querySelector('#id').value.split('?showuser=')[1] ? form.querySelector('#id').value.split('?showuser=')[1] : form.querySelector('#id').value;
    let plotSelected = form.querySelector('#plot').options[form.querySelector('#plot').selectedIndex];
    let sectionSelected = form.querySelector('#section').options[form.querySelector('#section').selectedIndex];
    let roleSelected = form.querySelector('#role').options[form.querySelector('#role').selectedIndex];

    let claim = {
        plot: plotSelected.innerText,
        plotId: plotSelected.value,
        plotPriority: `${form.querySelector('#plot').selectedIndex - 1}`,
        section: sectionSelected.innerText,
        sectionPriority: sectionSelected.value,
        role: roleSelected.innerText,
        rolePriority: roleSelected.value,
    }

    let updatedRoles = `${JSON.stringify(claim)}`;

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    fetch(claims)
    .then((response) => response.json())
    .then((claimsData) => {
        let exists = claimsData.filter(item => item.AccountID === id).length > 0;
        if(exists) {
            let character = claimsData.filter(item => item.AccountID === id)[0];

            if(character.SubplotRoles && character.SubplotRoles !== '') {
                updatedRoles += `@${character.SubplotRoles}`;
            }

            let discord = {
                staffTitle: `${capitalize(character.Member)} has added ${capitalize(character.Character)} to ${capitalize(claim.plot)}`,
                staffMessage: `**Section:** ${capitalize(claim.section)}
                **Role:** ${capitalize(claim.role)}`,
            }

            let data = {
                "SubmissionType": "plot-role-submit",
                SubplotRoles: updatedRoles,
                AccountID: id,
            }
        
            sendAjax(form, data, discord, successMessage);
        }
    });
});

//Reserve Face
document.querySelector('#form-reserve').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let member = form.querySelector('#member').value.toLowerCase().trim();
    let face = form.querySelector('#face').value.toLowerCase().trim();

    let embedTitle = `New Face Reservation`;
    let message = `${capitalize(member)} has reserved ${capitalize(face)}`;

    let data = {
        SubmissionType: `reserve-submit`,
        Member: member,
        Face: face,
    }
    let discord = {
        staffTitle: embedTitle,
        staffMessage: message,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    submitReserves(form, data, discord, successMessage);
});

//Reserve Face
document.querySelector('#form-reserve-plot').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let member = form.querySelector('#member').value.toLowerCase().trim();
    let plot = form.querySelector('#plot').options[form.querySelector('#plot').selectedIndex].innerText.toLowerCase().trim();
    let plotPriority = form.querySelector('#plot').selectedIndex;
    let section = form.querySelector('#section').options[form.querySelector('#section').selectedIndex].innerText.toLowerCase().trim();
    let sectionPriority = form.querySelector('#section').selectedIndex;
    let role = form.querySelector('#role').options[form.querySelector('#role').selectedIndex].innerText.toLowerCase().trim().split(' (')[0];
    let rolePriority = form.querySelector('#role').selectedIndex;

    let embedTitle = `New Subplot Reservation`;
    let message = `${capitalize(member)} has reserved ${capitalize(role)} from ${capitalize(plot)} (${capitalize(section)})`;

    let data = {
        SubmissionType: `subplot-submit`,
        Member: member,
        Subplot: plot,
        Section: section,
        RoleTitle: role,
        PlotPriority: plotPriority,
        SectionPriority: sectionPriority,
        RolePriority: rolePriority,
    }
    let discord = {
        staffTitle: embedTitle,
        staffMessage: message,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    sendAjax(form, data, discord, successMessage);
});

//Request Species
document.querySelector('#form-species').addEventListener('submit', e => {
    e.preventDefault();
    let form = e.currentTarget;
    let member = form.querySelector('#member').value.toLowerCase().trim();
    let species = form.querySelector('#species').value.toLowerCase().trim();
    let physiology = form.querySelector('#physiology').value.trim();
    let abilities = form.querySelector('#abilities').value.trim();
    let weaknesses = form.querySelector('#weaknesses').value.trim();
    let ideas = form.querySelector('#ideas').value.trim();
    let resources = form.querySelector('#resources').value.trim();

    let publicMessage = `Someone has suggested **${capitalize(species)}** as a new species! If you would like to see this species added, please react to this message! If you would like to discuss your own ideas for this species, please #create-a-ticket with staff!`;
    let privateMessage = `**Species:** ${species}
    \n\n**Physiology:**\n${physiology}
    \n\n**Abilities:**\n${abilities}
    \n\n**Weaknesses:**\n${weaknesses}
    \n\n**Ideas:**\n${ideas}
    \n\n**Resources:**\n${resources}
    \n\nReview collectively as staff and then, when ready, start a ticket in the public server with all staff and the member in order to discuss approval / edits / refusal. All staff should react to this request when it has been seen and read.`;

    //Send Public
    sendDiscordMessage(`https://discord.com/api/webhooks/${publicSpeciesBot}`, `New Species Suggested!`, publicMessage);

	if(privateMessage.length >= 2000) {
		let count = privateMessage.length / 2000;
		for (let i = 0; i < count; i++) {
			setTimeout(function() {
				let start = i * 2000;
				let end = start + 1999;
                    sendDiscordMessage(`https://discord.com/api/webhooks/${speciesBot}`, `New Species Request by ${capitalize(member)}, Part ${i + 1} of ${Math.ceil(count)}`, privateMessage);
			}, 500);
		}
	} else {
        sendDiscordMessage(`https://discord.com/api/webhooks/${speciesBot}`, `New Species Request by ${capitalize(member)}`, privateMessage);
	}

    form.innerHTML = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
});

//Announcement
document.querySelector('#form-announce').addEventListener('submit', e => {
    e.preventDefault();
    let form = e.currentTarget;
	let member = form.querySelector('#member').value.toLowerCase().trim();
	let character = form.querySelector('#character').value.toLowerCase().trim();
	let account = form.querySelector('#account').value.trim();
	let group = form.querySelector('#group').options[form.querySelector('#group').selectedIndex].innerText.toLowerCase().trim();
	let groupColor = rgbToHex(colors[group][0], colors[group][1], colors[group][2]);
	let hooks = form.querySelector('#about').value.trim();
    let embedTitle = `Welcome to ${capitalize(character)}!`;
	let message = `Played by ${capitalize(member)}\n\n**About:**\n${hooks}\n\n**Read more:**\n<https://godlybehaviour.jcink.net/?showuser=${account}>`;

    sendDiscordMessage(`https://discord.com/api/webhooks/${announceBot}`, embedTitle, message, null, groupColor);

    form.innerHTML = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
});

//Species Add
loadCredits();
document.querySelector('#form-species-add').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let species = form.querySelector('#species').value.toLowerCase().trim();
    let aging = form.querySelector('#aging').value.toLowerCase().trim();
    let lifespan = form.querySelector('#lifespan').value.toLowerCase().trim();
    let physiology = form.querySelector('#physiology').value.trim();
    let community = form.querySelector('#community').value.trim();
    let abilities = form.querySelector('#abilities').value.trim();
    let weaknesses = form.querySelector('#weaknesses').value.trim();
    let strength = form.querySelector('#strength').value;
    let longevity = form.querySelector('#longevity').value;
    let vulnerability = form.querySelector('#vulnerability').value;
    let customPercent = form.querySelector('#custom-percent').value;
    let customTrait = form.querySelector('#custom-trait').value.toLowerCase().trim();
    let traits = `{"trait": "physical strength", "percent": "${strength}"}+{"trait": "longevity", "percent": "${longevity}"}+{"trait": "vulnerability", "percent": "${vulnerability}"}+{"trait": "${customTrait}", "percent": "${customPercent}"}`;
    let credits = ``;
    let users = form.querySelectorAll('.user-name input');
    let ids = form.querySelectorAll('.user-id input');
    for(let i = 0; i < users.length; i++) {
        credits += `{"username": "${users[i].value.toLowerCase().trim()}", "userid": "${ids[i].value.toLowerCase().trim()}"}`;
        if(i !== users.length - 1) {
            credits += `+`;
        }
    }
    let premium = form.querySelector('#speciescat[value="cat-premium"]').checked;
    let hide = form.querySelector('#speciescat[value="staffOnly"]').checked;
    let tagObjects = document.querySelectorAll('#form-species-add .form-tag');
    let tagArray = Array.prototype.slice.call(tagObjects).filter(tag => tag.checked);
    let tags = tagArray.map(tag => tag.value).join(' ');
    let awarenessObjects = document.querySelectorAll('#form-species-add [name="awareness"]');
    let awarenessArray = Array.prototype.slice.call(awarenessObjects).filter(tag => tag.checked);
    let awareness = awarenessArray[0].value;
    let knowledgeObjects = document.querySelectorAll('#form-species-add [name="knowledge"]');
    let knowledgeArray = Array.prototype.slice.call(knowledgeObjects).filter(tag => tag.checked);
    let knowledge = knowledgeArray[0].value;

    let data = {
        SubmissionType: `species-submit`,
        Species: species,
        Aging: aging,
        Lifespan: lifespan,
        Physiology: physiology,
        CommunityStructure: community,
        Strengths: abilities,
        Weaknesses: weaknesses,
        Traits: traits,
        Credit: credits,
        Premium: premium,
        Tags: tags,
        Awareness: awareness,
        Knowledge: knowledge,
    }

    let discord = {
        staffTitle: `New Species Addition!`,
        staffMessage: `**${capitalize(species)}** has been added to the sheet${hide && ` for future release`}. Review them here: <https://godlybehaviour.jcink.net/?act=Pages&kid=species&typesearch=${species.replace(' ', '').toLowerCase().trim()}>`,
        publicTitle: `New Species Addition!`,
        publicMessage: `**${capitalize(species)}** has been added as a ${premium ? `premium species` : `playable species`}! Read more about them here: <https://godlybehaviour.jcink.net/?act=Pages&kid=species&typesearch=${species.replace(' ', '').toLowerCase().trim()}>`,
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    if(!hide) {
        sendDiscordMessage(`https://discord.com/api/webhooks/${speciesAnnouncement}`, discord.publicTitle, discord.publicMessage);
    }

    sendAjax(form, data, discord, successMessage);
});

//Add a Business
document.querySelector('#form-job-add').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let employer = form.querySelector('#employer').value.toLowerCase().trim();
    let category = form.querySelector('#category').options[form.querySelector('#category').selectedIndex].innerHTML;
    let location = form.querySelector('#location').options[form.querySelector('#location').selectedIndex].innerHTML;
    let locationId = form.querySelector('#location').options[form.querySelector('#location').selectedIndex].value;
    let hiring = form.querySelector('#hiring').options[form.querySelector('#hiring').selectedIndex].innerHTML;
    let summary = form.querySelector('#summary').value.trim();

    let weekdayHourOptions = form.querySelectorAll('[name="weekday"]');
    let weekdayArray = Array.prototype.slice.call(weekdayHourOptions).filter(item => item.checked);
    let weekdayHours = weekdayArray.map(item => item.parentNode.querySelector('strong').innerHTML).join(', ');

    let weekendHourOptions = form.querySelectorAll('[name="weekend"]');
    let weekendArray = Array.prototype.slice.call(weekendHourOptions).filter(item => item.checked);
    let weekendHours = weekendArray.map(item => item.parentNode.querySelector('strong').innerHTML).join(', ');

    let member = form.querySelector('#name').value.toLowerCase().trim();
    let memberId = form.querySelector('#id').value.trim();

    let data = {
        SubmissionType: `business-submit`,
        Employer: employer,
        Category: category,
        Location: location,
        LocationID: locationId,
        Hiring: hiring,
        Summary: summary,
        WeekendHours: weekendHours,
        WeekdayHours: weekdayHours,
    }

	let staffTitle = `${capitalize(member)} (#${memberId}) has added a business to the directory!`;
	let staffMessage = `**View here:** <https://godlybehaviour.jcink.net/?act=Pages&kid=businesses#${employer.replaceAll(' ', '').replaceAll('&amp;', '').replaceAll('&', '').replaceAll(`'`, '').replaceAll(`"`, '')}>`;

    let discord = {
        staffTitle: staffTitle,
        staffMessage: staffMessage
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    sendAjax(form, data, discord, successMessage);
});

//Get Sorted Form Toggles
let requestField = document.querySelector('#form-sort #request');
simpleFieldToggle(requestField, '.ifRequest');
requestField.addEventListener('change', () => {
    simpleFieldToggle(requestField, '.ifRequest');
});
let employedField = document.querySelector('#form-sort #employed');
simpleFieldToggle(employedField, '.ifEmployed');
employedField.addEventListener('change', () => {
    simpleFieldToggle(employedField, '.ifEmployed');
});
let firstField = document.querySelector('#form-sort #first');
simpleFieldToggle(firstField, '.ifFirst');
firstField.addEventListener('change', () => {
    simpleFieldToggle(firstField, '.ifFirst');
});

//Job Count Change
document.querySelectorAll('#job-count').forEach(jobCount => {
    jobCount.addEventListener('change', e => {
        handleJobFields(e.currentTarget.closest('form'), e.currentTarget);
    });
});

//Get Sorted Form
document.querySelector('#form-sort').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let member = form.querySelector('#member').value.toLowerCase().trim();
    let memberID = form.querySelector('#memberid').value.trim();
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let characterID = form.querySelector('#characterid').value.trim();
    let groupField = form.querySelector('#group');
    let group = groupField.options[groupField.selectedIndex].innerText.toLowerCase().trim();
    let groupID = groupField.options[groupField.selectedIndex].value;
    let face = form.querySelector('#face').value.toLowerCase().trim();
    let jobs = ``;
    if(memberID.includes(`showuser`)) {
	memberID = memberID.split('showuser=')[1];
    }
    if(characterID.includes(`showuser`)) {
	characterID = characterID.split('showuser=')[1];
    }
    if(form.querySelector('#employed').options[form.querySelector('#employed').selectedIndex].value === 'y') {
        let employers = form.querySelectorAll('.employer select');
        let positions = form.querySelectorAll('.job input');
        for(let i = 0; i < employers.length; i++) {
	    let employer = employers[i];
            jobs += `{"employer": "${employer.options[employer.selectedIndex].innerText.toLowerCase().trim()}", "position": "${positions[i].value.toLowerCase().trim()}"}`;
            if(i !== employers.length - 1) {
                jobs += `+`;
            }
        }
    }
    let firstCharacter = form.querySelector('#first').options[form.querySelector('#first').selectedIndex].innerText;
    let wanted = form.querySelector('#request').options[form.querySelector('#request').selectedIndex].value === 'y' ? 'Yes' : 'No';
    let wantedURLs = form.querySelector('#request-data').value;

    let staffTitle = `${capitalize(member)} has requested sorting for ${capitalize(character)}`;
    let staffMessage = `${capitalize(character)} should be placed in the ${capitalize(group)} group.\n\n**Profile:** https://godlybehaviour.jcink.net/?showuser=${characterID}\n**Parent Account:** https://godlybehaviour.jcink.net/?showuser=${memberID}\n**First Character?** ${firstCharacter}\n**Requested?** ${wanted}`;
    if (wanted === 'Yes') {
        message += `\n${wantedURLs}`;
    }
    message += `\n\nPlease follow the sorting procedure, available in Processes > #sorting of this Discord server. React to this notification when you begin reviewing the application.`;

    let publicTitle = `${capitalize(member)} has finished ${capitalize(character)}!`;
    let publicMessage = `**Learn More:** <https://godlybehaviour.jcink.net/?showuser=${characterID}>`;
    if (wanted === 'Yes') {
        publicMessage += `\n\n*This character fills one or more requests. Members managing those requests will be contacted prior to character approval and sorting.*`;
    }

    let groupColor = rgbToHex(colors[group][0], colors[group][1], colors[group][2]);

    let data = {
        SubmissionType: `claims-submit`,
        Member: member,
        ParentID: memberID,
        Character: character,
        AccountID: characterID,
        Group: group,
        GroupID: groupID,
        Face: face,
        Jobs: jobs
    }

    let discord = {
        staffTitle: staffTitle,
        staffMessage: staffMessage,
        publicTitle: publicTitle,
        publicMessage: publicMessage,
        groupColor: groupColor
    }

    submitClaims(form, data, discord);
});

//Edit Business 
document.querySelector('#form-job-edit').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let employer = form.querySelector('#employer').value.toLowerCase().trim();
    let hiring = form.querySelector('#hiring').options[form.querySelector('#hiring').selectedIndex].innerHTML;

    let weekdayHourOptions = form.querySelectorAll('[name="weekday"]');
    let weekdayArray = Array.prototype.slice.call(weekdayHourOptions).filter(item => item.checked);
    let weekdayHours = weekdayArray.map(item => item.parentNode.querySelector('strong').innerHTML).join(', ');

    let weekendHourOptions = form.querySelectorAll('[name="weekend"]');
    let weekendArray = Array.prototype.slice.call(weekendHourOptions).filter(item => item.checked);
    let weekendHours = weekendArray.map(item => item.parentNode.querySelector('strong').innerHTML).join(', ');

    let member = form.querySelector('#name').value.toLowerCase().trim();
    let memberId = form.querySelector('#id').value.trim();

    let data = {
        Employer: employer,
        Hiring: hiring,
        WeekendHours: weekendHours,
        WeekdayHours: weekdayHours,
        member: member,
        memberId: memberId
    }

    editBusinesses(form, data);
});

//Edit Claims
document.querySelector('#form-edit').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let characterId = form.querySelector('#id').value.split('?showuser=').length > 1 ? form.querySelector('#id').value.split('?showuser=')[1].toLowerCase().trim() : form.querySelector('#id').value;
    let alias = form.querySelector('#member').value.toLowerCase().trim();
    let editor = form.querySelector('#editor').value.toLowerCase().trim();
    let character = form.querySelector('#character').value.toLowerCase().trim();
    let groupField = form.querySelector('#group').options[form.querySelector('#group').selectedIndex];
    let group = groupField.innerText.toLowerCase().trim();
    let groupId = groupField.value.toLowerCase().trim();
    let selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="update"]')).filter(item => item.checked).map(item => item.value);

    let data = {
        SubmissionType: `claims-edit`,
        AccountID: characterId,
        selectedChanges: selectedChanges,
        Member: alias,
        Character: character,
        Group: group,
        GroupID: groupId,
        editor: editor
    }

    editClaims(form, data);
});

//Edit Form Toggles
let idField = document.querySelector('#form-edit #id');
let aliasBox = document.querySelector('#form-edit [name="update"][value="alias"]');
let nameBox = document.querySelector('#form-edit [name="update"][value="name"]');
let groupBox = document.querySelector('#form-edit [name="update"][value="group"]');
let addBox = document.querySelector('#form-edit [name="update"][value="job-add"]');
let editBox = document.querySelector('#form-edit [name="update"][value="job-edit"]');
let removeBox = document.querySelector('#form-edit [name="update"][value="job-remove"]');
let plotBox = document.querySelector('#form-edit [name="update"][value="plot-remove"]');
simpleCheckToggle(aliasBox, '.ifAlias');
aliasBox.addEventListener('change', () => {
    simpleCheckToggle(aliasBox, '.ifAlias');
});
simpleCheckToggle(nameBox, '.ifName');
nameBox.addEventListener('change', () => {
    simpleCheckToggle(nameBox, '.ifName');
});
simpleCheckToggle(groupBox, '.ifGroup');
groupBox.addEventListener('change', () => {
    simpleCheckToggle(groupBox, '.ifGroup');
});
simpleCheckToggle(addBox, '.ifAdd');
addBox.addEventListener('change', () => {
    simpleCheckToggle(addBox, '.ifAdd');
});
simpleCheckToggle(editBox, '.ifEdit');
editJobs(editBox.closest('form'), editBox);
editBox.addEventListener('change', () => {
    simpleCheckToggle(editBox, '.ifEdit');
    editJobs(editBox.closest('form'), editBox);
});
simpleCheckToggle(removeBox, '.ifRemove');
removeJobs(removeBox.closest('form'), removeBox);
removeBox.addEventListener('change', () => {
    simpleCheckToggle(removeBox, '.ifRemove');
    removeJobs(removeBox.closest('form'), removeBox);
});
simpleCheckToggle(plotBox, '.ifPlot');
removePlots(plotBox.closest('form'), plotBox);
plotBox.addEventListener('change', () => {
    simpleCheckToggle(plotBox, '.ifPlot');
    removePlots(plotBox.closest('form'), plotBox);
});
idField.addEventListener('change', () => {
    editJobs(editBox.closest('form'), editBox);
    removeJobs(removeBox.closest('form'), removeBox);
    removePlots(plotBox.closest('form'), plotBox);
});

//Mod Form Toggles
let modForm = document.querySelector('#form-mod');
let toggleField = modForm.querySelector('#type');
let modValue = toggleField.options[toggleField.selectedIndex].value.toLowerCase().trim();
modForm.querySelectorAll('.ifBoard').forEach(item => item.classList.add('hidden'));
modForm.querySelectorAll('.ifThread').forEach(item => item.classList.add('hidden'));
modForm.querySelectorAll('.ifAccount').forEach(item => item.classList.add('hidden'));
modForm.querySelectorAll('.ifOther').forEach(item => item.classList.add('hidden'));
switch(modValue) {
    case `board`:
        modForm.querySelectorAll('.ifBoard').forEach(item => item.classList.remove('hidden'));
        break;
    case `thread`:
        modForm.querySelectorAll('.ifThread').forEach(item => item.classList.remove('hidden'));
        break;
    case `account`:
        modForm.querySelectorAll('.ifAccount').forEach(item => item.classList.remove('hidden'));
        break;
    case `other`:
        modForm.querySelectorAll('.ifOther').forEach(item => item.classList.remove('hidden'));
        break;
    default:
        break;
}
toggleField.addEventListener('change', () => {
    let value = toggleField.options[toggleField.selectedIndex].value.toLowerCase().trim();
    modForm.querySelectorAll('.ifBoard').forEach(item => item.classList.add('hidden'));
    modForm.querySelectorAll('.ifThread').forEach(item => item.classList.add('hidden'));
    modForm.querySelectorAll('.ifAccount').forEach(item => item.classList.add('hidden'));
    modForm.querySelectorAll('.ifOther').forEach(item => item.classList.add('hidden'));
    switch(value) {
        case `board`:
            modForm.querySelectorAll('.ifBoard').forEach(item => item.classList.remove('hidden'));
            break;
        case `thread`:
            modForm.querySelectorAll('.ifThread').forEach(item => item.classList.remove('hidden'));
            break;
        case `account`:
            modForm.querySelectorAll('.ifAccount').forEach(item => item.classList.remove('hidden'));
            break;
        case `other`:
            modForm.querySelectorAll('.ifOther').forEach(item => item.classList.remove('hidden'));
            break;
        default:
            break;
    }
});

//Mod Form
document.querySelector('#form-mod').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let type = toggleField.options[toggleField.selectedIndex].value.toLowerCase().trim();
    let requester = form.querySelector('#requester').value.toLowerCase().trim();
    let staffTitle = `${capitalize(requester)} has requested ${type} moderation.`;
    let board, parent, threads, moveTo, account, request, staffMessage;
    switch(type) {
        case `board`:
            board = form.querySelector('#board').value.toLowerCase().trim();
            parent = form.querySelector('#parent').value.toLowerCase().trim();
            request = form.querySelector('#request').value.trim();
            staffMessage = `**Board Title:** ${capitalize(board)}
                **Place Within:** ${capitalize(parent)}

                **Request:**
                ${request}`;
            break;
        case `thread`:
            threads = form.querySelector('#threads').value.trim();
            moveTo = form.querySelector('#thread-location').options[form.querySelector('#thread-location').selectedIndex].innerText.trim();;
            staffMessage = `**Move To:** ${moveTo}

                **Thread(s) to Move:**
                ${threads}`;
            break;
        case `account`:
            account = form.querySelector('#account').value.toLowerCase().trim();
            request = form.querySelector('#request').value.trim();
            staffMessage = `**Account:** ${account}

                **Request:**
                ${request}`;
            break;
        case `other`:
            request = form.querySelector('#request').value.trim();
            staffMessage = `**Request:**
                ${request}`;
            break;
        default:
            break;
    }

    sendDiscordMessage(`https://discord.com/api/webhooks/${modBot}`, staffTitle, staffMessage);

    form.innerHTML = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
});