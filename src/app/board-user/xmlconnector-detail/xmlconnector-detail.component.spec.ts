import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XMLconnectorDetailComponent } from './xmlconnector-detail.component';

describe('XMLconnectorDetailComponent', () => {
  let component: XMLconnectorDetailComponent;
  let fixture: ComponentFixture<XMLconnectorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XMLconnectorDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XMLconnectorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
