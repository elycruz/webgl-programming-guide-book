
export const {error, log} = console,
    peek = (...args) => (log(...args), args.pop());

