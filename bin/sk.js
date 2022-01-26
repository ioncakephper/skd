const program = require('commander')
const path = require('path')
const fileEasy = require('file-easy')
const yamljs = require('yamljs')



const {buildAllSidebars, saveSidebars} = require('../lib/app')
const { loadMarkdownSidebarDefinitions } = require('../lib/md-app')

program
    .name('sk')
    .description(require("../package.json").description)
    .version(require("../package.json").version)

program
    .command('build', {isDefault: true})
    .description(require("../package.json").description)
    .arguments('<outline>')
    .option('-d, --docs <path>', 'path to documentation files root-folder', 'docs')
    .option('-s, --sidebars <filename>', 'path and filename for Docusaurus sidebars file', 'sidebars.js')
    .option('--outlineExtension <ext>', 'outline file default extension', '.yaml')

    .action((outline, options) => {
        
        let sidebars = buildAllSidebars(outline, options)
        saveSidebars(sidebars, options) 
    })

program
    .command('md2yaml')
    .description('convert Markdown outline file into Yaml outline')
    .arguments('<source> [target]')
    .action((source, target, options, command) => {
        source = fileEasy.setDefaultExtension(source, '.md')
        target = target || path.basename(source, path.extname(source))
        target = fileEasy.setDefaultExtension(target, '.yaml')

        // console.log(source, target)

        let sidebars = {sidebars: loadMarkdownSidebarDefinitions(source, options)}

        let content = yamljs.stringify(sidebars, 128, 4)
        fileEasy.saveDocument(target, content)
    })

program.parse("node sk sample".split(/\s+/))




