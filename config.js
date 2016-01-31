import { join } from "path"

const HTTP_SERVER_PATH = "127.0.0.1"
const HTTP_SERVER_PORT = 5000
const DB_SERVER_PATH = "postgres://postgres:postgres@localhost:5432/postgres"
const SOCKET_SERVER_PORT = 5001
const BASE_PATH = __dirname
const APP_PATH = join(__dirname, "/app")
const STEAM_API_KEY = "072B28626EB02FB62FCCDF0D5868AA7F"

export { HTTP_SERVER_PATH, HTTP_SERVER_PORT, DB_SERVER_PATH, SOCKET_SERVER_PORT, BASE_PATH, APP_PATH, STEAM_API_KEY }