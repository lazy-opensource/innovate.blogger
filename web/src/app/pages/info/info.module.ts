
import {NgModule} from "@angular/core";
import {InfoRoutingModule} from "./info-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {InfoService} from "./info.service";
import {InfoComponent} from "./info.component";
/**
 * Created by laizhiyuan on 2017/9/29.
 */
@NgModule({
  imports: [
    InfoRoutingModule,
    SharedModule
  ],
  providers: [InfoService],
  declarations: [InfoComponent]
})
export class InfoModule {

}
