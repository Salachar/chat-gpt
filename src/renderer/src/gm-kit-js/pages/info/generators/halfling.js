/*
    Names froms:
        - Player Handbook 5e
        - http://brandondraga.tumblr.com/post/66804468075/chris-perkins-npc-name-list
*/

const {
    percentage,
    randomFromList
} = Lib.helpers;


const halfling_names = {
    title: 'Halfling',

    generate: function (gender_names) {
        let name = randomFromList(gender_names) + ' ' + randomFromList(this.surnames);
        if (percentage() < 33) {
            name += (' aka "' + randomFromList(this.nicknames_prefix) + randomFromList(this.nicknames_suffix).toLowerCase() + '"');
        }
        return name;
    },

    male: [
        'Alton (Alt)',
        'Ander',
        'Arthan (Art)',
        'Bennet (Benny)',
        'Bodo (Bo)',
        'Cade',
        'Carvin (Vin)',
        'Chas',
        'Corby',
        'Corrin',
        'Cullen',
        'Dannad (Dan)',
        'Egen',
        'Eldon',
        'Ernest (Ernie)',
        'Errich',
        'Falk',
        'Finnan (Fin)',
        'Garret',
        'Gedi',
        'Heron',
        'Jeryl (Jer)',
        'Jet',
        'Jiri',
        'Keffen',
        'Kylem',
        'Kynt',
        'Lazam',
        'Leskyn (Les)',
        'Libo',
        'Lindal (Lin)',
        'Lyle',
        'Merric',
        'Milo',
        'Nebin',
        'Neff',
        'Orne',
        'Osborn (Ozzy)',
        'Ostran (Ozzy)',
        'Paddy',
        'Perrin',
        'Pipo',
        'Poe',
        'Quarrel',
        'Reed',
        'Rilkin',
        'Rollo',
        'Roscoe',
        'Shardon',
        'Tarfen',
        'Titch',
        'Tuck',
        'Ulmo',
        'Wellby',
        'Wenner (Wen)',
        'Whim'
    ],

    female: [
        'Andrey',
        'Bree',
        'Caliope',
        'Callie',
        'Chenna',
        'Cora',
        'Eida',
        'Emily',
        'Euphemia',
        'Holli',
        'Jillian',
        'Jinx',
        'Joy',
        'Kithri',
        'Lavinia',
        'Lidda',
        'Lilac',
        'Lily',
        'Merla',
        'Minka',
        'Nedda',
        'Orchid',
        'Paela',
        'Piper',
        'Portia',
        'Rixi',
        'Rosabelle',
        'Sabretha',
        'Seraphina',
        'Shaena',
        'Sierra',
        'Teg',
        'Tilly',
        'Tillip',
        'Toira',
        'Tryn',
        'Vani',
        'Verna',
        'Vexia',
        'Vil',
        'Vzani',
        'Wella',
        'Zanthe',
        'Ziza'
    ],

    nicknames_prefix: [
        'Amber',
        'Brown',
        'Cold',
        'Crazy',
        'Curly',
        'Earth',
        'Far',
        'Fast',
        'Fat',
        'Fire',
        'Flow',
        'Forest',
        'Free',
        'Glitter',
        'Good',
        'Great',
        'Green',
        'Hairy',
        'Honor',
        'Healthy',
        'Home',
        'Hot',
        'Laughing',
        'Lightning',
        'Little',
        'Many',
        'Moon',
        'Nimble',
        'Plump',
        'Pretty',
        'Quick',
        'Rain',
        'Road',
        'Running',
        'Scatter',
        'Shadow',
        'Silver',
        'Simple',
        'Sky',
        'Slow',
        'Sly',
        'Smooth',
        'Spring',
        'Sprout',
        'Stout',
        'Sun',
        'Swift',
        'Tall',
        'Travelling',
        'Under',
        'Warm',
        'Water',
        'Wet',
        'Wild'
    ],

    nicknames_suffix: [
        'Ale',
        'Arrow',
        'Body',
        'Bones',
        'Bottom',
        'Bread',
        'Brother',
        'Burrow',
        'Caller',
        'Cloak',
        'Digger',
        'Drum',
        'Eye',
        'Fellow',
        'Fingers',
        'Flower',
        'Foot',
        'Fox',
        'Ghost',
        'Goat',
        'Gold',
        'Grass',
        'Hand',
        'Head',
        'Heart',
        'Hearth',
        'Hill',
        'Lady',
        'Leaf',
        'Letters',
        'Maker',
        'Man',
        'Map',
        'Mind',
        'One',
        'Pipe',
        'Shadow',
        'Shaker',
        'Sister',
        'Skin',
        'Sleep',
        'Stick',
        'Stoat',
        'Swan',
        'Talker',
        'Taunt',
        'Tender',
        'Wanderer',
        'Will',
        'Wind',
        'Wit',
        'Wolf'
    ],

    surnames: [
        'Angler',
        'Battlestone',
        'Blackwater',
        'Brushgather',
        'Daggersharp',
        'Deepstrider',
        'Goodbarrel',
        'Greenbottle',
        'Highhill',
        'Hilltopple',
        'Hollowpot',
        'Leagallow',
        'Oleander',
        'Puddle',
        'Raftmite',
        'Skiprock',
        'Silverfin',
        'Tanglestrand',
        'Tealeaf',
        'Thorngage',
        'Tosscobble',
        'Tricker',
        'Willowrush',
        'Underbough',
        'Yellowcrane'
    ]
};

module.exports = halfling_names;
