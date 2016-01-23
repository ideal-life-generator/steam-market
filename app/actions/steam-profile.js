import { REQUEST_STEAM_PROFILE, RECEIVE_STEAM_PROFILE } from "constants/steam-profile"

function requestSteamProfile () {
  return {
    type: REQUEST_STEAM_PROFILE
  }
}

function receiveSteamProfile (steamProfile) {
  return {
    type: RECEIVE_STEAM_PROFILE,
    steamProfile: steamProfile
  }
}

export { requestSteamProfile, receiveSteamProfile }