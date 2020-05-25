class TokenHandler {
    constructor(rawToken) {
        let token = jwt_decode(rawToken);
        this.token = token;
        this.username = null;

        if(!this.validateToken()) {
            return;
        }

        this.getUsernameFromToken();
    }

    validateToken() {
        return this.validateTokenExpiration();
    }

    validateTokenExpiration() {
        let expTime = this.token.exp;
        let curr = getEpoch();

        return curr < expTime;
    }

    getUsernameFromToken() {
        let tokenArrays = Object.entries(this.token);

        let i;
        for(i = 0; i < tokenArrays.length; i++) {
            if(tokenArrays[i][0] == "cognito:username") {
                this.username = tokenArrays[i][1];
            }
        }
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