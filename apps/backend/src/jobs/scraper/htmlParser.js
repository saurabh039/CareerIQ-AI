import * as cheerio from "cheerio";

class HTMLParser {
    /**
     * Load HTML into Cheerio.
     */
    load(html) {
        return cheerio.load(html);
    }

    /**
     * Get text content.
     */
    text($, selector) {
        return $(selector).text().trim();
    }

    /**
     * Get attribute.
     */
    attr($, selector, attribute) {
        return $(selector).attr(attribute) || "";
    }

    /**
     * Get multiple elements.
     */
    list($, selector) {
        return $(selector).toArray();
    }

    /**
     * Check if element exists.
     */
    exists($, selector) {
        return $(selector).length > 0;
    }
}

export default new HTMLParser();