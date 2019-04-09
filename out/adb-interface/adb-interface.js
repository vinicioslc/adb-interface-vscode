"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class ADBInterface {
    static ConnectToDevice(deviceIP) {
        deviceIP = this.extractIPAddress(deviceIP);
        var finalResult = new ADBResult(ADBResultState.Error, "Some error ocurred during connection");
        const result = child_process_1.execSync(`adb connect ${deviceIP}:5555`);
        // const result = execSync(`adb devices`);
        const output = result.toLocaleString();
        // console.log("Output:", output);
        if (output.includes('already connected to')) {
            finalResult = new ADBResult(ADBResultState.AllreadyConnected, `Allready connected to device ${this.getDeviceName(deviceIP)}`);
        }
        else if (output.includes('connected to')) {
            finalResult = new ADBResult(ADBResultState.ConnectedToDevice, `Connected to device ${this.getDeviceName(deviceIP)}`);
        }
        else if (output.includes('(10061)')) {
            finalResult = new ADBResult(ADBResultState.ConnectionRefused, "Connection refused:\n Target machine actively refused connection.");
        }
        return finalResult;
    }
    static ResetPorts() {
        return __awaiter(this, void 0, void 0, function* () {
            var finalResult = new ADBResult(ADBResultState.Error, "Error while reset TCPIP Ports");
            try {
                const result = child_process_1.execSync(`adb tcpip 5555`);
                const output = result.toLocaleString();
                if (output.includes("restarting in TCP mode port: 5555")) {
                    finalResult = new ADBResult(ADBResultState.DevicesInPortMode, "Devices in TCP mode port: 5555");
                }
            }
            catch (e) {
                if (e.message.includes("no devices/emulators found")) {
                    finalResult = new ADBResult(ADBResultState.NoDevices, "No devices found or conected");
                }
                else
                    finalResult = new ADBResult(ADBResultState.Error, e.message);
            }
            return finalResult;
        });
    }
    static getDeviceName(deviceIP) {
        const result = child_process_1.execSync(`adb -s ${deviceIP} shell getprop ro.product.model`).toString();
        return result;
    }
    static DisconnectFromAllDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            var finalResult = new ADBResult(ADBResultState.Error, "Error while reset TCPIP Ports");
            try {
                const result = child_process_1.execSync(`adb disconnect`);
                const output = result.toLocaleString();
                if (output.includes("disconnected everything")) {
                    finalResult = new ADBResult(ADBResultState.DisconnectedEverthing, "Disconnected from all devices");
                }
            }
            catch (e) {
                finalResult = new ADBResult(ADBResultState.Error, e.message);
            }
            return finalResult;
        });
    }
    /**
     * Returns if the ipAddress contains some ip address pattern
     * @param ipAddress string to test
     */
    static testIP(ipAddress) {
        const regexIP = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1}\.[0-9]{1,3})/gmi;
        return regexIP.test(ipAddress);
    }
    static GetConnectedDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            var devicesArray = [];
            try {
                const result = child_process_1.execSync(`adb devices`);
                const output = result.toLocaleString();
                if (output.startsWith("List of devices attached")) {
                    let ips = output.split(/[\r]|[\n]/gmi);
                    ips = ips.filter((ip, index, array) => this.testIP(ip));
                    ips = ips.map((ipAddress, index, array) => {
                        let nameOfDevice = this.getDeviceName(this.extractIPAddress(ipAddress));
                        return `${ipAddress} | ${nameOfDevice}`;
                    });
                    console.log("ips", ips);
                    return ips;
                }
            }
            catch (e) {
            }
            return devicesArray;
        });
    }
    static extractIPAddress(ipAddress) {
        const regexIP = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1}\.[0-9]{1,3})/gmi;
        var matches = regexIP.exec(ipAddress) || [""];
        return matches[0];
    }
}
exports.ADBInterface = ADBInterface;
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
/**
 * Is an enum of adb possible results
 */
var ADBResultState;
(function (ADBResultState) {
    ADBResultState[ADBResultState["ConnectedToDevice"] = 0] = "ConnectedToDevice";
    ADBResultState[ADBResultState["ConnectionRefused"] = 1] = "ConnectionRefused";
    ADBResultState[ADBResultState["NotFound"] = 2] = "NotFound";
    ADBResultState[ADBResultState["NoDevices"] = 3] = "NoDevices";
    ADBResultState[ADBResultState["Error"] = 4] = "Error";
    ADBResultState[ADBResultState["DevicesInPortMode"] = 5] = "DevicesInPortMode";
    ADBResultState[ADBResultState["AllreadyConnected"] = 6] = "AllreadyConnected";
    ADBResultState[ADBResultState["DisconnectedEverthing"] = 7] = "DisconnectedEverthing";
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