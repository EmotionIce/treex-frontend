import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  dataImported: boolean;
  subscription: Subscription = Subscription.EMPTY;

  constructor(private dataService: DataService, private backendService: BackendService) {
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
}
