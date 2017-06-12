import React from 'react'
import { pipe, map, nth, defaultTo, length, divide } from 'ramda'
import { getTotalSpend, round } from './utils/'

const ExpenseMeta = props => {
	const tripSpend = getTotalSpend(props.expenses)
	const averageDailySpend = pipe(
		map(nth(1)),
		defaultTo([]),
		length,
		divide(tripSpend),
		round(2),
	)(props.dateGroupings)

	return (
		<div>
			<div>
				Total trip spend: £{tripSpend} (£{round(2, tripSpend / 2)} pp)
			</div>
			<div>
				Average daily spend: £
				{averageDailySpend}
				{' '}
				(£
				{round(2, averageDailySpend / 2)}
				{' '}
				pp)
			</div>
		</div>
	)
}

export default ExpenseMeta
