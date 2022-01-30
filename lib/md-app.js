const md = require("markdown").markdown
const fs = require("fs")
const path = require("path")

/**
 *
 *
 * @param {*} outline
 * @param {*} options
 * @return {*} 
 */
function loadMarkdownSidebarDefinitions(outline, options) {

    let sidebars = []
    getMarkdownSidebarDefinitions(outline, options).forEach(pair => {

        sidebars.push({
            ...{
                sidebar: pair.heading,
                items: buildMarkdownItems(pair.bulletlist)
            },
            ...addMarkdownAttributes(pair.attributes)
        })
    })

    return sidebars;
}

/**
 *
 *
 * @param {*} items
 * @return {*} 
 */
function buildMarkdownItems(items = []) {
    return items.map(item => {
        return isMarkdownTopic(item) ? buildMarkdownTopic(item) : buildMarkdownCategory(item)
    })
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function isMarkdownTopic(item) {
    return item.length < 3 || getMarkdownItems(item[2].slice(1)).length == 0
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function buildMarkdownTopic(item) {
    let attributes = item.length > 2 ? getMarkdownAttributes(item[2].slice(1)) : []
    let hasAttributes = attributes.length > 0;
    
    return hasAttributes ? {
        ...{label: item[1]},
        ...addMarkdownAttributes(attributes)
    } : item[1]
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function buildMarkdownCategory(item) {
    return {...{
        label: item[1],
        items: buildMarkdownItems(getMarkdownItems(item[2].slice(1)))
    },
        ...addMarkdownAttributes(getMarkdownAttributes(item[2].slice(1)))
    }
}

/**
 *
 *
 * @param {*} attributes
 * @return {*} 
 */
function addMarkdownAttributes(attributes) {
    let items = {}
    attributes.forEach(attr => {
        let parsed = parseAttribute(attr);
        items[parsed.name] = parsed.value;
    })
    return items;
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function parseAttribute(item) {
    let s = item[1];

    return {
        name: s.split(/\s+/)[0].substr(1).trim(),
        value: getAttributeValue(item),
        // s.substr(s.indexOf(' ')).trim()
    }
}

function getAttributeValue(item) {
    let s = item[1];
    let name = s.split(/\s+/)[0].substr(1).trim();
    switch (name) {
        case 'headings':
            return item[2] ? buildMarkdownItems(item[2].splice(1)) : []
    return 
        default:
            return s.substr(s.indexOf(' ')).trim()
    }
}

/**
 *
 *
 * @param {*} outline
 * @param {*} options
 * @return {*} 
 */
function getMarkdownSidebarDefinitions(outline, options) {
    let tree = md.parse(fs.readFileSync(outline, "utf-8"));
  
    let pairs = []
    for(let i = 1; i < tree.length - 1; i++) {
        if (isHeading(tree[i]) && isBulletList(tree[i+1])) {
            pairs.push({
                heading: tree[i][2],
                bulletlist: getMarkdownItems(tree[i+1].slice(1)),
                attributes: getMarkdownAttributes(tree[i+1].slice(1))
            })
        }
    }
    return pairs;
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function isHeading(item) {
    return item[0] == 'header' && item[1].level == 2;
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function isBulletList(item) {
    return item[0] == 'bulletlist';
}

/**
 *
 *
 * @param {*} items
 * @return {*} 
 */
function getMarkdownItems(items) {
    return items.filter(item => !isMarkdownAttribute(item))
}

function getMarkdownAttributes(items) {
    return items.filter(item => isMarkdownAttribute(item))
}

function isMarkdownAttribute(item) {
    return /^\@[^\s]+/.test(item[1])
}

module.exports = {
    loadMarkdownSidebarDefinitions,
}