function getQuerySelector<T extends Element>(query: string, ctx?: Element): T {
    const element = (ctx || document).querySelector<T>(query);
    if (!element) {
        throw new Error('Element with query: ' + query + ' not found');
    }
    return element;
}

function nextTick(callback: () => unknown) {
  setTimeout(callback, 0);
}

export {
    getQuerySelector,
    nextTick
}
