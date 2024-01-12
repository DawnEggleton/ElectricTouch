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
                default:
                    console.log('Complete');
                    break;
            }
        }
    });
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
function initJoinSelect(data) {
    let plots = [];
    let plotSelect = document.querySelector('#form-join-plot #plot');

    data.forEach(item => {
        plots.push({
            title: item.Plot,
            value: item.PlotID,
        });
    });

    plotSelect.innerHTML = formatSelect(plots);
    
    plotSelect.addEventListener('change', e => {
        initSectionSelect(data, plotSelect);
    });
}
function initSectionSelect(data, plotSelect) {
    let sections = [];
    let sectionSelect = document.querySelector('#form-join-plot #section');

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
        initRoleSelect(data, plotSelect, sectionSelect);
    });
}
function initRoleSelect(data, plotSelect, sectionSelect) {
    let roles = [];
    let roleSelect = document.querySelector('#form-join-plot #role');

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