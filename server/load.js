import { createReadStream } from "fs"
import { join } from "path"
import { checkFileType } from "./utilites"
import { PATH_APP } from "./../config"

function loadFile (res, filePath) {
  const fileFullPath = join(PATH_APP, filePath)
  try {
    const { contentType } = checkFileType(fileFullPath)
    let supportedFileReadStrem = createReadStream(fileFullPath)
    res.setHeader("Content-Type", contentType)
    supportedFileReadStrem.pipe(res)
  }
  catch (error) { throw error }
}

function loadTemplate (res, templatePath) {
  const templateFullPath = join(PATH_APP, templatePath)
  try {
    const { contentType } = checkFileType(templateFullPath)
    let supportedFileReadStrem = createReadStream(templateFullPath)
    res.setHeader("Content-Type", contentType)
    supportedFileReadStrem.pipe(res)
  }
  catch (error) { throw error }
}

export { loadFile, loadTemplate }