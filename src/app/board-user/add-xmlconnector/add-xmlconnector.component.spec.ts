import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddXMLconnectorComponent } from './add-xmlconnector.component';

describe('AddXMLconnectorComponent', () => {
  let component: AddXMLconnectorComponent;
  let fixture: ComponentFixture<AddXMLconnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddXMLconnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddXMLconnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
