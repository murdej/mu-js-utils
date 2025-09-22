import { DelayedSingleRun } from "./DelayedSingleRun";

export function sleepPromise(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
}

export function escapeHtml(src: string): string {
    return src
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function autosizeTextarea(textarea: HTMLElement, minHeight: null|string = null): void
{
    if (minHeight !== null) textarea.style.minHeight = minHeight;
    const resizer = () => {
        textarea.style.height = 'auto';
        textarea.style.height = (
            textarea.scrollHeight
            + parseInt(window.getComputedStyle(textarea).paddingTop)
            + parseInt(window.getComputedStyle(textarea).paddingBottom)
            + parseInt(window.getComputedStyle(textarea).borderTopWidth)
            + parseInt(window.getComputedStyle(textarea).borderBottomWidth)
        ) + 'px';
    }
    textarea.addEventListener('input', resizer);
    resizer();
}

export function naNToNull(value: number): number|null
{
    return Number.isNaN(value) ? null : value;
}

export function makeHtmlElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: { [key: string]: string } = {},
    content: null|string|HTMLElement|(string|HTMLElement|null)[] = null,
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if (content) {
        if (!Array.isArray(content)) content = [ content ];
        // if (textContent) element.textContent = textContent;
        for(const c of content) {
            if (c !== null)
                element.append(c);
        }
    }

    return element;
}

/**
 * 
 * @param el 
 * @param onClick 
 * @param onDoubleClick 
 * @param delay 
 */
export function handleClickAndDouble(
    el: HTMLElement,
    onClick: (ev: Event) => void,
    onDoubleClick: (ev: Event) => void,
    delay: number = 600,
) {
    let clickTimer: number|null = null;
    el.addEventListener('click', function(ev: Event) {
        if (clickTimer === null) {
            clickTimer = setTimeout(() => {
                onClick(ev)
                clickTimer = null;
            }, delay);
        }
    });

    el.addEventListener('dblclick', function(ev: Event) {
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = null;
        onDoubleClick(ev);
    });
}

/**
 * Places an HTML element at a specific position within a container.
 *
 * This function provides a flexible way to insert an element relative to a container or a reference element.
 * It handles different positioning cases, including inserting as the first or last child,
 * or placing it before or after a specified reference element.
 *
 * @param {HTMLElement} element - The element to be placed.
 * @param {HTMLElement} container - The container element where the element will be placed.
 * @param {"first" | "before" | "after" | "last"} [position="last"] - The position for the element.
 * - "first": Inserts the element as the first child of the container.
 * - "before": Inserts the element immediately before the `ref` element.
 * - "after": Inserts the element immediately after the `ref` element.
 * - "last": Appends the element as the last child of the container.
 * @param {HTMLElement | null} [ref=null] - A reference element used for "before" and "after" positions.
 * This parameter is ignored for "first" and "last" positions. It must be provided when `position` is "before" or "after".
 */
export function placeElementAt(
    element: HTMLElement,
    container : HTMLElement,
    position : "first"|"before"|"after"|"last" = "last",
    ref : HTMLElement|null = null,
) {
    switch(position) {
        case 'first':
            if (container.firstElementChild) {
                container.insertBefore(element, container.firstElementChild);
            } else {
                container.appendChild(element);
            }
            break;
        case 'before':
            if (!ref) throw new Error(`When using ${position}, ref must be set.`)
            container.insertBefore(element, ref);
            break;
        case 'after':
            if (!ref) throw new Error(`When using ${position}, ref must be set.`)
            if (ref.nextElementSibling) {
                container.insertBefore(element, ref.nextElementSibling);
            } else {
                container.appendChild(element);
            }
            break;
        case 'last':
            container.appendChild(element);
            break;
    }
}

/**
 * Creates an HTML element from a string of HTML code.
 *
 * This function parses an HTML string and creates a new element based on it. It intelligently
 * handles specific HTML tags like `<tr>`, `<td>`, `<th>`, `<tbody>`, etc., by wrapping them
 * in an appropriate parent element (`<tbody>`, `<tr>`, `<table>`) to ensure proper
 * parsing by the browser's DOM parser. The function returns the first child element
 * parsed from the HTML string.
 *
 * @template T The expected type of the returned element.
 * @param {string} htmlCode The string containing the HTML code to be parsed.
 * @param {T} container A reference container element. Its namespace URI is used for
 * creating the new element.
 * @returns {T | null} The first child element created from the HTML string, or `null` if the string
 * is empty or invalid.
 */
export function createHTMLElementFromString(htmlCode: string): HTMLElement {
    let elementType: string = 'div';
    const htmlCodeLo = htmlCode.toLowerCase();
    if (htmlCodeLo.startsWith('<tr')) elementType = "tbody";
    if (htmlCodeLo.startsWith('<td') || htmlCodeLo.startsWith('<th')) elementType = "tr";
    if (htmlCodeLo.startsWith('<tbody') || htmlCodeLo.startsWith('<thead') || htmlCodeLo.startsWith('<tfoot')) elementType = "table";
    const element = document.createElement(elementType);
    element.innerHTML = htmlCode;

    return  element.firstElementChild as HTMLElement;
}
