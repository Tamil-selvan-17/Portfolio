import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-project-card-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card-carousel.html',
  styleUrl: './project-card-carousel.css',
})
export class ProjectCardCarousel implements OnInit, OnDestroy {
  @Input() projects: any[] = [];
  @Input() interval = 10000;

  currentIndex = 0;
  autoPlayRef!: ReturnType<typeof setInterval>;

  private startX = 0;
  private currentTranslate = 0;
  private isDragging = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayRef = setInterval(() => this.next(), this.interval);
  }

  stopAutoPlay() {
    if (this.autoPlayRef) clearInterval(this.autoPlayRef);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  getTranslateValue(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  // --- Mobile drag handlers ---

  onPointerDown(event: PointerEvent | TouchEvent | MouseEvent) {
    const clientX = this.getClientX(event);
    this.startX = clientX;
    this.isDragging = true;

    const track = this.el.nativeElement.querySelector('.carousel-track');
    this.renderer.setStyle(track, 'transition', 'none');
    this.stopAutoPlay();
  }

  onPointerMove(event: PointerEvent | TouchEvent | MouseEvent) {
    if (!this.isDragging) return;

    const clientX = this.getClientX(event);
    const diff = clientX - this.startX;
    const track = this.el.nativeElement.querySelector('.carousel-track');
    const trackWidth = track.offsetWidth;
    const movePercent = (diff / trackWidth) * 100;

    this.renderer.setStyle(
      track,
      'transform',
      `translateX(calc(-${this.currentIndex * 100}% + ${movePercent}%))`
    );
  }

  onPointerUp(event: PointerEvent | TouchEvent | MouseEvent) {
    if (!this.isDragging) return;

    const clientX = this.getClientX(event);
    const diff = clientX - this.startX;
    const threshold = 50;

    const track = this.el.nativeElement.querySelector('.carousel-track');
    this.renderer.setStyle(track, 'transition', 'transform 0.4s ease');

    if (diff > threshold) {
      this.prev();
    } else if (diff < -threshold) {
      this.next();
    }

    requestAnimationFrame(() => {
      this.renderer.setStyle(track, 'transform', this.getTranslateValue());
    });

    this.isDragging = false;
    this.startAutoPlay();
  }

  private getClientX(event: PointerEvent | TouchEvent | MouseEvent): number {
    if ('touches' in event && event.touches.length > 0) {
      return event.touches[0].clientX;
    } else if ('clientX' in event) {
      return event.clientX;
    }
    return 0;
  }
}
