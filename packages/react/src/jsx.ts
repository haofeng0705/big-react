import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

// ReactElement

const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'haofeng'
	};
	return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];
		// key 和 ref 是特殊的属性
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val; // 转为字符串
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		// 其他属性
		if ({}.hasOwnProperty.call(config, prop)) {
			// 判断是否是自身属性添加到 props 对象中, 如果是原型链上的属性则不添加
			props[prop] = val;
			//这种方式是安全地在一个对象上设置属性的一个模式，它确保了只有对象自身的属性被处理
		}
	}
	const maybeChildrenLength = maybeChildren.length;
	// 如果有子元素
	if (maybeChildrenLength) {
		// 如果只有一个子元素
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		}
		// 如果有多个子元素
		else {
			props.children = maybeChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	return ReactElement(type, key, ref, props);
};
