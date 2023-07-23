import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private activeElement = new BehaviorSubject<string>('');
  currentData = this.activeElement.asObservable();

  constructor() {}

  changeData(data: any) {
    this.activeElement.next(data);
  }
}
