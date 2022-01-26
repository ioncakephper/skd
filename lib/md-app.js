const md = require("markdown").markdown
const fs = require("fs")


// const { buildSidebarItems } = require("./yaml-app")


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

function buildMarkdownItems(items) {
    return items.map(item => {
        return isMarkdownTopic(item) ? buildMarkdownTopic(item) : buildMarkdownCategory(item)
    })
}

function isMarkdownTopic(item) {
    return item.length < 3 || getMarkdownItems(item[2].slice(1)).length == 0
}

function buildMarkdownTopic(item) {
    let attributes = item.length > 2 ? getMarkdownAttributes(item[2].slice(1)) : []
    let hasAttributes = attributes.length > 0;
    
    return hasAttributes ? {
        ...{label: item[1]},
        ...addMarkdownAttributes(attributes)
    } : item[1]
}

function buildMarkdownCategory(item) {
    return {...{
        label: item[1],
        items: buildMarkdownItems(getMarkdownItems(item[2].slice(1)))
    },
        ...addMarkdownAttributes(getMarkdownAttributes(item[2].slice(1)))
    }
}

function addMarkdownAttributes(attributes) {
    let items = {}
    attributes.forEach(attr => {
        let parsed = parseAttribute(attr);
        items[parsed.name] = parsed.value;
    })
    return items;
}

function parseAttribute(item) {
    let s = item[1];

    return {
        name: s.split(/\s+/)[0].substr(1).trim(),
        value: s.substr(s.indexOf(' ')).trim()
    }
}

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

function isHeading(item) {
    return item[0] == 'header' && item[1].level == 2;
}

function isBulletList(item) {
    return item[0] == 'bulletlist';
}

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