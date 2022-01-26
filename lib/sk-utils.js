const {isString, isEmpty} = require('lodash')
const path = require('path')
const fileEasy = require('file-easy')




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

function isTopic(item) {
    return item.items.length == 0
}

function getItemBasename(item, options) {
    let localPath = getItemPath(item, options)
    return path.join(localPath, getItemSlug(item, options))
}

function getItemPath(item, options) {
    options = {
        ...{attributes: {path: ''}},
        ...options,
    }
    return path.join(options.attributes.path || '', item.path || '')
}

function getItemSlug(item, options) {
    return fileEasy.slug(item.slug || item.label)
}

module.exports = {
    normalizeItem,
    isTopic,
    getItemBasename,
}