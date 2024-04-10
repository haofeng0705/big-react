import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 函数的泛型写法
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

// 消费 update
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizedSate: State } => {
	// 返回值
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedSate: baseState
	};

	// 消费的过程
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// 如果是函数，执行函数
			// baseState 1 upadate (x) => 4x -> memorizedSate 4
			result.memorizedSate = action(baseState);
		} else {
			// 如果是对象，直接赋值
			// baseState 1 upadate 2 -> memorizedSate 2
			result.memorizedSate = action;
		}
	}

	return result;
};
