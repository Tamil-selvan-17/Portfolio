import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/apiservice/api.service';
import { ThemeMode, ThemeService } from '../../core/services/theme-service';
import { Home } from '../../features/home/home';
import { About } from '../../features/about/about';
import { SkillsComponent } from '../../features/skills/skills.component';
import { ExperienceComponent } from '../../features/experience/experience.component';
import { Projects } from '../../features/projects/projects';
import { Contact } from '../../features/contact/contact';
import { FooterComponent } from '../../features/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [
    CommonModule,
    Home,
    About,
    SkillsComponent,
    ExperienceComponent,
    Projects,
    Contact,
    FooterComponent,
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements OnInit, AfterViewInit, OnDestroy {
  private apiService = inject(ApiService);

  toggleMenu = false;
  active = 'home';
  theme$!: Observable<ThemeMode>;
  isPlaying = false;
  currentIndex = 0;
  audio!: HTMLAudioElement;
  clickCount = 0;
  clickDelay = 250;

  // Config-driven data
  musicPlaylist: string[] = [];
  LogoImage: string = '';
  fullName: string = '';
  navItems: string[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private theme: ThemeService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.theme$ = this.theme.theme$;

    // Fetch config JSON from API service
    this.apiService.getConfig().subscribe(
      (config) => {
        this.musicPlaylist = config.musicPlaylist || [];
        this.LogoImage = config.LogoImage;
        this.fullName = config.fullName;
        this.navItems = config.navItems || [];

        if (this.musicPlaylist.length > 0) {
          this.audio = new Audio(this.musicPlaylist[0]);
          this.audio.onended = () => this.nextTrack();
        }
      },
      (error) => {
        console.error('Failed to load config:', error);
      }
    );
  }

  toggleTheme() {
    this.theme.toggle();
  }

  scrollTo(sectionId: string) {
    const target = document.getElementById(sectionId.toLowerCase());
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.active = sectionId.toLowerCase();
    }
  }

  handleClick() {
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        this.togglePlayPause();
      } else if (this.clickCount === 2) {
        this.nextTrack();
      }
      this.clickCount = 0;
    }, this.clickDelay);
  }

  togglePlayPause() {
    if (!this.audio) return;
    this.isPlaying ? this.audio.pause() : this.audio.play();
    this.isPlaying = !this.isPlaying;
  }

  nextTrack() {
    if (!this.musicPlaylist.length) return;
    this.audio.pause();
    this.currentIndex = (this.currentIndex + 1) % this.musicPlaylist.length;
    this.audio = new Audio(this.musicPlaylist[this.currentIndex]);
    this.audio.play();
    this.isPlaying = true;
    this.audio.onended = () => this.nextTrack();
  }

  ngAfterViewInit(): void {
    const sections = document.querySelectorAll<HTMLElement>('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.ngZone.run(() => {
              this.active = entry.target.id.toLowerCase();
            });
          }
        });
      },
      { threshold: 0.6, rootMargin: '0px 0px -30% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
    }
  }
}
