import fs from "fs"
import path from "path"
import url from "url"
import querystring from "querystring"
import { PATH_APP } from "./../../config"

const FILES_SUPPORTED = /.(html|css|js|png|ttf)$/

const TEMPLATES_SUPPORTED = [
  {
    test: /^\/$/,
    path: "index.html"
  },
  {
    test: /^\/signin$/,
    path: "additionals/signin.html"
  }
]

const FILES_SUPPORTED_TYPES = [
  {
    test: /.html$/,
    contentType: "text/html"
  },
  {
    test: /.css$/,
    contentType: "text/css"
  },
  {
    test: /.js$/,
    contentType: "application/javascript"
  },
  {
    test: /.png$/,
    contentType: "image/png"
  },
  {
    test: /.ttf$/,
    contentType: "application/octet-stream"
  }
]

function checkSupportTemplate (path) {
  return TEMPLATES_SUPPORTED.find((template) => {
    return template.test.test(path)
  })
}

function checkSupportFile (path) {
  return FILES_SUPPORTED.test(path)
}

function checkFileType (filePath) {
  return FILES_SUPPORTED_TYPES.find((fileType) => {
    return fileType.test.test(filePath)
  })
}

function loadTemplate (res, templatePath) {
  const templateFullPath = path.join(PATH_APP, templatePath)
  try {
    const { contentType } = checkFileType(templateFullPath)
    let supportedFileReadStrem = fs.createReadStream(templateFullPath)
    res.setHeader("Content-Type", contentType)
    supportedFileReadStrem.pipe(res)
  }
  catch (error) { throw error }
}

function loadFile (res, filePath) {
  const fileFullPath = path.join(PATH_APP, filePath)
  try {
    const { contentType } = checkFileType(fileFullPath)
    let supportedFileReadStrem = fs.createReadStream(fileFullPath)
    res.setHeader("Content-Type", contentType)
    supportedFileReadStrem.pipe(res)
  }
  catch (error) { throw error }
}

function fileStream (req, res) {
  const fullUrl = req.url
  const urlParsed = url.parse(fullUrl)
  const pathname = urlParsed.pathname
  const urlQuery = urlParsed.query
  const query = querystring.parse(urlQuery)
  const isSupportedTemplate = checkSupportTemplate(pathname)
  if (isSupportedTemplate) {
    loadTemplate(res, isSupportedTemplate.path)
  }
  else if (!urlQuery) {
    const isSupportedFile = checkSupportFile(pathname)
    if (isSupportedFile) {
      loadFile(res, pathname)
    }
  }
}

export default fileStream