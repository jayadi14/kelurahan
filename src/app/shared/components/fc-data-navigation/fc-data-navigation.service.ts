import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcDataNavigationService {
  dataNavigationConfigSubject: BehaviorSubject<object>;

  constructor() {
    this.dataNavigationConfigSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('dataNavigationConfig') as string)
    );
  }
  public get getDataNavigationConfig() {
    return this.dataNavigationConfigSubject.value;
  }

  setDataNavigationConfig(datas: any, label: string = 'id') {
    let ids = datas.map((data: any) => {
      return data.id;
    });
    const dataNavigationConfig = {
      ids: ids,
      label: label,
    };
    localStorage.setItem(
      'dataNavigationConfig',
      JSON.stringify(dataNavigationConfig)
    );
    this.dataNavigationConfigSubject.next(dataNavigationConfig);
  }
}
