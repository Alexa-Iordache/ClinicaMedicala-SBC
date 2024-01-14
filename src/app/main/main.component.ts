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

  // how many pacients are under 20 years old
  under20: number = 0;

  // how many pacients are between 20 years old and 30 years old
  between20and30: number = 0;

  // how many pacients are between 30 years old and 40 years old
  between30and40: number = 0;

  // how many pacients are over 40 years old
  over40: number = 0;

  // chart for pacients age
  chartPacientsAge = {};

  // chart for medical specialitie
  chartMedicalSpecialities = {}

  cardiologyPacients: number = 0;
  dentistryPacients: number = 0;
  neurologyPacients: number = 0;

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

  // returns how many pacients are under 20 years old, how many are between 20 and 30
  // how many are between 30 and 40 and how many are over 40 years old
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

    this.chartPacientsAge = {
      animationEnabled: true,
      title: {
        text: 'Statistica varsta pacienti',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{name}: {y}%',
          dataPoints: [
            { name: 'Sub 20 de ani', y: this.under20 },
            { name: 'Intre 20 si 30 de ani', y: this.between20and30 },
            { name: 'Intre 30 si 40 de ani', y: this.between30and40 },
            { name: 'Peste 40 de ani', y: this.over40 },
          ],
        },
      ],
    };
  }

  // returns how many pacients had appointments at cardiology, how many pacients had appointments at dentistry
  // and how many pacients had appointments at neurology
  calculateMedicalSpecialty(): void {
    this.cardiologyPacients = 0;
    this.dentistryPacients = 0;
    this.neurologyPacients = 0;

    // create a list of medical specialities
    const medicalSpecialities: string[] = [];
    for (let i = 0; i < this.doctors.doctor.length; i++) {
      const specializare = this.doctors.doctor[i].specializare._text;
      if (!medicalSpecialities.includes(specializare)) {
        medicalSpecialities.push(specializare);
      }
    }

    // calculate the number of pacients that had appointments at a certain speciality
    const pacientsPerSpeciality: { [key: string]: number } = {};
    for (let i = 0; i < medicalSpecialities.length; i++) {
      const medicalSpeciality = medicalSpecialities[i];
      pacientsPerSpeciality[medicalSpeciality] = 0;
    }

    // Parcurge lista de consultatii și incrementeaaza numarul de pacienti pentru fiecare specializare
    for (let i = 0; i < this.appointments.consultatie.length; i++) {
      const numeDoctor = this.appointments.consultatie[i].nume_doctor._text;

      for (let j = 0; j < this.doctors.doctor.length; j++) {
        if (this.doctors.doctor[j].nume._text === numeDoctor) {
          pacientsPerSpeciality[this.doctors.doctor[j].specializare._text]++;
        }
      }
    }

    // Afiseaza rezultatele
    console.log('Numar pacienti pe specializare:', pacientsPerSpeciality);
    this.cardiologyPacients = pacientsPerSpeciality['Cardiologie'];
    this.dentistryPacients = pacientsPerSpeciality['Stomatologie'];
    this.neurologyPacients = pacientsPerSpeciality['Neurologie'];

    this.chartMedicalSpecialities = {
      animationEnabled: true,
      title: {
        text: 'Statistica pacienti si specializarile la care au avut programari:',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{name}: {y}%',
          dataPoints: [
            { name: 'Cardiologie', y: this.cardiologyPacients },
            { name: 'Stomatologie', y: this.dentistryPacients },
            { name: 'Neurologie', y: this.neurologyPacients}
          ],
        },
      ],
    };
  }
}
