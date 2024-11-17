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
