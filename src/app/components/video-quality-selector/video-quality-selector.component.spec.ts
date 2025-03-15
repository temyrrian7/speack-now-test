import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoQualitySelectorComponent } from './video-quality-selector.component';

describe('VideoQualitySelectorComponent', () => {
  let component: VideoQualitySelectorComponent;
  let fixture: ComponentFixture<VideoQualitySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoQualitySelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoQualitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
