import { get as requestGet } from "./../request"

function steamSigninCheck (signinQueryCheck, signinCallback) {
  requestGet("steamcommunity.com", `/openid/login?${signinQueryCheck}`, (result) => {
    const isValid = (/is_valid:true/).test(result)
    signinCallback(isValid)
  })
}

export { steamSigninCheck }