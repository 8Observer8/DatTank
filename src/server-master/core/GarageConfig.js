/*
 * @author ohmed
 * DatTank Garage objects
*/

var GarageConfig = {

    arenaLevels: {
        0:      { score: 2 },
        1:      { score: 4 },
        2:      { score: 5 },
        3:      { score: 7 },
        4:      { score: 8 },
        5:      { score: 10 },
        6:      { score: 12 },
        7:      { score: 500 },
        8:      { score: 650 },
        9:      { score: 1000 },
        10:     { score: 1400 },
        11:     { score: 1900 },
        12:     { score: 2500 },
        13:     { score: 3000 },
        14:     { score: 3800 },
        15:     { score: 4500 },
        16:     { score: 5500 },
        17:     { score: 6700 },
        18:     { score: 7200 },
        19:     { score: 8700 },
        20:     { score: 9800 },
        21:     { score: 12000 }
    },

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

    arenaUpgrades: {
        1: { maxSpeed: 1, power: 100, armor: 2, cannon: 1, rpm: 1 },
        2: { maxSpeed: 1, power: 100, armor: 2, cannon: 1, rpm: 1 },
        3: { maxSpeed: 1, power: 100, armor: 2, cannon: 1, rpm: 1 },
        4: { maxSpeed: 1, power: 100, armor: 2, cannon: 1, rpm: 1 },
        5: { maxSpeed: 1, power: 100, armor: 2, cannon: 1, rpm: 1 }
    },

    hull: {

        'IS2001': {
            nid:            1,
            type:           'Hull',
            id:             'IS2001',
            title:          'IS 2001',
            price:          500,
            cannon:         [ 'Plasma-g1', 'Plasma-g2', 'Razer-v1', 'Razer-double' ],
            engine:         [ 'KX-v8', 'ZEL-72', 'KTZ-r1' ],
            armor:          [ 'X-shield', 'KS-shield', 'Z8-shield' ],
            default:        {
                cannon:     'Plasma-g1',
                engine:     'KX-v8',
                armor:      'X-shield'
            },
            description:    '<b>IS2001 tank</b> - default tank of Russian army in WW VII (2139 year) against other sides on first colonized planet (Mars).<br><br>By default equipped with plasma cannon of first generation, turbo diesel engine and tesla induction generator.<br><br>Easy in movement control, quite fast, powerful cannon, but gets overheated quite fast.<br><br>',
            levels:         {
                1:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 100 } },
                2:    { speedCoef: 2, cannonCoef: 0.5, armorCoef: 3, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                3:    { speedCoef: 3, cannonCoef: 1, armorCoef: 3, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                4:    { speedCoef: 4, cannonCoef: 1, armorCoef: 3, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                5:    { speedCoef: 5, cannonCoef: 1, armorCoef: 3, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } }
            }
        },

        'TigerS8': {
            nid:            2,
            type:           'Hull',
            id:             'TigerS8',
            title:          'Tiger S8',
            price:          1500,
            cannon:         [ 'Plasma-g2', 'Plasma-double', 'Razer-v2', 'Razer-double' ],
            engine:         [ 'ZEL-72s', 'KTZ-r2' ],
            armor:          [ 'KS-shield', 'Z8-shield', 'KS200-shield' ],
            default:        {
                cannon:     'Plasma-double',
                engine:     'ZEL-72s',
                armor:      'KS-shield'
            },
            description:    '<b>Tiger S8 tank</b> - default tank of Germany army in Venus Planet War III (2140 year) against China.<br><br>By default equipped with plasma cannon of third generation, double turbo diesel engine with generator.<br><br>Is faster and has more powerful cannon than IS2001, but has problem with overheating.<br><br>',
            levels:         {
                1:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 100 } },
                2:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                3:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                4:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                5:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } }
            }
        },

        'OrbitT32s': {
            nid:            3,
            type:           'Hull',
            id:             'OrbitT32s',
            title:          'Orbit T32s',
            price:          2800,
            cannon:         [ 'Plasma-double', 'Plasma-triple', 'Razer-v2', 'Razer-double' ],
            engine:         [ 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armor:          [ 'KS200-shield', 'Z8-shield', 'MG-defence' ],
            default:        {
                cannon:     'Razer-v2',
                engine:     'VAX-32',
                armor:      'Z8-shield'
            },
            description:    '<b>Orbit T32s tank</b> - 1/3 tanks of China army in Venus Planet War III (2140 year) against Germany and USA.<br><br>By default equipped with improved second version laser cannon, improved ZEL-72 engine and uranium plates armor.<br><br>',
            levels:         {
                1:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 100 } },
                2:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                3:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                4:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                5:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } }
            }
        },

        'MG813': {
            nid:            4,
            type:           'Hull',
            id:             'MG813',
            title:          'MG 813',
            price:          5000,
            cannon:         [ 'Plasma-triple', 'Razer-double', 'Razer-quadro', 'Mag87' ],
            engine:         [ 'ZEL-72s', 'KTZ-r2', 'VAX-32s' ],
            armor:          [ 'X-shield', 'KS-shield', 'z8-shield' ],
            default:        {
                cannon:     'Razer-double',
                engine:     'ZEL-72s',
                armor:      'X-shield'
            },
            description:    '<b>MG 813 tank</b> - popular tank from all sides in Earth Asia War II (2141 year).<br><br>By default equipped with double laser cannon, nice engine improved with Gallium generator core, but has light less secure X-Shield armor.<br><br>',
            levels:         {
                1:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 100 } },
                2:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                3:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                4:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                5:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } }
            }
        },

        'DTEK72': {
            nid:            5,
            type:           'Hull',
            id:             'DTEK72',
            title:          'DTEK 72',
            price:          8700,
            cannon:         [ 'Plasma-triple', 'Razer-quadro', 'Mag87', 'Mag87s' ],
            engine:         [ 'KTZ-r1', 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armor:          [ 'Z8-shield', 'MG-defence', 'MG-defence-v2', 'P12-shield' ],
            default:        {
                cannon:     'Plasma-triple',
                engine:     'KTZ-r1',
                armor:      'Z8-shield'
            },
            description:    '<b>DTEK 72 tank</b> - rare Ukrainian tank designed in private company to defend oil wells from East Eurasian groups after Russia collapse in 2141 year.<br><br>By default equipped with triple plasma cannon, plutonium engine with partly organic generator and 80mm uranium plates armor sys.<br><br>',
            levels:         {
                1:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 100 } },
                2:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                3:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                4:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                5:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } }
            }
        },

        'RiperX3': {
            nid:            6,
            type:           'Hull',
            id:             'RiperX3',
            title:          'Riper X3',
            price:          12000,
            cannon:         [ 'Plasma-zero', 'Razer-quadro', 'Mag87', 'Mag87s', 'Plasma-zero' ],
            engine:         [ 'KTZ-r2', 'VAX-32s', 'VAX-32v2' ],
            armor:          [ 'MG-defence', 'MG-defence-v2', 'T215'],
            default:        {
                cannon:     'Plasma-zero',
                engine:     'KTZ-r2',
                armor:      'MG-defence'
            },
            description:    '<b>Riper X3</b> - very powerful elite tank of United Korean Forces in Second War for Moon "Space Harbor" (2143 year).<br><br>By default equipped with special plasma cannon which solved problem of overheating, but this costs lots of energy consumption and lower movement speed and has new light graphene-type armor.<br><br>',
            levels:         {
                1:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 100 } },
                2:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                3:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                4:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } },
                5:    { speedCoef: 1, cannonCoef: 1, armorCoef: 1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 200 } }
            }
        }

    },

    cannon: {

        // Plasma cannons

        'Plasma-g1': {
            nid:            101,
            type:           'Cannon',
            id:             'Plasma-g1',
            title:          'Plasma g1',
            description:    '',
            shortDesc:      'Plasma cannon first Gen.',
            price:          400,
            shootType:      'bullet',
            levels:         {
                1:      { damage: 30, range: 200, overheat: 110, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 50, range: 200, overheat: 110, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 70, range: 200, overheat: 110, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 30, range: 200, overheat: 110, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 30, range: 200, overheat: 110, rpm: 10, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Plasma-g2': {
            nid:            102,
            type:           'Cannon',
            id:             'Plasma-g2',
            title:          'Plasma g2',
            description:    '',
            shortDesc:      'Plasma cannon second Gen.',
            price:          500,
            shootType:      'bullet',
            levels:         {
                1:      { damage: 40, range: 220, overheat: 110, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 40, range: 220, overheat: 110, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 40, range: 220, overheat: 110, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 40, range: 220, overheat: 110, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 40, range: 220, overheat: 110, rpm: 13, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Plasma-double': {
            nid:            103,
            type:           'Cannon',
            id:             'Plasma-double',
            title:          'Plasma double',
            description:    '',
            shortDesc:      'Plasma cannon with double oscillator.',
            price:          800,
            shootType:      'bullet',
            levels:         {
                1:      { damage: 50, range: 180, overheat: 90, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 50, range: 180, overheat: 90, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 50, range: 180, overheat: 90, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 50, range: 180, overheat: 90, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 50, range: 180, overheat: 90, rpm: 9, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Plasma-triple': {
            nid:            104,
            type:           'Cannon',
            id:             'Plasma-triple',
            title:          'Plasma triple',
            description:    '',
            shortDesc:      'Plasma cannon with triple oscillator.',
            price:          1200,
            shootType:      'bullet',
            levels:         {
                1:      { damage: 80, range: 170, overheat: 70, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 80, range: 170, overheat: 70, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 80, range: 170, overheat: 70, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 80, range: 170, overheat: 70, rpm: 9, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 80, range: 170, overheat: 70, rpm: 9, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Plasma-zero': {
            nid:            105,
            type:           'Cannon',
            id:             'Plasma-zero',
            title:          'Plasma zero',
            description:    '',
            shortDesc:      'Plasma cannon with zero heat release.',
            price:          4000,
            shootType:      'bullet',
            levels:         {
                1:      { damage: 45, range: 210, overheat: 300, rpm: 25, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 45, range: 210, overheat: 300, rpm: 25, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 45, range: 210, overheat: 300, rpm: 25, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 45, range: 210, overheat: 300, rpm: 25, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 45, range: 210, overheat: 300, rpm: 25, price: { levelBonuses: 1, coins: 100 } }
            }
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
            shootType:      'laser',
            levels:         {
                1:      { damage: 95, range: 250, overheat: 65, rpm: 11, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 95, range: 250, overheat: 65, rpm: 11, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 95, range: 250, overheat: 65, rpm: 11, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 95, range: 250, overheat: 65, rpm: 11, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 95, range: 250, overheat: 65, rpm: 11, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Razer-v2': {
            nid:            107,
            type:           'Cannon',
            id:             'Razer-v2',
            title:          'Razer v2',
            description:    '',
            shortDesc:      'Second prototype version of laser cannon',
            price:          1500,
            shootType:      'laser',
            levels:         {
                1:      { damage: 115, range: 270, overheat: 70, rpm: 14, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 115, range: 270, overheat: 70, rpm: 14, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 115, range: 270, overheat: 70, rpm: 14, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 115, range: 270, overheat: 70, rpm: 14, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 115, range: 270, overheat: 70, rpm: 14, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Razer-double': {
            nid:            108,
            type:           'Cannon',
            id:             'Razer-double',
            title:          'Razer double',
            description:    '',
            shortDesc:      'Original Razer cannon with double oscillator core.',
            price:          4000,
            shootType:      'laser',
            levels:         {
                1:      { damage: 140, range: 250, overheat: 60, rpm: 12, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 140, range: 250, overheat: 60, rpm: 12, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 140, range: 250, overheat: 60, rpm: 12, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 140, range: 250, overheat: 60, rpm: 12, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 140, range: 250, overheat: 60, rpm: 12, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Razer-quadro': {
            nid:            109,
            type:           'Cannon',
            id:             'Razer-quadro',
            title:          'Razer quadro',
            description:    '',
            shortDesc:      'Original Razer cannon with quadro oscillator core.',
            price:          5000,
            shootType:      'laser',
            levels:         {
                1:      { damage: 180, range: 200, overheat: 30, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 180, range: 200, overheat: 30, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 180, range: 200, overheat: 30, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 180, range: 200, overheat: 30, rpm: 10, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 180, range: 200, overheat: 30, rpm: 10, price: { levelBonuses: 1, coins: 100 } }
            }
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
            shootType:      'fire',
            levels:         {
                1:      { damage: 190, range: 250, overheat: 45, rpm: 15, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 190, range: 250, overheat: 45, rpm: 15, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 190, range: 250, overheat: 45, rpm: 15, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 190, range: 250, overheat: 45, rpm: 15, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 190, range: 250, overheat: 45, rpm: 15, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Mag87s': {
            nid:            111,
            type:           'Cannon',
            id:             'Mag87s',
            title:          'Mag 87S',
            description:    '',
            shortDesc:      'Improved magnet cannon v87S.',
            price:          10000,
            shootType:      'fire',
            levels:         {
                1:      { damage: 220, range: 170, overheat: 65, rpm: 16, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 220, range: 170, overheat: 65, rpm: 16, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 220, range: 170, overheat: 65, rpm: 16, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 220, range: 170, overheat: 65, rpm: 16, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 220, range: 170, overheat: 65, rpm: 16, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Mag87s-turbo': {
            nid:            112,
            type:           'Cannon',
            id:             'Mag87s-turbo',
            title:          'Mag 87s turbo version',
            description:    '',
            shortDesc:      'Magnet cannon v87s turbo version.',
            price:          14000,
            shootType:      'fire',
            levels:         {
                1:      { damage: 235, range: 160, overheat: 50, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                2:      { damage: 235, range: 160, overheat: 50, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                3:      { damage: 235, range: 160, overheat: 50, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                4:      { damage: 235, range: 160, overheat: 50, rpm: 13, price: { levelBonuses: 1, coins: 100 } },
                5:      { damage: 235, range: 160, overheat: 50, rpm: 13, price: { levelBonuses: 1, coins: 100 } }
            }
        }

    },

    engine: {

        'KX-v8': {
            nid:            201,
            type:           'Engine',
            id:             'KX-v8',
            title:          'KX v8',
            description:    '',
            shortDesc:      'Turbo diesel 1.3k HP engine with tesla induction generator.',
            price:          500,
            levels:         {
                1:      { maxSpeed: 50, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 50, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 50, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 50, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 50, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'ZEL-72': {
            nid:            202,
            type:           'Engine',
            id:             'ZEL-72',
            title:          'ZEL 72',
            description:    '',
            shortDesc:      'Double turbo diesel 1.8k HP engine with tesla induction generator.',
            price:          800,
            levels:         {
                1:      { maxSpeed: 58, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 58, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 58, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 58, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 58, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'ZEL-72s': {
            nid:            203,
            type:           'Engine',
            id:             'ZEL-72s',
            title:          'ZEL 72s',
            description:    '',
            shortDesc:      'Double turbo diesel 2.1k HP engine with tesla induction generator with Gallium winding.',
            price:          1300,
            levels:         {
                1:      { maxSpeed: 62, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 62, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 62, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 62, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 62, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'KTZ-r1': {
            nid:            204,
            type:           'Engine',
            id:             'KTZ-r1',
            title:          'KTZ r1',
            description:    '',
            shortDesc:      'Plutonium 3.2k HP engine with organic-based generator.',
            price:          1700,
            levels:         {
                1:      { maxSpeed: 75, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 75, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 75, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 75, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 75, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'KTZ-r2': {
            nid:            205,
            type:           'Engine',
            id:             'KTZ-r2',
            title:          'KTZ r2',
            description:    '',
            shortDesc:      'Improved plutonium 3.4k HP engine with organic-based generator.',
            price:          2000,
            levels:         {
                1:      { maxSpeed: 78, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 78, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 78, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 78, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 78, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'VAX-32': {
            nid:            206,
            type:           'Engine',
            id:             'VAX-32',
            title:          'VAX 32',
            description:    '',
            shortDesc:      'Polonium ARK 3.7k HP engine with generator and Lithium batteries.',
            price:          3000,
            levels:         {
                1:      { maxSpeed: 85, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 85, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 85, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 85, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 85, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'VAX-32s': {
            nid:            207,
            type:           'Engine',
            id:             'VAX-32s',
            title:          'VAX 32s',
            description:    '',
            shortDesc:      'Improved polonium ARK 4.2k HP engine.',
            price:          4500,
            levels:         {
                1:      { maxSpeed: 89, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 89, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 89, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 89, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 89, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'VAX-32v2': {
            nid:            208,
            type:           'Engine',
            id:             'VAX-32v2',
            title:          'VAX 32v2',
            description:    '',
            shortDesc:      'Modified VAX32s with Cesium core, 4.6k HP.',
            price:          6000,
            levels:         {
                1:      { maxSpeed: 93, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                2:      { maxSpeed: 93, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                3:      { maxSpeed: 93, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                4:      { maxSpeed: 93, power: 30000, price: { levelBonuses: 1, coins: 100 } },
                5:      { maxSpeed: 93, power: 30000, price: { levelBonuses: 1, coins: 100 } }
            }
        }

    },

    armor: {

        'X-shield': {
            nid:            301,
            type:           'Armor',
            id:             'X-shield',
            title:          'X Shield',
            description:    '',
            shortDesc:      'Basic 100mm titanium list.',
            price:          400,
            levels:         {
                1:      { armor: 100, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 100, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 100, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 100, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 100, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'KS-shield': {
            nid:            302,
            type:           'Armor',
            id:             'KS-shield',
            title:          'KS Shield',
            description:    '',
            shortDesc:      '20mm Iridium armor.',
            price:          800,
            levels:         {
                1:      { armor: 140, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 140, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 140, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 140, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 140, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'KS200-shield': {
            nid:            303,
            type:           'Armor',
            id:             'KS200-shield',
            title:          'KS200 Shield',
            description:    '',
            shortDesc:      '35mm Iridium armor with active barrier.',
            price:          1400,
            levels:         {
                1:      { armor: 160, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 160, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 160, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 160, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 160, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'Z8-shield': {
            nid:            304,
            type:           'Armor',
            id:             'Z8-shield',
            title:          'Z8 Shield',
            description:    '',
            shortDesc:      '80mm uranium plates armor.',
            price:          1800,
            levels:         {
                1:      { armor: 200, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 200, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 200, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 200, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 200, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'MG-defence': {
            nid:            305,
            type:           'Armor',
            id:             'MG-defence',
            title:          'MG Defence',
            description:    '',
            shortDesc:      '3mm graphene nanotubes plates armor.',
            price:          2400,
            levels:         {
                1:      { armor: 250, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 250, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 250, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 250, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 250, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'MG-defence-v2': {
            nid:            306,
            type:           'Armor',
            id:             'MG-defence-v2',
            title:          'MG Defence v2',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          3500,
            levels:         {
                1:      { armor: 270, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 270, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 270, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 270, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 270, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'P12-shield': {
            nid:            307,
            type:           'Armor',
            id:             'P12-shield',
            title:          'P12 shield',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          5000,
            levels:         {
                1:      { armor: 310, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 310, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 310, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 310, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 310, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'P12.5-shield': {
            nid:            308,
            type:           'Armor',
            id:             'P12.5-shield',
            title:          'P12.5 shield',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          8000,
            levels:         {
                1:      { armor: 350, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 350, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 350, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 350, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 350, price: { levelBonuses: 1, coins: 100 } }
            }
        },

        'T215-armor': {
            nid:            309,
            type:           'Armor',
            id:             'T215-armor',
            title:          'T215 armor',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with adamantium strings.',
            price:          15000,
            levels:         {
                1:      { armor: 380, price: { levelBonuses: 1, coins: 100 } },
                2:      { armor: 380, price: { levelBonuses: 1, coins: 100 } },
                3:      { armor: 380, price: { levelBonuses: 1, coins: 100 } },
                4:      { armor: 380, price: { levelBonuses: 1, coins: 100 } },
                5:      { armor: 380, price: { levelBonuses: 1, coins: 100 } }
            }
        }

    }

};

//

module.exports = GarageConfig;
