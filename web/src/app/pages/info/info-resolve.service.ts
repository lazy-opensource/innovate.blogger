import {Injectable} from "@angular/core";
import {Account} from "../../vo/account";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {InfoService} from "./info.service";
/**
 * Created by lzy on 2017/10/6.
 */
@Injectable()
export class InfoResolveService implements Resolve<Account>{

  constructor(
    public infoService: InfoService,
    public router:Router
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Account>{
    let account_id = route.paramMap.get("account_id");
    return this.infoService.initAccountInfo(account_id);
  }

}
