import { request as httpsRequest } from "https"

const REQUEST_SUPPORTED_CONTENT_TYPES = /(text\/plain)/

const REQUEST_PARSER_CONTENT_TYPES = [
  {
    test: /text\/plain/,
    encode: "UTF-8",
    parser (data) { return data }
  }
]

function get (signinQueryCheck, callback) {
  try {
    let req = httpsRequest({
      method: "GET",
      host: "steamcommunity.com",
      path: `/openid/login?${signinQueryCheck}`
    }, (res) => {
      const { headers } = res
      const { "content-type": contentType } = headers
      const isSupportedContentType = REQUEST_SUPPORTED_CONTENT_TYPES.test(contentType)
      if (isSupportedContentType) {
        const { encode } = REQUEST_PARSER_CONTENT_TYPES.find((parseContentType) => {
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
    })
    req.end()
  }
  catch (error) { throw error }
}

export { get }