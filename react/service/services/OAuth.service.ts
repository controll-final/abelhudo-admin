import { OAuth } from "../@types";
import Service from "../Service";

const clientId = "controll-admin-2TJHMU";
const secret =
  "Z0SEF58HBO8TBMJYIAH2JIMJ1WFW8VGQ6RRQRZHGAOM3EU27F64SHQFFTR7YSZ44XOYEOFZG6QQ6IM1ZTAE5ZUHNXT55GB8J32IRERZPJR01DXCXID5U1OZXVKD0C9A1";

class OAuthService extends Service {
  static getAuthorizationToken() {
    const basicAuth = Buffer.from(`${clientId}:${secret}`).toString("base64");
    return this.Http.post<OAuth.Token>(
      "/oauth/token",
      "grant_type=client_credentials&scope=ADMIN",
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/plain, */*",
          Authorization: `Basic ${basicAuth}`,
        },
      }
    ).then(this.getData);
  }
}

export default OAuthService;
