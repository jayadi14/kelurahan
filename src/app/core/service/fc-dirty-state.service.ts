import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcDirtyStateService {
  state: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}
  public get getCurrentState() {
    return this.state;
  }
  setState(state: boolean) {
    return this.state.next(state);
  }
}
