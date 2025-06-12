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
    content: null|string|HTMLElement|(string|HTMLElement)[] = null,
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if (content) {
        if (!Array.isArray(content)) content = [ content ];
        // if (textContent) element.textContent = textContent;
        for(const c of content) {
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