import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	// 类型声明
	type: any;
	key: Key;
	tag: WorkTag;
	pendingProps: Props;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	updateQueue: unknown;
	memoizedState: any;
	index: number;
	ref: Ref;
	memoizedProps: Props | null;
	alternate: FiberNode | null; // 用于双缓存技术，如果当前fibernode 是 current，则 alternate 是 workInProgress，反之亦然
	flags: Flags; // 用于标记当前节点的状态

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 在构造函数中初始化属性
		this.tag = tag;
		this.key = key;
		this.pendingProps = pendingProps;
		this.stateNode = null; // 对于原生标签，比如 div、span，stateNode 是真实的 DOM 节点
		this.type = null; // 对于函数组件，type 是函数本身，例如 () => {}

		// 构成树状结构
		this.return = null; // 指向父节点
		this.child = null; // 指向第一个子节点
		this.sibling = null; // 指向下一个兄弟节点
		this.index = 0; // 在父节点中的索引 <ul> <li>1</li> <li>2</li> </ul> li 1 的 index 是 0，li 2 的 index 是 1

		this.ref = null; // ref 属性

		// 作为工作单元
		this.pendingProps = pendingProps; // 刚开始工作的时候，这个属性存储的是 props
		this.memoizedProps = null; // 确定下来的 props

		this.alternate = null; // 用于双缓存技术
		this.updateQueue = null; // 更新队列

		// 副作用标记
		this.flags = NoFlags; // 标记当前节点的状态
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null; // 已经完成的工作单元
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};
