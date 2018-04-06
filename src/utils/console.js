
export const

    log = console.log.bind(console),

    error = console.error.bind(console),

    warn = console.warn.bind(console),

    peek = (...args) => (log(...args), args.pop());
