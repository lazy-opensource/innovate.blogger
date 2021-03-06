import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef,
  ViewChild
} from "@angular/core";
import {BaseComponent} from "../common/BaseComponent";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {AuthorizationService} from "../../core/authorization/authorization.service";
import {Paging, PagingParams} from "../../vo/paging";
import {Note} from "../../vo/note";
import "tinymce";
import "tinymce/themes/modern";
import "tinymce/plugins/table";
import "tinymce/plugins/link";
import {NoteService} from "./note.service";
import {AppModal} from "../../vo/app-modal";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Reply} from "../../vo/comment";
import {Estimate} from "../../vo/estimate";
import {SearchService} from "../../core/search/search.service";
import {Subscription} from "rxjs/Subscription";
import {ModalExcuteDeleteType} from "../../constant/modal";
import {ToInterspaceNameService} from "../../core/common/common.service";
/**
 * Created by lzy on 2017/10/6.
 */
@Component({
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent extends BaseComponent implements OnInit , AfterViewInit, OnDestroy{

  ngAfterViewInit(): void {
    /*this.initPraise();*/
  }

  ngOnDestroy(): void {
    this.renderer2.destroy();
  }

  /**
   * 初始化变量
   */
  public requestAccountId: string;
  public paging: Paging = Paging.instantiation();
  public notes: Note[] = new Array<Note>();
  public content: string;
  public contentNumber: number = 200;
  public initContentNumber: number = 200;
  public head_portrait: string;
  public appModal:AppModal = new AppModal('确定删除', '确定删除吗?', 'confirmDelNoteModal', false);
  public modalRef: BsModalRef;
  public nativeElement = this.elementRef.nativeElement;
  @ViewChild('appModalTemplate')
  public appModalTemplateDiv:TemplateRef<any>;
  public modalExcuteDeleteType:ModalExcuteDeleteType; //执行删除类型 "1":删除日记   "2":删除评论
  public hideSubmitComment = true;
  public commentMaxLength = 50;
  public initCommentMaxLength = 50;
  public pagingParams = PagingParams.instantiation();
  public subscription: Subscription;

  /**
   * 构造器
   * @param route
   * @param authorizationService
   * @param noteService
   * @param modalService
   * @param elementRef
   * @param renderer2
   */
  constructor(public route: ActivatedRoute,
              public authorizationService: AuthorizationService,
              public noteService: NoteService,
              public modalService: BsModalService,
              public elementRef:ElementRef,
              public searchService:SearchService,
              public renderer2:Renderer2,
              public toInterspaceNameService:ToInterspaceNameService
  ) {
    super();
    this.route.paramMap.switchMap((params: ParamMap) => this.requestAccountId = params.get("account_id")).subscribe();
    this.subscription = this.searchService.missionAnnounced$.subscribe(
      keyword => {
        this.doSearch(keyword);
      });
    this.searchService.confirmMission(true);
  }

  /**
   * 关键字搜索
   * @param keyword
   */
  doSearch(keyword:string){
    if (this.paging.bigCurrentPage > 1){
      this.paging.bigCurrentPage = 1;
      this.paging.bigTotalItems = -1;
    }
    let pag = PagingParams.instantiation();
    pag.keyword = keyword;
    this.noteService.notes(this.requestAccountId, this.authorizationService.getCurrentUser()._id, pag).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
      }
    );
  }

  /**
   * 构造器初始化后回调
   */
  ngOnInit(): void {
    this.route.data.subscribe((rlt: {notes: any}) => {
      if (!rlt.notes.status) {
        this.showMsg = true;
        this.sysMsg = rlt.notes.msg;
        return;
      }
      this.initNotes(rlt.notes);
    });
  }

  /**
   * 确认删除日记
   */
  public noteId:string;
  onDeleteDocBefore(id:string){
    this.appModal.content = "确定永久删除该日记吗?";
    this.modalExcuteDeleteType = ModalExcuteDeleteType.DELETE_NOTE;
    this.noteId = id;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 初始化日记
   * @param data
   */
  initNotes(data: any) {
    this.content = '';
    this.notes = data.data.notes;
    this.paging.bigTotalItems = data.data.count;
    this.head_portrait = data.data.head_portrait;
    this.showMsg = false;
    this.isShow = false;
  }

  /**
   * 实现分页
   * @param event
   */
  public pageChanged(event: any): void {
    if (this.paging.bigTotalItems == -1){
      return;
    }
    this.pagingParams.currentPage = event.page;
    this.pagingParams.pageSize = event.itemsPerPage;
    this.pagingParams.skip = this.pagingParams.getSkip();

    this.noteService.notes(this.requestAccountId, this.authorizationService.getCurrentUser()._id, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
      }
    );
  }

  changeBtn() {
    if (this.isShow) {
      this.content = '';
    }
    this.isShow = !this.isShow;
  }

  /**
   * 监听写日记输入
   */
  keyup() {
    if (this.content) {
      this.contentNumber = this.initContentNumber - this.content.length;
    }else {
      this.contentNumber = this.initContentNumber;
    }
  }

  /**
   * 提交日记
   */
  submitNote() {
    let note = new Note();
    note.account_id = this.authorizationService.getCurrentUser()._id;
    note.content = this.content;
    this.noteService.submitNote(note, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 取消模态框
   */
  cancleModal(){
    this.noteId = '';
    this.modalRef.hide();
  }

  /**
   * 执行模态框的删除
   */
  excuteDel(){
    if (this.modalExcuteDeleteType == ModalExcuteDeleteType.DELETE_NOTE) {
      this.deleteNote();
    }else if (this.modalExcuteDeleteType == ModalExcuteDeleteType.DELETE_COMMENT) {
      this.delComment();
    }
  }

  /**
   * 确定删除日记
   */
  deleteNote() {
    let note = new Note();
    note.account_id = this.authorizationService.getCurrentUser()._id;
    note.id = this.noteId;
    this.noteService.deleteNote(note, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.initNotes(data);
        this.modalRef.hide();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 赞
   * @param id
   */
  onPraise(id: string) {
    let current_account_id = this.authorizationService.getCurrentUser()._id;
    this.noteService.praise(this.requestAccountId, current_account_id, id, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  public openCommentDiv:string[] = new Array<string>();
  public commentContent:string;
  public globalReply:Reply;

  /**
   * 打开评论输入框
   * @param noteId     日记id
   * @param root_id    根评论id
   * @param parent_id  父回复id
   * @param subject    回复主题
   */
  onComment(estimate: Estimate){
    this.globalReply = new Reply();
    this.globalReply.doc_id = estimate.doc_id;
    this.globalReply.parent_id = estimate.parent_id;
    this.globalReply.subject = estimate.subject;
    this.commentContent = '';
    this.commentMaxLength = this.initCommentMaxLength;
    this.hideSubmitComment = true;
    this.openCommentInput(estimate.doc_id, estimate.parent_id, estimate.subject);
  }

  openCommentInput(templateId:string, parent_id:string, subject: string){
    let isExists = false;
    //查找以及打开评论输入框的
    for (let i = 0; i < this.openCommentDiv.length; i++){
      if (this.openCommentDiv[i] == templateId){
        isExists = true; //如果本次评论输入已经打开过
      }else {
        this.cancleCommen(this.openCommentDiv[i]); //其它的取消评论
      }
    }
    if (!isExists) {
      this.openCommentDiv.push(templateId); //没打开则把它标记为打开
    }
    let commentDiv = this.nativeElement.querySelector('#T' + templateId); //评论 div
    this.renderer2.setProperty(commentDiv, 'hidden', false);
    let commentInput = this.nativeElement.querySelector('.T' + templateId); //评论 input
    if (!parent_id){ //顶级评论发起者
      this.toInterspaceNameService.toInterspaceName(this.requestAccountId).subscribe(
        data => {
          this.renderer2.setProperty(commentInput, 'placeholder', '评论' + data.data);
        }
      );
    }else { //子回复
      this.toInterspaceNameService.toInterspaceName(subject).subscribe(
        data => {
          this.renderer2.setProperty(commentInput, 'placeholder', '回复' + data.data);
        }
      );
    }
    commentInput.focus();
  }

  /**
   * 监听子回复组件回复事件
   * @param noteId
   * @param reply
   */
  onReply(reply:Reply){
    this.globalReply = reply;
    this.openCommentInput(reply.doc_id, reply.parent_id, reply.subject);
  }

  /**
   * 提交评论
   * @param id
   */
  submitComment(id:string){
    this.globalReply.from = this.authorizationService.getCurrentUser()._id;
    this.globalReply.account_id = this.requestAccountId;
    this.globalReply.content = this.commentContent;
    this.noteService.submitConment(this.globalReply, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
        this.cancleCommen('');
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 去删除评论
   * @param noteId
   * @param root_id
   * @param replyId
   */
  onDeleteCommentBefore(reply: Reply){
    this.appModal.content = "确定永久删除该评论/回复吗?";
    this.modalExcuteDeleteType = ModalExcuteDeleteType.DELETE_COMMENT;
    this.globalReply = new Reply();
    this.globalReply.doc_id = reply.doc_id;
    this.globalReply.id = reply.id;
    this.globalReply.account_id = this.requestAccountId;
    this.modalRef = this.modalService.show(this.appModalTemplateDiv);
  }

  /**
   * 删除评论
   * @param reply
   * @param id
   * @param root_id
   */
  delComment(){
    this.noteService.delConment(this.globalReply, this.pagingParams).subscribe(
      data => {
        if (!data.status) {
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data;
        this.cancleCommen('');
        this.modalRef.hide();
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '系统错误';
      }
    );
  }

  /**
   * 取消评论
   * @param id
   */
  cancleCommen(id:string){
    if (id) {
      let commentDiv = this.nativeElement.querySelector('#T' + id);
      this.renderer2.setProperty(commentDiv, 'hidden', true);
    }
    this.commentContent = '';
    this.commentMaxLength = this.initCommentMaxLength;
  }

  /**
   * 监听评论输入事件
   */
  keyupComment(){
    if (this.commentContent){
      this.hideSubmitComment = false;
      this.commentMaxLength = this.initCommentMaxLength - this.commentContent.length;
    }else {
      this.hideSubmitComment = true;
      this.commentMaxLength = this.initCommentMaxLength;
    }
  }
}
