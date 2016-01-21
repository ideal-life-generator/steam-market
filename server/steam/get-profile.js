import httpRequest from "./../http-request"
import { STEAM_API_KEY } from "./../../config"

function getAvatarId (avatarUrl) {
  const avatarMatch = avatarUrl.match(/https:\/\/steamcdn-a.akamaihd.net\/steamcommunity\/public\/images\/avatars\/be\/(.*).jpg/)
  const avatarId = avatarMatch[1]
  return avatarId
}

function getProfile (steamId, steamProfileCallback) {
  httpRequest.get("api.steampowered.com", `/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`, (steamProfileResponse) => {
    const { response: { players: [ steamProfile ] } } = steamProfileResponse
    const avatarId = getAvatarId(steamProfile.avatar)
    const parsedSteamProfile = {
      name: steamProfile.personaname,
      avatarId
    }
    steamProfileCallback(parsedSteamProfile)
  })
}

export default getProfile