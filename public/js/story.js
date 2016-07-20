var stages = [
    {
        background: 1,
        color: accent,
        select: select1,
    }, {
        background: 2,
        color: accent,
        select: select1,
    }, {
        background: 3,
        color: accent,
        select: select1,
    }, {
        background: 4,
        color: accent,
        select: select1,
    }, {
        background: 5,
        color: accent,
        select: select1,
    },
];
var story = [
    { // Level 1
        scenes: [
            {
                text: 'The next diagram we will discuss is the “out-insertion diagram”,\n it is used to describe object oriented design systems architecture methodology design. \nThis square represents a component.', // Text that will scroll across the screen
                name: 'Simon',                                                       // Name of the character speaking
                color: simon,                                                       // Color of name tag section
                character: 'cat1',                                                       // Character image name
                background: '0',                                                      // Background image name
            }, {
                text: 'This square with a slightly smaller square inside it represents \nan open interface. This square with a dotted line border, where if you look \n',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'closely the dots are actually tiny stars, \nthat\'s important, represents an interface that is depressed since nobody wants to use it. \nThis squiggly line followed by a randomized ASCII character is…',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'WHOAHH',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: 'fire',   
            }, {
                text: 'Simon, you are under arrest for violating article 2.4.6.3 \nof the requirements of space administration.',
                name: 'Rallien',
                color: rallien,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'That\'s absurd, i\'m innocent.',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'We will find out in space court. NOW COME WITH ME.',
                name: 'Rallien',
                color: rallien,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'But who will then teach these students UML?',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'No one?',
                name: 'Rallien',
                color: rallien,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'NOT ON MY WATCH!, Simon sends out GOAI',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'Haw haw haw, watch as I defeat your puny Go AI.',
                name: 'Rallien',
                color: rallien,
                character: 'rallien',
                background: '0',   
            }, {
                text: '(AI defeated)',
                name: 'Rallien',
                color: rallien,
                character: 'rallien',
                background: '0',   
            }, {
                text: 'I am running late for my next appointment, \nbut I will be back for you. \n(vanishes)',
                name: 'Rallien',
                color: rallien,
                character: 'rallien',
                background: '0',   
            }, {
                text: '... ok.',
                name: 'Player',
                color: rallien,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Oh no, he defeated my Go AI.',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: '... ok.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '0',   
            }, {
                text: 'You don\'t understand, he defeated and also captured it.',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: '... ok.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '0',   
            }, {
                text: 'No, my medical project was attached to that AI and now he has it. \nSomeone has to get it back!',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'ah.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Will you get it back for me?',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            }, {
                text: 'ok.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '0',   
            }, {
                text: 'Great. You are currently not powerful enough to take on soldiers of the space empire. \nYou must seek Sensei Caleb, he will train you in the arts of Go. \nGo now! There is no time to waste.',
                name: 'Simon',
                color: simon,
                character: 'cat1',
                background: '0',   
            },
             {
                text: 'Greetings my child. What brings you to my humble oasis?',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'Simon told me to go here.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'ah, I sensed your approach. \nI gather you seek knowledge in the arts of Go?',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'Yes.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'then let us begin. \nWe will go through an intensive training regimen, including training your skills, \nstrategy, patience and focus.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'This journey will take many years and will require complete \ncommitment of all your efforts. First, let us learn about the history of Go.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'The game of Go is one of the oldest board games in the world. \nIt is thought to have originated from ancient China about 3,000 \nto 4,000 years ago. Due to the unknowns…',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: '... What is that?',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: '...',
                name: 'Goat',
                color: goat,
                character: 'goat',
                background: '1',   
            }, {
                text: 'It is a goat. \nAnyway, the game of Go has a long and storied history. \nBeginning with the great player of…',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'It\'s giving me this look.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: '...',
                name: 'Goat',
                color: goat,
                character: 'goat',
                background: '1',   
            }, {
                text: 'Goats can not give you "looks”. \nAnyway, beginning in the realm of ancient China, master…',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'You don\'t know that',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'Yes, I do know that. \nEverybody knows that. \nNow, please focus. In ancient China…',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'It\'s eating your flowers.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'it is an unimportance in scope of the grave worries of our paths.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'It\'s eating the fancy pink ones.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'hmm. \nThose were priceless rare flowers from the ancient monasteries of Japan. \nHowever, it is not a reason to lose one\'s temper.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'It is only nature living out her will, \nlive and let live, my child, \nfor we are but passengers on this free flowing arc of time.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'It just pooped on your lawn.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'Destroy it.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'ok.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }
        ],
        game: {
            size: 9,               // Board size
            ai: 'AI1',             // Ai to use
            stageID: 0
        },
        next: function(vc, playerModel) {
            // Update player level completed
            vc.story(playerModel, 1, 0);
        }
    }, { // Level 2
        scenes: [
            {
                text: 'Well done my child, \nyou are a better warrior than I once thought.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'Do you think I am ready to take on the empire?',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'Absolutely not. \nWe must continue your many years long training, \nonly then will you have the capability to take on the empire.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'I don\'t have time for that.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: '… fine. You must seek the Token of a Thousand Truths. \nIt is the most overpowered piece of Go paraphernalia that has ever existed, \nwith it you will gain powers you do not deserve.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'Perhaps then you may be able to defeat the empire. \nIt is rumored that the token resides deep in the Mystical Forest. \nYou must go there to find it.',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'Though, be wary young traveller, \nfor the forest is a dangerous and mysterious place. \nGo now my child, for there is no time to waste!',
                name: 'Sensei',
                color: sensei,
                character: 'sensei',
                background: '1',   
            }, {
                text: 'ok.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'Well, well, well, what have we here.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'Looks like somebody is a tad lost.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Far away from home are we?',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: '...',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'Speechless, eh, I like the silence, is peaceful.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'Yeh, silent till we start skinning em alive.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Yer not supposed to tell em that.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'Why, why does that matter. \nIt’s not like I spoiled the experience for em. \nThis isn\'t shagging Game of Thrones.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Well, it\'s a matter of the surprise isn\'t it. \nYou’re not surprised anymore are ya?',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: '...',
                name: 'Player',
                color: player,
                character: 'player1',
                background: '1',   
            }, {
                text: 'Look at that, you confused the fool.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'You always have to find problems with everything.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Well it\'s only because you can\'t appreciate some theatrics. \nSaying what we\'re going to do before we do it, what the hell is that. You don\'t go see \nHamlet and in the first 5 minutes they tell you everybody frickin dies.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'Well maybe they should, \nthen I can quickly plow off and have a smashing good romp at the tavern.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Ye\'re a hobnocker.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'Eh, the bloke\'s gettin away!',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, 
        ],
        game: {
            size: 9,
            ai: 'AI2',
            stageID: 1
        },
        next: function(vc, playerModel) {
            // Update player level completed
            vc.story(playerModel, 2, 0);
        }
    }, { // Level 3
        scenes: [
            {
                text: 'Bloody \'ell, the blighter got the best of us.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'Yeh, you got us this time, but we\'ll be watchin for you.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Step in these woods again and you\'ll have to deal with more of us.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'Well there you go again, tellin em our secrets.',
                name: 'Edgar',
                color: edgar,
                character: 'edgar',
                background: 'mystical',   
            }, {
                text: 'I\'m really getting tired of you.',
                name: 'Elfred',
                color: elfred,
                character: 'elfred',
                background: 'mystical',   
            }, {
                text: 'There it is. The Token of a Thousand Truths.',
                name: 'Player',
                color: player,
                character: 'player1',
                background: 'bright',   
            }, {
                text: '??#*??',
                name: 'Sentinel',
                color: sentinel,
                character: 'f199',
                background: 'f199',   
            }, 
        ],
        game: {
            size: 9,
            ai: 'AI3',
            stageID: 2
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
            stageID: 3
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
            stageID: 4
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

