export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0; // 函数组件
export const HostRoot = 3; // 挂载的根节点 ReactDOM.render(<App />, document.getElementById('root'))

export const HostComponent = 5; // 原生标签 div span
// <div>123</div>
export const HostText = 6; // 文本节点 123
