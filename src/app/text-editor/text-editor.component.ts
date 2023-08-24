import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-text-editor',
  template: `
    <textarea
      #textArea
      matInput
      [(ngModel)]="text"
      (input)="adjustTextareaHeight()"
    ></textarea>
    <button mat-raised-button color="accent" (click)="saveText()">Speichern</button>
  `,
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements AfterViewInit {
  @Input() text: string = '';
  @Output() textUpdated = new EventEmitter<string>();
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight() {
    if (!this.textArea) return;
    const textAreaEl = this.textArea.nativeElement;
    textAreaEl.style.height = 'auto'; // Reset the height
    textAreaEl.style.height = textAreaEl.scrollHeight + 'px';
  }

  saveText() {
    this.textUpdated.emit(this.text);
  }
}
