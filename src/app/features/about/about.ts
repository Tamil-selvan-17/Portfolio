import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/apiservice/api.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  private apiService = inject(ApiService);
  imageUrl = '';
  heading = '';
  subtitle = '';
  bioParagraphs: string[] = [];
  resumeUrl = '';

  ngOnInit(): void {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.imageUrl = config.imageUrl;
        this.heading = config.heading;
        this.subtitle = config.subtitle;
        this.bioParagraphs = config.bioParagraphs;
        this.resumeUrl = config.resumeUrl;
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }
}
