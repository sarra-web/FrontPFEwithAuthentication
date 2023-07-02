import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopapComponent } from './popap.component';

describe('PopapComponent', () => {
  let component: PopapComponent;
  let fixture: ComponentFixture<PopapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
