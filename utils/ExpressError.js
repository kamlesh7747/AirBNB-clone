class ExpressError extends Error {
    constructor(code, message) {
        super();
        this.message = message;
        this.code = code
    }
}
module.exports = ExpressError;