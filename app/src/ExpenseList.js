import React from 'react'

import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'

import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const ExpenseList = props => {
	return (
		<Table selectable={false}>
			<TableHeader adjustForCheckbox={false} displaySelectAll={false}>
				<TableRow>
					{['Amount', 'Description', ''].map((header, i) => (
						<TableHeaderColumn key={i}>{header}</TableHeaderColumn>
					))}
				</TableRow>
			</TableHeader>

			<TableBody displayRowCheckbox={false}>
				{props.items.map(item => (
					<TableRow key={item._id}>
						<TableRowColumn>
							{item.amount} {item.currency}
						</TableRowColumn>

						<TableRowColumn>{item.description}</TableRowColumn>

						<TableRowColumn style={{ float: 'right' }}>
							<IconMenu
								onItemTouchTap={() => props.removeExpense(item)}
								iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							>
								<MenuItem primaryText="Remove" />
							</IconMenu>
						</TableRowColumn>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default ExpenseList
