function speciesBlock(species) {
    //abilities and weaknesses
    let abilities = species.Strengths.split('@').map(item => `<li>${item}</li>`).join('');
    let weaknesses = species.Weaknesses.split('@').map(item => `<li>${item}</li>`).join('');

    //traits
    let traits = species.Traits.split('+').map(item => JSON.parse(item)).map(trait => {
        return `<div class="trait">
        <b>${trait.trait}</b>
        <div class="trait--bar"><span style="width: ${trait.percent}%;"></span></div>
    </div>`;
    }).join('');

    //credits
    let creditsArray = species.Credit.split('+')
                  .map(item => `<a href="?showuser=${JSON.parse(item).userid}">${JSON.parse(item).username}</a>`);
    let credits = ``;
    if(creditsArray.length > 1) {
        creditsArray.forEach((credit, i) => {
            if(i === 0) {
                credits += `${credit}`;
            } else if(creditsArray.length - 1 === i) {
                credits += ` & ${credit}`;
            } else {
                credits += `, ${credit}`;
            }
        });
    } else {
        credits = creditsArray[0];
    }

    //premium
    let speciesTag = `<i class="fa-solid fa-book" title="Free Species"></i>`;
    if(species.Premium === 'TRUE') {
        speciesTag = `<a href="?act=store&code=shop&category=11"><i class="fa-solid fa-star" title="Premium Species"></i></a>`;
    }

    console.log(species);

    return `<div class="species--item ${species.Tags} aware-${species.Awareness.toLowerCase().trim()} know-${species.Knowledge.toLowerCase().trim()}">
        <div class="species--header">
            <div class="species--basics">
                <h2 class="species--title">${species.Species}</h2>
                <div class="species--info">
                    <span><strong>Lifespan</strong> ${species.Lifespan}</span>
                    <span><strong>Aging</strong> ${species.Aging}</span>
                    <span>Created by ${credits}</span>
                </div>
                <div class="species--tag">${speciesTag}</div>
            </div>
            <div class="species--stats">
                ${traits}
            </div>
        </div>
        <div class="species--main">
            <button class="species--learn-more" onclick="openSpecies(this);">
                <span class="to-open">Learn More</span>
                <span class="to-close">Close Info Panel</span>
            </button>
            <div class="openOnly">
                <div class="species--content">
                    <div class="species--section">
                        <h3>Physiology</h3>
                        <div class="species--section-inner"><div class="scroll">${species.Physiology}</div></div>
                    </div>
                    <div class="species--section">
                        <h3>Communitiy Structure</h3>
                        <div class="species--section-inner"><div class="scroll">${species.CommunityStructure}</div></div>
                    </div>
                    <div class="species--section">
                        <h3>Strengths</h3>
                        <div class="species--section-inner"><div class="scroll"><ul>${abilities}</ul></div></div>
                    </div>
                    <div class="species--section">
                        <h3>Weaknesses</h3>
                        <div class="species--section-inner"><div class="scroll"><ul>${weaknesses}</ul></div></div>
                    </div>
                </div>
                <div class="species--bottom-button">
                    <button class="species--learn-more" onclick="closeSpecies(this);">
                        <span class="to-close">Close Info Panel</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
function formatSpecies(data) {
    data.sort((a, b) => {
	if(a.Species.toLowerCase() < b.Species.toLowerCase()) {
		return -1;
	} else if (a.Species.toLowerCase() > b.Species.toLowerCase()) {
		return 1;
	} else {
		return 0;
	}
    });

    let html = ``;

    data.forEach(species => {
        html += speciesBlock(species);
    });

    document.querySelector('#species--rows').insertAdjacentHTML('beforeend', html);
}

function openSpecies(e) {
    e.closest('.species--item').classList.toggle('is-open');
    e.closest('.species--item').classList.toggle('grid-item--width2');
    $('#species--rows').isotope('layout');
}

function closeSpecies(e) {
    e.closest('.species--item').classList.remove('is-open');
    e.closest('.species--item').classList.remove('grid-item--width2');
    $('#species--rows').isotope('layout');
}

function initSpecies() {
    //isotope
    var filters = {};

    //set class variables
    let $container = $('#species--rows');
    let typeSearch = `#quicksearch`;
    let memName = `.species--title`;
    let visible = `is-visible`;
    let filterGroup = `.species--filter-group`;
    let filterOptions = `.species--filter-group input`;
    let gridItem = `.species--item`;
    let defaultShow = ``;

    function setCustomFilter() {
        //get search value
        qsRegex = document.querySelector(typeSearch).value;
        
        //add show class to all items to reset
        elements.forEach(el => el.classList.add(visible));
        
        //filter by nothing
        let searchFilter = '';
        
        //check each item
        elements.forEach(el => {
            let name = el.querySelector(memName).textContent;
            if(!name.toLowerCase().includes(qsRegex)) {
                el.classList.remove(visible);
                searchFilter = `.${visible}`;
            }
        });
    
        let filterGroups = document.querySelectorAll(filterGroup);
        let groups = [];
        filterGroups.forEach(group => {
            let filters = [];
            group.querySelectorAll('label.is-checked input').forEach(filter => {
                if(filter.value) {
                    filters.push(filter.value);
                }
            });
            groups.push({group: group.dataset.filterGroup, selected: filters});
        });

	groups.forEach(group => {
		let tagString = group.selected.join('_');
		appendSearchQuery(group.group, tagString);
	});
    
        let filterCount = 0;
        let comboFilters = [];
        groups.forEach(group => {
            // skip to next filter group if it doesn't have any values
            if ( group.selected.length > 0 ) {
                if ( filterCount === 0 ) {
                    // copy groups to comboFilters
                    comboFilters = group.selected;
                } else {
                    var filterSelectors = [];
                    var groupCombo = comboFilters;
                    // merge filter Groups
                    for (var k = 0; k < group.selected.length; k++) {
                        for (var j = 0; j < groupCombo.length; j++) {
                            //accommodate weirdness with object vs not
                            if(groupCombo[j].selected) {
                                if(groupCombo[j].selected != group.selected[k]) {
                                    filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                                }
                            } else if (!groupCombo[j].selected && group.selected[k]) {
                                if(groupCombo[j] != group.selected[k]) {
                                    filterSelectors.push( groupCombo[j] + group.selected[k] );
                                }
                            }
                        }
                    }
                    // apply filter selectors to combo filters for next group
                    comboFilters = filterSelectors;
                }
                filterCount++;
            }
        });
        
        //set filter to blank
        let filter = [];
        //check if it's only search
        if(qsRegex.length > 0 && comboFilters.length === 0) {
            filter = [`.${visible}`];
        }
        //check if it's only checkboxes
        else if(qsRegex.length === 0 && comboFilters.length > 0) {
            let combos = comboFilters.join(',').split(',');
            filter = [...combos];
        }
        //check if it's both
        else if (qsRegex.length > 0 && comboFilters.length > 0) {
            let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
            filter = [...dualFilters];
        }
    
        //join array into string
        filter = filter.join(', ');
        
        //render isotope
        $container.isotope({
            filter: filter
        });
    }

    //initialize isotope
    // quick search regex
    let qsRegex;
    let elements = document.querySelectorAll(gridItem);

    //handle filter storage
    let queryParamsArray = window.location.search.split('&').map(param => param.split('=')).filter(item => item.length > 1);
    let queryParams = {};
    queryParamsArray.forEach(param => {
	    queryParams[param[0]] = param[1];
    });
    for (const param in queryParams) {
        let key = param;
        let values = queryParams[param].split('_');
        
        if(document.querySelector(`[data-filter-group="${key}"]`) && values.length > 0) {
            document.querySelector(`[data-filter-group="${key}"] .all`).classList.remove('is-checked');
            values.forEach(value => {
                document.querySelector(`[data-filter-group="${key}"] [value="${value}"]`)
                .closest('label')
                .classList.add('is-checked');
            });
        }
    }
    setCustomFilter();

    if(window.location.search.split('typesearch=')[1]) {
        document.querySelector(typeSearch).value = window.location.search.split('typesearch=')[1].split('&')[0];
        setCustomFilter();
    }

    //use value of input select to filter
    let checkboxes = document.querySelectorAll(filterOptions);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            if(e.currentTarget.classList.contains('all')) {
                e.currentTarget.checked = true;
                e.currentTarget.parentElement.classList.add('is-checked');
                e.currentTarget.parentElement.parentElement.querySelectorAll('input:not(.all)').forEach(input => {
                    input.checked = false;
                    input.parentElement.classList.remove('is-checked');
                });
            } else {
                if(e.currentTarget.parentElement.classList.contains('is-checked')) {
                    e.currentTarget.checked = false;
                    e.currentTarget.parentElement.classList.remove('is-checked');
                } else {
                    e.currentTarget.checked = true;
                    e.currentTarget.parentElement.classList.add('is-checked');
                    e.currentTarget.parentElement.parentElement.querySelector('input.all').checked = false;
                    e.currentTarget.parentElement.parentElement.querySelector('input.all').parentElement.classList.remove('is-checked');
                }
            }
            let labels = e.currentTarget.parentElement.parentElement.querySelectorAll('label');
            let checked = 0;
            labels.forEach(label => {
                if(label.classList.contains('is-checked')) {
                    checked++;
                }
            });
            if(checked === 0) {
                e.currentTarget.parentElement.parentElement.querySelector('input.all').checked = true;
                e.currentTarget.parentElement.parentElement.querySelector('input.all').parentElement.classList.add('is-checked');
            }
            //set filters
            setCustomFilter();
        });
    });
    
    // use value of search field to filter
    document.querySelector(typeSearch).addEventListener('keyup', e => {
	appendSearchQuery('typesearch', e.currentTarget.value);
        setCustomFilter();
    });


    //remove loading screen
    document.querySelector('body').classList.remove('loading');
    document.querySelector('#loading').remove();

    //accordions
    initAccordion();
}

function appendSearchQuery(param, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(param, value);
	window.history.replaceState(null, null, url);
}