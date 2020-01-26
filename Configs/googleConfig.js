const TOKEN_PATH = "token.json";
const SCOPE = ["https://www.googleapis.com/auth/calendar"];

const client_id = "364852496370-on266r1ur5visg4dvs05u10b9resm35v.apps.googleusercontent.com";
const redirect_uris = ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"];
const client_secret = "pPBHlDZhDkuctvvl5sgSTuaB";

module.exports = {
   client_id,
   redirect_uris,
   client_secret,
    TOKEN_PATH,
    SCOPE
}