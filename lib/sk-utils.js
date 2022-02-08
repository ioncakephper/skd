const {isString, isEmpty} = require('lodash')
const path = require('path')
const fileEasy = require('file-easy')

/**
 * Normalizes the given item.
 * @param item - the item to normalize.
 * @returns the normalized item.
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
 * Returns true if the item is a topic, false otherwise.
 * @param item - the item to check.
 * @returns True if the item is a topic, false otherwise.
 */
function isTopic(item) {
    return item.items.length == 0
}

/**
 * Get the basename of an item.
 * @param item - The item to get the basename of.
 * @param options - The options object.
 * @param parent_path - The parent path of the item.
 * @returns The basename of the item.
 */
function getItemBasename(item, options, parent_path = '') {
    let localPath = getItemPath(item, options, parent_path)
    return path.join(localPath, getItemSlug(item, options, parent_path))
}

/**
 * Get the path of an item in the site tree.
 * @param item - The item to get the path for.
 * @param options - The options object.
 * @param parent_path - The parent path of the item.
 * @returns The path of the item.
 */
function getItemPath(item, options, parent_path = "") {
    return path.join(parent_path || '', item.path || '')
}

/**
 * Get the slug for an item.
 * @param item - The item to get the slug for.
 * @param options - The options for the item.
 * @param parent_path - The parent path of the item.
 * @returns The slug for the item.
 */
function getItemSlug(item, options, parent_path = '') {
    return fileEasy.slug(item.slug || item.label)
}

module.exports = {
    getItemBasename,
    getItemSlug,
    isTopic,
    normalizeItem,
}