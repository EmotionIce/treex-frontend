import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EditorPartComponent } from '../editor-part/editor-part.component';

@Component({
  selector: 'app-text-editor',
  template: `
    <div *ngIf="!isEditMode" (click)="enterEditMode()">{{ text }}</div>
    <textarea #textArea matInput *ngIf="isEditMode" [(ngModel)]="editedText" (input)="adjustTextareaHeight()"></textarea>
    <button mat-raised-button color="accent" *ngIf="isEditMode" (click)="saveText()">Save</button>
  `,
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {
  @Input() text: string = '';
  @Output() textUpdated = new EventEmitter<string>();
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;

  isEditMode: boolean = false;
  editedText: string = '';

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  enterEditMode() {
    this.isEditMode = true;
    this.editedText = this.text;
  }

  adjustTextareaHeight() {
    const textAreaEl = this.textArea.nativeElement;
    textAreaEl.style.height = 'auto'; // Reset the height
    textAreaEl.style.height = textAreaEl.scrollHeight + 'px';
  }

  saveText() {
    this.isEditMode = false;
    this.text = this.editedText;
    this.textUpdated.emit(this.text);
  }
}