import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {NoteService} from "./note.service";
import {PagingParams} from "../../vo/paging";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by lzy on 2017/10/7.
 */
@Injectable()
export class NoteResolveService implements Resolve<any>{

  constructor(
    public noteService: NoteService,
    public authorizationService: AuthorizationService
  ){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let requestAccountId = route.paramMap.get('account_id');
    let currentUsername = this.authorizationService.getCurrentUser()._id;
    return this.noteService.notes(requestAccountId, currentUsername, PagingParams.instantiation());
  }

}
