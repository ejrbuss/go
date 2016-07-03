var story = [
    { // Level 1
        scenes: [
            {
                text: 'Placeholder story text.\nNewlines have to be added manually.', // Text that will scroll across the screen
                name: 'Granny',                                                       // Name of the character speaking
                color: select1,                                                       // Color of name tag section
                character: '1',                                                       // Character image name
                background: '0',                                                      // Background image name
            }, {
                text: 'Here is more text showing what pressing next\nis like.',
                name: 'Granny',
                color: select1,
                character: '1',
                background: '1',   
            }, {
                text: 'Here is a character swap.',
                name: 'Claws',
                color: accent,
                character: '3',
                background: '1',   
            },
        ],
        game: {
            size: 9,               // Board size
            ai: 'AIC',             // Ai to use
            color: select1,        // Color of the obard
            background: '1'        // Backgroudn image
        }
    }, { // Level 2
        scenes: [
            {
                text: 'Testing the text',
                name: 'Jhonny',
                color: select2,
                character: '2',
                background: '2',   
            }
        ],
        game: {
            size: 9,
            ai: 'AI2',
            color: select2,
            background: '2'
        }
    }, { // Level 3
        scenes: [
            {
                text: 'Testing the text',
                name: 'Claws',
                color: accent,
                character: '3',
                background: '3',   
            }
        ],
        game: {
            size: 9,
            ai: 'AI2',
            color: accent,
            background: '3'
        }
    }, { // Level 4
        scenes: [
            {
                text: 'Testing the text',
                name: 'Joker',
                color: select1,
                character: '4',
                background: '4',   
            }
        ],
        game: {
            size: 9,
            ai: 'AI2',
            color: select1,
            background: '4'
        }
    }, { // Level 5
        scenes: [
            {
                text: 'Testing the text',
                name: 'Admin',
                color: select2,
                character: '5',
                background: '5',   
            }
        ],
        game: {
            size: 9,
            ai: 'AI2',
            color: select2,
            background: '5'
        }
    }
]

