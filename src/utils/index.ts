//导入hljs相关内容
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml' // HTML 使用 xml 模块
import css from 'highlight.js/lib/languages/css'
import less from 'highlight.js/lib/languages/less' // 导入 Less 支持
// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', html)
hljs.registerLanguage('css', css)
hljs.registerLanguage('less', less)

/**
 * 返回一个a到b之间的随机数
 * @param a 
 * @param b 
 * @returns 
 */
const random = (a:number,b:number)=>{
 return Math.random()*(b-a) + a
}

export{
  random,
  hljs,
}