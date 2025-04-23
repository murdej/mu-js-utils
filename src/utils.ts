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