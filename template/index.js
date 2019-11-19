/**
 * ifuner 制作 757148586@qq.com
 */

const chalk = require("chalk")
const path = require("path")
const inquirer = require("inquirer")
const dirCopy = require("./dirCopy")
const spawn = require("cross-spawn")
const fs = require("fs-extra")
const utils = require("./utils")
const fn = async function () {
    const cwd = process.cwd()
    const regexp = /^[a-zA-Z]+$/
    const regexpPath = /^([a-zA-Z])+/g
    const viewsLabel = "创建pages页面"
    const answerCreateType = await inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: chalk.green("请选择创建的类型："),
            choices: [viewsLabel, "创建components页面"],
            default: viewsLabel,
            validate: type => (type ? true : "请选择创建的类型")
        }
    ])

    let shouldCreateViews = answerCreateType.type === viewsLabel
    let targetFolder = shouldCreateViews ? "pages" : "components"

    const showtype = shouldCreateViews ? "pages页面" : "components组件"
    const VueName = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: chalk.green(`请输入${showtype}名称：`),
            validate: msg =>
                regexp.test(msg)
                    ? true
                    : msg
                    ? `${showtype}必须是英文字母开头，请重新输入`
                    : `请输入${showtype}名称`
        }
    ])

    const defaultSettings = "使用默认目标目录配置---使用默认"
    const answerPath = await inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: chalk.green("请选择是否需要自定义生成的目标路径："),
            choices: [defaultSettings, "使用自定义的目标目录配置---自定义"],
            default: defaultSettings,
            validate: type => (type ? true : "请选择是否需要自定义生成的目标路径")
        }
    ])
    let target = path.join(cwd, `./src/${targetFolder}/${VueName.name}`)
    if (answerPath.type !== defaultSettings) {
        // 填写目标路径
        const custompath = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: chalk.green(
                    `请输入${showtype}目标路径(reletive path like: web/components/businessComponents)：`
                ),
                validate: msg =>
                    regexpPath.test(msg)
                        ? true
                        : msg
                        ? `${showtype}必须是英文字母开头，请重新输入`
                        : `这个路径不能为空啊~（示例：like: web/components/businessComponent）`
            }
        ])

        target = path.join(cwd, `/${custompath.name}/${VueName.name}`)
    }
    const username = spawn.sync("git", ["config", "user.name"]).stdout.toString().trim() || ""
    const useremail = spawn.sync("git", ["config", "user.email"]).stdout.toString().trim() || ""
    const createTime = utils.formatTime()
    dirCopy({
        src: path.join(cwd, `/template/${targetFolder}/`),
        dist: target,
        sstrRpelace: [
            {
                oldText: "create-page-name",
                newText: VueName.name
            },
            {
                oldText: "create-user-name",
                newText: username
            },
            {
                oldText: "create-user-email",
                newText: useremail
            },
            {
                oldText: "create-time",
                newText: createTime
            }
        ],
        filenameTransformer(name) {
            name = name.replace("_index", VueName.name)
            return name
        },
        data: {}
    })
    if (shouldCreateViews) {
        // 读取json 文件并写入json 文件
        const appPath = path.join(cwd, `/src/app.json`)
        let appJson = require(appPath)
        appJson.pages.push(`pages/${VueName.name}/${VueName.name}`)
        try {
            fs.writeJsonSync(appPath, appJson)
            console.log(chalk.green(`app.json page 路由写入成功~`))
        } catch (e) {
            console.log("写入json文件出错", e);
        }
    }

};
fn()
