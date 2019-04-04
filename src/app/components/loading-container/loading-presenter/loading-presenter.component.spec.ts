import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPresenterComponent } from './loading-presenter.component';

describe('LoadingPresenterComponent', () => {
  let component: LoadingPresenterComponent;
  let fixture: ComponentFixture<LoadingPresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingPresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
