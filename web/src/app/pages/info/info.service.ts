import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {ACCOUNT_INFO} from "../../constant/uri";
import {AppResponse} from "../../vo/app-response";
import {Account} from "../../vo/account";
import {Router} from "@angular/router";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@Injectable()
export class InfoService {

  constructor(
    public http: HttpClient,
    public router:Router
  ){}

  initAccountInfo(account_id: string): Observable<any> {
    return this.http.get<AppResponse>(
      ACCOUNT_INFO,
      {
        params: new HttpParams().set("account_id", account_id)
      }
    ).map(
      data => {
        if (!data.status) {
          this.router.navigate(['system-error',{msg: data.msg}]);
        }
        return data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.router.navigate(['system-error',{msg: err.error.message}]);
        } else {
          this.router.navigate(['system-error',{msg: err.error}],);
        }
      }
    );
  }

  confirmEdit(accountInfo: Account): Observable<any> {
    return this.http.put<AppResponse>(
      ACCOUNT_INFO,
      {
        params: new HttpParams().set("accountInfo", JSON.stringify(accountInfo))
      }
    ).map(
      data => {
        return data;
      }
    );
  }
}
