import React, { Component } from 'react'

import { pipe, replace, defaultTo, groupBy, toPairs } from 'ramda'
import formatDate from 'date-fns/format'
import { renameKeysBy } from './utils'

import firebase from 'firebase/app'
import 'firebase/database'
import FirebaseWrapper from './FirebaseWrapper'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'

import ExpenseDateGroups from './ExpenseDateGroup'
import ExpenseMeta from './ExpenseMeta'

const config = renameKeysBy(replace('REACT_APP_', ''), process.env)

firebase.initializeApp({
	apiKey: config.FIREBASE_API_KEY,
	databaseURL: config.FIREBASE_DATABASE_URL,
	projectId: config.FIREBASE_PROJECT_ID,
})

class App extends Component {
	state = {
		initialBudget: config.INITIAL_BUDGET,
		dailyBudget: config.DAILY_BUDGET,
	}

	render() {
		const { initialBudget, dailyBudget } = this.state
		const { expenses } = this.props

		const dateGroupings = pipe(
			defaultTo([]),
			groupBy(item => formatDate(item.date, 'YYYY-MM-DD')),
			toPairs,
		)(expenses)

		return (
			<div className="App">
				<MuiThemeProvider>
					<div>
						<ExpenseDateGroups
							{...{ dateGroupings }}
							style={{ paddingBottom: 65 }}
						/>

						<Paper
							zDepth={3}
							style={{
								position: 'fixed',
								bottom: 0,
								width: '100%',
								padding: 14,
								backgroundColor: 'rgb(0, 188, 212)',
								color: 'white',
							}}
						>
							<ExpenseMeta
								{...{ expenses, dateGroupings, initialBudget, dailyBudget }}
							/>
						</Paper>
					</div>
				</MuiThemeProvider>
			</div>
		)
	}
}

export default FirebaseWrapper(App, firebase)
