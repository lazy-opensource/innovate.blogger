import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InfoComponent} from "./info.component";
import {InfoResolveService} from "./info-resolve.service";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
const INFO_ROUTES: Routes = [
  {path: '', redirectTo: '/not-found', pathMatch: 'full'},
  {path:':account_id', component: InfoComponent, resolve: {accountInfo: InfoResolveService}}
];
@NgModule({
  imports: [RouterModule.forChild(INFO_ROUTES)],
  exports: [RouterModule],
  providers: [InfoResolveService]
})
export class InfoRoutingModule {

}
