import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/apiservice/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private apiService = inject(ApiService);
  fullName: string = '';
  title: string = '';
  description: string = '';
  email: string = '';
  linkedin: string = '';
  profileImage: string = '';

  displayedName: string = '';
  typingSpeed: number = 100; // ms per character typing
  deletingSpeed: number = 50; // ms per character deleting
  pauseDuration: number = 1500; // pause before deleting and before typing again

  constructor() {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.fullName = config.fullName;
        this.title = config.title;
        this.description = config.description;
        this.email = config.email;
        this.linkedin = config.linkedin;
        this.profileImage = config.profileImage;
        this.loopTypingEffect();
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }
  loopTypingEffect(index: number = 0, isDeleting: boolean = false): void {
    if (!isDeleting && index <= this.fullName.length) {
      // Typing phase
      this.displayedName = this.fullName.substring(0, index);
      if (index === this.fullName.length) {
        // Pause before deleting
        setTimeout(
          () => this.loopTypingEffect(index - 1, true),
          this.pauseDuration
        );
      } else {
        setTimeout(
          () => this.loopTypingEffect(index + 1, false),
          this.typingSpeed
        );
      }
    } else if (isDeleting && index >= 0) {
      // Deleting phase
      this.displayedName = this.fullName.substring(0, index);
      if (index === 0) {
        // Pause before typing again
        setTimeout(() => this.loopTypingEffect(1, false), this.pauseDuration);
      } else {
        setTimeout(
          () => this.loopTypingEffect(index - 1, true),
          this.deletingSpeed
        );
      }
    }
  }
}
