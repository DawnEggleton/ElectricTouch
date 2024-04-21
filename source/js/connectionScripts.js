//Scripts
//Address Submission Toggles
let typeField = document.querySelector('#form-address #type');
complexFieldToggle(typeField, '#form-address .residentOnly', 'residential');
complexFieldToggle(typeField, '#form-address .businessOnly', 'business');
anyValueToggle(typeField, '#form-address .typeOnly');
typeField.addEventListener('change', () => {
    complexFieldToggle(typeField, '#form-address .residentOnly', 'residential');
    complexFieldToggle(typeField, '#form-address .businessOnly', 'business');
    anyValueToggle(typeField, '#form-address .typeOnly');
});
let locationField = document.querySelector('#form-address #location');
complexFieldToggle(locationField, '#form-address .tempOnly', 'temperance');
complexFieldToggle(locationField, '#form-address .sydOnly', 'sydney');
complexFieldToggle(locationField, '#form-address .ruralOnly', 'rural');
locationField.addEventListener('change', () => {
    complexFieldToggle(locationField, '#form-address .tempOnly', 'temperance');
    complexFieldToggle(locationField, '#form-address .sydOnly', 'sydney');
    complexFieldToggle(locationField, '#form-address .ruralOnly', 'rural');
});

//Change Address Toggles
let typeChangeField = document.querySelector('#form-change-address #type');
complexFieldToggle(typeChangeField, '#form-change-address .residentOnly', 'residential');
complexFieldToggle(typeChangeField, '#form-change-address .businessOnly', 'business');
anyValueToggle(typeChangeField, '#form-change-address .typeOnly');
typeChangeField.addEventListener('change', () => {
    complexFieldToggle(typeChangeField, '#form-change-address .residentOnly', 'residential');
    complexFieldToggle(typeChangeField, '#form-change-address .businessOnly', 'business');
    anyValueToggle(typeChangeField, '#form-change-address .typeOnly');
});
let locationChangeField = document.querySelector('#form-change-address #location');
complexFieldToggle(locationChangeField, '#form-change-address .tempOnly', 'temperance');
complexFieldToggle(locationChangeField, '#form-change-address .sydOnly', 'sydney');
complexFieldToggle(locationChangeField, '#form-change-address .ruralOnly', 'rural');
locationChangeField.addEventListener('change', () => {
    complexFieldToggle(locationChangeField, '#form-change-address .tempOnly', 'temperance');
    complexFieldToggle(locationChangeField, '#form-change-address .sydOnly', 'sydney');
    complexFieldToggle(locationChangeField, '#form-change-address .ruralOnly', 'rural');
});

//Connection Toggles
let connectionTypeField = document.querySelector('#form-connection #type');
complexFieldToggle(connectionTypeField, '#form-connection .histOnly', 'historical');
complexFieldToggle(connectionTypeField, '#form-connection .localOnly', 'local');
anyValueToggle(connectionTypeField, '#form-connection .typeOnly');
connectionTypeField.addEventListener('change', () => {
    complexFieldToggle(connectionTypeField, '#form-connection .histOnly', 'historical');
    complexFieldToggle(connectionTypeField, '#form-connection .localOnly', 'local');
    anyValueToggle(connectionTypeField, '#form-connection .typeOnly');
});

//Add Address
document.querySelector('#form-address').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    submitAddress(form);
});

//Change Address
document.querySelector('#form-change-address').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    submitAddress(form);
});

//Add Connection
document.querySelector('#form-connection').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let type = form.querySelector('#type').options[form.querySelector('#type').selectedIndex].value;
    let id = form.querySelector('#id').value.split('?showuser=')[1] ? form.querySelector('#id').value.split('?showuser=')[1].trim() : form.querySelector('#id').value.trim();
    let category = form.querySelector('#category').options[form.querySelector('#category').selectedIndex].innerText.toLowerCase().trim();
    let priority = form.querySelector('#category').options[form.querySelector('#category').selectedIndex].value;
    let subcategory = form.querySelector('#subcategory').value.toLowerCase().trim();
    let location = type === 'historical' ? form.querySelector('#hist-location').value.toLowerCase().trim() : form.querySelector('#local-location').options[form.querySelector('#local-location').selectedIndex].innerText.toLowerCase().trim();
    let role = form.querySelector('#role').value.toLowerCase().trim();
    let connection = {
        type: type,
        category: category,
        priority: priority,
        subcategory: subcategory,
        location: location,
        role: role,
    };

    let staffTitle = `New Connection for Character #${id}`;
    let staffMessage = `**Type:** ${type}
    **Category:** ${category}
    **Subcategory:** ${subcategory}
    **Location:** ${location}
    **Role:** ${role}`;

    let data = {
        SubmissionType: 'connections',
        AccountID: id,
        Connections: JSON.stringify(connection),
    }

    let discord = {
        staffTitle: staffTitle,
        staffMessage: staffMessage
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;


    submitConnection(form, data, discord, successMessage);
});

//Lookup Submit
document.querySelector('#form-lookup').addEventListener('submit', e => {
    e.preventDefault();
    let form = e.currentTarget;
    searchAddress(form);
});

//Functions
function formatResidents(data) {
    data.forEach(resident => resident.Address = JSON.parse(resident.Address));
    let temperance = data.filter(resident => resident.Address.city === 'temperance');
    let sydney = data.filter(resident => resident.Address.city === 'sydney');
    let rural = data.filter(resident => resident.Address.city === 'rural');

    if(temperance.length > 0) {
        document.querySelector('tag-tab[data-key="#temperance"] .scroll').innerHTML = formatCityList(temperance);
    }
    if(sydney.length > 0) {
        document.querySelector('tag-tab[data-key="#sydney"] .scroll').innerHTML = formatCityList(sydney);
    }
    if(rural.length > 0) {
        document.querySelector('tag-tab[data-key="#rural"] .scroll').innerHTML = formatCityList(rural);
    }
}
function formatCityList(data) {
    let html = ``;

    data.sort((a, b) => {
        if (parseInt(a.Address.priority) < parseInt(b.Address.priority)) {
            return -1;
        } else if (parseInt(a.Address.priority) > parseInt(b.Address.priority)) {
            return 1;
        } else if (a.Address.street < b.Address.street) {
            return -1;
        } else if (a.Address.street > b.Address.street) {
            return 1;
        } else if (parseInt(a.Address.houseNumber) < parseInt(b.Address.houseNumber)) {
            return -1;
        } else if (parseInt(a.Address.houseNumber) > parseInt(b.Address.houseNumber)) {
            return 1;
        } else if (parseInt(a.Address.apartmentNumber) < parseInt(b.Address.apartmentNumber)) {
            return -1;
        } else if (parseInt(a.Address.apartmentNumber) > parseInt(b.Address.apartmentNumber)) {
            return 1;
        } else if ((a.Character && b.Character && a.Character < b.Character) ||
        (a.Employer && b.Character && a.Employer < b.Character) ||
        (a.Character && b.Employer && a.Character < b.Employer) ||
        (a.Employer && b.Employer && a.Employer < b.Employer)) {
            return -1;
        } else if ((a.Character && b.Character && a.Character > b.Character) ||
        (a.Employer && b.Character && a.Employer > b.Character) ||
        (a.Character && b.Employer && a.Character > b.Employer) ||
        (a.Employer && b.Employer && a.Employer > b.Employer)) {
            return 1;
        } else {
            return 0;
        }
    })

    data.forEach((character, i) => {
        let lines = [`${character.Address.houseNumber} ${character.Address.street}`];
        if(character.Address.apartmentNumber && character.Address.apartmentNumber !== '') {
            lines.push(`Unit ${character.Address.apartmentNumber}`);
        }
        let title = ``, group = ``, url = ``;
        if(character.Character) {
            title = capitalize(character.Character);
            group = character.GroupID;
            url = `?showuser=${character.AccountID}`;
        } else if (character.Employer) {
            title = capitalize(character.Employer);
            group = `3`;
            url = `/?act=Pages&kid=businesses#${cleanText(character.Employer)}`;
        }

        //If first
        if(i === 0) {
            if(character.Address.neighbourhood && character.Address.neighbourhood !== '') {
                html += formatHeader(character.Address.neighbourhood, 2);
            }
            html += formatToggleHeader(character.Address.street, 3);
            html += openGrid();
            html += formatClaim(title,
            lines,
            group,
            url);
        }
        //If different neighbourhood
        else if(data[i - 1].Address.priority !== character.Address.priority) {
            html += closeGrid();
            if(character.Address.neighbourhood && character.Address.neighbourhood !== '') {
                html += formatHeader(character.Address.neighbourhood, 2);
            }
            html += formatToggleHeader(character.Address.street, 3);
            html += openGrid();
            html += formatClaim(title,
            lines,
            group,
            url);
        }
        //If different street
        else if(data[i - 1].Address.street !== character.Address.street) {
            html += closeGrid();
            html += formatToggleHeader(character.Address.street, 3);
            html += openGrid();
            html += formatClaim(title,
            lines,
            group,
            url);
        }
        //If same
        else {
            html += formatClaim(title,
            lines,
            group,
            url);
        }
        //if last
        if(i === data.length - 1) {
            html += closeGrid();
        }
    });
    return html;
}
function formatConnections(data) {
    data.forEach(character => character.Connections = character.Connections.split('+').map(item => JSON.parse(item)));
    let roles = [];
    data.forEach(character => {
        character.Connections.forEach(connection => {
            roles.push({
                character: character.Character,
                id: character.AccountID,
                member: character.Member,
                memberId: character.ParentID,
                groupId: character.GroupID,
                connection: connection,
            });
        });
    });
    
    let historical = roles.filter(character => character.connection.type === 'historical');
    let local = roles.filter(character => character.connection.type === 'local');

    if(historical.length > 0) {
        document.querySelector('tag-tab[data-key="#historical"] .scroll').innerHTML = formatHistoryConnectionList(historical);
    }
    if(local.length > 0) {
        document.querySelector('tag-tab[data-key="#local"] .scroll').innerHTML = formatLocalConnectionList(local);
    }
}
function formatHistoryConnectionList(data) {
    let html = ``;

    data.sort((a, b) => {
        if (parseInt(a.connection.priority) < parseInt(b.connection.priority)) {
            return -1;
        } else if (parseInt(a.connection.priority) > parseInt(b.connection.priority)) {
            return 1;
        } else if (a.connection.subcategory < b.connection.subcategory) {
            return -1;
        } else if (a.connection.subcategory > b.connection.subcategory) {
            return 1;
        }  else if (a.connection.location < b.connection.location) {
            return -1;
        } else if (a.connection.location > b.connection.location) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else if (a.character > b.character) {
            return 1;
        } else {
            return 0;
        }
    })

    data.forEach((character, i) => {
        let lines = [character.connection.role,
        `played by <a href="?showuser=${character.memberId}">${character.member}</a>`];

        //If first
        if(i === 0) {
            html += formatHeader(character.connection.category, 2);
            html += formatToggleHeader(character.connection.subcategory, 3);
            html += openGrid();
            html += formatInnerHeader(character.connection.location, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If different category
        else if(data[i - 1].connection.priority !== character.connection.priority) {
            html += closeGrid();
            html += formatHeader(character.connection.category, 2);
            html += formatToggleHeader(character.connection.subcategory, 3);
            html += openGrid();
            html += formatInnerHeader(character.connection.location, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If different subcategory
        else if(data[i - 1].connection.subcategory !== character.connection.subcategory) {
            html += closeGrid();
            html += formatToggleHeader(character.connection.subcategory, 3);
            html += openGrid();
            html += formatInnerHeader(character.connection.location, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If different location
        else if(data[i - 1].connection.location !== character.connection.location) {
            html += formatInnerHeader(character.connection.location, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If same
        else {
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //if last
        if(i === data.length - 1) {
            html += closeGrid();
        }
    });
    return html;
}
function formatLocalConnectionList(data) {
    let html = ``;

    data.sort((a, b) => {
        if (parseInt(a.connection.priority) < parseInt(b.connection.priority)) {
            return -1;
        } else if (parseInt(a.connection.priority) > parseInt(b.connection.priority)) {
            return 1;
        } else if (a.connection.location < b.connection.location) {
            return -1;
        } else if (a.connection.location > b.connection.location) {
            return 1;
        } else if (a.connection.subcategory < b.connection.subcategory) {
            return -1;
        } else if (a.connection.subcategory > b.connection.subcategory) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else if (a.character > b.character) {
            return 1;
        } else {
            return 0;
        }
    })

    data.forEach((character, i) => {
        let lines = [character.connection.role,
        `played by <a href="?showuser=${character.memberId}">${character.member}</a>`];

        //If first
        if(i === 0) {
            html += formatHeader(character.connection.category, 2);
            html += formatToggleHeader(character.connection.location, 3);
            html += openGrid();
            html += formatInnerHeader(character.connection.subcategory, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If different category
        else if(data[i - 1].connection.priority !== character.connection.priority) {
            html += closeGrid();
            html += formatHeader(character.connection.category, 2);
            html += formatToggleHeader(character.connection.location, 3);
            html += openGrid();
            html += formatInnerHeader(character.connection.subcategory, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If different location
        else if(data[i - 1].connection.location !== character.connection.location) {
            html += closeGrid();
            html += formatToggleHeader(character.connection.location, 3);
            html += openGrid();
            html += formatInnerHeader(character.connection.subcategory, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If different subcategory
        else if(data[i - 1].connection.subcategory !== character.connection.subcategory) {
            html += formatInnerHeader(character.connection.subcategory, 6);
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //If same
        else {
            html += formatClaim(capitalize(character.character),
            lines,
            character.groupId,
            `?showuser=${character.id}`);
        }
        //if last
        if(i === data.length - 1) {
            html += closeGrid();
        }
    });
    return html;
}
function submitAddress(form) {
    let type = form.querySelector('#type').options[form.querySelector('#type').selectedIndex].value;
    let identifier = '', staffTitle = '';
    if(type === 'residential') {
        identifier = form.querySelector('#id').value.split('?showuser=')[1] ? form.querySelector('#id').value.split('?showuser=')[1].trim() : form.querySelector('#id').value.trim();
        staffTitle = `Address added for Character #${identifier}`;
    } else if(type === 'business') {
        identifier = form.querySelector('#employer').options[form.querySelector('#employer').selectedIndex].value;
        staffTitle = `Address added for ${capitalize(identifier)}`;
    }
    let city = form.querySelector('#location').options[form.querySelector('#location').selectedIndex].value;
    let priority = form.querySelector('#neighbourhood').options[form.querySelector('#neighbourhood').selectedIndex].value;
    let neighbourhood = priority && priority !== '' ? form.querySelector('#neighbourhood').options[form.querySelector('#neighbourhood').selectedIndex].innerText.toLowerCase() : '';
    let street = form.querySelector('#street').value.toLowerCase().trim();
    let houseNumber = form.querySelector('#houseNumber').value.toLowerCase().trim();
    let apartmentNumber = form.querySelector('#apartmentNumber').value.toLowerCase().trim();
    let address = {
        city: city,
        neighbourhood: neighbourhood,
        priority: priority,
        street: street,
        houseNumber: houseNumber,
        apartmentNumber: apartmentNumber,
    };

    let staffMessage = `No action required.`;

    let data = {
        Address: JSON.stringify(address),
    }

    if(type === 'residential') {
        data.SubmissionType = `residential-address`;
        data.AccountID = identifier;
    } else if(type === 'business') {
        data.SubmissionType = `business-address`;
        data.Employer = identifier;
    }

    let discord = {
        staffTitle: staffTitle,
        staffMessage: staffMessage
    }

    let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
    <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

    sendAjax(form, data, discord, successMessage);
}

function submitConnection(form, data, discord, successMessage) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Claims`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.AccountID === data.AccountID);

        if(existing.length === 1) {
            existing = existing[0];
            existing.SubmissionType = data.SubmissionType;
            
            if(existing.Connections && existing.Connections !== '') {
                existing.Connections = `${existing.Connections}+${data.Connections}`;
            } else {
                existing.Connections = data.Connections;
            }

            console.log(existing);
            sendAjax(form, existing, discord, successMessage);
        }

    });
}

function searchAddress(form) {
    let value = form.querySelector('#name').value.toLowerCase().trim();
    let html = `<ul>`;
    lookupList.forEach(item => {
        if(item.name.includes(value) && item.address) {
            let address = item.address;
            let parsedAddress = ``;
            if(address.apartmentNumber && address.apartmentNumber !== '') {
                parsedAddress += `Unit ${address.apartmentNumber}, `;
            }
            parsedAddress += `${address.houseNumber} ${capitalize(address.street)}, `;
            if(address.neighbourhood && address.neighbourhood !== '') {
                parsedAddress += `${capitalize(address.neighbourhood)}, `;
            }
            if(address.city !== 'rural') {
                parsedAddress += `${capitalize(address.city)}, `;
            }
            parsedAddress += `NS`;
            html += `<li>
                <b>${capitalize(item.name)}</b> &mdash; ${parsedAddress}
            </li>`;
        }
    });
    html += `</ul>`;

    if(html === `<ul></ul>`) {
        html = `<div class="h8">No matches found.</div>`;
    }

    document.querySelector('#lookup-results').innerHTML = html;
}