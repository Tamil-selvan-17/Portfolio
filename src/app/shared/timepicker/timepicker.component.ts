import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timepicker',
  imports: [CommonModule, FormsModule],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.css',
})
export class TimepickerComponent {
  @Input() selectedTimezone: string = '';
  @Input() fullName: string = '';
  @Output() bookCallEvent = new EventEmitter<any>();

  selectedDate: Date = new Date();
  currentDate: Date = new Date();
  daysInMonth: number[] = [];
  blanks: number[] = [];
  selectedTime: string = '10:30';
  timezones: string[] = [];
  baseTimeSlots: string[] = [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
  ]; // in 24hr format (IST-based slots)

  timeSlots: string[] = [];

  ngOnInit(): void {
    this.generateCalendar();
    const supported = Intl.supportedValuesOf
      ? Intl.supportedValuesOf('timeZone')
      : this.getStaticTimezones();

    // Ensure Asia/Kolkata is included
    this.timezones = supported.includes('Asia/Kolkata')
      ? supported
      : ['Asia/Kolkata', ...supported];

    this.selectedTimezone = 'Asia/Kolkata';
    this.updateTimeSlots();
  }

  getStaticTimezones(): string[] {
    return [
      'Asia/Kolkata',
      'America/New_York',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
      'Europe/Berlin',
      'America/Los_Angeles',
    ];
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: lastDate }, (_, i) => i + 1);
    this.blanks = Array.from({ length: firstDay });
  }

  selectDate(day: number) {
    const selected = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    const today = new Date();

    // Reset hours to ignore time in comparison
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected >= today) {
      this.selectedDate = selected;
    } else {
      // Optional: show alert, toast, or disable past day in UI
      console.warn('Cannot select a past date.');
    }
  }
  isPast(day: number): boolean {
    const checkDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  isSelected(day: number): boolean {
    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getFullYear() === this.currentDate.getFullYear()
    );
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  onTimeSelect(time: string) {
    this.selectedTime = time;
  }

  onTimezoneChange(event: any) {
    this.selectedTimezone = event.target.value;
    console.log(this.selectedTimezone);
    this.updateTimeSlots(); // ✅ update time on change
  }

  updateTimeSlots() {
    const date = new Date();
    const IST = 'Asia/Kolkata';

    this.timeSlots = this.baseTimeSlots.map((time) => {
      const [hour, minute] = time.split(':').map(Number);
      const utcDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hour - 5,
          minute - 30
        )
      );

      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: this.selectedTimezone, // user's timezone
      }).format(utcDate);
    });
  }

  bookCall() {
    const meetingDetails = {
      date: this.selectedDate,
      time: this.selectedTime,
      timezone: this.selectedTimezone,
      meetingType: 'Google Meet',
    };

    console.log(meetingDetails);
    this.bookCallEvent.emit(meetingDetails);

    // Format date nicely
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(meetingDetails.date));

    // Show alert
    const message = `✅ Thank you for booking!

📅 Date: ${formattedDate}
⏰ Time: ${meetingDetails.time}
🌍 Timezone: ${meetingDetails.timezone}
📞 Meeting Type: ${meetingDetails.meetingType}

We’ll reach out to you soon.`;

    alert(message);
  }
}
