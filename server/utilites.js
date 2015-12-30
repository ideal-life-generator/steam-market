const FILES_SUPPORTED = /.(html|css|js|png|ttf)$/

const TEMPLATES_SUPPORTED = [
  {
    test: /^\/$/,
    path: "index.html"
  },
  {
    test: /^\/signin$/,
    path: "signin.html"
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

function streamToString (stream, callback) {
  let result = ""
  stream.setEncoding("utf-8")
  stream.on("data", (chunk) => {
    result += chunk
  })
  stream.on("end", () => {
    callback(result)
  })
}

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

export { streamToString, checkSupportTemplate, checkSupportFile, checkFileType }