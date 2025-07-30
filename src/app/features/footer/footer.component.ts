import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/apiservice/api.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private apiService = inject(ApiService);

  currentYear: number = new Date().getFullYear();
  name: any;
  github: any;
  linkedin: any;
  email: any;
  instagram: any;
  ngOnInit(): void {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.name = config.fullName;
        this.github = config.github;
        this.linkedin = config.linkedin;
        this.instagram = config.instagram;
        this.email = config.email;
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }
}
