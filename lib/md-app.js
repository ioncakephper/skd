const fs    = require("fs")
const md    = require("markdown").markdown


/**
 * Loads the sidebar definitions for the given outline.
 * @param outline - The outline to load the sidebar definitions for.
 * @param options - The options for the site.
 * @returns An array of sidebar definitions.
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
 * Takes in an array of items and returns a markdown list of those items.
 * @param items - the array of items to build a markdown list of.
 * @returns a markdown list of the items.
 */
function buildMarkdownItems(items = []) {
    return items.map(item => {
        return isMarkdownTopic(item) ? buildMarkdownTopic(item) : buildMarkdownCategory(item)
    })
}

/**
 * Determines if the given item is a markdown topic.
 * @param item - the item to check.
 * @returns True if the item is a markdown topic, false otherwise.
 */
function isMarkdownTopic(item) {
    return item.length < 3 || getMarkdownItems(item[2].slice(1)).length == 0
}

/**
 * Builds a Markdown topic object.
 * @param item - the item to build a topic object for.
 * @returns a Markdown topic object.
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
 * Builds a markdown category object.
 * @param item - the markdown category object.
 * @returns the markdown category object.
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
 * Takes in a string of attributes and returns an object containing the name and value of each attribute.
 * @param attributes - the string of attributes to parse.
 * @returns an object containing the name and value of each attribute.
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
 * Takes in a string of code and parses it to get the name and value of the attribute.
 * @param item - the string of code to parse.
 * @returns an object containing the name and value of the attribute.
 */
function parseAttribute(item) {
    let s = item[1];

    return {
        name: s.split(/\s+/)[0].substr(1).trim(),
        value: getAttributeValue(item),
    }
}

/**
 * Takes in a list of items and returns a list of the attribute values for each item.
 * @param items - the list of items to get the attribute values for.
 * @returns a list of the attribute values for each item.
 */
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
 * Takes in a markdown outline and returns an array of objects containing the heading, bulletlist, and attributes.
 * @param outline - the markdown outline to parse.
 * @param options - the options to use when parsing the outline.
 * @returns an array of objects containing the heading, bulletlist, and attributes.
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
 * Returns true if the given item is a heading.
 * @param item - the item to check.
 * @returns True if the given item is a heading.
 */
function isHeading(item) {
    return item[0] == 'header' && item[1].level == 2;
}

/**
 * Checks if the given item is a bullet list.
 * @param item - the item to check.
 * @returns True if the item is a bullet list, false otherwise.
 */
function isBulletList(item) {
    return item[0] == 'bulletlist';
}

/**
 * Takes in an array of items and returns an array of items that are not markdown attributes.
 * @param items - the array of items to filter.
 * @returns an array of items that are not markdown attributes.
 */
function getMarkdownItems(items) {
    return items.filter(item => !isMarkdownAttribute(item))
}

/**
 * Takes in an array of strings and returns an array of strings that are markdown attributes.
 * @param items - the array of strings to filter.
 * @returns an array of strings that are markdown attributes.
 */
function getMarkdownAttributes(items) {
    return items.filter(item => isMarkdownAttribute(item))
}

/**
 * Checks if the given item is a markdown attribute.
 * @param item - The item to check.
 * @returns True if the item is a markdown attribute, false otherwise.
 */
function isMarkdownAttribute(item) {
    return /^\@[^\s]+/.test(item[1])
}

module.exports = {
    loadMarkdownSidebarDefinitions,
}