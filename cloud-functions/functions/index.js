const GoogleSpreadsheet = require('google-spreadsheet')
const functions = require('firebase-functions')
const R = require('ramda')
const promisify = require('es6-promisify')

const promisifyMethods = obj =>
	R.pipe(R.filter(R.is(Function)), R.map(promisify), R.mergeDeepRight(obj))(obj)

const addExpenses = (worksheet, expenses) => {
	const headerRow = R.pipe(R.head, R.keys, R.sortBy(R.toLower))(expenses)

	return worksheet
		.resize({ colCount: headerRow.length, rowCount: expenses.length + 1 })
		.then(() => worksheet.setHeaderRow(headerRow))
		.then(() =>
			worksheet.getCells({ 'return-empty': true }).then(cells => {
				expenses.forEach((expense, i) => {
					return cells.filter(cell => cell.row === i + 2).forEach((cell, j) => {
						cell.value = R.propOr('', headerRow[j], expense)
					})
				})

				return worksheet.bulkUpdateCells(cells)
			})
		)
}

exports.updateExpenseSpreadsheet = functions.database
	.ref('/expenses')
	.onWrite(event => {
		const {
			sheet_key,
			service_account,
			worksheet_name
		} = functions.config().sheets
		const expenses = R.values(event.data.val())
		const spreadsheet = promisifyMethods(new GoogleSpreadsheet(sheet_key))

		return spreadsheet
			.useServiceAccountAuth(service_account)
			.then(() => spreadsheet.getInfo())
			.then(
				R.pipe(R.prop('worksheets'), R.find(R.propEq('title', worksheet_name)))
			)
			.then(promisifyMethods)
			.then(worksheet => addExpenses(worksheet, expenses))
			.catch(console.log)
	})
