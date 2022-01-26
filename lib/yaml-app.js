const yamljs = require('yamljs')
const fileEasy = require('file-easy')
const path = require('path')
const hbsr = require('hbsr')



const {normalizeItem, isTopic, getItemBasename, getItemSlug } = require("../lib/sk-utils")


function loadYamlSidebarDefinitions(outline, options) {
    return yamljs.load(outline).sidebars
}

function buildSidebarItems(items, options) {
    let r = items.map(item => {
        item = normalizeItem(item);
        return isTopic(item) ? buildTopic(item, options) : buildCategory(item, options)
    })

    return r;
}

function buildTopic(item, options) {
    let basename = getItemBasename(item, options)
    saveTopicDocument(basename, item, options)
    return basename;
}

function saveTopicDocument(basename, item, options) {

    let topicContent = buildTopicContent(basename, item, options)
    let topicFilename = fileEasy.setDefaultExtension(basename, '.md')
    topicFilename = path.join(options.docs, topicFilename)
    fileEasy.saveDocument(topicFilename, topicContent)
}

function buildTopicContent(basename, item, options) {

    let data = {
        title: item.title || item.label,
        id: (getItemSlug(item) == fileEasy.slug(item.label)) ? null: getItemSlug(item),
        sidebar_label: item.label,
        brief: item.brief,
        headings: buildTopicHeadings(item.headings)
    }
    return fill('topic', data)
}

function buildTopicHeadings(items, level = 2, options = {}) {
    if (items) {
        let parts = items.map(item => {
            item = normalizeItem(item);
            return fill('headings', {
                prefix: "#".repeat(level),
                title: item.label,
                headings: buildTopicHeadings(item.items, level + 1)
            })
        })
        return parts.join(`
`)
    }
}

function buildCategory(item, options) {
    options = {
        ...{attributes: {path: ''}},
        ...options
    }
    let s = path.join(options.attributes.path || "", item.path || '')
    options.attributes.path = s
    return {
        label: item.label,
        type: 'category',
        items: buildSidebarItems(item.items, options)
    }
}


function fill(template, data = {}) {
    return hbsr.render_template(template, data)
}

module.exports = {
    loadYamlSidebarDefinitions,
    buildSidebarItems,
    fill,
}