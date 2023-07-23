import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private activeElement = new BehaviorSubject<string>('');
  currentActiveElementID = this.activeElement.asObservable();

  private changeNotifier = new BehaviorSubject<number>(0);
  currentChange = this.changeNotifier.asObservable();

  constructor() {}

  changeActiveElement(data: any) {
    this.activeElement.next(data);
  }

  notifyChange() {
    let currentValue = this.changeNotifier.value;
    this.changeNotifier.next(currentValue + 1);
  }
}
