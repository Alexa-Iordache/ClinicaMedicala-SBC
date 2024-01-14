import { AfterViewInit, Component, OnInit } from '@angular/core';
import { XmlService } from './main.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  // the entire object from xml file
  medicalInformation: any;

  // obejct with all the pacients
  pacients: any;

  // obejct with all the doctors
  doctors: any;

  // obejct with all the appointments
  appointments: any;

  // obejct with all the medical records
  medical_records: any;

  // obejct with all the hospitals
  hospitals: any;

  // array with the pacients that are older than 30 years
  under20: number = 0;
  between20and30: number = 0;
  between30and40: number = 0;
  over40: number = 0;

  chartOptions = {};

  constructor(private xmlService: XmlService) {}

  ngOnInit(): void {
    this.xmlService
      .parseXmlFile('assets/bazaCunostinte.xml')
      .then((data) => {
        // Parse the JSON string
        const jsonObject = JSON.parse(data);

        // Now, jsonObject is a JavaScript object
        this.medicalInformation = jsonObject.informatii_medicale;

        this.pacients = this.medicalInformation.pacienti;
        console.log(this.pacients);

        this.doctors = this.medicalInformation.doctori;
        console.log(this.doctors);

        this.appointments = this.medicalInformation.consultatii;
        console.log(this.appointments);

        this.medical_records = this.medicalInformation.fise_medicale;
        console.log(this.medical_records);

        this.hospitals = this.medicalInformation.spitale;
        console.log(this.hospitals);
      })
      .catch((error) => {
        console.error('Error parsing XML:', error);
      });
  }

  // returns the pacients who are older than 30 years
  calculatePacientsAge(): void {

    this.under20 = 0;
    this.between20and30 = 0;
    this.between30and40 = 0;
    this.over40 = 0;

    for (let i = 0; i < this.pacients.pacient.length; i++) {
      const age = parseInt(this.pacients.pacient[i].varsta._text, 10);
      if (age <= 20) {
        this.under20++;
      }

      if (age > 20 && age <= 30) {
        this.between20and30++;
      }

      if (age > 30 && age <= 40) {
        this.between30and40++;
      }

      if (age > 40) {
        this.over40++;
      }
    }

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: 'Statistica varsta pacienti',
      },
      data: [
        {
          type: 'pie', //change type to column, line, area, doughnut, etc
          indexLabel: '{name}: {y}%',
          dataPoints: [
            { name: 'Sub 20 de ani', y: this.under20 },
            { name: 'Intre 20 si 30 de ani', y: this.between20and30 },
            { name: 'Intre 30 si 40 de ani', y: this.between30and40},
            { name: 'Peste 40 de ani', y: this.over40 }
          ],
        },
      ],
    };
  }
}
