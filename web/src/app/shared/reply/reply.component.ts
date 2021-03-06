import {Component, EventEmitter, Input, Output, AfterViewInit} from "@angular/core";
import {Reply} from "../../vo/comment";
import {AuthorizationService} from "../../core/authorization/authorization.service";
/**
 * Created by laizhiyuan on 2017/10/11.
 */
@Component({
  selector: 'reply',
  templateUrl: './reply.component.html'
})
export class ReplyComponent {

  @Input()
  public replies: Array<any> = new Array<any>();
  @Output()
  public onReply = new EventEmitter<Reply>();
  @Output()
  public onRemoveReply = new EventEmitter<string>();

  constructor(public authorizationService: AuthorizationService){
  }

  reply(reply:Reply){
    let newReply = Reply.toNew(reply);
    newReply.parent_id = newReply._id;
    newReply.subject = newReply.from._id;
    this.onReply.emit(newReply);
  }

  removeReply(replyId:string){
    this.onRemoveReply.emit(replyId);
  }
}
