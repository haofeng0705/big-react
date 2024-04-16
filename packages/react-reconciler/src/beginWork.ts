import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	HostRoot,
	HostComponent,
	HostText,
	FunctionComponent
} from './workTags';
import { renderWithHooks } from './fiberHooks';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// 比较，返回子fiberNode
	switch (wip.tag) {
		case HostRoot: // 对应于根节点
			return updateHostRoot(wip);
		case HostComponent: // 对应于真实的DOM元素
			return updateHostComponent(wip);
		case HostText:
			return null; // 文本节点不需要更新，没有子节点(叶子结点,递到这里就结束了)
		case FunctionComponent:
			return updateFunctionComponent(wip);
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState; // wip 的 memoizedState 是上一次的状态，对首屏来说是 null
	const updateQueue = wip.updateQueue as UpdateQueue<Element>; // wip 的 updateQueue 是上一次的更新队列
	const pending = updateQueue.shared.pending; // 从更新队列中取出更新
	updateQueue.shared.pending = null; // 清空更新队列
	const { memorizedSate } = processUpdateQueue(baseState, pending); // 消费更新, 这里的 memoizedState 是新的状态
	wip.memoizedState = memorizedSate;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 与 updateHostRoot 类似，不同的是这里的 wip 是 HostComponent 类型，不触发更新
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 返回子fiberNode
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
