class Reply {
    constructor(status, responseCode, success, message, data = null, error = null) {
        this.status = status;
        this.responseCode = responseCode;
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

module.exports = {
    successResponse: (code, message, data) => {
        return new Reply(
            200,
            code,
            true,
            message,
            data,
        )
    },

    badRequest: (message = "Bad Request") => {
        return new Reply(400, 0, false, message);
    },

    notFound: (code, message, error) => {
        return new Reply(404, code, false, message, null, error);
    },

    validationError: (code, message, error) => {
        return new Reply(422, code, false, message, null, error);
    },

    serverError: (code, message, error) => {
        return new Reply(500, code, false, message, null, error);
    },

    failConflict: (code, message, error) => {
        return new Reply(409, code, false, message, null, error);
    },

    forbidden: (code, message, error) => {
        return new Reply(403, code, false, message, null, error);
    },

    requestTimeOut: (code, message, error) => {
        return new Reply(408, code, false, message, null, error);
    },

    failAuthorization: (code, message, error) => {
        return new Reply(401, code, false, message, null, error);
    },
}