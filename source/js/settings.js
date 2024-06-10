const discordChannels = [
	{title: `#comm-tags`, hook: `1222619480731947028/udI01gRguGBnLb4uSGv7UCNkDPo6TdTYhABks68wXgS1K_U_z3LHMMnfheDoPUX-Kfyw`},
	{title: `#thread-tags`, hook: `1222619465963929801/w3iZ_xgX6WEe-WXuqO25_wlvyZy3AIK_ggCfyeEfsB3rBQs4Hlws_Ux7abMKUf9CAQTW`},
	{title: `#open-comms`, hook: `1222619662903279617/_rlDqv8FfEJSEPXDG2nxWzfh-u4izhO1b4D-Y02M07GO1BpUrKftXcmliBk2cwlpnxSg`},
	{title: `#open-threads`, hook: `1222619636722569298/LNwDFoiEcRgBm4uV4WVBDQshgCbFHlemS56dyV49Oyzx0KnTlL8cW_vmliIVaH7kI7mo`},
];

const discordTags = [
    {alias: `Anna`, id: `379614457304842250`},
    {alias: `Atlas`, id: `388906867096813582`},
    {alias: `Ben`, id: `443645745682317312`},
    {alias: `Cricket`, id: `287717448235483141`},
    {alias: `Dashin`, id: `177638202755121152`},
    {alias: `Feelix`, id: `316600785536286724`},
    {alias: `Hermes`, id: `830491813407883306`},
    {alias: `Iris`, id: `691131810213527592`},
    {alias: `Ixchel`, id: `761250715720089650`},
    {alias: `Kade`, id: `288169191914078211`},
    {alias: `Lux`, id: `253627726886469642`},
    {alias: `Mata`, id: `1218893371897024514`},
    {alias: `Max`, id: `359467024449142796`},
    {alias: `Para`, id: `336126083906797578`},
    {alias: `Pinky`, id: `562006518099345439`},
    {alias: `Remi`, id: `1009896626007068732`},
    {alias: `Ronnie`, id: `597385892243701760`},
    {alias: `Shay`, id: `301925093112807425`},
    {alias: `Silence`, id: `224926781243785218`},
    {alias: `Sly`, id: `351560535122116608`},
    {alias: `Spyder`, id: `189583247141765120`},
    {alias: `Sunny Flower`, id: `85490376281968640`},
    {alias: `Tao`, id: `1221143886353928202`},
    {alias: `Temple`, id: `177174017017511938`},
    {alias: `Theo`, id: `243141923634675712`},
    {alias: `Wander`, id: `316576558116765707`},
    {alias: `Whisper`, id: `808086875021377627`},
];

const discordRoles = [
    {title: `Open`, id: `&1124169819869155451`},
    {title: `Vox Machina`, id: `&1236751323374817382`},
];

const colors = {
    'amaranth': [157, 99, 99],
    'birch': [187, 166, 151],
    'blueberry': [70, 120, 142],
    'dandelion': [189, 166, 96],
    'hemlock': [72, 104, 98],
    'juniper': [110, 115, 145],
    'lupin': [159, 142, 162],
    'nettle': [119, 155, 113],
    'spruce': [106, 136, 119],
    'sundew': [189, 134, 101],
    'tobacco': [132, 97, 69],
    'thistle': [119, 99, 125],
    'balsam': [134, 124, 116],
    'clover': [85, 111, 74],
    'sage': [149, 155, 127],
    'cedar': [168, 127, 84],
    'laurel': [115, 99, 108],
    'goldenrod': [168, 124, 38],
    'hawthorn': [104, 54, 54],
    'periwinkle': [143, 153, 176],
    'primrose': [149, 106, 130],
    'sweetgrass': [160, 168, 156],
    'starflower': [202, 175, 190],
    'seaweed': [54, 87, 53],
    'buttercup': [204, 190, 148],
    'yarrow': [113, 75, 64],
}
const unusable = ['premium species', 'premium group', 'custom complex event', 'custom discord role & icon', 'custom event', 'custom subplot'];

const immortals = ['phoenix', 'vampire', 'jinn', 'kitsune', 'selkie', 'púca', 'barghest', 'faerie', 'spriggan', 'unicorn', 'faun', 'qilin', 'ghost', 'reaper', 'hellhound', 'aster', 'coaltus', 'marid', 'pegasus', 'supplicant'];

const toggleFields = ['#field_1_input', '#field_40_input', '#field_27_input', '#field_65_input'];

const characterFields = ['#field_13', '#field_14', '#field_15', '#field_16', '#field_17', '#field_18', '#field_19', '#field_20', '#field_21', '#field_22', '#field_23', '#field_24', '#field_25', '#field_26', '#field_27', '#field_29', '#field_30', '#field_31', '#field_32', '#field_33', '#field_34', '#field_36', '#field_37', '#field_38', '#field_39', '#field_40', '#field_48', '#field_49', '#field_50', '#field_51', '#field_52', '#field_53', '#field_54', '#field_55', '#field_65', '#field_72', '#field_73', '#field_74', '#field_75', '#field_76', '#field_77'];

const singleRelFields = ['#field_35'];
const sectionRelFields = ['#field_66', '#field_67', '#field_68', '#field_69', '#field_70', '#field_71', '#field_72', '#field_78'];

const hybridFields = ['#field_28'];
const wereFields = ['#field_58'];
const dragonFields = ['#field_59'];
const vampFields = ['#field_61'];
const faeFields = ['#field_62'];
const elementalFields = ['#field_63'];
const centaurFields = ['#field_64'];

const defaultImages = ['#field_42'];
const gridImages = ['#field_43', '#field_45', '#field_46'];
const mosaicImages = ['#field_44', '#field_47'];

const allHeaders = [
    {'title': `Player Information`, 'insertBefore': '#field_1'},
    {'title': `Images`, 'insertBefore': '#field_40'},
    {'title': `Site Customization`, 'insertBefore': '#field_56'},
];
const charHeaders = [
    {'title': `Basic Information`, 'insertBefore': '#field_13'},
    {'title': `Detailed Information`, 'insertBefore': '#field_29'},
    {'title': `Plotting`, 'insertBefore': '#field_32'},
    {'title': `Links`, 'insertBefore': '#field_36'},
    {'title': `Relationships`, 'insertBefore': '#field_65'},
];

const specialSpecies = [
    {'species': 'hybrid', 'fields': hybridFields},
    {'species': 'were', 'fields': wereFields},
    {'species': 'dragon', 'fields': dragonFields},
    {'species': 'elemental', 'fields': elementalFields},
    {'species': 'vamp', 'fields': vampFields},
    {'species': 'faerie', 'fields': faeFields},
    {'species': 'centaur', 'fields': centaurFields},
];

const current = new Date();
const year = current.getFullYear();
const month = current.getMonth() + 1;
const day = current.getDate();
  
/** auto-tracker code by FizzyElf - https://fizzyelf.jcink.net **/
trackerParams = {
    //include
    includeCategoryIds: ['3', '4', '5', '6', '7', '8'],
    includeForumIds: [],
    ignoreForumIds: ['1', '2', '3', '5', '6', '7', '11', '18', '26', '27', '28', '29', '30', '34', '35', '89', '127', '128', '129', '130'],

    //define au, comm, dev, archive forums
    historyForumIds: ['33', '37', '38'], //history
    commForumIds: ['17'], //comm
    commHistoryForumIds: ['32'], //comm history
    socialForumIds: ['40', '41'], //social
    socialHistoryForumIds: ['39'], //social history
    devForumIds: ['10', '123', '125', '152', '124', '126', '134', '135', '136', '137', '59', '60', '109', '73', '61', '145', '146', '147', '148', '105' ,'106', '107', '52', '53', '99', '54', '55', '56', '57', '153', '75', '81', '155', '156', '157', '69', '70', '98', '71', '72', '100', '101', '102', '103', '85','114', '8', '47', '48', '50', '49', '97', '51', '154', '76', '77', '78', '79', '80', '86', '138', '139', '140', '141', '142', '143', '144', '131', '133', '132', '9', '64', '117', '66', '108', '65', '68', '161', '162', '163', '164', '165', '168', '166', '170', '173', '174', '172','175'], //dev
    devHistoryForumIds: ['31'], //dev history
    reqForumIds: ['12', '13', '14', '15', '16', '167'], //requests
    reqHistoryForumIds: ['36'], //request history
    eventForumIds: ['176', '177'], //events
    eventHistoryForumIds: ['67', '115', '94', '104', '169'], //event history

    //set indicators
    indicators: ['fa-solid fa-check', 'fa-solid fa-star'], 
}