import React from 'react'

import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'

const ExpenseList = props => {
	return (
		<Table selectable={false}>
			<TableHeader adjustForCheckbox={false} displaySelectAll={false}>
				<TableRow>
					<TableHeaderColumn key={1}>Amount</TableHeaderColumn>
					<TableHeaderColumn key={2}>Description</TableHeaderColumn>
				</TableRow>
			</TableHeader>

			<TableBody displayRowCheckbox={false}>
				{props.items.map(item => (
					<TableRow key={item._id}>
						<TableRowColumn>{item.amount} {item.currency}</TableRowColumn>
						<TableRowColumn>{item.description}</TableRowColumn>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default ExpenseList
