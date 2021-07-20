import { name } from './utils/http.js'; // 实际上这里是解析不了的 需要使用插件钩子 resolveId 处理 路径;

// NOT GO 处理css 文件
import './style.css';
const path = "";


console.log(path)


console.log(import.meta)


const user = {
  name: "ck",
  age: 22,
  sex: 1
}

for (const key in user) {
  if (Object.hasOwnProperty.call(user, key)) {
    const value = user[key];
    console.log(key, value)
  }
}
