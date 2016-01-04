import { join } from "path"

const PORT_HTTP_SERVER = 5000
const PATH_HTTP_SERVER = "127.0.0.1"
const PATH_DB_SERVER = "postgres://postgres:postgres@localhost:5432/postgres"
const PORT_SOCKET_SERVER = 5001
const PATH_BASE = __dirname
const PATH_UTILITES = join(__dirname, "/server/utilites")
const PATH_APP = join(__dirname, "/app")
const STEAM_API_KEY = "072B28626EB02FB62FCCDF0D5868AA7F"

export { PORT_HTTP_SERVER, PATH_HTTP_SERVER, PATH_DB_SERVER, PORT_SOCKET_SERVER, PATH_BASE, PATH_UTILITES, PATH_APP, STEAM_API_KEY }