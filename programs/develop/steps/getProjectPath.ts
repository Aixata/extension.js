// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import path from 'path'
import goGitIt from 'go-git-it'
import {blue, green, white, bold, underline} from '@colors/colors/safe'

async function importUrlSource(pathOrRemoteUrl: string, text: string) {
  if (new URL(pathOrRemoteUrl).hostname !== 'github.com') {
    console.log(`
      The remote extension URL must be stored on GitHub.
    `)
    process.exit(1)
  }

  await goGitIt(pathOrRemoteUrl, process.cwd(), text)

  return path.resolve(process.cwd(), path.basename(pathOrRemoteUrl))
}

export default async function getProjectPath(
  pathOrRemoteUrl: string | undefined
) {
  if (!pathOrRemoteUrl) {
    return process.cwd()
  }

  if (pathOrRemoteUrl.startsWith('http')) {
    if (!pathOrRemoteUrl.startsWith('https://github.com')) {
      console.log(
        `extension-create ►►► The remote extension URL must be stored on GitHub.`
      )
      process.exit(1)
    }

    const urlData = new URL(pathOrRemoteUrl).pathname.split('/')
    const owner = urlData.slice(1, 3)[0]
    const project = urlData.slice(1, 3)[1]
    const projectName = path.basename(pathOrRemoteUrl)
    console.log(
      `🧩 ${bold(`extension-create`)} ${green(`►►►`)} Fetching data from ${blue(underline(`https://github.com/${owner}/${project}`))}`
    )
    const downloadingText = `🧩 ${bold(`extension-create`)} ${green(`►►►`)} Downloading ${bold(projectName)}...`
    const urlSource = await importUrlSource(pathOrRemoteUrl, downloadingText)
    console.log(
      `🧩 ${bold(`extension-create`)} ${green(`►►►`)} Creating a new browser extension in ${white(underline(`${process.cwd()}/${projectName}`))}`
    )

    return urlSource
  }

  return path.resolve(process.cwd(), pathOrRemoteUrl)
}
