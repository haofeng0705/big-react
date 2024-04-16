import { FiberNode } from './fiber';

// 获取函数组件并将props传入,返回执行结果
export function renderWithHooks(wip: FiberNode) {
	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	return children;
}
