import React, { Component } from 'react'
import R from 'ramda'

const toArrayWithID = R.pipe(
	R.toPairs,
	R.map(([key, expense]) => R.assoc('_id', key, expense)),
)

const sortByTimestamp = R.sortWith([R.ascend(R.prop('timestamp'))])

function FirebaseWrapper(WrappedComponent, firebase) {
	var database = (window.database = firebase.database())

	return class extends Component {
		state = {
			expenses: [],
		}

		componentDidMount() {
			this.refreshExpenses()

			const updatesList = this.getPendingUpdates()
			if (updatesList.length > 0) {
				R.map(this.updateFirebase, updatesList)
			}

			database.ref('/expenses/').on('value', snapshot => {
				localStorage.setItem('lastSnapshot', JSON.stringify(snapshot.val()))
				this.refreshExpenses()
			})

			database.ref('.info/connected').on('value', snap => {
				this.setState({
					online: snap.val() === true,
				})
			})
		}

		getPendingUpdates = () => JSON.parse(localStorage.getItem('updates')) || []

		updateFirebase = updates => {
			return database.ref().update(updates).then(() => {
				const cachedUpdates = R.pipe(
					this.getPendingUpdates,
					R.reject(R.equals(updates)),
					JSON.stringify,
				)()

				localStorage.setItem('updates', cachedUpdates)
			})
		}

		updateAndCache = updates => {
			const allUpdates = this.getPendingUpdates().concat(updates)
			localStorage.setItem('updates', JSON.stringify(allUpdates))

			if (!this.state.online) {
				this.refreshExpenses()
			}

			return this.updateFirebase(updates)
		}

		refreshExpenses = () => {
			return this.getExpenses().then(expenses => {
				this.setState({ expenses })
			})
		}

		getExpenses = () => {
			if (!this.state.online) {
				const updates = R.pipe(R.reduce(R.mergeDeepRight, {}))(
					this.getPendingUpdates(),
				)

				return Promise.resolve(localStorage.getItem('lastSnapshot')).then(
					R.pipe(
						JSON.parse,
						R.mergeDeepRight(updates),
						R.reject(R.isNil),
						toArrayWithID,
						sortByTimestamp,
					),
				)
			}

			return database
				.ref('expenses')
				.once('value')
				.then(snapshot => snapshot.val())
				.then(toArrayWithID)
				.then(sortByTimestamp)
		}

		addExpense = item => {
			var key = database.ref('expenses').child('posts').push().key

			const updates = {
				[`expenses/${key}`]: item,
			}

			return this.updateAndCache(updates)
		}

		removeExpense = expense =>
			this.updateAndCache({
				[`/expenses/${expense._id}`]: null,
			})

		render() {
			return (
				<WrappedComponent
					{...this.props}
					expenses={this.state.expenses}
					addExpense={this.addExpense}
					removeExpense={this.removeExpense}
				/>
			)
		}
	}
}

export default FirebaseWrapper
