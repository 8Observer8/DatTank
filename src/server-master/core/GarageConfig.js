/*
 * @author ohmed
 * DatTank Garage objects
*/

var GarageConfig = {

    arenaLevels: {
        0:      { score: 5 },
        1:      { score: 35 },
        2:      { score: 50 },
        3:      { score: 80 },
        4:      { score: 120 },
        5:      { score: 170 },
        6:      { score: 250 },
        7:      { score: 380 },
        8:      { score: 450 },
        9:      { score: 650 },
        10:     { score: 800 },
        11:     { score: 1100 },
        12:     { score: 1350 },
        13:     { score: 1600 },
        14:     { score: 1900 },
        15:     { score: 2400 },
        16:     { score: 2700 },
        17:     { score: 3200 },
        18:     { score: 3600 },
        19:     { score: 3900 },
        20:     { score: 4400 },
        21:     { score: 7000 },
    },

    levels: {
        0:      100,
        1:      150,
        2:      150,
        3:      150,
        4:      200,
        5:      200,
        6:      250,
        7:      350,
        8:      350,
        9:      400,
        10:     400,
        11:     450,
        12:     450,
        13:     550,
        14:     550,
        15:     550,
        16:     600,
        17:     600,
        18:     650,
        19:     650,
        20:     700,
        21:     800,
        22:     800,
        23:     850,
        24:     900,
        25:     900,
        26:     950,
        27:     1000,
        28:     1100,
        29:     1200,
        30:     1300,
        31:     1350,
        32:     1400,
        33:     1400,
        34:     1500,
        35:     1550,
        36:     1600,
        37:     1700,
        38:     1800,
        39:     1900,
        40:     2200,
        41:     2300,
        42:     2300,
        43:     2350,
        44:     2400,
        45:     2500,
        46:     2600,
        47:     2700,
        48:     2800,
        49:     2900,
        50:     5000,
        51:     5000,
        52:     7000,
        53:     10000,
        54:     10000,
        55:     12000,
        56:     15000,
        57:     19000,
        58:     22000,
        59:     25000,
        60:     27000,
        61:     29000,
        62:     32000,
        63:     32000,
        64:     32000,
        65:     35000,
        66:     35000,
        67:     35000,
        67:     39000,
        68:     43000,
        69:     43000,
        70:     45000,
        71:     50000,
    },

    arenaUpgrades: {
        1: { maxSpeed: 2, power: 1000, armor: 10, cannon: 5, rpm: 10 },
        2: { maxSpeed: 4, power: 1000, armor: 20, cannon: 7, rpm: 10 },
        3: { maxSpeed: 4, power: 1500, armor: 20, cannon: 5, rpm: 10 },
        4: { maxSpeed: 5, power: 2000, armor: 15, cannon: 2, rpm: 10 },
        5: { maxSpeed: 6, power: 1500, armor: 10, cannon: 3, rpm: 10 }
    },

    hull: {

        'IS2001': {
            nid:            1,
            type:           'Hull',
            id:             'IS2001',
            title:          'IS 2001',
            price: {
                coins:          10,
                levelBonuses:   0
            },
            cannon:         [ 'Plasma-g1', 'Plasma-double', 'Razer-v1' ],
            engine:         [ 'KX-v8', 'ZEL-72', 'KTZ-r1' ],
            armor:          [ 'X-shield', 'KS-shield', 'Z8-shield' ],
            default:        {
                cannon:     'Plasma-g1',
                engine:     'KX-v8',
                armor:      'X-shield'
            },
            description:    '<b>IS2001 tank</b> - default tank of Russian army in WW VII (2139 year) against other sides on first colonized planet (Mars).<br><br>By default equipped with plasma cannon of first generation, turbo diesel engine and tesla induction generator.<br><br>Easy in movement control, quite fast, powerful cannon, but gets overheated quite fast.<br><br>',
            levels:         {
                1:    { speedCoef:   1, cannonCoef:   1, armorCoef:   1, ammoCapacity: 40, price: { levelBonuses: 0, coins: 5 } },
                2:    { speedCoef: 1.1, cannonCoef: 1.1, armorCoef: 1.5, ammoCapacity: 40, price: { levelBonuses: 0, coins: 7 } },
                3:    { speedCoef: 1.1, cannonCoef: 1.2, armorCoef: 1.7, ammoCapacity: 55, price: { levelBonuses: 1, coins: 10 } },
                4:    { speedCoef: 1.2, cannonCoef: 1.3, armorCoef: 1.8, ammoCapacity: 40, price: { levelBonuses: 1, coins: 15 } },
                5:    { speedCoef: 1.3, cannonCoef: 1.5, armorCoef:   2, ammoCapacity: 55, price: { levelBonuses: 2, coins: 18 } }
            }
        },

        'TigerS8': {
            nid:            2,
            type:           'Hull',
            id:             'TigerS8',
            title:          'Tiger S8',
            price: {
                coins:          14,
                levelBonuses:   1
            },
            cannon:         [ 'Plasma-g1', 'Plasma-g2', 'Plasma-double', 'Razer-v1', 'Razer-v2' ],
            engine:         [ 'ZEL-72', 'ZEL-72s', 'KTZ-r2' ],
            armor:          [ 'KS-shield', 'Z8-shield', 'KS200-shield' ],
            default:        {
                cannon:     'Plasma-g1',
                engine:     'ZEL-72s',
                armor:      'KS-shield'
            },
            description:    '<b>Tiger S8 tank</b> - default tank of Germany army in Venus Planet War III (2140 year) against China.<br><br>By default equipped with plasma cannon of third generation, double turbo diesel engine with generator.<br><br>Is faster and has more powerful cannon than IS2001, but has problem with overheating.<br><br>',
            levels:         {
                1:    { speedCoef:   1, cannonCoef:   1, armorCoef:   1, ammoCapacity: 60, price: { levelBonuses: 0, coins:  7 } },
                2:    { speedCoef: 1.1, cannonCoef: 1.1, armorCoef: 1.5, ammoCapacity: 60, price: { levelBonuses: 0, coins: 10 } },
                3:    { speedCoef: 1.1, cannonCoef: 1.2, armorCoef: 1.7, ammoCapacity: 45, price: { levelBonuses: 1, coins: 10 } },
                4:    { speedCoef: 1.2, cannonCoef: 1.3, armorCoef: 1.8, ammoCapacity: 50, price: { levelBonuses: 1, coins: 12 } },
                5:    { speedCoef: 1.3, cannonCoef: 1.5, armorCoef:   2, ammoCapacity: 55, price: { levelBonuses: 1, coins: 13 } }
            }
        },

        'OrbitT32s': {
            nid:            3,
            type:           'Hull',
            id:             'OrbitT32s',
            title:          'Orbit T32s',
            price: {
                coins:          25,
                levelBonuses:   2
            },
            cannon:         [ 'Plasma-g1', 'Plasma-g2', 'Plasma-double', 'Plasma-triple', 'Razer-v1', 'Razer-v2', 'Mag87' ],
            engine:         [ 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armor:          [ 'KS200-shield', 'Z8-shield', 'MG-defence' ],
            default:        {
                cannon:     'Plasma-g1',
                engine:     'VAX-32',
                armor:      'Z8-shield'
            },
            description:    '<b>Orbit T32s tank</b> - 1/3 tanks of China army in Venus Planet War III (2140 year) against Germany and USA.<br><br>By default equipped with improved second version laser cannon, improved ZEL-72 engine and uranium plates armor.<br><br>',
            levels:         {
                1:    { speedCoef:   1, cannonCoef:   1, armorCoef:   1, ammoCapacity: 70, price: { levelBonuses: 0, coins: 10 } },
                2:    { speedCoef: 1.1, cannonCoef: 1.1, armorCoef: 1.5, ammoCapacity: 70, price: { levelBonuses: 1, coins: 15 } },
                3:    { speedCoef: 1.1, cannonCoef: 1.2, armorCoef: 1.7, ammoCapacity: 75, price: { levelBonuses: 1, coins: 20 } },
                4:    { speedCoef: 1.2, cannonCoef: 1.3, armorCoef: 1.8, ammoCapacity: 80, price: { levelBonuses: 1, coins: 22 } },
                5:    { speedCoef: 1.3, cannonCoef: 1.5, armorCoef:   2, ammoCapacity: 85, price: { levelBonuses: 2, coins: 25 } }
            }
        },

        'MG813': {
            nid:            4,
            type:           'Hull',
            id:             'MG813',
            title:          'MG 813',
            price: {
                coins:          45,
                levelBonuses:   3
            },
            cannon:         [ 'Plasma-double', 'Plasma-triple', 'Razer-v1', 'Razer-v2', 'Razer-double', 'Mag87', 'Mag87s' ],
            engine:         [ 'ZEL-72s', 'KTZ-r2', 'VAX-32s' ],
            armor:          [ 'X-shield', 'KS-shield', 'z8-shield' ],
            default:        {
                cannon:     'Plasma-double',
                engine:     'ZEL-72s',
                armor:      'X-shield'
            },
            description:    '<b>MG 813 tank</b> - popular tank from all sides in Earth Asia War II (2141 year).<br><br>By default equipped with double laser cannon, nice engine improved with Gallium generator core, but has light less secure X-Shield armor.<br><br>',
            levels:         {
                1:    { speedCoef:   1, cannonCoef:   1, armorCoef:   1, ammoCapacity: 60, price: { levelBonuses: 1, coins: 20 } },
                2:    { speedCoef: 1.1, cannonCoef: 1.1, armorCoef: 1.5, ammoCapacity: 60, price: { levelBonuses: 1, coins: 25 } },
                3:    { speedCoef: 1.1, cannonCoef: 1.2, armorCoef: 1.7, ammoCapacity: 65, price: { levelBonuses: 1, coins: 26 } },
                4:    { speedCoef: 1.2, cannonCoef: 1.3, armorCoef: 1.8, ammoCapacity: 70, price: { levelBonuses: 2, coins: 30 } },
                5:    { speedCoef: 1.3, cannonCoef: 1.5, armorCoef:   2, ammoCapacity: 75, price: { levelBonuses: 2, coins: 35 } }
            }
        },

        'DTEK72': {
            nid:            5,
            type:           'Hull',
            id:             'DTEK72',
            title:          'DTEK 72',
            price: {
                coins:          70,
                levelBonuses:   3
            },
            cannon:         [ 'Plasma-double', 'Plasma-triple', 'Razer-v2', 'Razer-double', 'Mag87', 'Mag87s' ],
            engine:         [ 'KTZ-r1', 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armor:          [ 'Z8-shield', 'MG-defence', 'MG-defence-v2', 'P12-shield' ],
            default:        {
                cannon:     'Plasma-double',
                engine:     'KTZ-r1',
                armor:      'Z8-shield'
            },
            description:    '<b>DTEK 72 tank</b> - rare Ukrainian tank designed in private company to defend oil wells from East Eurasian groups after Russia collapse in 2141 year.<br><br>By default equipped with triple plasma cannon, plutonium engine with partly organic generator and 80mm uranium plates armor sys.<br><br>',
            levels:         {
                1:    { speedCoef:   1, cannonCoef:   1, armorCoef:   1, ammoCapacity: 100, price: { levelBonuses: 1, coins: 40 } },
                2:    { speedCoef: 1.1, cannonCoef: 1.1, armorCoef: 1.5, ammoCapacity: 110, price: { levelBonuses: 1, coins: 50 } },
                3:    { speedCoef: 1.1, cannonCoef: 1.2, armorCoef: 1.7, ammoCapacity: 125, price: { levelBonuses: 2, coins: 60 } },
                4:    { speedCoef: 1.2, cannonCoef: 1.3, armorCoef: 1.8, ammoCapacity: 130, price: { levelBonuses: 2, coins: 80 } },
                5:    { speedCoef: 1.3, cannonCoef: 1.5, armorCoef:   2, ammoCapacity: 145, price: { levelBonuses: 3, coins: 85 } }
            }
        },

        'RiperX3': {
            nid:            6,
            type:           'Hull',
            id:             'RiperX3',
            title:          'Riper X3',
            price: {
                coins:          100,
                levelBonuses:   4
            },
            cannon:         [ 'Plasma-double', 'Plasma-triple', 'Plasma-zero', 'Razer-v2', 'Razer-double', 'Mag87', 'Mag87s', 'Mag87s-turbo' ],
            engine:         [ 'KTZ-r2', 'VAX-32s', 'VAX-32v2' ],
            armor:          [ 'MG-defence', 'MG-defence-v2', 'T215'],
            default:        {
                cannon:     'Plasma-double',
                engine:     'KTZ-r2',
                armor:      'MG-defence'
            },
            description:    '<b>Riper X3</b> - very powerful elite tank of United Korean Forces in Second War for Moon "Space Harbor" (2143 year).<br><br>By default equipped with special plasma cannon which solved problem of overheating, but this costs lots of energy consumption and lower movement speed and has new light graphene-type armor.<br><br>',
            levels:         {
                1:    { speedCoef:   1, cannonCoef:   1, armorCoef:   1, ammoCapacity: 110, price: { levelBonuses: 2, coins:  70 } },
                2:    { speedCoef: 1.1, cannonCoef: 1.1, armorCoef: 1.5, ammoCapacity: 130, price: { levelBonuses: 2, coins:  85 } },
                3:    { speedCoef: 1.1, cannonCoef: 1.2, armorCoef: 1.7, ammoCapacity: 145, price: { levelBonuses: 3, coins: 100 } },
                4:    { speedCoef: 1.2, cannonCoef: 1.3, armorCoef: 1.8, ammoCapacity: 150, price: { levelBonuses: 3, coins: 120 } },
                5:    { speedCoef: 1.3, cannonCoef: 1.5, armorCoef:   2, ammoCapacity: 165, price: { levelBonuses: 4, coins: 140 } }
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
            shootType:      'bullet',
            levels:         {
                1:      { damage: 20, range: 200, overheat: 200, rpm: 140, price: { levelBonuses: 0, coins:  5 } },
                2:      { damage: 25, range: 210, overheat: 250, rpm: 160, price: { levelBonuses: 0, coins:  8 } },
                3:      { damage: 28, range: 220, overheat: 220, rpm: 170, price: { levelBonuses: 0, coins: 10 } },
                4:      { damage: 32, range: 230, overheat: 180, rpm: 180, price: { levelBonuses: 1, coins: 10 } },
                5:      { damage: 35, range: 240, overheat: 200, rpm: 200, price: { levelBonuses: 1, coins: 12 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle: 0, offset: 25, y: 20 }
            ],
            price: {
                coins:          8,
                levelBonuses:   0
            },
        },

        'Plasma-g2': {
            nid:            102,
            type:           'Cannon',
            id:             'Plasma-g2',
            title:          'Plasma g2',
            description:    '',
            shortDesc:      'Plasma cannon second Gen.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 30, range: 200, overheat: 210, rpm: 140, price: { levelBonuses: 0, coins:  7 } },
                2:      { damage: 33, range: 210, overheat: 220, rpm: 150, price: { levelBonuses: 0, coins:  8 } },
                3:      { damage: 36, range: 220, overheat: 230, rpm: 150, price: { levelBonuses: 1, coins: 10 } },
                4:      { damage: 42, range: 230, overheat: 210, rpm: 170, price: { levelBonuses: 1, coins: 12 } },
                5:      { damage: 50, range: 250, overheat: 190, rpm: 190, price: { levelBonuses: 2, coins: 13 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle: 0, offset: 25, y: 20 }
            ],
            price: {
                coins:          12,
                levelBonuses:   0
            },
        },

        'Plasma-double': {
            nid:            103,
            type:           'Cannon',
            id:             'Plasma-double',
            title:          'Plasma double',
            description:    '',
            shortDesc:      'Plasma cannon with double oscillator.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 30, range: 180, overheat: 270, rpm: 120, price: { levelBonuses: 0, coins: 13 } },
                2:      { damage: 33, range: 200, overheat: 280, rpm: 120, price: { levelBonuses: 0, coins: 16 } },
                3:      { damage: 35, range: 210, overheat: 300, rpm: 120, price: { levelBonuses: 1, coins: 18 } },
                4:      { damage: 37, range: 210, overheat: 280, rpm: 120, price: { levelBonuses: 1, coins: 19 } },
                5:      { damage: 40, range: 220, overheat: 290, rpm: 120, price: { levelBonuses: 2, coins: 20 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle:   0.16, offset: 25, y: 20 },
                { dAngle: - 0.16, offset: 25, y: 20 }
            ],
            price: {
                coins:          20,
                levelBonuses:   0
            },
        },

        'Plasma-triple': {
            nid:            104,
            type:           'Cannon',
            id:             'Plasma-triple',
            title:          'Plasma triple',
            description:    '',
            shortDesc:      'Plasma cannon with triple oscillator.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 20, range: 170, overheat: 330, rpm: 120, price: { levelBonuses: 0, coins: 20 } },
                2:      { damage: 23, range: 170, overheat: 320, rpm: 125, price: { levelBonuses: 1, coins: 30 } },
                3:      { damage: 26, range: 170, overheat: 310, rpm: 130, price: { levelBonuses: 1, coins: 50 } },
                4:      { damage: 30, range: 170, overheat: 300, rpm: 130, price: { levelBonuses: 1, coins: 80 } },
                5:      { damage: 40, range: 170, overheat: 290, rpm: 135, price: { levelBonuses: 2, coins: 100 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle:   0.10, offset: 25, y: 21 },
                { dAngle:   0.00, offset: 25, y: 23 },
                { dAngle: - 0.10, offset: 25, y: 21 }
            ],
            price: {
                coins:          40,
                levelBonuses:   0
            },
        },

        'Plasma-zero': {
            nid:            105,
            type:           'Cannon',
            id:             'Plasma-zero',
            title:          'Plasma zero',
            description:    '',
            shortDesc:      'Plasma cannon with zero heat release.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 35, range: 170, overheat: 0, rpm: 150, price: { levelBonuses: 0, coins: 25 } },
                2:      { damage: 35, range: 170, overheat: 0, rpm: 155, price: { levelBonuses: 1, coins: 35 } },
                3:      { damage: 35, range: 170, overheat: 0, rpm: 165, price: { levelBonuses: 1, coins: 40 } },
                4:      { damage: 35, range: 170, overheat: 0, rpm: 180, price: { levelBonuses: 2, coins: 40 } },
                5:      { damage: 35, range: 170, overheat: 0, rpm: 190, price: { levelBonuses: 2, coins: 50 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle:   0.00, offset: 30, y: 23 }
            ],
            price: {
                coins:          50,
                levelBonuses:   0
            },
        },

        // Laser cannons

        'Razer-v1': {
            nid:            106,
            type:           'Cannon',
            id:             'Razer-v1',
            title:          'Razer v1',
            description:    '',
            shortDesc:      'Laser cannon first prototype',
            shootType:      'laser',
            levels:         {
                1:      { damage: 8, range: 170, overheat: 10, rpm: 600, price: { levelBonuses: 1, coins: 35 } },
                2:      { damage: 9, range: 170, overheat: 10, rpm: 600, price: { levelBonuses: 1, coins: 40 } },
                3:      { damage: 10, range: 170, overheat: 10, rpm: 600, price: { levelBonuses: 1, coins: 47 } },
                4:      { damage: 11, range: 170, overheat: 11, rpm: 600, price: { levelBonuses: 2, coins: 54 } },
                5:      { damage: 12, range: 170, overheat: 12, rpm: 600, price: { levelBonuses: 2, coins: 57 } }
            },
            shotSpeed:      1,
            shootInfo: [
                { dAngle: 0, offset: 40, y: 20 }
            ],
            price: {
                coins:          70,
                levelBonuses:   0
            },
        },

        'Razer-v2': {
            nid:            107,
            type:           'Cannon',
            id:             'Razer-v2',
            title:          'Razer v2',
            description:    '',
            shortDesc:      'Second prototype version of laser cannon',
            shootType:      'laser',
            levels:         {
                1:      { damage: 9, range: 200, overheat: 10, rpm: 600, price: { levelBonuses: 1, coins: 40 } },
                2:      { damage: 10, range: 200, overheat: 11, rpm: 600, price: { levelBonuses: 1, coins: 45 } },
                3:      { damage: 11, range: 200, overheat: 11, rpm: 600, price: { levelBonuses: 1, coins: 52 } },
                4:      { damage: 12, range: 200, overheat: 10, rpm: 600, price: { levelBonuses: 2, coins: 56 } },
                5:      { damage: 13, range: 200, overheat: 11, rpm: 600, price: { levelBonuses: 2, coins: 72 } }
            },
            shotSpeed:      1,
            shootInfo: [
                { dAngle: 0, offset: 40, y: 20 }
            ],
            price: {
                coins:          95,
                levelBonuses:   0
            },
        },

        'Razer-double': {
            nid:            108,
            type:           'Cannon',
            id:             'Razer-double',
            title:          'Razer double',
            description:    '',
            shortDesc:      'Original Razer cannon with double oscillator core.',
            shootType:      'laser',
            levels:         {
                1:      { damage:  8, range: 190, overheat: 10, rpm: 600, price: { levelBonuses: 1, coins: 35 } },
                2:      { damage:  9, range: 190, overheat: 10, rpm: 600, price: { levelBonuses: 1, coins: 40 } },
                3:      { damage: 10, range: 190, overheat: 10, rpm: 600, price: { levelBonuses: 2, coins: 47 } },
                4:      { damage: 11, range: 190, overheat: 10, rpm: 600, price: { levelBonuses: 2, coins: 54 } },
                5:      { damage: 12, range: 190, overheat: 10, rpm: 600, price: { levelBonuses: 3, coins: 57 } }
            },
            shotSpeed:      1,
            shootInfo: [
                { dAngle: - 1.3, offset: 20, y: 16 },
                { dAngle:   1.3, offset: 20, y: 16 }
            ],
            price: {
                coins:          130,
                levelBonuses:   0
            },
        },

        // Magnet cannons

        'Mag87': {
            nid:            110,
            type:           'Cannon',
            id:             'Mag87',
            title:          'Mag 87',
            description:    '',
            shortDesc:      'Magnet cannon v87 release.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 13, range: 220, overheat: 80, rpm: 450, price: { levelBonuses: 1, coins: 50 } },
                2:      { damage: 14, range: 230, overheat: 80, rpm: 460, price: { levelBonuses: 2, coins: 53 } },
                3:      { damage: 15, range: 230, overheat: 80, rpm: 470, price: { levelBonuses: 2, coins: 55 } },
                4:      { damage: 16, range: 240, overheat: 80, rpm: 480, price: { levelBonuses: 2, coins: 58 } },
                5:      { damage: 17, range: 240, overheat: 80, rpm: 500, price: { levelBonuses: 3, coins: 60 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle: 0, offset: 25, y: 20 }
            ],
            price: {
                coins:          160,
                levelBonuses:   0
            },
        },

        'Mag87s': {
            nid:            111,
            type:           'Cannon',
            id:             'Mag87s',
            title:          'Mag 87S',
            description:    '',
            shortDesc:      'Improved magnet cannon v87S.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 10, range: 220, overheat: 65, rpm: 550, price: { levelBonuses: 1, coins: 60 } },
                2:      { damage: 12, range: 230, overheat: 65, rpm: 560, price: { levelBonuses: 2, coins: 66 } },
                3:      { damage: 13, range: 230, overheat: 65, rpm: 570, price: { levelBonuses: 2, coins: 70 } },
                4:      { damage: 14, range: 240, overheat: 65, rpm: 580, price: { levelBonuses: 2, coins: 75 } },
                5:      { damage: 15, range: 240, overheat: 65, rpm: 620, price: { levelBonuses: 3, coins: 80 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle: 0, offset: 25, y: 20 }
            ],
            price: {
                coins:          180,
                levelBonuses:   0
            },
        },

        'Mag87s-turbo': {
            nid:            112,
            type:           'Cannon',
            id:             'Mag87s-turbo',
            title:          'Mag 87s turbo',
            description:    '',
            shortDesc:      'Magnet cannon v87s turbo version.',
            shootType:      'bullet',
            levels:         {
                1:      { damage: 8, range: 220, overheat: 80, rpm: 650, price: { levelBonuses: 2, coins: 70 } },
                2:      { damage: 9, range: 230, overheat: 80, rpm: 660, price: { levelBonuses: 2, coins: 76 } },
                3:      { damage: 10, range: 230, overheat: 80, rpm: 670, price: { levelBonuses: 2, coins: 82 } },
                4:      { damage: 12, range: 240, overheat: 80, rpm: 680, price: { levelBonuses: 3, coins: 86 } },
                5:      { damage: 13, range: 240, overheat: 80, rpm: 720, price: { levelBonuses: 4, coins: 90 } }
            },
            shotSpeed:      1.8,
            shootInfo: [
                { dAngle: 0.28, offset: 45, y: 21 }
            ],
            price: {
                coins:          220,
                levelBonuses:   0
            },
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
            levels:         {
                1:      { maxSpeed: 50, power: 24000, price: { levelBonuses: 0, coins: 4 } },
                2:      { maxSpeed: 52, power: 26000, price: { levelBonuses: 0, coins: 5 } },
                3:      { maxSpeed: 53, power: 27000, price: { levelBonuses: 0, coins: 7 } },
                4:      { maxSpeed: 55, power: 28000, price: { levelBonuses: 0, coins: 7 } },
                5:      { maxSpeed: 57, power: 30000, price: { levelBonuses: 1, coins: 8 } }
            },
            price: {
                coins:          10,
                levelBonuses:   0
            }
        },

        'ZEL-72': {
            nid:            202,
            type:           'Engine',
            id:             'ZEL-72',
            title:          'ZEL 72',
            description:    '',
            shortDesc:      'Double turbo diesel 1.8k HP engine with tesla induction generator.',
            levels:         {
                1:      { maxSpeed: 52, power: 28000, price: { levelBonuses: 0, coins: 4 } },
                2:      { maxSpeed: 53, power: 30000, price: { levelBonuses: 0, coins: 5 } },
                3:      { maxSpeed: 55, power: 32000, price: { levelBonuses: 1, coins: 7 } },
                4:      { maxSpeed: 56, power: 33000, price: { levelBonuses: 1, coins: 7 } },
                5:      { maxSpeed: 57, power: 35000, price: { levelBonuses: 1, coins: 8 } }
            },
            price: {
                coins:          20,
                levelBonuses:   0
            }
        },

        'ZEL-72s': {
            nid:            203,
            type:           'Engine',
            id:             'ZEL-72s',
            title:          'ZEL 72s',
            description:    '',
            shortDesc:      'Double turbo diesel 2.1k HP engine with tesla induction generator with Gallium winding.',
            levels:         {
                1:      { maxSpeed: 54, power: 33000, price: { levelBonuses: 0, coins:  7 } },
                2:      { maxSpeed: 56, power: 35000, price: { levelBonuses: 0, coins:  8 } },
                3:      { maxSpeed: 57, power: 38000, price: { levelBonuses: 1, coins:  8 } },
                4:      { maxSpeed: 58, power: 40000, price: { levelBonuses: 1, coins: 10 } },
                5:      { maxSpeed: 59, power: 43000, price: { levelBonuses: 1, coins: 12 } }
            },
            price: {
                coins:          35,
                levelBonuses:   0
            },
        },

        'KTZ-r1': {
            nid:            204,
            type:           'Engine',
            id:             'KTZ-r1',
            title:          'KTZ r1',
            description:    '',
            shortDesc:      'Plutonium 3.2k HP engine with organic-based generator.',
            levels:         {
                1:      { maxSpeed: 54, power: 33000, price: { levelBonuses: 1, coins:  7 } },
                2:      { maxSpeed: 56, power: 35000, price: { levelBonuses: 1, coins:  8 } },
                3:      { maxSpeed: 57, power: 38000, price: { levelBonuses: 1, coins:  8 } },
                4:      { maxSpeed: 58, power: 40000, price: { levelBonuses: 1, coins: 10 } },
                5:      { maxSpeed: 59, power: 43000, price: { levelBonuses: 1, coins: 12 } }
            },
            price: {
                coins:          45,
                levelBonuses:   0
            }
        },

        'KTZ-r2': {
            nid:            205,
            type:           'Engine',
            id:             'KTZ-r2',
            title:          'KTZ r2',
            description:    '',
            shortDesc:      'Improved plutonium 3.4k HP engine with organic-based generator.',
            levels:         {
                1:      { maxSpeed: 56, power: 36000, price: { levelBonuses: 1, coins: 15 } },
                2:      { maxSpeed: 58, power: 37000, price: { levelBonuses: 1, coins: 18 } },
                3:      { maxSpeed: 60, power: 38000, price: { levelBonuses: 1, coins: 20 } },
                4:      { maxSpeed: 62, power: 41000, price: { levelBonuses: 1, coins: 23 } },
                5:      { maxSpeed: 65, power: 44000, price: { levelBonuses: 2, coins: 25 } }
            },
            price: {
                coins:          60,
                levelBonuses:   0
            },
        },

        'VAX-32': {
            nid:            206,
            type:           'Engine',
            id:             'VAX-32',
            title:          'VAX 32',
            description:    '',
            shortDesc:      'Polonium ARK 3.7k HP engine with generator and Lithium batteries.',
            levels:         {
                1:      { maxSpeed: 60, power: 36000, price: { levelBonuses: 1, coins: 20 } },
                2:      { maxSpeed: 61, power: 38000, price: { levelBonuses: 1, coins: 22 } },
                3:      { maxSpeed: 63, power: 42000, price: { levelBonuses: 1, coins: 24 } },
                4:      { maxSpeed: 65, power: 44000, price: { levelBonuses: 2, coins: 28 } },
                5:      { maxSpeed: 68, power: 48000, price: { levelBonuses: 2, coins: 30 } }
            },
            price: {
                coins:          80,
                levelBonuses:   0
            }
        },

        'VAX-32s': {
            nid:            207,
            type:           'Engine',
            id:             'VAX-32s',
            title:          'VAX 32s',
            description:    '',
            shortDesc:      'Improved polonium ARK 4.2k HP engine.',
            levels:         {
                1:      { maxSpeed: 60, power: 36000, price: { levelBonuses: 1, coins: 20 } },
                2:      { maxSpeed: 61, power: 38000, price: { levelBonuses: 1, coins: 22 } },
                3:      { maxSpeed: 63, power: 42000, price: { levelBonuses: 2, coins: 24 } },
                4:      { maxSpeed: 65, power: 44000, price: { levelBonuses: 2, coins: 28 } },
                5:      { maxSpeed: 68, power: 48000, price: { levelBonuses: 3, coins: 30 } }
            },
            price: {
                coins:          100,
                levelBonuses:   0
            }
        },

        'VAX-32v2': {
            nid:            208,
            type:           'Engine',
            id:             'VAX-32v2',
            title:          'VAX 32v2',
            description:    '',
            shortDesc:      'Modified VAX32s with Cesium core, 4.6k HP.',
            levels:         {
                1:      { maxSpeed: 63, power: 32000, price: { levelBonuses: 1, coins: 25 } },
                2:      { maxSpeed: 65, power: 40000, price: { levelBonuses: 2, coins: 27 } },
                3:      { maxSpeed: 66, power: 45000, price: { levelBonuses: 2, coins: 29 } },
                4:      { maxSpeed: 68, power: 48000, price: { levelBonuses: 2, coins: 34 } },
                5:      { maxSpeed: 71, power: 50000, price: { levelBonuses: 3, coins: 40 } }
            },
            price: {
                coins:          130,
                levelBonuses:   0
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
            levels:         {
                1:      { armor: 30, price: { levelBonuses: 0, coins:  3 } },
                2:      { armor: 33, price: { levelBonuses: 0, coins:  5 } },
                3:      { armor: 36, price: { levelBonuses: 0, coins:  7 } },
                4:      { armor: 40, price: { levelBonuses: 0, coins:  8 } },
                5:      { armor: 50, price: { levelBonuses: 1, coins: 10 } }
            },
            price: {
                coins:          10,
                levelBonuses:   0
            }
        },

        'KS-shield': {
            nid:            302,
            type:           'Armor',
            id:             'KS-shield',
            title:          'KS Shield',
            description:    '',
            shortDesc:      '20mm Iridium armor.',
            levels:         {
                1:      { armor: 40, price: { levelBonuses: 0, coins:  6 } },
                2:      { armor: 45, price: { levelBonuses: 0, coins: 10 } },
                3:      { armor: 48, price: { levelBonuses: 0, coins: 12 } },
                4:      { armor: 55, price: { levelBonuses: 1, coins: 13 } },
                5:      { armor: 65, price: { levelBonuses: 1, coins: 15 } }
            },
            price: {
                coins:          20,
                levelBonuses:   0
            }
        },

        'KS200-shield': {
            nid:            303,
            type:           'Armor',
            id:             'KS200-shield',
            title:          'KS200 Shield',
            description:    '',
            shortDesc:      '35mm Iridium armor with active barrier.',
            levels:         {
                1:      { armor: 45, price: { levelBonuses: 0, coins: 10 } },
                2:      { armor: 50, price: { levelBonuses: 0, coins: 13 } },
                3:      { armor: 55, price: { levelBonuses: 1, coins: 16 } },
                4:      { armor: 65, price: { levelBonuses: 1, coins: 18 } },
                5:      { armor: 72, price: { levelBonuses: 1, coins: 20 } }
            },
            price: {
                coins:          35,
                levelBonuses:   0
            }
        },

        'Z8-shield': {
            nid:            304,
            type:           'Armor',
            id:             'Z8-shield',
            title:          'Z8 Shield',
            description:    '',
            shortDesc:      '80mm uranium plates armor.',
            levels:         {
                1:      { armor: 50, price: { levelBonuses: 0, coins: 15 } },
                2:      { armor: 56, price: { levelBonuses: 1, coins: 18 } },
                3:      { armor: 64, price: { levelBonuses: 1, coins: 20 } },
                4:      { armor: 72, price: { levelBonuses: 1, coins: 22 } },
                5:      { armor: 85, price: { levelBonuses: 1, coins: 25 } }
            },
            price: {
                coins:          45,
                levelBonuses:   0
            }
        },

        'MG-defence': {
            nid:            305,
            type:           'Armor',
            id:             'MG-defence',
            title:          'MG Defence',
            description:    '',
            shortDesc:      '3mm graphene nanotubes plates armor.',
            levels:         {
                1:      { armor:  65, price: { levelBonuses: 0, coins: 18 } },
                2:      { armor:  72, price: { levelBonuses: 1, coins: 20 } },
                3:      { armor:  84, price: { levelBonuses: 1, coins: 24 } },
                4:      { armor:  90, price: { levelBonuses: 1, coins: 26 } },
                5:      { armor: 100, price: { levelBonuses: 2, coins: 30 } }
            },
            price: {
                coins:          55,
                levelBonuses:   0
            }
        },

        'MG-defence-v2': {
            nid:            306,
            type:           'Armor',
            id:             'MG-defence-v2',
            title:          'MG Defence v2',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            levels:         {
                1:      { armor:  75, price: { levelBonuses: 1, coins: 23 } },
                2:      { armor:  90, price: { levelBonuses: 1, coins: 27 } },
                3:      { armor: 100, price: { levelBonuses: 2, coins: 29 } },
                4:      { armor: 110, price: { levelBonuses: 2, coins: 32 } },
                5:      { armor: 130, price: { levelBonuses: 2, coins: 35 } }
            },
            price: {
                coins:          70,
                levelBonuses:   0
            }
        },

        'P12-shield': {
            nid:            307,
            type:           'Armor',
            id:             'P12-shield',
            title:          'P12 shield',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            price:          85,
            levels:         {
                1:      { armor:  90, price: { levelBonuses: 0, coins: 35 } },
                2:      { armor: 100, price: { levelBonuses: 1, coins: 38 } },
                3:      { armor: 115, price: { levelBonuses: 1, coins: 43 } },
                4:      { armor: 135, price: { levelBonuses: 1, coins: 48 } },
                5:      { armor: 150, price: { levelBonuses: 2, coins: 50 } }
            },
            price: {
                coins:          85,
                levelBonuses:   0
            }
        },

        'P12.5-shield': {
            nid:            308,
            type:           'Armor',
            id:             'P12.5-shield',
            title:          'P12.5 shield',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with Adamantium strings.',
            levels:         {
                1:      { armor: 110, price: { levelBonuses: 1, coins: 45 } },
                2:      { armor: 120, price: { levelBonuses: 1, coins: 50 } },
                3:      { armor: 135, price: { levelBonuses: 2, coins: 54 } },
                4:      { armor: 155, price: { levelBonuses: 2, coins: 58 } },
                5:      { armor: 170, price: { levelBonuses: 2, coins: 60 } }
            },
            price: {
                coins:          100,
                levelBonuses:   0
            },
        },

        'T215-armor': {
            nid:            309,
            type:           'Armor',
            id:             'T215-armor',
            title:          'T215 armor',
            description:    '',
            shortDesc:      '5mm graphene nanotubes plates with adamantium strings.',
            price:          120,
            levels:         {
                1:      { armor: 135, price: { levelBonuses: 1, coins: 50 } },
                2:      { armor: 150, price: { levelBonuses: 2, coins: 55 } },
                3:      { armor: 165, price: { levelBonuses: 2, coins: 60 } },
                4:      { armor: 180, price: { levelBonuses: 3, coins: 62 } },
                5:      { armor: 200, price: { levelBonuses: 3, coins: 70 } }
            },
            price: {
                coins:          120,
                levelBonuses:   0
            }
        }

    }

};

//

module.exports = GarageConfig;
