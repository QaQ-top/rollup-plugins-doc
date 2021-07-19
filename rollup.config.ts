import { defineConfig } from 'rollup';
// import {  } from '@/';
import { resolve } from 'path';

export default defineConfig({
  input: 'src/main.js',
  
  output: {
    file: 'dist/[name]-[hash].js',
    format: "cjs"
  },
  plugins: [
    {
      name: 'dev-plugin', // 插件名称
      // >构建钩子 -----------------------------------------------------------------
      options(inputOptions) {
        console.log("options >>>", "options");
        /**
         * 这是构建阶段的第一个钩子
         * 可以在这个阶段对配置项目进行一些修改，然后返回，返回 null 不会代替配置项
         * 推荐在 buildStart 钩子对配置项进行修改
         */
        return inputOptions
      },
      buildStart(options) {
        console.log("buildStart >>>", "options") 
      },
      resolveId(source, importer, options) {
        /**
         * 定义 自定义解析器 (主要是路径解析)
         * source: 当前文件的文件路径
         * importer: 引用这个文件 的 文件路径
         * options: 配置项
         * 返回 source 表示解析，null 按照原来的处理
         * 
         */
        console.log("resolveId >>>", source)
        let absolute  = '';
        
        if(importer) {
          const paths = importer.split("/");
          paths.pop();
          const dirname = paths.join("/");
          absolute = resolve(dirname, source);
        }

        /**
         * 最好的方式是 通过 rollup 自身上 Api 去获取正确的路径
         * this.resolve(source, importer, { skipSelf: true })
         */
        return absolute ? absolute : source;
      },
      load(id) {
        /**
         * 处理当前文件 输出内容
         * id: 当前文件的 id (文件路径)
         * 返回 code，返回 null 表示返回原文件 code
         * 
         * 高级 load 返回 ast必须是标准的ESTree ast
         * map 这一项我们只需要 关心 mappings属性，其它的一切 rollup 会帮我处理
         * {
         *   ast?: AcornNode;
         *   code: string;
         *   map?: SourceMapInput;
         * }
         */
        
        console.log("load >>>", id)
        return id === 'src/utils/http.js' ? 'export const name = "ck"' : null
      },
      transform(code, id) {
        /**
         * 与 load 不同的是 transform 可以接收到 文件内的 code
         * code: 文件内容
         * id: 当前文件的 id (文件路径)
         * 返回 code，返回 null 表示返回原文件 code
         * 
         * 高级 load 返回 ast必须是标准的ESTree ast
         * map 这一项我们只需要 关心 mappings属性，其它的一切 rollup 会帮我处理
         * {
         *   ast?: AcornNode;
         *   code: string;
         *   map?: SourceMapInput;
         * }
         */
         console.log("transform >>>", code)
        return code;
      },
      moduleParsed(info) {
        /**
         * 每次 Rollup 完全解析模块时都会调用此钩子。与transform钩子相反，此钩子从不缓存。
         * info: this.getModuleInfo传递给此钩子的信息
         */
        console.log("moduleParsed >>>", "info")
      },
      resolveDynamicImport(specifier, importer) {
        /**
         * 为动态导入定义自定义解析器。返回的false信号表明导入应该保持原样，
         * 而不是传递给其他解析器，从而使其成为外部。
         * 
         * 
         * 
         * 与resolveId钩子类似，还可以返回一个对象以将导入解析为不同的 id，同时将其标记为外部
         * {id: string, external?: boolean}
         */
        console.log(specifier, importer)
        return false
      },
      buildEnd(error) {
        /**
         * 构建阶段的最后一个钩子
         * error 上的属性
         * id: <错误id>,
         * pos: 15,
         * loc: { column: <错误列>, file: <错误文件>, line: <错误行> },
         * frame: <文件内错误位置展示>,
         * watchFiles: [ 'src/main.js', 'src/utils/http.js' ]
         */
        console.log("buildEnd >>>", error)
      },
      
      // >输出生成钩子 -----------------------------------------------------------------
      outputOptions(outputOptions) {
        /**
         * 这是输出生成的第一个钩子
         * 可以在这个阶段对配置项目进行一些修改，然后返回，返回 null 不会代替配置项
         * 推荐在 renderStart 钩子对配置项进行修改
         */
        return outputOptions;
      },
      renderStart(outputOptions, inputOptions) {
        console.log("renderStart >>>", "outputOptions, inputOptions") 
      },
      // 这几个 钩子 目前还没搞清楚用途
      // banner() {
      //   console.log("banner >>>")
      //   return ""
      // },
      // footer() {
      //   console.log("footer >>>")
      //   return ""
      // },
      // intro() {
      //   console.log("intro >>>")
      //   return ""
      // },
      // augmentChunkHash(chunkInfo) {
      //   console.log("augmentChunkHash >>>", chunkInfo);
      // },
      resolveFileUrl(options) {
        console.log("resolveFileUrl >>>", options)
        /**
         * import.meta.url 这个属性的的值
         */
        return `new URL('${options.fileName}', document.baseURI).href`;
      },
      resolveImportMeta(prop, options) {
        /**
         * 允许自定义处理 import.meta
         */
        console.log("resolveImportMeta >>>",prop, options)
        return null;
      },
      renderChunk(code, chunk, options) {
        /**
         * 生成 chunk，返回null将不应用任何转换
         * code: 最终输出代码
         * chunk: 当前输出的 chunk 信息
         * options: 配置项
         */
        console.log("renderChunk >>>", "生成 chunk");
        return code;
      },
      generateBundle(options, bundle, isWrite) {
        /**
         * 生成最终输出文件前调用
         * 提供正在写入或生成的文件的完整列表及其详细信息
         * 在这里可以 生成自定义文件
         * options: 配置项
         * bundle: chunk 和 asset 信息(最终的生成文件)
         * isWrite: 是否写入
         * 
         * asset 与 chunk 配置是有区别的
         * Asset {
         *   fileName: <最终输出文件名称 string>, 
         *   name?: <asset名称 string>,
         *   source: <文件内容 string | Uint8Array>,
         *   type: 'asset',
         * }
         * 
         * Chunk {
         *   type: 'chunk',
         *   name: <chunk名称 string>,
         *   code:  <文件内容 string>,
         *   fileName: <最终输出文件名称 string>
         *   ... 还有许多其它属性
         * }
         */
        // // 通过 this.emitFile 添加一个输出文件
        // this.emitFile({
        //   type: 'asset',
        //   fileName: "assets/build-test.json",
        //   source: JSON.stringify({name: "ck"})
        // });
        console.log("generateBundle >>>", "bundle");
      },
      writeBundle(options, bundle) {
        /**
         * 写入所有文件后调用
         * options: 配置项
         * bundle:  chunk 和 asset 信息
         * 这个钩子已经是输出输出阶段，
         */
        
        console.log("writeBundle >>>", "写入 打包文件成功");
      },
      closeBundle() {
        /**
         * 输出生成阶段结束后 会调用改钩子
         */
        console.log("closeBundle >>>")
      },
    }
  ]
});