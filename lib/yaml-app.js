const yamljs = require('yamljs')
const fileEasy = require('file-easy')
const path = require('path')
const hbsr = require('hbsr')
const { normalizeItem, isTopic, getItemBasename, getItemSlug } = require("../lib/sk-utils")
const { isEmpty } = require('lodash')

/**
 * Loads the sidebar definitions from a YAML file.
 * @param outline - The path to the YAML file.
 * @param options - The options object.
 * @returns The sidebar definitions.
 */
function loadYamlSidebarDefinitions(outline, options = {}) {
    return yamljs.load(outline).sidebars
}

/**
 * Builds sidebar items from a list of items.
 * @param items - the list of items to build from.
 * @param options - the options to use when building the sidebar.
 * @param parent_path - the path of the parent item.
 * @returns the list of sidebar items.
 */
function buildSidebarItems(items, options = {}, parent_path = '') {
    let r = items.map(item => {
        item = normalizeItem(item);
        return isTopic(item) ? buildTopic(item, options, parent_path) : buildCategory(item, options, parent_path)
    })

    return r;
}

/**
 * Builds a topic document for the given item.
 * @param item - The item to build a topic document for.
 * @param options - The options object.
 * @param parent_path - The parent path of the item.
 * @returns The basename of the topic document.
 */
function buildTopic(item, options, parent_path = '') {
    let basename = getItemBasename(item, options, parent_path)
    saveTopicDocument(basename, item, options)
    basename = basename.replace(/\\/ig, '/')
    return basename;
}

/**
 * Save the topic document for the given item.
 * @param basename - The base name of the topic.
 * @param item - The item to save the topic for.
 * @param options - The options for the topic.
 * @returns None
 */
function saveTopicDocument(basename, item, options) {

    let topicContent = buildTopicContent(basename, item, options)
    let topicFilename = fileEasy.setDefaultExtension(basename, '.md')
    topicFilename = path.join(options.docs, topicFilename)
    fileEasy.saveDocument(topicFilename, topicContent)
}

/**
 * Builds the content for a topic.
 * @param basename - the basename of the topic.
 * @param item - the topic object.
 * @param options - the options object.
 * @returns the content for the topic.
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
 * Builds a list of headings for a topic.
 * @param items - the items to build headings for.
 * @param level - the level of the headings.
 * @param options - the options for the headings.
 * @returns the headings for the topic.
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
 * Builds the sidebar items for the given category.
 * @param item - The category object.
 * @param options - The options object.
 * @param parent_path - The parent path of the category.
 * @returns The sidebar items for the category.
 */
function buildCategory(item, options, parent_path = '') {
    return {
        label: item.label,
        type: 'category',
        items: buildSidebarItems(item.items, options, path.join(parent_path, item.path || ''))
    }
}

/**
 * Takes in a template and data and returns a string of the rendered template.
 * @param template - the template to render.
 * @param data - the data to pass to the template.
 * @returns a string of the rendered template.
 */
function fill(template, data = {}) {
    return hbsr.render_template(template, data, { template_path: path.join(__dirname, '..', 'templates') })
}

module.exports = {
    buildSidebarItems,
    fill,
    loadYamlSidebarDefinitions,
}