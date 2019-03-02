import * as cmd from "node-cmd";
import { execSync } from "child_process";
export class ADBInterface {

    static ConnectToDevice(deviceIP: String): ADBResult {
        var finalResult = new ADBResult(ADBResultState.Error, "Some error ocurred during connection");

        const result = execSync(`adb connect ${deviceIP}`);
        // const result = execSync(`adb devices`);
        const output = result.toLocaleString();
        if (output.includes('(10061)'))
            finalResult = new ADBResult(ADBResultState.ConnectionRefused, "Connection refused:\n Target machine actively refused connection.")

        return finalResult;
    }
    static ResetPorts(): ADBResult {
        var finalResult = new ADBResult(ADBResultState.Error, "Some error ocurred during connection");

        const result = execSync(`adb tcpip 5555`);
        const output = result.toLocaleString();
    
        finalResult = new ADBResult(ADBResultState.Connected, "ADB Devices port reset to 5555")

        return finalResult;
    }
}

/**
 * Is an enum of adb possible results
 */
export enum ADBResultState {
    Connected,
    ConnectionRefused,
    NotFound,
    Error
}
/**
 * Is an result returned by an adb connection
 */
export class ADBResult {
    state: ADBResultState;
    message: string;
    constructor(resultState: ADBResultState, message: string) {
        this.state = resultState;
        this.message = message;
    }
}
export class ADBNotFoundError extends Error {
    message = "ADB Device not found in this machine"
}