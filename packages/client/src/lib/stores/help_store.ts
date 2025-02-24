import { writable } from 'svelte/store';

interface HelpContent {
    description: string;
    usage?: string;
    examples?: string[];
}

interface HelpState {
    currentText: string;
    isVisible: boolean;
    commands: Record<string, HelpContent>;
    helpTexts: Record<string, HelpContent>;
    topic?: string;
}

const helpTexts: Record<string, HelpContent> = {
    'default': {
        description: 'Type "help close" to close this window\n' +
                    '--------------------------------\n' +
                    'Command Syntax:\n' +
                    'The parser understands natural language like "I want to open the door" or\n' +
                    '"please kick the ball at the troll", but you can save typing by using\n' +
                    'shorter forms like "open door", "kick ball troll", or just "n" for "go north".\n' +
                    'Most commands follow the pattern: <verb> <object> [target/direction]\n' +
                    '--------------------------------\n' +
                    'Available commands:\n' +
                    'help <topic> - Show help for a specific topic\n' +
                    '\nTopics:\n' +
                    'move        - Navigate through the world\n' +
                    'look        - Examine your surroundings\n' +
                    'burn        - Burn an object\n' +
                    'light       - Light a object like a lantern or synonym for burn/ignite\n' +
                    'ignite      - Set on fire\n' +
                    'spawn       - Create a new world instance\n' +
                    'take        - Take an object\n' +
                    'help        - Display available commands and their usage\n' +
                    'pour        - Pour a liquid\n' +
                    'soak        - Soak an object\n' +
                    'empty       - Empty a container\n' +
                    'close       - Close this help window\n' +
                    'hear        - Control ambient sounds'
    },
    'close': {
        description: 'Close a thing requires a noun',
        usage: 'close [the] <noun>',
        examples: ['close door', 'close the door']
    },
    'go': {
        description: 'Move through the world in a specific direction\n can also just use direction',
        usage: 'go <direction>',
        examples: ['go north', 'go south', 'go east', 'go west', 'go up', 'go down', 'north', 'south', '...']
    },
    'look': {
        description: 'Examine your surroundings or specific objects',
        usage: 'look [around]\nlook at <object>',
        examples: ['look', 'look around', 'look at tree']
    },
    'burn': {
        description: 'Set objects on fire - requires a fire source',
        usage: 'burn <object>',
        examples: ['burn papers', 'burn the wood', 'I want to burn this']
    },
    'light': {
        description: 'Illuminate areas or ignite objects',
        usage: 'light <object>',
        examples: ['light torch', 'light the lantern', 'I want to light this area']
    },
    'ignite': {
        description: 'Start fires - similar to light and burn',
        usage: 'ignite <object>',
        examples: ['ignite fuel', 'ignite the fire', 'I want to ignite this']
    },
    'pour': {
        description: 'Empty liquid containers in a specific direction',
        usage: 'pour <liquid> [on <target>]',
        examples: ['pour water', 'pour water on fire', 'I want to pour this out']
    },
    'soak': {
        description: 'Saturate objects with liquid',
        usage: 'soak <object> [in <liquid>]',
        examples: ['soak cloth', 'soak it in water', 'I want to soak this']
    },
    'empty': {
        description: 'Remove contents from containers',
        usage: 'empty <container>',
        examples: ['empty chest', 'empty the bag', 'I want to empty this']
    },
    'hear': {
        description: 'Control the ambient sound system',
        usage: 'hear wind [on|off]\nhear tone [on|off]\nhear help',
        examples: [
            'hear wind off',
            'hear wind on',
            'hear tone off',
            'hear tone on'
        ]
    },
    'spawn': {
        description: 'Create a new world instance',
        usage: 'spawn',
        examples: ['spawn']
    }
};

function createHelpStore() {
    const initialState: HelpState = {
        currentText: '',
        isVisible: false,
        helpTexts: helpTexts,
        commands: {
            'help': {
                description: 'Open the help window.',
                usage: 'help [command]\nwhere [command] is passed will print long form.',
                examples: ['help', 'help jump']
            },
            'help list': {
                description: 'Show the list of verbs',
                usage: 'help list',
            },
            'help help': {
                description: 'Show the help for help!',
                usage: 'help help',
            },
            'help-close': {
                description: 'Close the help window.',
                usage: 'help-close',
            },
            'spawn': {
                description: 'Create a new world instance',
                usage: 'spawn',
            },
            'clear': {
                description: 'Clear the terminal screen',
                usage: 'clear'
            },
            'debug': {
                description: 'Toggle the debug window',
                usage: 'debug'
            }
        }
    };

    const { subscribe, set, update } = writable<HelpState>(initialState);

    return {
        subscribe,
        showHelp: (command?: string) => {
            const newText = getHelpText({ ...initialState, helpTexts, commands: initialState.commands }, command);
            console.log('Updating help text to:', newText); // Debug log
            update(state => ({
                ...state,
                currentText: newText,
                isVisible: true,
                topic: command
            }));
        },
        hide: () => {
            update(state => ({ ...state, isVisible: false }));
        },
    };
}

function getHelpText(state: HelpState, command?: string): string {
    // If no command, show basic help with commands
    if (!command) {
        return `Available basic commands for main terminal:\n\n${
            Object.entries(state.commands)
                .map(([cmd, content]) => 
                    `${cmd.padEnd(10)} - ${content.description}`)
                .join('\n')
        }\n\nType 'help <command>' for more information about a specific command.`;
    }

    // If "help list", show all available verbs from helpTexts
    if (command.toLowerCase() === 'list') {
        console.log('------> LIST');
        const verbs = Object.keys(state.helpTexts)
            .filter(key => key !== 'default')
            .sort();
        
        return 'Available verbs:\n\n' + 
               verbs.map(verb => `${verb.padEnd(15)}`).join('\n') +
               '\n\nUse "help <verb>" for detailed information about each verb.';
    }

    // Check helpTexts for detailed verb help
    const helpContent = state.helpTexts[command];
    if (helpContent) {
        console.log('HLP:--------> found cmd: ', command);
        let output = `${command.toUpperCase()}\n`;
        output += `\nDescription:\n  ${helpContent.description}`;
        
        if (helpContent.usage) {
            output += `\n\nUsage:\n  ${helpContent.usage}`;
        }
        
        if (helpContent.examples?.length) {
            output += `\n\nExamples:\n${
                helpContent.examples.map(ex => `  ${ex}`).join('\n')
            }`;
        }
        console.log(output); 
        return output;
    }

    // Check commands for basic help
    const commandContent = state.commands[command];
    if (!commandContent) {
        return `Unknown command: '${command}'\nType 'help' to see available commands or 'help list' to see all verbs.`;
    }

    let output = `${command.toUpperCase()}\n`;
    output += `\nDescription:\n  ${commandContent.description}`;
    
    if (commandContent.usage) {
        output += `\n\nUsage:\n  ${commandContent.usage}`;
    }
    
    if (commandContent.examples?.length) {
        output += `\n\nExamples:\n${
            commandContent.examples.map(ex => `  ${ex}`).join('\n')
        }`;
    }

    return output;
}

export function handleHelp(command: string) {
    const parts = command.split(' ');
    const topic = parts.length > 1 ? parts[1].toLowerCase() : 'default';

    // If help is typed alone, show default help
    if (command.trim().toLowerCase() === 'help') {
        helpStore.showHelp();
        return;
    }

    // If "help close" or "help-close" is typed, close the window
    if (command.trim().toLowerCase() === 'help-close') {
        helpStore.hide();
        return;
    }

    // Show help for specific verb
    helpStore.showHelp(topic === 'help' ? 'default' : topic);
}

export const helpStore = createHelpStore(); 