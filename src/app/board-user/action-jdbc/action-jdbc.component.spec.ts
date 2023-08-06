import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionJDBCComponent } from './action-jdbc.component';

describe('ActionJDBCComponent', () => {
  let component: ActionJDBCComponent;
  let fixture: ComponentFixture<ActionJDBCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionJDBCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionJDBCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
