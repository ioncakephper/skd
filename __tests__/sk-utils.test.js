const rewire = require("rewire")
const sk_utils = rewire("../lib/sk-utils")
const getItemPath = sk_utils.__get__("getItemPath")
// @ponicode
describe("sk_utils.normalizeItem", () => {
    test("0", () => {
        let result = sk_utils.normalizeItem("label_1")
        expect(result).toEqual({ label: "label_1", items: [] })
    })

    test("1", () => {
        let result = sk_utils.normalizeItem("ISO 9001")
        expect(result).toEqual({ label: "ISO 9001", items: [] })
    })

    test("2", () => {
        let result = sk_utils.normalizeItem("")
        expect(result).toEqual({ label: "No label", items: [] })
    })

    test("3", () => {
        let result = sk_utils.normalizeItem(undefined)
        expect(result).toEqual({ label: "No label", items: [] })
    })
})

// @ponicode
describe("sk_utils.isTopic", () => {
    test("0", () => {
        let result = sk_utils.isTopic({ items: [] })
        expect(result).toBe(true)
    })

    test("1", () => {
        let result = sk_utils.isTopic({ items: ["Label"] })
        expect(result).toBe(false)
    })
})

// @ponicode
describe("sk_utils.getItemBasename", () => {
    test("0", () => {
        let callFunction = () => {
            sk_utils.getItemBasename(undefined, undefined, undefined)
        }
    
        expect(callFunction).toThrow("Cannot read property 'path' of undefined")
    })

    test("1", () => {
        let callFunction = () => {
            sk_utils.getItemBasename("", undefined, undefined)
        }
    
        expect(callFunction).toThrow("Cannot read property 'trim' of undefined")
    })

    test("2", () => {
        let callFunction = () => {
            sk_utils.getItemBasename("Label", undefined, undefined)
        }
    
        expect(callFunction).toThrow("Cannot read property 'trim' of undefined")
    })

    test("3", () => {
        let result = sk_utils.getItemBasename({ label: "Label", slug: "slug" }, undefined, undefined)
        expect(result).toBe("slug")
    })

    test("4", () => {
        let result = sk_utils.getItemBasename({ label: "Label" }, undefined, undefined)
        expect(result).toBe("label")
    })

    test("5", () => {
        let result = sk_utils.getItemBasename({ label: "Label", path: "path/to/this/item" }, undefined, undefined)
        expect(result).toBe("path\\to\\this\\item\\label")
    })

    test("6", () => {
        let result = sk_utils.getItemBasename({ label: "Label", slug: "slug", path: "path/to/this/item" }, undefined, undefined)
        expect(result).toBe("path\\to\\this\\item\\slug")
    })
})

// @ponicode
describe("getItemPath", () => {
    test("0", () => {
        let result = getItemPath({ path: "" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "")
        expect(result).toBe(".")
    })

    test("1", () => {
        let result = getItemPath({ path: "path/to/item" }, undefined, undefined)
        expect(result).toBe("path\\to\\item")
    })

    test("2", () => {
        let callFunction = () => {
            getItemPath(undefined, undefined, "parent/path")
        }
    
        expect(callFunction).toThrow("Cannot read property 'path' of undefined")
    })

    test("3", () => {
        let result = getItemPath({}, undefined, "parent/path")
        expect(result).toBe("parent\\path")
    })
})

// @ponicode
describe("sk_utils.getItemSlug", () => {
    test("0", () => {
        let result = sk_utils.getItemSlug({ slug: "mollitia-quis-alias", label: "label_1" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "path/to/folder/")
        expect(result).toBe("mollitia-quis-alias")
    })

    test("1", () => {
        let result = sk_utils.getItemSlug({ slug: "consequatur-necessitatibus-sit", label: "label_1" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "C:\\\\path\\to\\folder\\")
        expect(result).toBe("consequatur-necessitatibus-sit")
    })

    test("2", () => {
        let result = sk_utils.getItemSlug({ slug: "quam-dignissimos-nostrum", label: "label_1" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "path/to/folder/")
        expect(result).toBe("quam-dignissimos-nostrum")
    })

    test("3", () => {
        let result = sk_utils.getItemSlug({ slug: "praesentium-et-ducimus", label: "label_1" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", ".")
        expect(result).toBe("praesentium-et-ducimus")
    })

    test("4", () => {
        let result = sk_utils.getItemSlug({ slug: "est-dignissimos-earum", label: "ISO 22000" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "C:\\\\path\\to\\file.ext")
        expect(result).toBe("est-dignissimos-earum")
    })

    test("5", () => {
        let result = sk_utils.getItemSlug({ slug: "consequatur-necessitatibus-sit", label: "ISO 22000" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "path/to/file.ext")
        expect(result).toBe("consequatur-necessitatibus-sit")
    })

    test("6", () => {
        let result = sk_utils.getItemSlug({ slug: "quam-dignissimos-nostrum", label: "AOP" }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "./path/to/file")
        expect(result).toBe("quam-dignissimos-nostrum")
    })

    test("7", () => {
        let result = sk_utils.getItemSlug({ slug: "", label: "" }, "", "")
        expect(result).toBe("")
    })
})
