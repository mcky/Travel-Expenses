import React, { Component } from 'react'

import { pipe, defaultTo, groupBy, toPairs } from 'ramda'
import formatDate from 'date-fns/format'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ExpenseDateGroups from './ExpenseDateGroup'

const sampleExpenses = [
	{
		amount: '101.96',
		category: 'Long distance travel',
		city: 'London -> Dubrovnik',
		country: 'England -> Croatia',
		currency: 'GBP',
		date: '2017-05-18',
		description: 'Flight',
		exchangeRate: '1',
	},
	{
		amount: '80',
		category: 'Local travel',
		city: 'Dubrovnik',
		country: 'Croatia',
		currency: 'HRK',
		date: '2017-05-18',
		description: 'Dubrovnik airport transfer',
		exchangeRate: '8.59',
	},
	{
		amount: '28',
		category: 'Accomodation',
		city: 'Dubrovnik',
		country: 'Croatia',
		currency: 'GBP',
		date: '2017-05-18',
		description: 'Dubrovnik airbnb',
		exchangeRate: '1',
	},
]

class App extends Component {
	render() {
		const expenses = sampleExpenses

		const dateGroupings = pipe(
			defaultTo([]),
			groupBy(item => formatDate(item.date, 'YYYY-MM-DD')),
			toPairs,
		)(expenses)

		return (
			<div className="App">
				<MuiThemeProvider>
					<ExpenseDateGroups {...{ dateGroupings }} />
				</MuiThemeProvider>
			</div>
		)
	}
}

export default App
