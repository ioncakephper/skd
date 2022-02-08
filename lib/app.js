const fileEasy = require('file-easy')
const hbsr = require('hbsr')
const path = require('path')
const fs = require('fs')

const {loadYamlSidebarDefinitions, buildSidebarItems, fill} = require("../lib/yaml-app")
const {loadMarkdownSidebarDefinitions} = require("../lib/md-app")

/**
 * Builds all the sidebars for the given outline.
 * @param outline - The outline of the site.
 * @param options - The options for the site.
 * @returns A map of all the sidebars.
 */
function buildAllSidebars(outline, options) {
    let sidebars = {}
    let allDefinedSidebars = loadSidebarDefinitions(outline, options)
    if (options.clear && fs.existsSync(options.docs)) {
        fs.rmdirSync(options.docs, {recursive: true})        
    }
    allDefinedSidebars.forEach(sidebar => {
        options.attributes = getAttributes(sidebar)
        sidebars[sidebar.sidebar] = buildSidebarItems(sidebar.items, options, options.path);
    })
    return sidebars;
} 

/**
 * Gets the attributes of an item.
 * @param item - the item to get the attributes of.
 * @returns the attributes of the item.
 */
function getAttributes(item) {
    let attributes = {}

    let keys = Object.keys(item).filter(key => !["sidebar", "items"].includes(key))

    keys.forEach(key => {
        attributes[key] = item[key]
    })
    return attributes
}

/**
 * Loads the sidebar definitions from the given file.
 * @param outline - The path to the sidebar definitions file.
 * @param options - The options object.
 * @returns The sidebar definitions.
 */
function loadSidebarDefinitions(outline, options) {
    outline = fileEasy.setDefaultExtension(outline, options.outlineExtension);

    let isMarkdown = [".md", ".markdown"].includes(path.extname(outline).trim()) 
    return isMarkdown ? loadMarkdownSidebarDefinitions(outline, options) : loadYamlSidebarDefinitions(outline, options)
}

/**
 * Saves the sidebars to a file.
 * @param sidebars - The sidebars to save.
 * @param options - The options object.
 * @returns None
 */
function saveSidebars(sidebars, options) {

    let content = fill('sidebars', {
        content: JSON.stringify(sidebars, null, 4)
    })
    let sidebarsFilename = fileEasy.setDefaultExtension(options.sidebars, '.js')
    fileEasy.saveDocument(sidebarsFilename, content)
}

module.exports = {
    buildAllSidebars,
    saveSidebars,
}