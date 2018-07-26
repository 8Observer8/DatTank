/*
 * @author ohmed
 * DatTank Garage objects
*/

export let GarageConfig = {

    tanks: {

        'IS2001': {
            title:          'IS 2001',
            price:          10,
            cannons:        [ 'Plasma-g1', 'Plasma-g2', 'Raiser-v1', 'Raiser-double' ],
            engines:        [ 'KX-v8', 'ZEL-72', 'KTZ-r1' ],
            armors:         [ 'X-shield', 'KS-shield', 'Z8-shield' ],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        },

        'TigerS8': {
            title:          'Tiger S8',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:        [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        },

        'OrbitT32s': {
            title:          'Orbit T32s',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:        [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        },

        'MG813': {
            title:          'MG 813',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:        [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        },

        'DTEK72': {
            title:          'DTEK 72',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:        [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        },

        'RiperX3': {
            title:          'Riper X3',
            price:          10,
            cannons:        [],
            engines:        [],
            armors:        [],
            speedCoef:      1,
            cannonCoef:     1,
            armorCoef:      1,
            description:    ''
        }

    },

    cannons: {

        'Plasma-g1': {
            title:          'Plasma g1',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Plasma-g2': {
            title:          'Plasma g2',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Plasma-g3': {
            title:          'Plasma g3',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Plasma-g5': {
            title:          'Plasma g5',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Raiser-v1': {
            title:          'Raiser v1',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Raiser-v2': {
            title:          'Raiser v2',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Raiser-indigo': {
            title:          'Raiser indigo',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Raiser-irridium': {
            title:          'Raiser irridium',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Raiser-double': {
            title:          'Raiser double',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        },

        'Raiser-quadro': {
            title:          'Raiser quadro',
            price:          20,
            damage:         1,
            antiArmor:      1,
            range:          0,
            overheating:    0,
            energy:         0
        }

    },

    engines: {

        'KX-v8': {
            title:          'KX v8',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        },

        'ZEL-72': {
            title:          'ZEL 72',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        },

        'ZEL-72s': {
            title:          'ZEL 72s',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        },

        'KTZ-r1': {
            title:          'KTZ r1',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        },

        'KTZ-r2': {
            title:          'KTZ r2',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        },

        'VAX-32': {
            title:          'VAX 32',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        },

        'VAX-32v2': {
            title:          'VAX 32v2',
            price:          30,
            power:          300,
            maxSpeed:       100,
            description:    ''
        }

    },

    armors: {

        'X-shield': {
            title:          'X Shield',
            price:          40,
            armor:          100,
            description:    ''
        },

        'KS-shield': {
            title:          'KS Shield',
            price:          40,
            armor:          100,
            description:    ''
        },

        'KS200-shield': {
            title:          'KS200 Shield',
            price:          40,
            armor:          100,
            description:    ''
        },

        'Z8-shield': {
            title:          'Z8 Shield',
            price:          40,
            armor:          100,
            description:    ''
        },

        'MG-deffence': {
            title:          'MG Deffence',
            price:          40,
            armor:          100,
            description:    ''
        },

        'MG-deffence-v2': {
            title:          'MG Deffence v2',
            price:          40,
            armor:          100,
            description:    ''
        },

        'MG-deffence-irridium': {
            title:          'MG Deffence Irridium',
            price:          40,
            armor:          100,
            description:    ''
        },

    }

};
