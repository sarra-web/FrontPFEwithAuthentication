import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JDBCconnectorComponent } from './jdbcconnector.component';

describe('JDBCconnectorComponent', () => {
  let component: JDBCconnectorComponent;
  let fixture: ComponentFixture<JDBCconnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JDBCconnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JDBCconnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
