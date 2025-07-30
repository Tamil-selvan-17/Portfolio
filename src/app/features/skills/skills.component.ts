import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/apiservice/api.service';
interface Skill {
  name: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
})
export class SkillsComponent implements OnInit {
  private apiService = inject(ApiService);
  filters: string[] = [];
  activeFilter = 'All';
  skills: Skill[] = [];
  skilltitle: string = '';
  skillsubtitle: string = '';

  ngOnInit() {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.filters = config.filters;
        this.skills = config.skills;
        this.skilltitle = config.skilltitle;
        this.skillsubtitle = config.skillsubtitle;
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }

  filteredSkills(): Skill[] {
    const allSkills =
      this.activeFilter === 'All'
        ? this.skills
        : this.skills.filter((skill) => skill.category === this.activeFilter);

    // Remove duplicates based on skill name
    const uniqueSkillsMap = new Map<string, Skill>();
    allSkills.forEach((skill) => {
      if (!uniqueSkillsMap.has(skill.name)) {
        uniqueSkillsMap.set(skill.name, skill);
      }
    });

    return Array.from(uniqueSkillsMap.values());
  }
}
