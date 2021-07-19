import { name } from './utils/http.js'; // 实际上这里是解析不了的 需要使用插件钩子 resolveId 处理 路径;

// NOT GO 处理css 文件
import './style.css';
const path = "";

console.log(import.meta)