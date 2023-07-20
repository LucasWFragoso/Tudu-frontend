import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})

export class JwtService{
    getToken():string {
        return window.localStorage["TuduToken"]
    }

    saveToken(token: string): void {
        window.localStorage["TuduToken"] = token
    }

    destroyToken(): void {
        window.localStorage.removeItem("TuduToken")
    }
}