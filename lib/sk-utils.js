const {isString, isEmpty} = require('lodash')
const path = require('path')
const fileEasy = require('file-easy')

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function normalizeItem(item) {
    if (isString(item) && isEmpty(item)) {
        item = "No label";
    }
    if (isString(item)) {
        item = {
            label: item
        }
    }
    item = {
        ...{label: "No label"},
        ...{items: []},
        ...item
    }
    return item;
}

/**
 *
 *
 * @param {*} item
 * @return {*} 
 */
function isTopic(item) {
    return item.items.length == 0
}

/**
 *
 *
 * @param {*} item
 * @param {*} options
 * @return {*} 
 */
function getItemBasename(item, options, parent_path = '') {
    let localPath = getItemPath(item, options, parent_path)
    return path.join(localPath, getItemSlug(item, options, parent_path))
}

/**
 *
 *
 * @param {*} item
 * @param {*} options
 * @return {*} 
 */
function getItemPath(item, options, parent_path = "") {
    // options = {
    //     ...{attributes: {path: ''}},
    //     ...options,
    // }
    return path.join(parent_path || '', item.path || '')
}

/**
 *
 *
 * @param {*} item
 * @param {*} options
 * @return {*} 
 */
function getItemSlug(item, options, parent_path = '') {
    return fileEasy.slug(item.slug || item.label)
}

module.exports = {
    normalizeItem,
    isTopic,
    getItemBasename,
    getItemSlug,
}