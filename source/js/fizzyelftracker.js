
/** auto-tracker code by FizzyElf - https://fizzyelf.jcink.net **/
async function FillTracker(username, params = {}) {

    /***  CONFIGURATION AREA ***/
    const config = {
      includedforums: (params.includeCategoryIds || []).map(x => "c_" + x).concat(params.includeForumIds || []),
      historyforums: params.historyForumNames || [],
      historyforumids: params.historyForumIds || [],
      commforums: params.commForumNames || [],
      commforumids: params.commForumIds || [],
      commhistoryforums: params.commHistoryForumNames || [],
      commhistoryforumids: params.commHistoryForumIds || [],
      socialforums: params.socialForumNames || [],
      socialforumids: params.socialForumIds || [],
      socialhistoryforums: params.socialHistoryForumNames || [],
      socialhistoryforumids: params.socialHistoryForumIds || [],
      devforums: params.devForumNames || [],
      devforumids: params.devForumIds || [],
      devhistoryforums: params.devHistoryForumNames || [],
      devhistoryforumids: params.devHistoryForumIds || [],
      reqforums: params.reqForumNames || [],
      reqforumids: params.reqForumIds || [],
      reqhistoryforums: params.reqHistoryForumNames || [],
      reqhistoryforumids: params.reqHistoryForumIds || [],
      eventforums: params.eventForumNames || [],
      eventforumids: params.eventForumIds || [],
      eventhistoryforums: params.eventHistoryForumNames || [],
      eventhistoryforumids: params.eventHistoryForumIds || [],
      ignoreforums: params.ignoreForumNames || [],
      ignoreforumids: params.ignoreForumIds || [],
      lockedclass: params.lockedMacroIdentifier || "[title=Closed]",
      lockedforums: params.archiveForumNames || [],
      lockedforumids: params.archiveForumIds || [],
      indicators: params.indicators || ['<span style="font-family: roboto, verdana, arial, sans">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span>', '<span style="font-family: roboto, verdana, arial, sans">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤</span>'],
      separator: params.separator || "|",
      username: username.replace(/&#([0-9]+);/g, (m, p1) => String.fromCharCode(p1)),
      trackerwrap: params.thisTracker || $('tag-tab[data-key="#active"] .tracker-inner'),
      historywrap: params.thisHistory || $('tag-tab[data-key="#archived"] .tracker-inner'),
      commwrap: params.thisCommTracker || $('tag-tab[data-key="#comms"] .tracker-inner'),
      commhistorywrap: params.thisCommHistoryTracker || $('tag-tab[data-key="#archivedcomms"] .tracker-inner'),
      socialwrap: params.thisSocialTracker || $('tag-tab[data-key="#socials"] .tracker-inner'),
      devwrap: params.thisDevTracker || $('tag-tab[data-key="#dev"] .tracker-inner'),
      reqwrap: params.thisDevTracker || $('tag-tab[data-key="#requests"] .tracker-inner'),
      eventwrap: params.thisEventTracker || $('tag-tab[data-key="#events"] .tracker-inner'),
      pagelimit: params.pageLimit || 10,
      previousposters: params.previousPosters || {},
      lockedregex: (params.archiveForumRegex)?  RegExp(params.archiveForumRegex) : /archive/i ,
      closedthreads: (params.completedThreads) || []
    }
    if (!config.includedforums.length) config.includedforums.push("all");
    /*** END CONFIGURATION ***/
    if (/^[-w _d]+$/.test(params.indicators[0])) {
    params.indicators[0] = `<i class="${params.indicators[0]}"></i>`
    }
    if (/^[-w _d]+$/.test(params.indicators[1])) {
      params.indicators[1] = `<i class="${params.indicators[1]}"></i>`
    }
  
    /***  RUN THE SEARCH ***/
  
    let href = `/index.php?act=Search&CODE=01&nomobile=1`;
    let data = '';
    try {
      //console.log(`fetching ${href}`);
      data = await $.post(href, {
        keywords: "",
        namesearch: config.username,
        forums: config.includedforums,
        searchsubs: "1",
        prune: "0",
        prune_type: "newer",
        sort_key: "last_post",
        sort_order: "desc",
        search_in: "posts",
        result_type: "topics",
      });
      //console.log('success.');
    } catch (err) {
      console.log(`Ajax error loading page: ${href} - ${err.status} ${err.statusText}`);
      config.trackerwrap.append('<div class="profile--nothreads">Search Failed</div>');
      return;
    }
    doc = new DOMParser().parseFromString(data, 'text/html');
  
    let meta = $('meta[http-equiv="refresh"]', doc);
    if (meta.length) {
      href = meta.attr('content').substr(meta.attr('content').indexOf('=') + 1) + '&st=0';
    } else {
      let boardmessage = $('#board-message .tablefill .postcolor', doc).text();
      config.trackerwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.historywrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.commwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.commhistorywrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.socialwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.devwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.reqwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      config.eventwrap.append(`<div class="profile--nothreads">${boardmessage}</div>`);
      return;
    }
  
    await parseResults(href, config, 0);
    
  }
  
  
  
  parseResults = async (searchlink, config, page) => {
    let doc;
    searchlink = searchlink.replace(/&st=\d+/, `&st=${page * 25}`);
console.log(searchlink);
    let data = '';
    try {
      //console.log(`fetching ${searchlink}`);
      data = await $.get(searchlink);
      //console.log('success.');
    } catch (err) {
      console.log(`Ajax error loading page: ${searchlink} - ${err.status} ${err.statusText}`);
      console.log(err)
      config.trackerwrap.append('<div class="profile--nothreads">Search Failed</div>');
      return;
    }
    doc = new DOMParser().parseFromString(data, 'text/html');
  
    $('#search-topics .tablebasic > tbody > tr', doc).each(function (i, e) {
      if (i > 0) {
        const cells = $(e).children('td');
        const location = $(cells[3]).text();
        const location_id = $(cells[3]).find('a').attr('href').match(/showforum=([^&]+)&?/)[1]
        const threadLink = $(cells[7]).children('a').attr('href');
        const thread_id = threadLink.match(/showtopic=([^&]+)&?/)[1];
        if (!config.ignoreforums.includes(location) && !config.ignoreforumids.includes(location_id)) {
          const locked = $(cells[0]).find(`${config.lockedclass}`).length 
                        || config.lockedforums.includes(location) 
                        || config.lockedforumids.includes(location_id) 
                        || config.lockedregex.test(location)
                        || config.closedthreads.includes(thread_id);
          const title = $(cells[2]).find('td:nth-child(2) > a').first().text();
          const threadDesc = $(cells[2]).find('.desc').text().replaceAll('[', '<tag-highlight>').replaceAll(']', '</tag-highlight>');
          const history = config.historyforums.includes(location) || config.historyforumids.includes(location_id);
          const comm = config.commforums.includes(location) || config.commforumids.includes(location_id);
      	  const commhistory = config.commhistoryforums.includes(location) || config.commhistoryforumids.includes(location_id);
          const social = config.socialforums.includes(location) || config.socialforumids.includes(location_id);
          const socialhistory = config.socialhistoryforums.includes(location) || config.socialhistoryforumids.includes(location_id);
          const dev = config.devforums.includes(location) || config.devforumids.includes(location_id);
          const devhistory = config.devhistoryforums.includes(location) || config.devhistoryforumids.includes(location_id);
          const req = config.reqforums.includes(location) || config.reqforumids.includes(location_id);
          const reqhistory = config.reqhistoryforums.includes(location) || config.reqhistoryforumids.includes(location_id);
          const event = config.eventforums.includes(location) || config.eventforumids.includes(location_id);
          const eventhistory = config.eventhistoryforums.includes(location) || config.eventhistoryforumids.includes(location_id);
          const lastPoster = $(cells[7]).find('a[href*=showuser]').text().trim().replace(/&#([0-9]+);/g, (m, p1) => String.fromCharCode(p1));
          const lastPosterId = $(cells[7]).find('a[href*=showuser]').attr('href');
          let myturn = (config.username == lastPoster) ? 'Caught Up' : 'Owing';
          if (config.previousposters[thread_id]) {
            myturn = (lastPoster == config.previousposters[thread_id].replace(/&#([0-9]+);/g, (m, p1) => String.fromCharCode(p1))) ? 'Owing' : 'Caught Up';
          }
          const symbol = (myturn == 'Caught Up') ? config.indicators[0] : config.indicators[1];
  
          let postDate = $(cells[7]).html();
          postDate = postDate.substr(0, postDate.indexOf('<br>'));
          const sep = (threadDesc) ? config.separator : '';

          function formatItem (turn, url, title, desc, forumURL, forum, posterURL, poster, date) {
            return `<div class="profile--tracker-item" data-owing="${turn}">
                <a href="${url}">${title}</a>
                <span>${desc}</span>
                <span>Posted in <a href="?showforum=${forumURL}">${forum}</a></span>
                <span>Last post by <a href="${posterURL}">${poster}</a></span>
                <span>${date}</span>
            </div>`;
          }

          //${myturn.replace(/ /g, '').toLowerCase()}
          
          if (history) {
            config.historywrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (comm) {
            config.commwrap.append(formatItem(myturn.replace(/ /g, '').toLowerCase(), threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (commhistory) {
            config.commhistorywrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (social) {
            config.socialwrap.append(formatItem(myturn.replace(/ /g, '').toLowerCase(), threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (socialhistory) {
            config.commhistorywrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (dev) {
            config.devwrap.append(formatItem('dev', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (devhistory) {
            config.devwrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (req) {
            config.reqwrap.append(formatItem('req', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (reqhistory) {
            config.reqwrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (event) {
            config.eventwrap.append(formatItem(myturn.replace(/ /g, '').toLowerCase(), threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else if (eventhistory) {
            config.eventwrap.append(formatItem('archived', threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          } else { 
            config.trackerwrap.append(formatItem(myturn.replace(/ /g, '').toLowerCase(), threadLink, title, threadDesc, location_id, location, lastPosterId, lastPoster, postDate));
          }
        }
      }
  
    });
  
    if ($('#search-topics .tablebasic > tbody > tr', doc).length == 26 && page < config.pagelimit) {
      page = page + 1;
      await parseResults(searchlink, config, page)
    } else {
      if (!config.trackerwrap.children().length) {
        config.trackerwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.historywrap.children().length) {
        config.historywrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.commwrap.children().length) {
        config.commwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.socialwrap.children().length) {
        config.socialwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.devwrap.children().length) {
        config.devwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.reqwrap.children().length) {
        config.reqwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
      if (!config.eventwrap.children().length) {
        config.eventwrap.append($('<div class="profile--nothreads">No results found.</div>'));
      }
    }
}