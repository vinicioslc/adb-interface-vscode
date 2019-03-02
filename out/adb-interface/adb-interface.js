"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class ADBInterface {
    static ConnectToDevice(deviceIP) {
        var finalResult = new ADBResult(ADBResultState.Error, "Some error ocurred during connection");
        const result = child_process_1.execSync(`adb connect ${deviceIP}`);
        // const result = execSync(`adb devices`);
        const output = result.toLocaleString();
        if (output.includes('(10061)'))
            finalResult = new ADBResult(ADBResultState.ConnectionRefused, "Connection refused:\n Target machine actively refused connection.");
        return finalResult;
    }
    static ResetPorts() {
        var finalResult = new ADBResult(ADBResultState.Error, "Some error ocurred during connection");
        const result = child_process_1.execSync(`adb tcpip 5555`);
        const output = result.toLocaleString();
        finalResult = new ADBResult(ADBResultState.Connected, "ADB Devices port reset to 5555");
        return finalResult;
    }
}
exports.ADBInterface = ADBInterface;
/**
 * Is an enum of adb possible results
 */
var ADBResultState;
(function (ADBResultState) {
    ADBResultState[ADBResultState["Connected"] = 0] = "Connected";
    ADBResultState[ADBResultState["ConnectionRefused"] = 1] = "ConnectionRefused";
    ADBResultState[ADBResultState["NotFound"] = 2] = "NotFound";
    ADBResultState[ADBResultState["Error"] = 3] = "Error";
})(ADBResultState = exports.ADBResultState || (exports.ADBResultState = {}));
/**
 * Is an result returned by an adb connection
 */
class ADBResult {
    constructor(resultState, message) {
        this.state = resultState;
        this.message = message;
    }
}
exports.ADBResult = ADBResult;
class ADBNotFoundError extends Error {
    constructor() {
        super(...arguments);
        this.message = "ADB Device not found in this machine";
    }
}
exports.ADBNotFoundError = ADBNotFoundError;
//# sourceMappingURL=adb-interface.js.map