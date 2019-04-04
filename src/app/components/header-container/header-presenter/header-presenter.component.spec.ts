import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPresenterComponent } from './header-presenter.component';

describe('HeaderPresenterComponent', () => {
  let component: HeaderPresenterComponent;
  let fixture: ComponentFixture<HeaderPresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
