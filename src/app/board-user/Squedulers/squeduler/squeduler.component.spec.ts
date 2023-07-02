import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquedulerComponent } from './squeduler.component';

describe('SquedulerComponent', () => {
  let component: SquedulerComponent;
  let fixture: ComponentFixture<SquedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SquedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
