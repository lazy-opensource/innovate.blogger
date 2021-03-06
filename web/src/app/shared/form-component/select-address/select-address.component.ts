import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";
import {HttpParams, HttpClient} from "@angular/common/http";
import {ADDRESS_PROVINCES, ADDRESS_CITYS, ADDRESS_COUNTYS, ADDRESS_STREETS} from "../../../constant/uri";
import {AppResponse} from "../../../vo/app-response";
/**
 * Created by lzy on 2017/9/30.
 */
@Component({
  selector: 'select-address',
  templateUrl: './select-address.component.html'
})
export class SelectAddressComponent{

  @Input() public provinceCode: string = "";
  @Input() public cityCode: string = "";
  @Input() public countyCode: string = "";
  @Input() public streetCode: string = "";
  @Input() public isDisabled: boolean = false;
  @Output() public onChange = new EventEmitter<any>();

  public provinces: {name:string, code:string}[] = [{name: '--请选择地址--', code: ''}];
  public citys: {name:string, code:string}[];
  public countys: {name:string, code:string}[];
  public streets: {name:string, code:string}[];

  public showCity: boolean = false;
  public showCounty: boolean = false;
  public showStreet: boolean = false;

  constructor(public http: HttpClient) {

  }

  change() {
    let data = this.provinceCode + '#' + this.cityCode + '#' + this.countyCode + '#' + this.streetCode;
    this.onChange.emit({status: true, msg: null, data: data});
  }

  loadAllProvinces() {
    this.http.get<AppResponse>(
      ADDRESS_PROVINCES
    ).subscribe(
      data => {
        if (data.status) {
          this.provinces = this.provinces.concat(data.data);
          if (!this.provinceCode) {
            this.provinceCode = this.provinces[0].code;
            this.showCity = false;
            this.showCounty = false;
            this.showStreet = false;
            this.cityCode = '';
            this.countyCode = '';
            this.streetCode = '';
            this.change();
          } else {
            this.loadCitysByProvinceCode(false);
          }
        } else {
          this.onChange.emit({status: false, msg: data.msg, data: ''});
        }
      },
      err => {
        this.onChange.emit({status: false, msg: '服务器错误', data: ""});
      }
    );
  };

  loadCitysByProvinceCode(isChange:boolean) {
  if (isChange) {
    if (!this.provinceCode) {
      this.showCity = false;
      this.showCounty = false;
      this.showStreet = false;
      this.cityCode = '';
      this.countyCode = '';
      this.streetCode = '';
      this.change();
      return;
    }
  }
  this.showCity = true;
  this.http.get<AppResponse>(
    ADDRESS_CITYS,
    {
      params: new HttpParams().set("provinceCode", <string>this.provinceCode)
    }).subscribe(
    data => {
      if (data.status) {
        this.citys = data.data;
        if (isChange || !this.cityCode) {
          if (!this.citys[0]) { //没有该省会下面没有市情况下
            this.showCity = false;
            this.showCounty = false;
            this.showStreet = false;
            this.cityCode = '';
            this.countyCode = '';
            this.streetCode = '';
            this.change();
            return;
          }
          this.cityCode = this.citys[0].code; //每次change就从市集合中拿第一条数据
        }
        this.loadCountysByCityCode(isChange);
      } else {
        this.showCity = false;
        this.showCounty = false;
        this.showStreet = false;
        this.cityCode = '';
        this.countyCode = '';
        this.streetCode = '';
        this.onChange.emit({status: false, msg: data.msg, data: ''});
      }
    },
    err => {
      this.onChange.emit({status: false, msg: '服务器错误', data: ""});
    }
  );
};

  loadCountysByCityCode(isChange:boolean) {
    this.showCounty = true;
    this.http.get<AppResponse>(
      ADDRESS_COUNTYS,
      {
        params: new HttpParams().set("cityCode", <string>this.cityCode)
      }).subscribe(
      data => {
        if (data.status) {
          this.countys = data.data;
          if (isChange || !this.countyCode) {
            if (!this.countys[0]) {
              this.showCounty = false;
              this.showStreet = false;
              this.countyCode = '';
              this.streetCode = '';
              this.change();
              return;
            }
            this.countyCode = this.countys[0].code;
          }
          this.loadStreetsByCountyCode(isChange);
        } else {
          this.showCounty = false;
          this.showStreet = false;
          this.countyCode = '';
          this.streetCode = '';
          this.onChange.emit({status: false, msg: data.msg, data: ''});
        }
      },
      err => {
        this.onChange.emit({status: false, msg: '服务器错误', data: ""});
      }
    );
  };

  loadStreetsByCountyCode(isChange:boolean) {
    this.showStreet = true;
    this.http.get<AppResponse>(
      ADDRESS_STREETS,
      {
        params: new HttpParams().set("countyCode", <string>this.countyCode)
      }).subscribe(
      data => {
        if (data.status) {
          var streetsData = data.data;
          this.streets = streetsData;
          if (isChange || !this.streetCode) {
            if (!this.streets[0]) {
              this.showStreet = false;
              this.streetCode = '';
              this.change();
              return;
            }
            this.streetCode = this.streets[0].code;
            this.change();
          }
        } else {
          this.showStreet = false;
          this.streetCode = '';
          this.onChange.emit({status: false, msg: data.msg, data: ''});
        }
      },
      err => {
        this.onChange.emit({status: false, msg: '服务器错误', data: ""});
      }
    );
  };
}
