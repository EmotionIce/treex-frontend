import { Component, OnInit, Renderer2, Inject, AfterViewInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  dataImported: boolean;
  subscription: Subscription = Subscription.EMPTY;

  constructor(private dataService: DataService, private backendService: BackendService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {
    // Initialize as false
    this.dataImported = false;
  }

  ngOnInit() {
    this.subscription = this.dataService.currentImportStatus.subscribe(status => {
      this.dataImported = status;
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

  exportData() {
    this.backendService.Export().subscribe((data) => {
      if(data.success) {
        alert('Export successful');
      }
    });
  }

  ngAfterViewInit() {
    this.renderer.setStyle(this.document.querySelector('app-settings'), 'display', 'none');
  }

  openSettings() {
    this.renderer.setStyle(this.document.querySelector('app-settings'), 'display', 'flex');
  }
}
