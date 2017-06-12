import { pipe, map, sum, curry } from 'ramda'

export const round = curry((decimals, value) =>
	Number(Math.round(value + 'e' + decimals) + 'e-' + decimals),
)

export const getTotalSpend = pipe(
	map(item => item.amount / item.exchangeRate),
	sum,
	n => round(2, n),
)
