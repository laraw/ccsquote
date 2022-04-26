import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreDetailComponent } from './centre-detail.component';

describe('CentreDetailComponent', () => {
  let component: CentreDetailComponent;
  let fixture: ComponentFixture<CentreDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentreDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
