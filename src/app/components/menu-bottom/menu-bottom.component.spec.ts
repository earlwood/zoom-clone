import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuBottomComponent } from './menu-bottom.component';

describe('MenuBottomComponent', () => {
  let component: MenuBottomComponent;
  let fixture: ComponentFixture<MenuBottomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
