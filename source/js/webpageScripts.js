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

            let data = {
                "SubmissionType": "plot-role-submit",
                SubplotRoles: updatedRoles,
                AccountID: id,
            }
        
            sendAjax(form, data, null, successMessage);
        }
    });
});