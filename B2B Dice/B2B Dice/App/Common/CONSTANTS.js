"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONSTANTS = (function () {
    function CONSTANTS() {
    }
    CONSTANTS._diceApiUrl = function () {
        // During Octopus deployment, variable values in this file using Octopus hash-syntax will be replaced
        var apiUrl = "#{DiceApiUrl}";
        // For local development, the string above won't be replaced. The following block provides a default fallback URL
        // In a file being ran through Octopus variable substitution, you have to avoid using the 'hash' symbol anywhere
        // (other than a "real" Octopus variable, of course). Otherwise Octopus throws a wobbly.
        if (~encodeURIComponent(apiUrl).indexOf("%23%7B"))
            apiUrl = "http://localhost:19776/api";
        //apiUrl = "http://p62vmb2bls01.production.online.dell.com/b2bdiceapi/api";
        return apiUrl;
    };
    return CONSTANTS;
}());
exports.CONSTANTS = CONSTANTS;
//# sourceMappingURL=CONSTANTS.js.map