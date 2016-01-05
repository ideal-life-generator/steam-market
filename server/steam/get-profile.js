import httpRequest from "./../http-request"
import { STEAM_API_KEY } from "./../../config"

function getProfile (steamId, steamProfileCallback) {
  httpRequest.get("api.steampowered.com", `/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`, (steamProfileResponse) => {
    const { response: { players: [ steamProfile ] } } = steamProfileResponse
    const parsedSteamProfile = {
      avatarUrl: steamProfile.avatar,
      avatarMediumUrl: steamProfile.avatarmedium,
      avatarFullUrl: steamProfile.avatarfull,
      name: steamProfile.personaname,
      profileUrl: steamProfile.profileurl,
      steamId: steamProfile.steamid
    }
    steamProfileCallback(parsedSteamProfile)
  })
}

export default getProfile