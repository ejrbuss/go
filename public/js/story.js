var story = [
    { // Level 1
        scenes: [
            {
                text: 'The next diagram we will discuss is the “out-insertion diagram”,\n it is used to describe object oriented design systems architecture methodology design. \nThis square represents a component.', // Text that will scroll across the screen
                name: 'Simon',                                                       // Name of the character speaking
                color: select1,                                                       // Color of name tag section
                character: 'cat1',                                                       // Character image name
                background: '0',                                                      // Background image name
            }, {
                text: 'This square with a slightly smaller square inside it represents \nan open interface. This square with a dotted line border, where if you look \n',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'closely the dots are actually tiny stars, \nthat\'s important, represents an interface that is depressed since nobody wants to use it. \nThis squiggly line followed by a randomized ASCII character is…',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'WHOAHH',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: 'fire',   
            }, {
                text: 'Simon, you are under arrest for violating article 2.4.6.3 \nof the requirements of space administration.',
                name: 'Rallien',
                color: accent,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'That\'s absurd, i\'m innocent.',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'We will find out in space court. NOW COME WITH ME.',
                name: 'Rallien',
                color: accent,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'But who will then teach these students UML?',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'No one?',
                name: 'Rallien',
                color: accent,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'NOT ON MY WATCH!, Simon sends out GOAI',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'Haw haw haw, watch as I defeat your puny Go AI.',
                name: 'Rallien',
                color: accent,
                character: 'rallien',
                background: '0',   
            }, {
                text: '(AI defeated)',
                name: 'Rallien',
                color: accent,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'I am running late for my next appointment, \nbut I will be back for you. \n(vanishes)',
                name: 'Rallien',
                color: accent,
                character: 'rallien',
                background: '0',   
            }, {
                text: '... ok.',
                name: 'Player',
                color: accent,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Oh no, he defeated my Go AI.',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: '... ok.',
                name: 'Player',
                color: accent,
                character: 'player1',
                background: '0',   
            }, {
                text: 'You don\'t understand, he defeated and also captured it.',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: '... ok.',
                name: 'Player',
                color: accent,
                character: 'player1',
                background: '0',   
            }, {
                text: 'No, my medical project was attached to that AI and now he has it. \nSomeone has to get it back!',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'ah.',
                name: 'Player',
                color: accent,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Will you get it back for me?',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'ok.',
                name: 'Player',
                color: accent,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Great. You are currently not powerful enough to take on soldiers of the space empire. \nYou must seek Sensei Caleb, he will train you in the arts of Go. \nGo now! There is no time to waste.',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'Greetings my child. What brings you to my humble oasis?',
                name: 'Sensei',
                color: accent,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Will you get it back for me?',
                name: 'Simon',
                color: select1,
                character: 'cat1',
                background: '0',   
            },
        ],
        game: {
            size: 9,               // Board size
            ai: 'AI1',             // Ai to use
            color: select1,        // Color of the board
            background: '1'        // Background image
        },
        next: function(vc, playerModel) {
            // Update player level completed
            vc.story(playerModel, 2, 1);
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
            ai: 'AI3',
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
            ai: 'AI5',
            color: select2,
            background: '5'
        },
        next: function(vc, playerModel) {
            vc.story(playerModel, 5, 0);
        }
    }, { // Epilogue
        scenes: [
            {
                text: 'Testing the text',
                name: 'Admin',
                color: select2,
                character: '5',
                background: '5',   
            }
        ],
        next: function(vc, playerModel) {
            vc.mainMenu(playerModel);
        }
        
    }
]

