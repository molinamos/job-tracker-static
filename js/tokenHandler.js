class TokenHandler {
    constructor(rawToken) {
        this.username = null;
        this.rawToken = rawToken;

        let token = jwt.WebTokenParser.parse(rawToken);
        this.token = token;
        this.payload = JSON.parse(jwt.base64urldecode(token.payloadSegment));

        if(!this.validateToken()) {
            return;
        }
    }

    validateToken() {
        return this.validateTokenExpiration();
    }

    validateTokenExpiration() {
        let expTime = this.payload.exp;
        let curr = getEpoch();

        return curr < expTime;
    }

    getUsername() {
        return this.payload["username"];
    }

    get isValid(){
        return this.validateToken();
    }

    get username(){
        return username;
    }

    set username(input) {
        username = input;
    }
}