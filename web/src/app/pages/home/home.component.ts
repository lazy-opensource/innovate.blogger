import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppResponse} from "../../vo/app-response";
import {HOME_ARTICLES, HOME_IMAGES, HOME_NOTES, NEWS, NEWS_TYPES} from "../../constant/uri";
import {BaseComponent} from "../common/BaseComponent";
import {Paging, PagingParams} from "../../vo/paging";
import {Article} from "../../vo/article";
import {Note} from "../../vo/note";
import {Image} from "../../vo/image";
/**
 * Created by laizhiyuan on 2017/9/25.
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit{

  public newsTypes:any[] = new Array<any>();
  public news: any[] = new Array<any>();
  public paging: Paging = Paging.instantiation3();
  public pagingParams = PagingParams.instantiation3();
  public globalType:string;
  public articles: Article[] = new Array<Article>();
  public notes: Note[] = new Array<Note>();
  public articlesPaging = Paging.instantiation10();
  public articlesPagingParam = PagingParams.instantiation10();
  public notesPaging = Paging.instantiation10();
  public notesPagingParam = PagingParams.instantiation10();
  public images: Image[] = new Array<Image>();

  constructor(
    public http:HttpClient) {
    super();
  }

  changeTab(type:string){
    this.pagingParams = PagingParams.instantiation3();
    this.globalType = type;
    if (this.paging.bigCurrentPage > 1){
      this.paging = Paging.instantiation3();
      this.loadNews(type);
    }else {
      this.loadNews(type);
    }
  }

  ngOnInit(): void {
    this.loadNewsTypes();
    this.loadArticles();
   // this.loadNotes();
   // this.loadImages();
  }

  loadImages(){
    this.http.get<AppResponse>(
      HOME_IMAGES,
      {
        params: new HttpParams().set('paging', JSON.stringify(PagingParams.instantiation10()))
      }
    ).subscribe(
      data => {
        this.images = data.data;
      }
    );
  }

  loadArticles(){
    this.http.get<AppResponse>(
      HOME_ARTICLES,
      {
        params: new HttpParams().set('paging', JSON.stringify(this.articlesPagingParam))
      }
    ).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.articles = data.data.articles;
        this.articlesPaging.bigTotalItems = data.data.count;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  loadNotes(){
    this.http.get<AppResponse>(
      HOME_NOTES,
      {
        params: new HttpParams().set('paging', JSON.stringify(this.notesPagingParam))
      }
    ).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.showMsg = false;
        this.notes = data.data.notes;
        this.notesPaging.bigTotalItems = data.data.count;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  changeTab1(type:string){
    if (type == '1'){
      this.articlesPagingParam = PagingParams.instantiation10();
      if (this.articlesPaging.bigCurrentPage > 1){
        this.articlesPaging.bigCurrentPage = 1;
      }
      this.loadArticles();
    }else if (type == '2'){
      this.notesPagingParam = PagingParams.instantiation10();
      if (this.notesPaging.bigCurrentPage > 1){
        this.notesPaging.bigCurrentPage = 1;
      }
      this.loadNotes();
    }else if (type == '3'){
      if (this.images.length < 1){
        this.loadImages();
      }
    }
  }

  public articlesPageChanged(event: any): void {
    this.articlesPagingParam.currentPage = event.page;
    this.articlesPagingParam.pageSize = event.itemsPerPage;
    this.articlesPagingParam.skip = this.articlesPagingParam.getSkip();
    this.loadArticles();
  }

  public notesPageChanged(event: any): void {
    this.notesPagingParam.currentPage = event.page;
    this.notesPagingParam.pageSize = event.itemsPerPage;
    this.notesPagingParam.skip = this.notesPagingParam.getSkip();
    this.loadNotes();
  }

  /**
   * 实现分页
   * @param event
   */
  public pageChanged(event: any): void {
    this.pagingParams.currentPage = event.page;
    this.pagingParams.pageSize = event.itemsPerPage;
    this.pagingParams.skip = this.pagingParams.getSkip();

    this.loadNews(this.globalType);
  }

  loadNews(type:string){
    this.http.get<AppResponse>(
      NEWS,
      {
        params: new HttpParams().set('paging', JSON.stringify(this.pagingParams)).set('type', type)
      }
    ).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.news = data.data.news;
        this.paging.bigTotalItems = data.data.count;
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

  loadNewsTypes(){
    this.http.get<AppResponse>(
      NEWS_TYPES
    ).subscribe(
      data => {
        if (!data.status){
          this.showMsg = true;
          this.sysMsg = data.msg;
          return;
        }
        this.newsTypes = data.data;
        this.globalType = this.newsTypes[0].no;
        this.loadNews(this.newsTypes[0].no);
      },
      err => {
        this.showMsg = true;
        this.sysMsg = '服务器错误';
      }
    );
  }

}
