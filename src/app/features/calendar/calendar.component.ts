import { Component } from '@angular/core';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  currentMonth: Date;
  daysOfWeek: string[];
  calendarDays: { day: number; isCurrentMonth: boolean }[];
  selectedDate: Date | null = null;

  constructor() {
    this.currentMonth = new Date();
    this.daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.calendarDays = [];
    this.generateCalendar();
  }
  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];

    // Generate previous month's days
    const previousMonth = new Date(year, month - 1, 1);
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        day: daysInPreviousMonth - i,
        isCurrentMonth: false,
      });
    }

    // Generate current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({ day: i, isCurrentMonth: true });
    }

    // Generate next month's days
    const nextMonth = new Date(year, month + 1, 1);
    const lastDay = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      0
    ).getDay();
    const daysInNextMonth = 6 * 7 - (firstDay + daysInMonth);

    for (let i = 1; i <= daysInNextMonth; i++) {
      this.calendarDays.push({ day: i, isCurrentMonth: false });
    }
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1)
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1)
    );
    this.generateCalendar();
  }

  selectedHour: number = 0;
  selectedMinute: number = 0;
  selectedSecond: number = 0;

  hours: number[] = Array.from({ length: 24 }, (_, index) => index); // 0-23 hours
  minutes: number[] = Array.from({ length: 60 }, (_, index) => index); // 0-59 minutes
  seconds: number[] = Array.from({ length: 60 }, (_, index) => index); // 0-59 minutes

  selectDate(day: { day: number; isCurrentMonth: boolean }): void {
    if (day.isCurrentMonth) {
      const selectedDate = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth(),
        day.day
      );
      selectedDate.setHours(
        this.selectedHour,
        this.selectedMinute,
        this.selectedSecond
      );
      this.selectedDate = selectedDate;
    }
  }
}
