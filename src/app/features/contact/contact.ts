import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/apiservice/api.service';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { TimepickerComponent } from '../../shared/timepicker/timepicker.component';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    FormsModule,
    ContactFormComponent,
    TimepickerComponent,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  title = '';
  subtitle = '';
  email = '';
  linkedin = '';
  github = '';
  twitter = '';
  instagram = '';
  address = '';
  phone = '';
  SatelliteMapAd = '';

  private apiService = inject(ApiService);
  copySuccess: boolean = false;
  isBookCall: boolean = false;

  formData = {
    name: '',
    email: '',
    message: '',
  };

  callData = {
    name: '',
    email: '',
    date: '',
    time: '',
  };

  bookedCall: any = null;
  selectedTimezone: any;
  fullName: any;

  ngOnInit(): void {
    this.apiService.getConfig().subscribe(
      (config) => {
        this.title = config.Contacttitle;
        this.subtitle = config.Contactsubtitle;
        this.email = config.email;
        this.address = config.address;
        this.phone = config.phone;
        this.selectedTimezone = config.selectedTimezone;
        this.fullName = config.fullName;
        this.SatelliteMapAd = config.SatelliteMapAd;
        this.linkedin = config.linkedin;
        this.github = config.github;
        this.twitter = config.twitter;
        this.instagram = config.instagram;
      },
      (error) => {
        console.error('Error loading endpoints:', error);
      }
    );
  }
  copyEmail() {
    navigator.clipboard.writeText(this.email).then(() => {
      this.copySuccess = true;
      setTimeout(() => (this.copySuccess = false), 1500);
    });
  }

  sendEmail(form: any) {
    if (form.valid) {
      console.log('Email Sent', this.formData);
      form.resetForm();
    }
  }

  bookCall(form: any) {
    if (form.valid) {
      this.bookedCall = { ...this.callData };
      form.resetForm();
    }
  }
}
