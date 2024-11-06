import { isApiError } from "$lib/api";
import { logs, loadingState } from "$lib/stores";
import { LoadingState } from "$lib/types";
import { get } from "svelte/store";

export enum LogLevel {
    SUCCESS,
    WARNING,
    FAIL,
    INFO,
    OTHER
}

export class LogEntry {
    public prefix: string;
    public text: string;
    public cssclass: string;
    public date: string;
    constructor(_logType: LogLevel, _message: string) {
        switch(_logType) {
            case LogLevel.SUCCESS:
                this.prefix = "[ SUCCESS ]";
                this.cssclass = "success";
                break;
            case LogLevel.WARNING:
                this.prefix = "[ WARNING ]";
                this.cssclass = "warning";
                break;
            case LogLevel.FAIL:
                this.prefix = "[ FAILED ]";
                this.cssclass = "fail";
                break;
            case LogLevel.INFO:
                this.prefix = "[ INFO ]";
                this.cssclass = "info";
                break;
            default:
                this.prefix = "[ OTHER ]";
                this.cssclass = "other";
                break;
        }

        this.text = _message;
        let currentdate = new Date();
        let datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        this.date = datetime;
    }
}

export async function log(_logType: LogLevel, _message: string | any) {
    let logObj = new LogEntry(_logType, _message);
    let currentLogs = get(logs);
    logs.set([logObj, ...currentLogs]);
}

export function asyncTask<A extends []>(fn: (...args: A) => Promise<LoadingState | void>): (...args: A) => Promise<void> {
    return (...args) => {
        loadingState.set(LoadingState.LOADING);
        return fn(...args)
            .then(ok => {
                if (ok == null) {
                    ok = LoadingState.SUCCESS;
                }
                loadingState.set(ok);
            }, err => {
                // No Error.isError ;(
                let apiError;
                if (!(err instanceof Error) && (apiError = isApiError(err))) {
                    log(LogLevel.FAIL, `API Error (${apiError.kind}): ${apiError.msg}`);
                } else {
                    log(LogLevel.FAIL, err);
                }
                loadingState.set(LoadingState.FAILED);
                return Promise.reject(err);
            });
    };
}
