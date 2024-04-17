// import { Dispatch } from 'react/src/currentDispatcher';
// import { Dispatcher } from 'react/src/currentDispatcher';
import internals from 'shared/internals';
import { Action } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { Dispatcher, Dispatch } from './currentDispatcher';

let currentlyRenderingFiber: FiberNode | null = null; // 当前正在渲染的fibernode,为了能记住状态
let workInProgressHook: Hook | null = null; // 当前正在处理的hook

const { currentDispatcher } = internals;
interface Hook {
	memorizedState: any; // 每个 hook 内的状态, 要区分和fiberNode的memorizedState字段
	updateQueue: unknown;
	next: Hook | null;
}

// 获取函数组件并将props传入,返回执行结果
export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	// 重置
	wip.memorizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前useState对应的hook数据
	const hook = mountWorkInProgresHook();
	let memorizedState;
	if (initialState instanceof Function) {
		memorizedState = initialState();
	} else {
		memorizedState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memorizedState = memorizedState;

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memorizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgresHook(): Hook {
	const hook: Hook = {
		memorizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		// mount时 第一个hook
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		// mount时 后续的hook
		workInProgressHook.next = hook; // 形成单向的链表
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
