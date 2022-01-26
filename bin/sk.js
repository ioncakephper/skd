const program = require('commander')
const {buildAllSidebars, saveSidebars} = require('../lib/app')

program
    .name('sk')
    .description(require("../package.json").description)
    .version(require("../package.json").version)

program
    .arguments('<outline>')
    .option('-d, --docs <path>', 'path to documentation files root-folder', 'docs')
    .option('-s, --sidebars <filename>', 'path and filename for Docusaurus sidebars file', 'sidebars.js')
    .option('--outlineExtension <ext>', 'outline file default extension', '.yaml')

    .action((outline, options) => {
        
        let sidebars = buildAllSidebars(outline, options)
        saveSidebars(sidebars, options) 
    })

program.parse("node sk sample".split(/\s+/))

