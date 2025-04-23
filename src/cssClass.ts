
export function addCssClass(element: HTMLElement, ...classes: (string[]|string|null)[]) {
    const allClasses: string[] = [];
    classes
        .filter(arg => !!arg)
        .forEach(arg => (Array.isArray(arg) ? arg : [ arg ])
            .filter(classNames => !!classNames)
            .forEach(classNames => allClasses.push(
                // @ts-ignore
                ...classNames.split(' ')
                    .filter(className => !!className.trim())
            )
        )
    )
    element.classList.add(...allClasses);
}