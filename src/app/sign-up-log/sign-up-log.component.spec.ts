import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpLogComponent } from './sign-up-log.component';

describe('SignUpLogComponent', () => {
  let component: SignUpLogComponent;
  let fixture: ComponentFixture<SignUpLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
