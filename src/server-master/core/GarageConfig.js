/*
 * @author ohmed
 * DatTank Garage objects
*/

var GarageConfig = {

    levels: {
        0:      200,
        1:      300,
        2:      400,
        3:      600,
        4:      900,
        5:      1300,
        6:      1800,
        7:      2500,
        8:      3500,
        9:      4600
    },

    tanks: {

        'IS2001': {
            nid:            1,
            type:           'Tank',
            id:             'IS2001',
            title:          'IS 2001',
            price:          500,
            cannons:        [ 'Plasma-g1', 'Plasma-g2', 'Razer-v1', 'Razer-double' ],
            engines:        [ 'KX-v8', 'ZEL-72', 'KTZ-r1' ],
            armors:         [ 'X-shield', 'KS-shield', 'Z8-shield' ],
            default:        {
                cannon:     'Plasma-g1',
                engine:     'KX-v8',
                armor:      'X-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            ammoCapacity:   100,
            description:    '<b>IS2001 tank</b> - default tank of Russian army in WW VII (2139 year) against other sides on first colonized planet (Mars).<br><br>By default equipped with plasma cannon of first generation, turbo diesel engine and tesla induction generator.<br><br>Easy in movement control, quite fast, powerful cannon, but gets overheated quite fast.<br><br>'
        },

        'TigerS8': {
            nid:            2,
            type:           'Tank',
            id:             'TigerS8',
            title:          'Tiger S8',
            price:          1500,
            cannons:        [ 'Plasma-g2', 'Plasma-double', 'Razer-v2', 'Razer-double' ],
            engines:        [ 'ZEL-72s', 'KTZ-r2' ],
            armors:         [ 'KS-shield', 'Z8-shield', 'KS200-shield' ],
            default:        {
                cannon:     'Plasma-double',
                engine:     'ZEL-72s',
                armor:      'KS-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            ammoCapacity:   100,
            description:    '<b>Tiger S8 tank</b> - default tank of Germany army in Venus Planet War III (2140 year) against China.<br><br>By default equipped with plasma cannon of third generation, double turbo diesel engine with generator.<br><br>Is faster and has more powerful cannon than IS2001, but has problem with overheating.<br><br>'
        },

        'OrbitT32s': {
            nid:            3,
            type:           'Tank',
            id:             'OrbitT32s',
            title:          'Orbit T32s',
            price:          2800,
            cannons:        [ 'Plasma-double', 'Plasma-triple', 'Razer-v2', 'Razer-double' ],
            engines:        [ 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armors:         [ 'KS200-shield', 'Z8-shield', 'MG-defence' ],
            default:        {
                cannon:     'Razer-v2',
                engine:     'VAX-32',
                armor:      'Z8-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            ammoCapacity:   100,
            description:    '<b>Orbit T32s tank</b> - 1/3 tanks of China army in Venus Planet War III (2140 year) against Germany and USA.<br><br>By default equipped with improved second version laser cannon, improved ZEL-72 engine and uranium plates armor.<br><br>'
        },

        'MG813': {
            nid:            4,
            type:           'Tank',
            id:             'MG813',
            title:          'MG 813',
            price:          5000,
            cannons:        [ 'Plasma-triple', 'Razer-double', 'Razer-quadro', 'Mag87' ],
            engines:        [ 'ZEL-72s', 'KTZ-r2', 'VAX-32s' ],
            armors:         [ 'X-shield', 'KS-shield', 'z8-shield' ],
            default:        {
                cannon:     'Razer-double',
                engine:     'ZEL-72s',
                armor:      'X-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            ammoCapacity:   100,
            description:    '<b>MG 813 tank</b> - popular tank from all sides in Earth Asia War II (2141 year).<br><br>By default equipped with double laser cannon, nice engine improved with Gallium generator core, but has light less secure X-Shield armor.<br><br>'
        },

        'DTEK72': {
            nid:            5,
            type:           'Tank',
            id:             'DTEK72',
            title:          'DTEK 72',
            price:          8700,
            cannons:        [ 'Plasma-triple', 'Razer-quadro', 'Mag87', 'Mag87s' ],
            engines:        [ 'KTZ-r1', 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armors:         [ 'Z8-shield', 'MG-defence', 'MG-defence-v2', 'P12-shield' ],
            default:        {
                cannon:     'Plasma-triple',
                engine:     'KTZ-r1',
                armor:      'Z8-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            ammoCapacity:   100,
            description:    '<b>DTEK 72 tank</b> - rare Ukrainian tank designed in private company to defend oil wells from East Eurasian groups after Russia collapse in 2141 year.<br><br>By default equipped with triple plasma cannon, plutonium engine with partly organic generator and 80mm uranium plates armor sys.<br><br>'
        },

        'RiperX3': {
            nid:            6,
            type:           'Tank',
            id:             'RiperX3',
            title:          'Riper X3',
            price:          12000,
            cannons:        [ 'Plasma-zero', 'Razer-quadro', 'Mag87', 'Mag87s', 'Plasma-zero' ],
            engines:        [ 'KTZ-r2', 'VAX-32s', 'VAX-32v2' ],
            armors:         [ 'MG-defence', 'MG-defence-v2', 'T215'],
            default:        {
                cannon:     'Plasma-zero',
                engine:     'KTZ-r2',
                armor:      'MG-defence'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            ammoCapacity:   100,
            description:    '<b>Riper X3</b> - very powerful elite tank of United Korean Forces in Second War for Moon "Space Harbor" (2143 year).<br><br>By default equipped with special plasma cannon which solved problem of overheating, but this costs lots of energy consumption and lower movement speed and has new light graphene-type armor.<br><br>'
        }

    },

    cannons: {

        // Plasma cannons

        'Plasma-g1': {
            nid:            101,
            type:           'Cannon',
            id:             'Plasma-g1',
            title:          'Plasma g1',
            description:    '',
            shortDesc:      'Plasma cannon first Gen.',
            price:          400,
            damage:         30,
            antiArmor:      1,
            range:          200,
            overheat:       110,
            rpm:            10
        },

        'Plasma-g2': {
            nid:            102,
            type:           'Cannon',
            id:             'Plasma-g2',
            title:          'Plasma g2',
            description:    '',
            shortDesc:      'Plasma cannon second Gen.',
            price:          500,
            damage:         40,
            antiArmor:      1,
            range:          220,
            overheat:       110,
            energy:         0,
            rpm:            13
        },

        'Plasma-double': {
            nid:            103,
            type:           'Cannon',
            id:             'Plasma-double',
            title:          'Plasma double',
            description:    '',
            shortDesc:      'Plasma cannon with double oscillator.',
            price:          800,
            damage:         50,
            antiArmor:      1,
            range:          180,
            overheat:       90,
            energy:         0,
            rpm:            9
        },

        'Plasma-triple': {
            nid:            104,
            type:           'Cannon',
            id:             'Plasma-triple',
            title:          'Plasma triple',
            description:    '',
            shortDesc:      'Plasma cannon with triple oscillator.',
            price:          1200,
            damage:         80,
            antiArmor:      1,
            range:          170,
            overheat:       70,
            energy:         0,
            rpm:            9
        },

        'Plasma-zero': {
            nid:            105,
            type:           'Cannon',
            id:             'Plasma-zero',
            title:          'Plasma zero',
            description:    '',
            shortDesc:      'Plasma cannon with zero heat release.',
            price:          4000,
            damage:         45,
            antiArmor:      1,
            range:          210,
            overheat:       300,
            energy:         0,
            rpm:            25
        },

        // Laser cannons

        'Razer-v1': {
            nid:            106,
            type:           'Cannon',
            id:             'Razer-v1',
            title:          'Razer v1',
            description:    '',
            shortDesc:      'Laser cannon first prototype',
            price:          900,
            damage:         95,
            antiArmor:      1,
            range:          250,
            overheat:       65,
            energy:         0,
            rpm:            11
        },

        'Razer-v2': {
            nid:            107,
            type:           'Cannon',
            id:             'Razer-v2',
            title:          'Razer v2',
            description:    '',
            shortDesc:      'Second prototype version of laser cannon',
            price:          1500,
            damage:         115,
            antiArmor:      1,
            range:          270,
            overheat:       70,
            energy:         0,
            rpm:            14
        },

        'Razer-double': {
            nid:            108,
            type:           'Cannon',
            id:             'Razer-double',
            title:          'Razer double',
            description:    '',
            shortDesc:      'Original Razer cannon with double oscillator core.',
            price:          4000,
            damage:         140,
            antiArmor:      1,
            range:          250,
            overheat:       60,
            energy:         0,
            rpm:            12
        },

        'Razer-quadro': {
            nid:            109,
            type:           'Cannon',
            id:             'Razer-quadro',
            title:          'Razer quadro',
            description:    '',
            shortDesc:      'Original Razer cannon with quadro oscillator core.',
            price:          5000,
            damage:         180,
            antiArmor:      1,
            range:          200,
            overheat:       30,
            energy:         0,
            rpm:            10
        },

        // Magnet cannons

        'Mag87': {
            nid:            110,
            type:           'Cannon',
            id:             'Mag87',
            title:          'Mag 87',
            description:    '',
            shortDesc:      'Magnet cannon v87 release.',
            price:          7000,
            damage:         190,
            antiArmor:      1,
            range:          250,
            overheat:       45,
            energy:         0,
            rpm:            15
        },

        'Mag87s': {
            nid:            111,
            type:           'Cannon',
            id:             'Mag87s',
            title:          'Mag 87S',
            description:    '',
            shortDesc:      'Improved magnet cannon v87S.',
            price:          10000,
            damage:         220,
            antiArmor:      1,
            range:          170,
            overheat:       65,
            energy:         0,
            rpm:            16
        },

        'Mag87s-turbo': {
            nid:            112,
            type:           'Cannon',
            id:             'Mag87s-turbo',
            title:          'Mag 87s turbo version',
            description:    '',
            shortDesc:      'Magnet cannon v87s turbo version.',
            price:          14000,
            damage:         235,
            antiArmor:      1,
            range:          160,
            overheat:       50,
            energy:         0,
            rpm:            13
        }

    },

    engines: {

        'KX-v8': {
            nid:            201,
            type:           'Engine',
            id:             'KX-v8',
            title:          'KX v8',
            description:    '',
            shortDesc:      'Turbo diesel 1.3k HP engine with tesla induction generator.',
            price:          500,
            power:          30000,
            maxSpeed:       50
        },

        'ZEL-72': {
            nid:            202,
            type:           'Engine',
            id:             'ZEL-72',
            title:          'ZEL 72',
            description:    '',
            shortDesc:      'Double turbo diesel 1.8k HP engine with tesla induction generator.',
            price:          800,
            power:          30000,
            maxSpeed:       58
        },

        'ZEL-72s': {
            nid:            203,
            type:           'Engine',
            id:             'ZEL-72s',
            title:          'ZEL 72s',
            description:    '',
            shortDesc:      'Double turbo diesel 2.1k HP engine with tesla induction generator with Gallium winding.',
            price:          1300,
            power:          30000,
            maxSpeed:       62
        },

        'KTZ-r1': {
            nid:            204,
            type:           'Engine',
            id:             'KTZ-r1',
            title:          'KTZ r1',
            description:    '',
            shortDesc:      'Plutonium 3.2k HP engine with organic-based generator.',
            price:          1700,
            power:          30000,
            maxSpeed:       75
        },

        'KTZ-r2': {
            nid:            205,
            type:           'Engine',
            id:             'KTZ-r2',
            title:          'KTZ r2',
            description:    '',
            shortDesc:      'Improved plutonium 3.4k HP engine with organic-based generator.',
            price:          2000,
            power:          30000,
            maxSpeed:       78
        },

        'VAX-32': {
            nid:            206,
            type:           'Engine',
            id:             'VAX-32',
            title:          'VAX 32',
            description:    '',
            shortDesc:      'Polonium ARK 3.7k HP engine with generator and Lithium batteries.',
            price:          3000,
            power:          30000,
            maxSpeed:       85
        },

        'VAX-32s': {
            nid:            207,
            type:           'Engine',
            id:             'VAX-32s',
            title:          'VAX 32s',
            description:    '',
            shortDesc:      'Improved polonium ARK 4.2k HP engine.',
            price:          4500,
            power:          30000,
            maxSpeed:       89
        },

        'VAX-32v2': {
            nid:            208,
            type:           'Engine',
            id:             'VAX-32v2',
            title:          'VAX 32v2',
            description:    '',
            shortDesc:      'Modified VAX32s with Cesium core, 4.6k HP.',
            price:          6000,
            power:          30000,
            maxSpeed:       93
        }

    },

    armors: {

        'X-shield': {
            nid:            301,
            type:           'Armor',
            id:             'X-shield',
            title:          'X Shield',
            description:    '',
            shortDesc:      'Basic 100mm titanium list.',
            price:          400,
            armor:          100
        },

        'KS-shield': {
            nid:            302,
            type:           'Armor',
            id:             'KS-shield',
            title:          'KS Shield',
            description:    '',
            shortDesc:      '20mm Iridium armor.',
            price:          800,
            armor:          140
        },

        'KS200-shield': {
            nid:            303,
            type:           'Armor',
            id:             'KS200-shield',
            title:          'KS200 Shield',
            description:    '',
            shortDesc:      '35mm Iridium armor with active barrier.',
            price:          1400,
            armor:          160
        },

        'Z8-shield': {
            nid:            304,
            type:           'Armor',
            id:             'Z8-shield',
            title:          'Z8 Shield',
            description:    '',
            shortDesc:      '80mm uranium plates armor.',
            price:          1800,
            armor:          200
        },

        'MG-defence': {
            nid:            305,
            type:           'Armor',
            id:             'MG-defence',
            title:          'MG Defence',
            description:    '',
            shortDesc:      '3mm graphene nanotubes plates armor.',
            price:          2400,
            armor:          250
        },

        'MG-defence-v2': {
            nid:            306,
            type:           'Armor',
            id:             'MG-defence-v2',
            title:          'MG Defence v2',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          3500,
            armor:          270
        },

        'P12-shield': {
            nid:            307,
            type:           'Armor',
            id:             'P12-shield',
            title:          'P12 shield',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          5000,
            armor:          310
        },

        'P12.5-shield': {
            nid:            308,
            type:           'Armor',
            id:             'P12.5-shield',
            title:          'P12.5 shield',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          8000,
            armor:          350
        },

        'T215-armor': {
            nid:            309,
            type:           'Armor',
            id:             'T215-armor',
            title:          'T215 armor',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with adamantium strings.',
            price:          15000,
            armor:          380
        }

    }

};

//

module.exports = GarageConfig;
