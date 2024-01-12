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
});