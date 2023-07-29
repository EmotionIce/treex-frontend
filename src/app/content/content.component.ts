import { Component, Input } from '@angular/core';
import { Element } from '@angular/compiler';
import { BackendService } from '../services/backend.service';
import { DataService } from '../services/data.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
 
  }

