const supportsSymbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ELEMENT_TYPE = supportsSymbol
	? Symbol.for('react.element') // 独一无二的值
	: 0xeac7;
