/**
 * Add an eventlistener which will be fired only once.
 *
 * @param element Target element
 * @param event Event name
 * @param fn Callback
 * @param options Optional options
 */
export function once(element, event, fn, options = {}) {
    element.addEventListener(event, function helper(e) {
        fn(e);
        element.removeEventListener(event, helper, options);
    }, {capture: false, ...options});
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 */
export function on(elements, events, fn, options = {}) {
    eventListener(elements, events, fn, options);
}

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 */
export function off(elements, events, fn, options = {}) {
    eventListener(elements, events, fn, options, true);
}

function eventListener(elements, events, fn, options = {}, remove) {
    const method = remove ? 'removeEventListener' : 'addEventListener';

    // Normalize array
    if (HTMLCollection.prototype.isPrototypeOf(elements) ||
        NodeList.prototype.isPrototypeOf(elements)) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) {
        events = [events];
    }

    for (let element of elements) {
        for (let event of events) {
            element[method](event, fn, {capture: false, ...options});
        }
    }
}

/**
 * Creates an DOM-Element out of a string (Single element).
 * @param html HTML representing a single element
 * @returns {HTMLElement} The element.
 */
export function createElementFromString(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) return path;

    let el = evt.target.parentElement;

    for (path = [evt.target]; el; el = el.parentElement) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}