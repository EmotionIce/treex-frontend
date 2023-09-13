import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Element } from '../models/element';
import { Child } from '../models/child';

/**
 * Service class that manages and provides access to shared data across components.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private activeElement = new BehaviorSubject<string>('');
  /**
   * Emits the currently active element
   */
  currentActiveElementID = this.activeElement.asObservable();

  private changeNotifier = new BehaviorSubject<number>(0);
  /**
   * Emits a change notification
   */
  currentChange = this.changeNotifier.asObservable();

  private navigationElements = new BehaviorSubject<string>('');
  /**
   * Emits the current navigation elements
   */
  currentNavigationElements = this.navigationElements.asObservable();

  private editorElements = new BehaviorSubject<string>('');
  /**
   * Emits the current editor elements
   */
  currentEditorElements = this.editorElements.asObservable();

  private isDataImported = new BehaviorSubject<boolean>(false);
  /**
   * Emits the current data import status
   */
  currentImportStatus = this.isDataImported.asObservable();

  private draggedElement = new BehaviorSubject<string | null>(null);
  /**
   * Emits the current dragged element
   */
  currentDraggedElement = this.draggedElement.asObservable();

  private hostingPort = new BehaviorSubject<number>(8080);
  /**
   * Emits the current hosting port
   */
  currentHostingPort = this.hostingPort.asObservable();

  /**
   * Initializes the service
   */
  constructor() {}

  /**
   * Emits the new active element
   *
   * @param data the new active element
   */
  changeActiveElement(data: any) {
    this.activeElement.next(data);
  }

  /**
   * Emits a change notification
   */
  notifyChange() {
    let currentValue = this.changeNotifier.value;
    this.changeNotifier.next(currentValue + 1);
  }

  /**
   * Emits the new navigation elements
   *
   * @param data the new navigation elements
   */
  changeNavigationElements(data: any) {
    this.navigationElements.next(data);
  }

  /**
   * Emits the currently dragged element
   *
   * @param data the currently dragged element
   */
  changeDraggedElement(data: string | null) {
    this.draggedElement.next(data);
  }

  /**
   * Emits the new editor elements
   *
   * @param data the new editor elements
   */
  changeEditorElements(data: any) {
    this.editorElements.next(data);
  }

  /**
   * Set the data import status
   *
   * @param status the data import status
   */
  setDataImportStatus(status: boolean) {
    this.isDataImported.next(status);
  }

  /**
   * Updates the hosting port
   * @param port the new hosting port
   */
  updateHostingPort(port: number) {
    this.hostingPort.next(port);
  }

  /**
   * Retrieves the current navigation element
   *
   * @returns {string} the current navigation element
   */
  getNavigationElement(): string {
    return this.navigationElements.value;
  }

  /**
   * Retrieves the current editor element
   *
   * @returns {string} the current editor element
   */
  getEditorElement(): string {
    return this.editorElements.value;
  }

  /**
   * Resets the service to initial state
   */
  reset() {
    this.changeActiveElement('');
    this.changeNavigationElements('');
    this.changeEditorElements('');
    this.changeDraggedElement(null);
  }
}
