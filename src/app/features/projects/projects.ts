import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/apiservice/api.service';
import { CardCarouselComponent } from '../../shared/card-carousel/card-carousel.component';
interface Tech {
  name: string;
  icon: string; // image URL
}

interface Project {
  name: string;
  company: string;
  period: string;
  bullets: string[];
  stack: Tech[];
  image: string;
}
@Component({
  selector: 'app-projects',
  imports: [CommonModule, CardCarouselComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: Project[] = [];
  ProjectTitle: string = '';
  ProjectSubTitle: string = '';
  ngOnInit(): void {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.projects = config.project;
        this.ProjectTitle = config.ProjectTitle;
        this.ProjectSubTitle = config.ProjectSubTitle;
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }
  private apiService = inject(ApiService);
}
