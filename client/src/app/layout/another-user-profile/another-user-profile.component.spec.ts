import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherUserProfileComponent } from './another-user-profile.component';

describe('AnotherUserProfileComponent', () => {
  let component: AnotherUserProfileComponent;
  let fixture: ComponentFixture<AnotherUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherUserProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
