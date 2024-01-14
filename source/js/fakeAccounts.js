const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

accounts = [
    {
        //all
        name: `Lux`.split(' ').length > 1 ? capitalize(`Lux`).replace(` `, `<span>`) + `</span>` : capitalize(`Admin`) + `<span>${capitalize(`Lux`)}</span>`,
        nameClean: `Lux`.toLowerCase().trim(),
        id: parseInt(`1`),
        parentID: parseInt(`0`),
        groupID: parseInt(`4`),
        groupName: `Admin`,
        imageTall: `https://dawneggleton.github.io/images/photo/eq/2017-despook2.jpg`,
        imageWide: `https://dawneggleton.github.io/images/photo/eq/2017-despook4.jpg`,
        type: `Staff`.toLowerCase(),
        alias: capitalize(`Lux`, [` `]),
        aliasClass: cleanText(`Lux`).toLowerCase().trim(),

        //character only
        species: capitalize(``),
        speciesClass: ``.toLowerCase() !== 'unset' && cleanText(``).toLowerCase(),
        pronouns: capitalize(``.toLowerCase(), [`/`]),
        relationship: ``.toLowerCase(),
        relationshipClass: cleanText(``).toLowerCase(),
        age: `` !== `` ? parseInt(``) : -1,
        ageClass: ``,
        location: ``,
        locationClass: cleanText(``).toLowerCase(),
        overview: lipsum,

        //member only
        memberPronouns: `She/Her`,
        timezone: `GMT-04:00`,
        triggers: lipsum,
        postCount: parseInt(`100`),
        dates: {
            joined: `June 28, 2023`,
            lastActive: `Today`,
            lastPost: `January 6 2024, 9:09 PM`
        }
    },
    {
        //all
        name: capitalize(`nikolas kovac`).replace(` `, `<span>`) + `</span>`,
        nameClean: `nikolas kovac`.toLowerCase().trim(),
        id: parseInt(`3`),
        parentID: parseInt(`1`),
        groupID: parseInt(`13`),
        groupName: `Hemlock`,
        imageTall: `https://64.media.tumblr.com/bdf44fbac68a03966e87193181bb8755/b54f37b3591867f2-d7/s1280x1920/63e0f589911b515142a6ebb6799613b7c7a4330a.jpg`,
        imageWide: `https://64.media.tumblr.com/e07395d9cec6df17fb937bf3e188e645/af6fdf304f4c49a1-21/s1280x1920/7d73cd8de48485de943c1811f8227396b1c87537.jpg`,
        type: `Character`.toLowerCase(),
        alias: capitalize(`Lux`, [` `]),
        aliasClass: cleanText(`Lux`).toLowerCase().trim(),
    
        //character only
        species: capitalize(`Phoenix`, [` `]),
        speciesClass: `Phoenix`.toLowerCase() !== 'unset' && cleanText(``).toLowerCase(),
        pronouns: capitalize(`he/him`.toLowerCase(), [`/`]),
        relationship: `Dating`.toLowerCase(),
        relationshipClass: cleanText(`Dating`).toLowerCase(),
        age: parseInt(`113`),
        ageClass: `101500 immortal`,
        location: `Temperance, NS`,
        locationClass: cleanText(`Temperance, NS`).toLowerCase(),
        overview: lipsum,
    
        //member only
        memberPronouns: `She/Her`,
        timezone: `GMT-04:00`,
        triggers: lipsum,
        postCount: parseInt(`200`),
        dates: {
            joined: `January 14, 2024`,
            lastActive: `11 seconds ago`,
            lastPost: `January 6 2024, 5:16 PM`
        }
    },
    {
        //all
        name: capitalize(`abigail amesbury`).replace(` `, `<span>`) + `</span>`,
        nameClean: `abigail amesbury`.toLowerCase().trim(),
        id: parseInt(`71`),
        parentID: parseInt(`1`),
        groupID: parseInt(`15`),
        groupName: `Amaranth`,
        imageTall: `https://64.media.tumblr.com/7f2e289f204ff499eeebc2ffec40e1df/fe432be0349896cd-27/s1280x1920/be470caf53daeb191e78cde6098d19e1b04a78e9.jpg`,
        imageWide: `https://64.media.tumblr.com/7de9e6a9e3ebe792a1273c301961876d/fe432be0349896cd-77/s1280x1920/a664bfdb9987652d41009351d036d4c120eb4744.jpg`,
        type: `Character`.toLowerCase(),
        alias: capitalize(`Lux`, [` `]),
        aliasClass: cleanText(`Lux`).toLowerCase().trim(),
    
        //character only
        species: capitalize(`human`, [` `]),
        speciesClass: `Human`.toLowerCase() !== 'unset' && cleanText(``).toLowerCase(),
        pronouns: capitalize(`SHe/Her`.toLowerCase(), [`/`]),
        relationship: `It's Complicated`.toLowerCase(),
        relationshipClass: cleanText(`It's Complicated`).toLowerCase(),
        age: parseInt(`30`),
        ageClass: `2635 mortal`,
        location: `Sydney, NS`,
        locationClass: cleanText(`Sydney, NS`).toLowerCase(),
        overview: lipsum,
    
        //member only
        memberPronouns: `She/Her`,
        timezone: `GMT-04:00`,
        triggers: lipsum,
        postCount: parseInt(`300`),
        dates: {
            joined: `July 16, 2023`,
            lastActive: `January 7 2024, 8:56 PM`,
            lastPost: `December 2 2023, 2:24 PM`
        }
    },
    {
        //all
        name: capitalize(`christopher reeves`).replace(` `, `<span>`) + `</span>`,
        nameClean: `christopher reeves`.toLowerCase().trim(),
        id: parseInt(`271`),
        parentID: parseInt(`1`),
        groupID: parseInt(`14`),
        groupName: `Nettle`,
        imageTall: `https://64.media.tumblr.com/761d40720057d50c9271ccbc508360da/tumblr_p2mlalaYh71vz2ghao10_500.jpg`,
        imageWide: `https://64.media.tumblr.com/d29d446d36df2e5585594941aa503c11/tumblr_p2mlalaYh71vz2ghao3_540.png`,
        type: `Character`.toLowerCase(),
        alias: capitalize(`Lux`, [` `]),
        aliasClass: cleanText(`Lux`).toLowerCase().trim(),
    
        //character only
        species: `hybrid`.toLowerCase() === `hybrid` ? `Hybrid Text` : capitalize(`hybrid`, [` `]),
        speciesClass: `Hybrid`.toLowerCase() !== 'unset' && cleanText(``).toLowerCase(),
        pronouns: capitalize(`He/Him`.toLowerCase(), [`/`]),
        relationship: `It's Complicated`.toLowerCase(),
        relationshipClass: cleanText(`It's Complicated`).toLowerCase(),
        age: parseInt(`799`),
        ageClass: `5011000 immortal`,
        location: `Rural Cape Breton`,
        locationClass: cleanText(`Rural Cape Breton`).toLowerCase(),
        overview: lipsum,
    
        //member only
        memberPronouns: `She/Her`,
        timezone: `GMT-04:00`,
        triggers: lipsum,
        postCount: parseInt(`400`),
        dates: {
            joined: `September 21, 2023`,
            lastActive: `January 7 2024, 7:02 PM`,
            lastPost: `December 30 2023, 11:18 PM`
        }
    }
];