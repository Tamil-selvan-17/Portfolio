import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/apiservice/api.service';

interface JourneyStep {
  category: string;
  title: string;
  place?: string;
  period: string;
  bullets?: string[];
}
@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnInit {
  private apiService = inject(ApiService);
  education: any[] = [];
  experience: any[] = [];
  experiencetitle: string = '';
  experienceSubtitle: string = '';

  ngOnInit(): void {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.education = config.education;
        this.experiencetitle = config.experiencetitle;
        this.experienceSubtitle = config.experienceSubtitle;
        this.experience = config.experience.map((exp: any) => ({
          ...exp,
          expanded: false, // default collapsed
        }));
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }
  getTotalDuration(roles: { date: string }[]): string {
    let totalMonths = 0;

    for (const role of roles) {
      const [startStr, endStrRaw] = role.date.split('–').map((s) => s.trim());

      const startDate = new Date(startStr + ' 01');
      const endDate =
        endStrRaw === 'Present' ? new Date() : new Date(endStrRaw + ' 01');

      const years = endDate.getFullYear() - startDate.getFullYear();
      const months = endDate.getMonth() - startDate.getMonth();

      let diff = years * 12 + months;

      if (endDate.getDate() >= startDate.getDate()) {
        diff += 1;
      }

      totalMonths += diff;
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years > 0 ? years + ' yr' + (years > 1 ? 's' : '') : ''}${
      months > 0 ? (years ? ' ' : '') + months + ' mo' : ''
    }`;
  }

  toggleCompany(selected: any): void {
    this.experience.forEach((company) => {
      company.expanded = company === selected ? !company.expanded : false;
    });
  }
}
