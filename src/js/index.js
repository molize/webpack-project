import '../css/index.css';
import '../css/main.scss';
import '../iconfont/iconfont.css';

import printMe from './print';

console.log('开始执行了');

if (module.hot) {
  module.hot.accept('./print.js', () => {
    console.log('Accepting the updated printMe module!');
    printMe();
  });
}
// import '@babel/polyfill';

const add = (x, y) => x + y;
// 下一行eslint所有规则都失效（下一行不进行eslint检查）
// eslint-disable-next-line
console.log(add(1, 9));

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了');
    resolve();
  }, 1000);
});

console.log(promise);
