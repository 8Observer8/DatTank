/*
 * @author ohmed
 * DatTank Garage objects
*/

export let GarageConfig = {

    tanks: {

        'IS2001': {
            title:          'IS 2001',
            price:          10,
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
            description:    '<b>IS2001 tank</b> - default tank of Russian army in WW VII (2139 year) against other sides on first colonized planet (Mars).<br><br>By default equipped with plasma cannon of first generartion, turbo diesel engine and tesla induction generator.<br><br>Easy in movement control, quite fast, powefull cannon, but gets overheated quite fast.<br><br>'
        },

        'TigerS8': {
            title:          'Tiger S8',
            price:          10,
            cannons:        [ 'Plasma-g1', 'Plasma-g2', 'Plasma-g3', 'Razer-v2' ],
            engines:        [ 'ZEL-72s', 'KTZ-r2' ],
            armors:         [ 'KS-shield', 'Z8-shield', 'KS200-shield' ],
            default:        {
                cannon:     'Plasma-g3',
                engine:     'ZEL-72s',
                armor:      'Z8-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    '<b>Tiger S8 tank</b> - default tank of Germany army in Venus Planet War III (2140 year) against China.<br><br>By default rquipped with plasma cannon of third generation, plutonium RA engine with generator.<br><br>Is faster and has more powerfull cannon than IS2001, but has problem with overheating.<br><br>'
        },

        'OrbitT32s': {
            title:          'Orbit T32s',
            price:          10,
            cannons:        [ 'Plasma-g3', 'Razer-v2', 'Razer-indigo', 'Razer-irridium' ],
            engines:        [ 'KTZ-r2', 'VAX-32', 'VAX-32s' ],
            armors:         [],
            default:        {
                cannon:     'Razer-indigo',
                engine:     'VAX-32',
                armor:      'Z8-shield'
            },
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    '<b>Orbit T32s tank</b> - '
        },

        'MG813': {
            title:          'MG 813',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:         [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    '<b>MG 813 tank</b> - '
        },

        'DTEK72': {
            title:          'DTEK 72',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:         [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    '<b>DTEK 72 tank</b> - '
        },

        'RiperX3': {
            title:          'Riper X3',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:         [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        }

    },

    cannons: {

        'Plasma-g1': {
            title:          'Plasma g1',
            description:    '',
            shortDesc:      'Plasma cannon first Gen.',
            price:          20,
            damage:         30,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Plasma-g2': {
            title:          'Plasma g2',
            description:    '',
            shortDesc:      'Plasma cannon second Gen.',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Plasma-g3': {
            title:          'Plasma g3',
            description:    '',
            shortDesc:      'Plasma cannon third Gen.',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Plasma-g5': {
            title:          'Plasma g5',
            description:    '',
            shortDesc:      'Plasma cannon fifth Gen.',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Razer-v1': {
            title:          'Razer v1',
            description:    '',
            shortDesc:      'Laser cannon first prototype',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Razer-v2': {
            title:          'Razer v2',
            description:    '',
            shortDesc:      'Second prototype version of laser cannon',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Razer-indigo': {
            title:          'Razer indigo',
            description:    '',
            shortDesc:      'Official Razer version, 30% more power',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Razer-irridium': {
            title:          'Razer irridium',
            description:    '',
            shortDesc:      'Razer with irridium core, 25% less overheating',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Razer-double': {
            title:          'Razer double',
            description:    '',
            shortDesc:      'Original Razer cannon with double core',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        },

        'Razer-quadro': {
            title:          'Razer quadro',
            description:    '',
            shortDesc:      '',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0,
            reload:         1
        }

    },

    engines: {

        'KX-v8': {
            title:          'KX v8',
            description:    '',
            shortDesc:      'Turbo diesel 1.3k HP engine with tesla induction generator.',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'ZEL-72': {
            title:          'ZEL 72',
            description:    '',
            shortDesc:      'Double turbo diesel 1.8k HP engine with tesla induction generator.',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'ZEL-72s': {
            title:          'ZEL 72s',
            description:    '',
            shortDesc:      'Double turbo diesel 2.1k HP engine with tesla induction generator with galium winding.',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'KTZ-r1': {
            title:          'KTZ r1',
            description:    '',
            shortDesc:      'Plutonium 3.2k HP engine with organic-based generator.',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'KTZ-r2': {
            title:          'KTZ r2',
            description:    '',
            shortDesc:      'Improved plutonium 3.4k HP engine with organic-based generator.',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'VAX-32': {
            title:          'VAX 32',
            description:    '',
            shortDesc:      'Polonium ARK 3.7k HP engine with generator and litium batteries.',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'VAX-32s': {
            title:          'VAX 32s',
            description:    '',
            shortDesc:      '',
            price:          30,
            power:          300,
            maxSpeed:       100
        },

        'VAX-32v2': {
            title:          'VAX 32v2',
            description:    '',
            shortDesc:      '',
            price:          30,
            power:          300,
            maxSpeed:       100
        }

    },

    armors: {

        'X-shield': {
            title:          'X Shield',
            description:    '',
            shortDesc:      'Basic 100mm irridium list.',
            price:          40,
            armor:          100
        },

        'KS-shield': {
            title:          'KS Shield',
            description:    '',
            shortDesc:      '',
            price:          40,
            armor:          100
        },

        'KS200-shield': {
            title:          'KS200 Shield',
            description:    '',
            shortDesc:      '',
            price:          40,
            armor:          100
        },

        'Z8-shield': {
            title:          'Z8 Shield',
            description:    '',
            shortDesc:      '',
            price:          40,
            armor:          100
        },

        'MG-deffence': {
            title:          'MG Deffence',
            description:    '',
            shortDesc:      '',
            price:          40,
            armor:          100
        },

        'MG-deffence-v2': {
            title:          'MG Deffence v2',
            description:    '',
            shortDesc:      '',
            price:          40,
            armor:          100
        },

        'MG-deffence-irridium': {
            title:          'MG Deffence Irridium',
            description:    '',
            shortDesc:      '',
            price:          40,
            armor:          100
        }

    }

};
