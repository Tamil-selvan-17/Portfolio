import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ɵIMAGE_CONFIG_DEFAULTS,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/apiservice/api.service';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { TimepickerComponent } from '../../shared/timepicker/timepicker.component';
import emailjs from '@emailjs/browser';

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
  serviceID: string = '';
  templateID: string = '';
  publicKey: string = '';

  ngOnInit(): void {
    emailjs.init(this.publicKey);
    this.apiService.getConfig().subscribe(
      (config) => {
        this.serviceID = config.serviceID;
        this.templateID = config.templateID;
        this.publicKey = config.publicKey;

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

  sendEmail(formData: any) {
    alert(
      `✅ Thank you, ${formData.name}!\n\nYour message has been sent successfully:\n\n"${formData.message}"`
    );
    // emailjs.send(this.serviceID, this.templateID, formData).then(
    //   (response) => {
    //     console.log('Email sent!', response.status);
    //     alert('Thank you! Your message has been sent.');
    //   },
    //   (error) => {
    //     console.error('Failed to send email', error);
    //     alert('Oops! Something went wrong.');
    //   }
    // );
  }
  bookCall(form: any) {}
}
