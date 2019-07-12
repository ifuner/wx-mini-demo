"use strict"
const chalk = require("chalk")
const fs = require("fs-extra")
const path = require("path")
const _ = require("underscore")
_.templateSettings = {
  evaluate: /<{%([\s\S]+?)%}>/g,
  interpolate: /<{%=([\s\S]+?)%}>/g,
  escape: /<{%-([\s\S]+?)%}>/g
}

/**
 * 复制文件
 * 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
 * @param {object} options
 * @exmaple
 * options.src 绝对路径
 * options.dist 绝对路径
 * options.stringReplace 数组 , 将文件里面匹配到的字符串替换掉,如 [ { placeholder: 'PLACEHOLDER', value: 'theReplaceValue' } ]
 * options.data
 *
 */

function copyDirectory(options) {
  // 递归读取目录
  const recursiveDir = (curSrcPath, curDistPath) => {
    const stats = fs.statSync(curSrcPath)

    if (stats.isDirectory()) {
      // 若目标目录不存在, 会创建一个
      fs.mkdirsSync(curDistPath)

      const dirFiles = fs.readdirSync(curSrcPath)

      for (let i = 0; i < dirFiles.length; i += 1) {
        if (options.ignore.indexOf(dirFiles[i]) === -1) {
          recursiveDir(
            path.resolve(curSrcPath, dirFiles[i]),
            path.resolve(curDistPath, dirFiles[i])
          )
        }
      }
    } else {
      curDistPath = curDistPath.split(path.sep)

      // 文件名转换
      const newFilename = options.filenameTransformer(curDistPath.pop())
      if (!newFilename) {
        return
      }
      curDistPath = path.resolve(curDistPath.join(path.sep), newFilename)

      // 文件内容变量替换
      let fileContent = fs
        .readFileSync(curSrcPath, {encoding: options.encoding})
        .toString()
      fileContent = _.template(fileContent)(options.data)
      for (let j = 0; j < options.sstrRpelace.length; j += 1) {
        fileContent = fileContent.replace(
          new RegExp(options.sstrRpelace[j].oldText, "g"),
          options.sstrRpelace[j].newText
        )
      }

      const writeErr = fs.writeFileSync(curDistPath, fileContent)
      if (!writeErr) {
        console.log(chalk.green(`${curDistPath} 写入成功`))
      } else {
        console.log(`${curDistPath} 写入失败`)
      }
    }
  }

  options = options || {}

  if (!options.src || !options.dist) {
    console.log(
      "Please import the source file directory path (src) and the target directory path (dist)"
    )
    return
  }

  if (!fs.existsSync(options.src)) {
    console.log(
      `The source file directory does not exist， src = ${options.src} This directory or file does not exist`
    )
    return
  }

  options.data = options.data || {}
  options.ignore = options.ignore || ["node_modules", ".DS_Store", ".idea"]
  options.stringReplace = options.stringReplace || []
  options.filenameTransformer = options.filenameTransformer || (a => a)

  // 开发者可以自定义模板标签类型
  if (options.templateSettings) {
    _.templateSettings = Object.assign(
      {},
      _.templateSettings,
      options.templateSettings
    )
  }

  recursiveDir(options.src, options.dist)
}

module.exports = copyDirectory
