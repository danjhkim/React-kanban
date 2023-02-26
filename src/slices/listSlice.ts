import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

interface TasksOject {
	content: String | null;
	id: String;
}

const tasks: TasksOject[] = [
	{
		id: '1',
		content: `Task 1`,
	},
	{
		id: '2',
		content: `Task 2`,
	},
];

const initialState = tasks;

const listSlice = createSlice({
	name: 'listSlice',
	initialState,
	reducers: {
		addTask: (state, action) => {
			state.push(action.payload);
		},
		removeTaskFunc: (state, action) => {
			return state.filter(item => {
				return item.id !== action.payload;
			});
		},
	},
});

export const { addTask, removeTaskFunc } = listSlice.actions;

export default listSlice.reducer;
