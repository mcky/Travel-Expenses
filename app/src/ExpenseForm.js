import React, { Component } from 'react'
import R from 'ramda'

import formatDate from 'date-fns/format'
import isToday from 'date-fns/is_today'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import DatePicker from 'material-ui/DatePicker'
import Form from 'react-material-ui-form-validator/lib/ValidatorForm'
import TextField from 'react-material-ui-form-validator/lib/TextValidator'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import './ExpenseForm.css'

const fields = ['amount', 'description', 'currency', 'exchangeRate', 'date']

const getLastExchangeRate = (currency, expenses) =>
	R.pipe(
		R.findLast(R.propEq('currency', currency)),
		R.propOr('', 'exchangeRate'),
	)(expenses)

class ExpenseForm extends Component {
	initialState = {
		currencyChanged: false,
		exchangeRateChanged: false,
		amount: '',
		description: '',
		currency: '',
		exchangeRate: '',
		date: new Date(),
		currencyList: [],
		disabled: false,
	}

	state = this.initialState

	handleChange = field => (evt, newValue) => {
		this.setState(prevState => ({
			[field]: newValue,
		}))

		if (field === 'exchangeRate') {
			this.setState(prevState => ({
				exchangeRateChanged: true,
			}))
		}
	}

	handleDateChange = (evt, date) => {
		this.handleChange('date')(evt, date)
	}

	handleCurrencyChange = (evt, i, newCurrency) => {
		const lastExchangeRateForCurrency = getLastExchangeRate(
			newCurrency,
			this.props.expenses,
		)

		this.setState({
			currencyChanged: true,
			exchangeRateChanged: false,
			currency: newCurrency,
			exchangeRate: lastExchangeRateForCurrency,
		})
	}

	submitForm = () => {
		this.refs.form.submit()
	}

	handleSubmit = () => {
		this.setState({ disabled: true }, () => {
			const formData = {
				...R.pick(fields, this.state),
				date: formatDate(this.state.date, 'YYYY-MM-DD'),
				timestamp: isToday(this.state.date)
					? Date.now()
					: Date.parse(this.state.date),
			}

			this.props.handleSubmit(formData)
			this.setState(this.initialState)
		})
	}

	handleClose = () => {
		this.setState(this.initialState)
		this.props.handleClose()
	}

	componentWillReceiveProps(nextProps) {
		const expenses = nextProps.expenses

		if (!this.state.currencyChanged) {
			const newCurrency = R.pipe(R.last, R.propOr('GBP', 'currency'))(expenses)

			this.setState({
				currency: newCurrency,
				exchangeRate: getLastExchangeRate(this.state.currency, expenses),
			})
		}

		this.setState({
			currencyList: R.uniq(R.map(R.prop('currency'), expenses)),
		})
	}

	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
			/>,

			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.submitForm}
				disabled={this.state.disabled}
			/>,
		]

		const fullWidth = { width: '100%' }
		const requiredField = {
			validators: ['required'],
			errorMessages: ['This field is required'],
		}

		return (
			<Dialog
				title="Add expense"
				actions={actions}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
				repositionOnUpdate={false}
				autoDetectWindowHeight={false}
				className="ExpenseDialog"
				contentClassName="ExpenseDialog__content"
				bodyClassName="ExpenseDialog__body"
			>
				<Form
					ref="form"
					onSubmit={this.handleSubmit}
					style={{ display: 'flex', flexDirection: 'column' }}
				>
					<TextField
						name="amount"
						floatingLabelText="Amount"
						type="number"
						value={this.state.amount}
						onChange={this.handleChange('amount')}
						style={fullWidth}
						{...requiredField}
					/>

					<TextField
						name="description"
						floatingLabelText="Description"
						value={this.state.description}
						onChange={this.handleChange('description')}
						style={fullWidth}
						{...requiredField}
					/>

					<SelectField
						name="currency"
						floatingLabelText="Currency"
						value={this.state.currency}
						maxHeight={200}
						onChange={this.handleCurrencyChange}
						style={fullWidth}
					>
						{this.state.currencyList.map(currency => (
							<MenuItem
								value={currency}
								primaryText={currency}
								key={currency}
							/>
						))}
					</SelectField>

					<TextField
						name="exchangeRate"
						floatingLabelText="Exchange Rate"
						type="number"
						value={this.state.exchangeRate}
						onChange={this.handleChange('exchangeRate')}
						style={fullWidth}
						{...requiredField}
					/>

					<DatePicker
						name="date"
						floatingLabelText="Date"
						autoOk={true}
						value={this.state.date}
						onChange={this.handleDateChange}
						style={fullWidth}
						textFieldStyle={fullWidth}
					/>
				</Form>
			</Dialog>
		)
	}
}

export default ExpenseForm
