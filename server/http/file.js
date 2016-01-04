import url from "url"
import querystring from "querystring"
import { checkSupportTemplate, checkSupportFile } from "./../utilites"
import { loadTemplate, loadFile } from "./../load"

function file (req, res) {
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

export { file }