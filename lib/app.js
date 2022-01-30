const fileEasy = require('file-easy')
const hbsr = require('hbsr')
const path = require('path')
const fs = require('fs')

const {loadYamlSidebarDefinitions, buildSidebarItems, fill} = require("../lib/yaml-app")
const {loadMarkdownSidebarDefinitions} = require("../lib/md-app")

/**
 *
 *
 * @param {*} outline
 * @param {*} options
 * @return {*} 
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
 *
 *
 * @param {*} item
 * @return {*} 
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
 *
 *
 * @param {*} outline
 * @param {*} options
 * @return {*} 
 */
function loadSidebarDefinitions(outline, options) {
    outline = fileEasy.setDefaultExtension(outline, options.outlineExtension);

    let isMarkdown = [".md", ".markdown"].includes(path.extname(outline).trim()) 
    return isMarkdown ? loadMarkdownSidebarDefinitions(outline, options) : loadYamlSidebarDefinitions(outline, options)
}

/**
 *
 *
 * @param {*} sidebars
 * @param {*} options
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