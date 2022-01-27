const rewire = require("rewire")
const yaml_app = rewire("./yaml-app")
const buildTopicContent = yaml_app.__get__("buildTopicContent")

const buildTopicHeadings = yaml_app.__get__("buildTopicHeadings")
const buildCategory = yaml_app.__get__("buildCategory")
// @ponicode
describe("buildTopicContent", () => {
    test("0", () => {
        let object = [[-5.48, -100, -100, 0], [100, -100, 0, 0], [100, 1, 100, -100], [-100, -100, 1, 100]]
        buildTopicContent(".out", { title: "Dynamic Quality Specialist", label: "ISO 9001", brief: 12345, headings: object }, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })
})

// @ponicode
describe("buildTopicHeadings", () => {
    test("0", () => {
        let param1 = [{ label: "label_3", items: 256 }, { label: "label_1", items: 16 }, { label: "AOP", items: 256 }, { label: "ISO 22000", items: 256 }]
        buildTopicHeadings(param1, 2, {})
    })
})

// @ponicode
describe("buildCategory", () => {
    test("0", () => {
        buildCategory({ path: "", label: "ISO 9001", items: 32 }, {})
    })
})
