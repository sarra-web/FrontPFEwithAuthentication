import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSQLconnectorComponent } from './no-sqlconnector.component';

describe('NoSQLconnectorComponent', () => {
  let component: NoSQLconnectorComponent;
  let fixture: ComponentFixture<NoSQLconnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoSQLconnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoSQLconnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
