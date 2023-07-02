import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJDBCconnectorComponent } from './add-jdbcconnector.component';

describe('AddJDBCconnectorComponent', () => {
  let component: AddJDBCconnectorComponent;
  let fixture: ComponentFixture<AddJDBCconnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJDBCconnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJDBCconnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
