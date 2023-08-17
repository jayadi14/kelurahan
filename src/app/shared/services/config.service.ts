import { Injectable } from '@angular/core';
import { Config } from 'src/app/shared/interfaces/config.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  configSubject: BehaviorSubject<Config>;
  constructor() {
    this.configSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('configs') as string)
    );
  }
  public get getConfigs() {
    return this.configSubject.value;
  }
  setConfigs(config: Config) {
    localStorage.setItem('configs', JSON.stringify(config));
    this.configSubject.next(config);
  }
  clearConfigs() {
    localStorage.removeItem('configs');
    this.configSubject.next({} as Config);
  }
}
