#!/usr/bin/env node

const program                             = require('commander')
const fileEasy                            = require('file-easy')
const fs                                  = require('fs')
const path                                = require('path')
const yamljs                              = require('yamljs')
const {buildAllSidebars, saveSidebars}    = require('../lib/app')
const { loadMarkdownSidebarDefinitions }  = require('../lib/md-app')

let defaultSettings = {
    'outlineExtension': '.md'
}

let info = require('../package.json');

program
    .name('sk')
    .description(info.description)
    .version(info.version)

program
    .command('build', {isDefault: true})
    .description(info.description)
    .argument('<outline>', 'filename (path allowed) of documentation outline')

    .option('--config <config>', 'configuration filename', fileEasy.setDefaultExtension(program.name(), '.json'))
    .option('--no-clear', 'inhibit clearing content of docs folder')
    .option('-d, --docs <path>', 'path to documentation files root-folder', 'docs')
    .option('-s, --sidebars <filename>', 'path and filename for Docusaurus sidebars file', 'sidebars.js')
    .option('--outlineExtension <ext>', 'outline file default extension', defaultSettings.outlineExtension || '.yaml')
    .option('--docsExtension <ext>', 'markdown doc files default extension', '.md')
    
    .action((outline, options) => {

        let settings = loadSettings(options)
        let sidebars = buildAllSidebars(outline, options)
        saveSidebars(sidebars, options) 
    })

program
    .command('toyaml')
    .description('convert Markdown outline file into Yaml outline')
    .argument('<source>', 'Markdown outline file to convert into YAML')
    .argument('[target]', 'YAML outline filename of created file')
    .action((source, target, options, command) => {
        source = fileEasy.setDefaultExtension(source, '.md')
        target = target || path.basename(source, path.extname(source))
        target = fileEasy.setDefaultExtension(target, '.yaml')

        let sidebars = {sidebars: loadMarkdownSidebarDefinitions(source, options)}

        let content = yamljs.stringify(sidebars, 128, 4)
        fileEasy.saveDocument(target, content)
    })

program
    .command('init')
    .description('create configuration file')
    .argument('[config]', 'configuration filename', fileEasy.setDefaultExtension(program.name(), '.json'))
    .action((config, options, commander) => {
        config = fileEasy.setDefaultExtension(config, '.json');
        fileEasy.saveDocument(config, JSON.stringify(defaultSettings, null, 4))
    })

program.parse()

/**
 * Loads the settings from the config file.
 * @param options - The options object.
 * @returns The settings object.
 */
function loadSettings(options) {
    let configFilename = fileEasy.setDefaultExtension(options.config, '.json');
    configFilename = path.resolve(configFilename);
    return fs.existsSync(configFilename)
        ? {
        ...defaultSettings,
        ...require(configFilename)
        }
        : defaultSettings;
}
