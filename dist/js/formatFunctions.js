function formatSelect(data) {
    let html = `<option value="">(select)</option>`;
    data.forEach(item => {
        html += `<option value=${item.value}>${capitalize(item.title)}</option>`;
    });
    return html;
}
function formatHeader(title, level) {
    return `<h${level}>${title}</h${level}>`
}
function formatClaim(name, lines, group = ``, url = null) {
    let title = name;
    if(url) {
        title = `<a href="${url}">${name}</a>`;
    }
    return `<div class="claim g-${group}">
        <strong>${title}</strong>
        ${lines && lines.map(line => `<span>${line}</span>`).join('')}
    </div>`;
}
function formatSortableClaim(name, lines, group = ``, url = null) {
    let title = `<span data-sort-type="name">${name}</a>`;
    if(url) {
        title = `<a href="${url}" data-sort-type="name">${name}</a>`;
    }
    return `<div class="claim sortable g-${group}">
        <strong>${title}</strong>
        ${lines && lines.map(line => `<span>${line}</span>`).join('')}
    </div>`;
}
function formatMemberInfo(character) {
    return `<div class="claim-member" data-type="flex">
        <span>${character.MemberGroup}</span>
        <span>${character.MemberPronouns}</span>
        <span><a href="?showuser=${character.ParentID}">View Account</a></span>
        <span><button onClick="toggleCharacters(this)">
            <span class="view-characters">View Characters<i class="fa-solid fa-plus"></i></span>
            <span class="hide-characters">Hide Characters<i class="fa-regular fa-minus"></i></span>
        </button></span>
    </div>`;
}
function characterSorts() {
    return `<div class="claim-sorts fullWidth">
        <button onclick="sortButton(this)" data-sort-type="name">Sort by Name</button>
        <button onclick="sortButton(this)" data-sort-type="face">Sort by Face</button>
        <button onclick="sortButton(this)" data-sort-type="group">Sort by Group</button>
    </div>`;
}
function openGrid() {
    return `<div class="claim-wrap" data-type="grid" data-columns="3">`;
}
function closeGrid() {
    return `</div>`;
}
function formatSubplot(data) {
    let labels = ``;
    let content = ``;

    data.forEach(item => {
        let sections = ``;

        let sectionArray = item.Sections.split('@').map(item => JSON.parse(item));

        sectionArray.forEach(section => {
            let roles = section.roles.split(', ')
                        .map(role => {
                            if(role.split('|').length > 1) {
                                let splitRole = role.split('|');
                                let formattedRole = `${splitRole[0]}<span>${splitRole[1]}</span>`;
                                return formattedRole;
                            } else {
                                return role;
                            }
                        });

            sections += `<h4>${capitalize(section.title)}</h4>
            ${section.overview}
            <ul>
                ${roles.map(item => `<li class="subplot-role">${capitalize(item)}</li>`).join('')}
            </ul>`;
        });

        labels += `<a href="#${item.PlotID}">${capitalize(item.Plot)}</a>`;
        content += `<tag-tab data-key="#${item.PlotID}">
            <div class="webpage--content-inner"><div class="scroll">
                <h2>${item.Plot}</h2>
                <p class="h6">${item.Tagline}</p>
                <hr>
                ${item.Overview}
                <h3>Subplot Roles</h3>
                ${sections}
            </div></div>
        </tag-tab>`;
    });

    document.querySelector('.accordion--content[data-category="subplots"]').innerHTML = labels;
    document.querySelector('tag-tab.tab-category[data-category="subplots"] tag-tabset').innerHTML = content;
}
function formatSubplotClaims(data) {
    let characters = data.filter(item => item.SubplotRoles && item.SubplotRoles !== '');
    let roles = [];
    characters.forEach(character => {
        let characterRoles = character.SubplotRoles.split('@').map(item => JSON.parse(item));
        characterRoles.forEach(role => {
            role.character = character.Character;
            role.id = character.AccountID;
            role.member = character.Member;
            role.memberId = character.ParentID;
            role.groupId = character.GroupID;
        })
        roles = [...roles, ...characterRoles];
    });

    roles.sort((a, b) => {
        if (parseInt(a.plotPriority) < parseInt(b.plotPriority)) {
            return -1;
        } else if (parseInt(a.plotPriority) > parseInt(b.plotPriority)) {
            return 1;
        } else if (parseInt(a.sectionPriority) < parseInt(b.sectionPriority)) {
            return -1;
        } else if (parseInt(a.sectionPriority) > parseInt(b.sectionPriority)) {
            return 1;
        } else if (parseInt(a.rolePriority) < parseInt(b.rolePriority)) {
            return -1;
        } else if (parseInt(a.rolePriority) > parseInt(b.rolePriority)) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else if (a.character > b.character) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    roles.forEach((role, i) => {
        //If first
        if(i === 0) {
            html += formatHeader(role.plot, 2);
            html += formatHeader(role.section, 3);
            html += openGrid();
            html += formatClaim(capitalize(role.character), [
                role.role.split(' (')[0],
                `Played by <a href="?showuser=${role.memberId}">${role.member}</a>`
            ],
            role.groupId,
            `?showuser=${role.id}`);
        }
        //If different plot
        else if(roles[i - 1].plotPriority !== role.plotPriority) {
            html += closeGrid();
            html += formatHeader(role.plot, 2);
            html += formatHeader(role.section, 3);
            html += openGrid();
            html += formatClaim(capitalize(role.character), [
                role.role.split(' (')[0],
                `Played by <a href="?showuser=${role.memberId}">${role.member}</a>`
            ],
            role.groupId,
            `?showuser=${role.id}`);
        }
        //If different section
        else if(roles[i - 1].sectionPriority !== role.sectionPriority) {
            html += closeGrid();
            html += formatHeader(role.section, 3);
            html += openGrid();
            html += formatClaim(capitalize(role.character), [
                role.role.split(' (')[0],
                `Played by <a href="?showuser=${role.memberId}">${role.member}</a>`
            ],
            role.groupId,
            `?showuser=${role.id}`);
        }
        //If same
        else {
            html += formatClaim(capitalize(role.character), [
                role.role.split(' (')[0],
                `Played by <a href="?showuser=${role.memberId}">${role.member}</a>`
            ],
            role.groupId,
            `?showuser=${role.id}`);
        }
        //if last
        if(i === roles.length - 1) {
            html += closeGrid();
        }
    })

    document.querySelector(`tag-tab[data-key="#subplots"] .scroll`).innerHTML = html;
}
function formatFaces(data) {
    data.sort((a, b) => {
        if (a.Face < b.Face) {
            return -1;
        } else if (a.Face > b.Face) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    data.forEach((character, i) => {
        //If first
        if(i === 0) {
            html += formatHeader(character.Face[0], 2);
            html += openGrid();
            html += formatClaim(capitalize(character.Face), [
                `Representing <a href="?showuser=${character.AccountID}">${character.Character}</a>`,
                `Played by <a href="?showuser=${character.ParentID}">${character.Member}</a>`
            ],
            character.GroupID,
            `?showuser=${character.AccountID}`);
        }
        //If different letter
        else if(data[i - 1].Face[0] !== character.Face[0]) {
            html += closeGrid();
            html += formatHeader(character.Face[0], 2);
            html += openGrid();
            html += formatClaim(capitalize(character.Face), [
                `Representing <a href="?showuser=${character.AccountID}">${character.Character}</a>`,
                `Played by <a href="?showuser=${character.ParentID}">${character.Member}</a>`
            ],
            character.GroupID,
            `?showuser=${character.AccountID}`);
        }
        //If same
        else {
            html += formatClaim(capitalize(character.Face), [
                `Representing <a href="?showuser=${character.AccountID}">${character.Character}</a>`,
                `Played by <a href="?showuser=${character.ParentID}">${character.Member}</a>`
            ],
            character.GroupID,
            `?showuser=${character.AccountID}`);
        }
        //if last
        if(i === data.length - 1) {
            html += closeGrid();
        }
    })

    document.querySelector(`tag-tab[data-key="#faces"] .scroll`).insertAdjacentHTML('beforeend', html);
}
function formatMembers(data) {
    data.sort((a, b) => {
        if (a.Member < b.Member) {
            return -1;
        } else if (a.Member > b.Member) {
            return 1;
        } else if (a.Character < b.Character) {
            return -1;
        } else if (a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    console.log(data);

    let html = ``;

    data.forEach((character, i) => {
        //First
        if (i === 0) {
            html += formatHeader(character.Member, `2`);
            html += formatMemberInfo(character);
            html += openGrid();
            html += characterSorts();
            html += formatSortableClaim(character.Character, [
                `Played by <span data-sort-type="face">${character.Face}</span>`,
                `Sorted into <span data-sort-type="group">${character.Group}</span>`
            ], character.GroupID,
            `?showuser=${character.AccountID}`);
        }
        //Different Member
        else if (data[i - 1].Member !== character.Member) {
            html += closeGrid();
            html += formatHeader(character.Member, `2`);
            html += formatMemberInfo(character);
            html += openGrid();
            html += characterSorts();
            html += formatSortableClaim(character.Character, [
                `Played by <span data-sort-type="face">${character.Face}</span>`,
                `Sorted into <span data-sort-type="group">${character.Group}</span>`
            ], character.GroupID,
            `?showuser=${character.AccountID}`);
        }
        //Same Member
        else {
            html += formatSortableClaim(character.Character, [
                `Played by <span data-sort-type="face">${character.Face}</span>`,
                `Sorted into <span data-sort-type="group">${character.Group}</span>`
            ], character.GroupID,
            `?showuser=${character.AccountID}`);
        }
        //Last
        if (i === data.length - 1) {
            html += closeGrid();
        }
    });

    document.querySelector('tag-tab[data-key="#members"] .scroll').innerHTML = html;
}
function formatFaceReserves(data, claimed) {
    let completed = claimed.map(item => item = item.Face);
    let current = new Date();
    let active = data.filter(item => {
        let time = new Date(item.Timestamp);
        let difference = Math.floor(((current - time) / (1000*60*60*24)));
        return difference < 14;
    });
    active = active.filter(item => !completed.includes(item.Face));
    active.sort((a, b) => {
        if (a.Face < b.Face) {
            return -1;
        } else if (a.Face > b.Face) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = openGrid();

    active.forEach((reserve, i) => {
        let reserveDate = new Date(reserve.Timestamp);
        reserveDate.setDate(reserveDate.getDate() + 14);
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',	'november', 'december'];
        let expiry = `${months[reserveDate.getMonth()]} ${reserveDate.getDate()}, ${reserveDate.getFullYear()}`;

        html += formatClaim(capitalize(reserve.Face), [
            `Reserved by ${reserve.Member}`,
            `Expires ${expiry}`
        ]);
    });

    html += closeGrid();

    if (active.length === 0) {
        html = `<blockquote>No active reservations at this time.</blockquote>`;
    }

    document.querySelector(`tag-tab[data-key="#reserves"] .scroll`).insertAdjacentHTML('beforeend', html);
}
function formatSubplotReserves(data) {
    let current = new Date();
    let active = data.filter(item => {
        let time = new Date(item.Timestamp);
        let difference = Math.floor(((current - time) / (1000*60*60*24)));
        return difference < 14;
    });
    active.sort((a, b) => {
        if (parseInt(a.PlotPriority) < parseInt(b.PlotPriority)) {
            return -1;
        } else if (parseInt(a.PlotPriority) > parseInt(b.PlotPriority)) {
            return 1;
        } else if (parseInt(a.SectionPriority) < parseInt(b.SectionPriority)) {
            return -1;
        } else if (parseInt(a.SectionPriority) > parseInt(b.SectionPriority)) {
            return 1;
        } else if (parseInt(a.RolePriority) < parseInt(b.RolePriority)) {
            return -1;
        } else if (parseInt(a.RolePriority) > parseInt(b.RolePriority)) {
            return 1;
        } else if (a.Member < b.Member) {
            return -1;
        } else if (a.Member > b.Member) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    active.forEach((reserve, i) => {
        let reserveDate = new Date(reserve.Timestamp);
        reserveDate.setDate(reserveDate.getDate() + 14);
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',	'november', 'december'];
        let expiry = `${months[reserveDate.getMonth()]} ${reserveDate.getDate()}, ${reserveDate.getFullYear()}`;

        //First
        if (i === 0) {
            html += formatHeader(reserve.Subplot, `2`);
            html += openGrid();
            html += formatClaim(capitalize(reserve.RoleTitle), [
                `From ${reserve.Section}`,
                `Reserved by ${reserve.Member}`,
                `Expires ${expiry}`
            ]);
        }
        //Different Plot
        else if (active[i - 1].Subplot !== reserve.Subplot) {
            html += closeGrid();
            html += formatHeader(reserve.Subplot, `2`);
            html += openGrid();
            html += formatClaim(capitalize(reserve.RoleTitle), [
                `From ${reserve.Section}`,
                `Reserved by ${reserve.Member}`,
                `Expires ${expiry}`
            ]);
        }
        //Same Plot
        else {
            html += formatClaim(capitalize(reserve.RoleTitle), [
                `From ${reserve.Section}`,
                `Reserved by ${reserve.Member}`,
                `Expires ${expiry}`
            ]);
        }
        //Last
        if (i === active.length - 1) {
            html += closeGrid();
        }
    });

    if (active.length === 0) {
        html = `<blockquote>No active reservations at this time.</blockquote>`;
    }

    document.querySelector(`tag-tab[data-key="#subplot-reserves"] .scroll`).innerHTML = html;
}