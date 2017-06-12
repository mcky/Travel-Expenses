import React from 'react'
import ExpenseList from './ExpenseList'
import { getTotalSpend, round } from './utils/'

import { Card, CardHeader, CardText } from 'material-ui/Card'

const ExpenseDateGroup = props => {
	const { date, items } = props
	const dailySpend = getTotalSpend(items)

	return (
		<Card initiallyExpanded={props.initiallyExpanded}>
			<CardHeader
				title={new Date(date).toDateString()}
				subtitle={`Total: £${dailySpend} (£${round(2, dailySpend / 2)} pp)`}
				actAsExpander={true}
				showExpandableButton={true}
			/>
			<CardText expandable={true} style={{ padding: 0 }}>
				<ExpenseList items={items} />
			</CardText>
		</Card>
	)
}

const ExpenseDateGroups = props => {
	return (
		<div style={props.style}>
			{props.dateGroupings.map(([date, items], i, list) => {
				const isLast = i === list.length - 1
				return (
					<ExpenseDateGroup
						{...{ items, date }}
						key={date}
						initiallyExpanded={isLast}
					/>
				)
			})}
		</div>
	)
}

export default ExpenseDateGroups
