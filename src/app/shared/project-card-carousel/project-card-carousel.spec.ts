import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardCarousel } from './project-card-carousel';

describe('ProjectCardCarousel', () => {
  let component: ProjectCardCarousel;
  let fixture: ComponentFixture<ProjectCardCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
