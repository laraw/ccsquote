import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCentresComponent } from './manage-centres.component';

describe('ManageCentresComponent', () => {
  let component: ManageCentresComponent;
  let fixture: ComponentFixture<ManageCentresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCentresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
