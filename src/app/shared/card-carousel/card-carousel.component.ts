import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-carousel.component.html',
  styleUrl: './card-carousel.component.css',
})
export class CardCarouselComponent implements OnInit, OnDestroy {
  @Input() projects: any[] = [];
  @Input() interval = 8000; // autoplay interval (ms)

  currentIndex = 0;
  autoPlayRef!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay(); // clear existing
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
}
