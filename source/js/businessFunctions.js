function initBusinessListing(data) {
    data.sort((a, b) => {
        if (a.Category < b.Category) {
            return -1;
        } else if (a.Category > b.Category) {
            return 1;
        } else if (a.Employer.toLowerCase().trim().replace('the ', '') < b.Employer.toLowerCase().trim().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().trim().replace('the ', '') > b.Employer.toLowerCase().trim().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });
    
    let menu = ``;
    let content = ``;

    data.forEach((business, i) => {
        //First
        if(i === 0) {
            menu += openBusinessMenu(business);
            content += openBusinessCategory(business);
        }
        //Different Category
        else if (data[i - 1].Category !== business.Category) {
            menu += closeBusinessMenu();
            content += closeBusinessCategory();
            menu += openBusinessMenu(business);
            content += openBusinessCategory(business);
        }
        //Same Category
        else {
            menu += businessLabel(business);
            content += businessTab(business);
        }
        //Last?
        if(i === data.length - 1) {
            menu += closeBusinessMenu();
            content += closeBusinessCategory();
        }
    });

    menu += `<tag-label data-category="self-employed" class="tab-category accordion--trigger">
        <span>Self-Employed</span>
    </tag-label>
    <div data-category="self-employed" class="tab-category accordion--content">
        <a href="#self-employed">Self-Employed</a>
    </div>`;
    content += `<tag-tab class="tab-category" data-category="self-employed">
        <tag-tabset>
            <tag-tab data-key="#self-employed">
                <div class="webpage--content-inner"><div class="scroll">
                    <div class="claim-wrap" data-type="grid" data-columns="3" style="margin-bottom: 20px;">
                        <div>
                            <strong class="h7">Filter by Name</strong>
                            <input type="text" data-filter="#self-employed" data-objects="> strong > a" data-headers="h2" onkeyup="filterValue(this)" placeholder="Face" style="width: 100%;">
                        </div>
                    
                        <div>
                            <strong class="h7">Filter by Position</strong>
                            <input type="text" data-filter="#self-employed" data-objects="> strong + span" data-headers="h2" onkeyup="filterValue(this)" placeholder="Member" style="width: 100%;">
                        </div>
                    
                        <div>
                            <strong class="h7">Filter by Member</strong>
                            <input type="text" data-filter="#self-employed" data-objects="> strong + span + span > a" data-headers="h2" onkeyup="filterValue(this)" placeholder="Member" style="width: 100%;">
                        </div>
                    </div>
                    <div id="self-employed-clip" class="claim-wrap" data-type="grid" data-columns="3">
                        <blockquote class="fullWidth onlySolo">No active characters are currently self-employed.</blockquote>
                    </div>
                </div></div>
            </tag-tab>
        </tag-tabset>
    </tag-tab>`;

    document.querySelector('.webpage--menu .accordion').insertAdjacentHTML('beforeend', menu);
    document.querySelector('.webpage--content').insertAdjacentHTML('beforeend', content);
}

function openBusinessMenu(business) {
    return `<tag-label data-category="${cleanText(business.Category)}" class="tab-category accordion--trigger">
        <span>${capitalize(business.Category, [' ', '(', '-'])}</span>
    </tag-label>
    <div data-category="${cleanText(business.Category)}" class="tab-category accordion--content">
        ${businessLabel(business)}`;
}
function closeBusinessMenu() {
    return `</div>`;
}
function businessLabel(business) {
    return `<a href="#${cleanText(business.Employer)}">${capitalize(business.Employer, [' ', '(', '-'])}</a>`;
}
function openBusinessCategory(business) {
    return `<tag-tab class="tab-category" data-category="${cleanText(business.Category)}">
        <tag-tabset>
            ${businessTab(business)}`;
}
function closeBusinessCategory() {
    return `</tag-tabset>
    </tag-tab>`;
}
function businessTab(business) {
    return `<tag-tab data-key="#${cleanText(business.Employer)}">
        <div class="webpage--content-inner"><div class="scroll">
            <div class="business">
                <div class="business--main">
                    <h2>${business.Employer}</h2>
                    <p class="h6">Located in <a href="?showforum=${business.LocationID}">${capitalize(business.Location, [' ', '(', '-'])}</a></p>
                    <p class="h6"><strong>Hiring?</strong> ${business.Hiring}</p>
                    <p>${business.Summary}</p>
                </div>
                <div class="business--hours">
                    <strong class="h6">Weekday Hours</strong>
                    <ul>
                        ${business.WeekdayHours.split(', ').map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <strong class="h6">Weekend Hours</strong>
                    <ul>
                        ${business.WeekendHours.split(', ').map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <h3>Employees</h3>
            <div id="${cleanText(business.Employer)}-clip" class="claim-wrap" data-type="grid" data-columns="3">
                <blockquote class="fullWidth onlySolo">No active characters work here.</blockquote>
            </div>
        </div></div>
    </tag-tab>`;
}
function filterBusinesses(e) {
    let searchValue = e.value.toLowerCase().trim();
    let names = document.querySelectorAll(`.webpage--menu .accordion--content a`);
    let accordions = document.querySelectorAll(`.accordion--content`);
    let accordionTriggers = document.querySelectorAll(`.accordion--trigger`);
    let matches = [];
    if(searchValue !== '') {
        e.parentNode.classList.add('pb');
        names.forEach(name => {
            let nameValue = name.innerText.toLowerCase().trim();
            if (nameValue.indexOf(searchValue) > -1) {
                name.classList.remove('hidden');
                matches.push(name);
            } else {
                name.classList.add('hidden');
            }
        });
        if(matches.length > 0) {
            matches.forEach(match => {
                match.closest('.accordion--content').classList.add('is-active');
                match.closest('.accordion--content').previousElementSibling.classList.add('is-active');
            })
        }
    } else {
        names.forEach(name => name.classList.remove('hidden'));
        accordions.forEach(accordion => accordion.classList.remove('is-active'));
        accordionTriggers.forEach(trigger => trigger.classList.remove('is-active'));
    }
}
function formatJobClaims(data) {
    let employed = data.filter(item => item.Jobs && item.Jobs !== '');
    let jobs = [];

    employed.forEach(employee => {
        let characterJobs = employee.Jobs.split('+').map(item => JSON.parse(item));
        characterJobs.forEach(job => {
            let jobObject = {
                ...job,
                id: employee.AccountID,
                character: employee.Character,
                memberId: employee.ParentID,
                member: employee.Member,
                groupId: employee.GroupID,
                bumpOwner: job.position.includes('owner') && job.employer !== 'self-employed' ? 1 : 0,
                bumpLeader: job.position.includes('leader') && job.employer !== 'self-employed' ? 1 : 0,
                bumpHead: job.position.includes('head') && job.employer !== 'self-employed' ? 1 : 0,
                bumpChief: job.position.includes('chief') && job.employer !== 'self-employed' ? 1 : 0,
                bumpManager: job.position.includes('manager') && job.employer !== 'self-employed' ? 1 : 0,
            }
            jobs.push(jobObject);
        });
    });

    jobs.sort((a, b) => {
        if(a.employer < b.employer) {
            return -1;
        } else if (a.employer > b.employer) {
            return 1;
        } else if (a.bumpOwner > b.bumpOwner) {
            return -1;
        } else if (a.bumpOwner < b.bumpOwner) {
            return 1;
        } else if (a.bumpLeader > b.bumpLeader) {
            return -1;
        } else if (a.bumpLeader < b.bumpLeader) {
            return 1;
        } else if (a.bumpHead > b.bumpHead) {
            return -1;
        } else if (a.bumpHead < b.bumpHead) {
            return 1;
        } else if (a.bumpChief > b.bumpChief) {
            return -1;
        } else if (a.bumpChief < b.bumpChief) {
            return 1;
        } else if (a.bumpManager > b.bumpManager) {
            return -1;
        } else if (a.bumpManager < b.bumpManager) {
            return 1;
        } else if (a.position < b.position && a.employer !== 'self-employed' && b.employer !== 'self-employed') {
            return -1;
        } else if (a.position > b.position && a.employer !== 'self-employed' && b.employer !== 'self-employed') {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else if (a.character > b.character) {
            return 1;
        } else {
            return 0;
        }
    });

    jobs.forEach(job => {
        let html = formatClaim(job.character, [
            capitalize(job.position, [' ', '(', '-']),
            `Played by <a href="?showuser=${job.memberId}">${job.member}</a>`
        ], job.groupId, `?showuser=${job.id}`);
        console.log(cleanText(job.employer));
        document.querySelector(`#${cleanText(job.employer)}-clip`).insertAdjacentHTML('beforeend', html);
    });
}