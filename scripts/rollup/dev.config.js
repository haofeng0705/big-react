import reactDomConfig from './react-dom.config';
import reactConfig from './react.config';

// 导出react和react-dom的配置(合并)
export default () => {
	return [...reactConfig, ...reactDomConfig];
};
