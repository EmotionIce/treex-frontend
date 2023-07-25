import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../services/settings';
import { HeaderComponent } from '../header/header.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;

  beforeEach(() => {
    // Create a mock SettingsService
    const mockSettingsService = jasmine.createSpyObj('SettingsService', [
      'getSettings',
      'updateSettings',
    ]);

    TestBed.configureTestingModule({
      declarations: [SettingsComponent, HeaderComponent],
      providers: [{ provide: SettingsService, useValue: mockSettingsService }],
      imports: [MatFormFieldModule, MatSelectModule, MatCheckboxModule],
    });

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    // Get the instance of the mock SettingsService
    settingsService = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
