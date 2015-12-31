import { request as httpsRequest } from "https"

const RESPONSE_SUPPORTED_CONTENT_TYPES = /(text\/plain)/

const RESPONSE_PARSER_CONTENT_TYPES = [
  {
    test: /text\/plain/,
    encode: "utf-8",
    parser (data) { return data }
  }
]

function get (host, path, callback) {
  try {
    let req = httpsRequest({
      method: "GET",
      host: host,
      path: path
    }, (res) => {
      const { headers } = res
      const { "content-type": contentType } = headers
      const isSupportedContentType = RESPONSE_SUPPORTED_CONTENT_TYPES.test(contentType)
      if (isSupportedContentType) {
        const { encode } = RESPONSE_PARSER_CONTENT_TYPES.find((parseContentType) => {
          return parseContentType.test.test(contentType)
        })
        res.setEncoding(encode)
        let result = ""
        res.on("data", (chunk) => {
          result += chunk
        })
        res.on("end", () => {
          callback(result)
        })
      }
      else {
        callback()
      }
    })
    req.end()
  }
  catch (error) { throw error }
}

export { get }