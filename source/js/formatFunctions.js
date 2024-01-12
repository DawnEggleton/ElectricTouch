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
function formatSelect(data) {
    let html = `<option value="">(select)</option>`;
    data.forEach(item => {
        html += `<option value=${item.value}>${capitalize(item.title)}</option>`;
    });
    return html;
}