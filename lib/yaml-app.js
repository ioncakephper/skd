const yamljs = require('yamljs')
const fileEasy = require('file-easy')
const path = require('path')
const hbsr = require('hbsr')
const { normalizeItem, isTopic, getItemBasename, getItemSlug } = require("../lib/sk-utils")
const { isEmpty } = require('lodash')

/**
 *
 *
 * @param {*} outline
 * @param {*} [options={}]
 * @return {*} 
 */
function loadYamlSidebarDefinitions(outline, options = {}) {
    return yamljs.load(outline).sidebars
}

/**
 *
 *
 * @param {*} items
 * @param {*} [options={}]
 * @return {*} 
 */
function buildSidebarItems(items, options = {}, parent_path = '') {
    let r = items.map(item => {
        item = normalizeItem(item);
        return isTopic(item) ? buildTopic(item, options, parent_path) : buildCategory(item, options, parent_path)
    })

    return r;
}

/**
 *
 *
 * @param {*} item
 * @param {*} options
 * @return {*} 
 */
function buildTopic(item, options, parent_path = '') {
    let basename = getItemBasename(item, options, parent_path)
    saveTopicDocument(basename, item, options)
    basename = basename.replace(/\\/ig, '/')
    return basename;
}

/**
 *
 *
 * @param {*} basename
 * @param {*} item
 * @param {*} options
 */
function saveTopicDocument(basename, item, options) {

    let topicContent = buildTopicContent(basename, item, options)
    let topicFilename = fileEasy.setDefaultExtension(basename, '.md')
    topicFilename = path.join(options.docs, topicFilename)
    fileEasy.saveDocument(topicFilename, topicContent)
}

/**
 *
 *
 * @param {*} basename
 * @param {*} item
 * @param {*} options
 * @return {*} 
 */
function buildTopicContent(basename, item, options) {

    let data = {
        title: item.title || item.label,
        id: (getItemSlug(item) == fileEasy.slug(item.label)) ? null : getItemSlug(item),
        "sidebar_label": item.label,
        brief: item.brief,
        headings: buildTopicHeadings(item.headings)
    }
    return fill('topic', data)
}

/**
 *
 *
 * @param {*} items
 * @param {number} [level=2]
 * @param {*} [options={}]
 * @return {*} 
 */
function buildTopicHeadings(items, level = 2, options = {}) {
    if (items) {
        let parts = items.map(item => {
            item = normalizeItem(item);
            return fill('headings', {
                prefix: "#".repeat(level),
                title: item.label,
                headings: buildTopicHeadings(item.items, level + 1),
                brief: item.brief
            })
        })
        return parts.join(`
`)
    }
}

/**
 *
 *
 * @param {*} item
 * @param {*} options
 * @return {*} 
 */
function buildCategory(item, options, parent_path = '') {

    return {
        label: item.label,
        type: 'category',
        items: buildSidebarItems(item.items, options, path.join(parent_path, item.path || ''))
    }
}

/**
 *
 *
 * @param {*} template
 * @param {*} [data={}]
 * @return {*} 
 */
function fill(template, data = {}) {
    return hbsr.render_template(template, data, { template_path: path.join(__dirname, '..', 'templates') })
}

module.exports = {
    loadYamlSidebarDefinitions,
    buildSidebarItems,
    fill,
}