import { pipe, map, sum, curry, toPairs, adjust, fromPairs } from 'ramda'

export const renameKeysBy = curry((fn, obj) =>
	pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj),
)

export const round = curry((decimals, value) =>
	Number(Math.round(value + 'e' + decimals) + 'e-' + decimals),
)

export const getTotalSpend = pipe(
	map(item => item.amount / item.exchangeRate),
	sum,
	n => round(2, n),
)
