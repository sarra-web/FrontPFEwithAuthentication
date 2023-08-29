import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoSQLconnectorComponent } from './add-no-sqlconnector.component';

describe('AddNoSQLconnectorComponent', () => {
  let component: AddNoSQLconnectorComponent;
  let fixture: ComponentFixture<AddNoSQLconnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNoSQLconnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNoSQLconnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
