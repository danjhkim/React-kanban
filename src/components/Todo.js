import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import '../styles/Todo.css';

import { addTask, removeTaskFunc } from '../slices/listSlice';

const Todo = () => {
	const tasks = useSelector(state => state.listSlice);
	const dispatch = useDispatch();
	const [inputTask, setInputTask] = useState('');

	const [list, setList] = useState({
		1: tasks,
		2: [],
		3: [],
	});

	//indexing based on tasks
	const [taskIds, setTaskIds] = useState(['1', '2']);

	//on Drag
	const onDragEnd = result => {
		const { destination, source } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const sourceColumn = list[source.droppableId];
		const destinationColumn = list[destination.droppableId];

		if (sourceColumn === destinationColumn) {
			const newTasks = Array.from(sourceColumn);
			const [removedTask] = newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, removedTask);
			setList({
				...tasks,
				[source.droppableId]: newTasks,
			});
		} else {
			const sourceTasks = Array.from(sourceColumn);
			const [removedTask] = sourceTasks.splice(source.index, 1);
			const destinationTasks = Array.from(destinationColumn);
			destinationTasks.splice(destination.index, 0, removedTask);
			setList({
				...list,
				[source.droppableId]: sourceTasks,
				[destination.droppableId]: destinationTasks,
			});
		}
	};

	//on Add
	const onTaskAdd = e => {
		e.stopPropagation();
		let id = uuidv4();
		const newTask = { id: id, content: inputTask };
		setInputTask('');
		dispatch(addTask(newTask));

		const newTasks = { ...list, 1: [...list[1], newTask] };
		setList(newTasks);
		setTaskIds([...taskIds, id]);
	};

	//on Delete
	const onTaskDelete = id => {
		const newTasks = {};
		dispatch(removeTaskFunc(id));
		Object.keys(list).forEach(key => {
			const newColumn = list[key].filter(task => task.id !== id);
			newTasks[key] = newColumn;
		});
		setList(newTasks);
		setTaskIds(taskIds.filter(taskId => taskId !== id));
	};

	return (
		<div className='todo'>
			<div className='todo-header'>
				<h2>To Do List</h2>
			</div>
			<div className='add-block'>
				<h3>Add Task</h3>
				<div className='inputBlock'>
					<input
						className='add-field '
						type='text'
						placeholder='Add a task'
						onChange={e => {
							setInputTask(e.target.value);
						}}
						value={inputTask}
					/>
				</div>
				<div className='buttonBox'>
					<button className='add-button' onClick={e => onTaskAdd(e)}>
						+
					</button>
				</div>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='table'>
					{[1, 2, 3].map(columnId => (
						<div key={columnId} className='tasks'>
							<h3>Section {columnId}</h3>
							<Droppable droppableId={columnId.toString()}>
								{(provided, snapshot) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className='tasklist'
										style={{
											backgroundColor:
												snapshot.isDraggingOver
													? 'lightblue'
													: 'white',
										}}>
										{list[columnId].map((task, index) => (
											<Draggable
												key={task.id}
												draggableId={task.id}
												index={index}>
												{(provided, snapshot) => (
													<div
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														ref={provided.innerRef}
														className='task'
														style={{
															backgroundColor:
																snapshot.isDragging
																	? '#eee'
																	: '#fff',
															...provided
																.draggableProps
																.style,
														}}>
														<span>
															{task.content}
														</span>

														<button
															onClick={() =>
																onTaskDelete(
																	task.id,
																)
															}
															className='task-remove'></button>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					))}
				</div>
			</DragDropContext>
		</div>
	);
};

export default Todo;
