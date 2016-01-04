import { get as requestGet } from "./../request"
import { STEAM_API_KEY } from "./../../config"

function getProfileSteam (steamProfileId, steamProfileCallback) {
  requestGet("api.steampowered.com", `/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamProfileId}`, (userProfileResponse) => {
    const { response: { players: [ userProfile ] } } = userProfileResponse
    const parsedUserProfile = {
      avatarUrl: userProfile.avatar,
      avatarMediumUrl: userProfile.avatarmedium,
      avatarFullUrl: userProfile.avatarfull,
      name: userProfile.personaname,
      profileUrl: userProfile.profileurl,
      steamId: userProfile.steamid
    }
    steamProfileCallback(parsedUserProfile)
  })
}

export { getProfileSteam }