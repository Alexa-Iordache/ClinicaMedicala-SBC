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

  // obejct with all the patients
  patients: any;

  // obejct with all the doctors
  doctors: any;

  // obejct with all the appointments
  appointments: any;

  // obejct with all the medical records
  medical_records: any;

  // obejct with all the hospitals
  hospitals: any;

  // how many patients are under 20 years old
  under20: number = 0;

  // how many patients are between 20 years old and 30 years old
  between20and30: number = 0;

  // how many patients are between 30 years old and 40 years old
  between30and40: number = 0;

  // how many patients are over 40 years old
  over40: number = 0;

  // chart for patients age
  chartPatientsAge = {};

  // chart for medical specialitie
  chartMedicalSpecialities = {};

  // chart for season appointment
  chartSeasonApp = {};

  // chart for patients and doctors
  chartPatientsBasedOnDoctors = {};

  // chart for hospital capacity
  chartHospitalCapacity = {};

  // number of patients that had an appointment to cardiology
  cardiologyPatients: number = 0;

  // number of patients that had an appointment to dentistry
  dentistryPatients: number = 0;

  // number of patients that had an appointment to neurology
  neurologyPatients: number = 0;

  // number of appointments that took place in spring
  springApp: number = 0;

  // number of appointments that took place in summer
  summerApp: number = 0;

  // number of appointments that took place in autumn
  autumnApp: number = 0;

  // number of appointments that took place in winter
  winterApp: number = 0;

  // number of patients that went to Popescu Daniela
  popescuPatients: number = 0;

  // number of patients that went to Dumitru Stefan
  dumitruPatients: number = 0;

  // number of patients that went to Ionescu Lavinia
  ionescuPatients: number = 0;

  // number of patients that went to Toma Razvan
  tomaPatients: number = 0;

  // number of patients that went to Adam Miruna
  adamPatients: number = 0;

  // number of hospitals that has a capacity of more than 1500 places
  hospitalCapacityOver1500: number = 0;

  // number of hospitals that has a capacity of less than 1500 places
  hospitalCapacityUnder1500: number = 0;

  // if the doctor introduced in input exists or not
  doctorExists: boolean = false;

  // number of patients
  numberOfPatients: number = 0;

  // if the check doctor was clicked or not
  buttonCliked = false;

  doctorName: string = '';

  constructor(private xmlService: XmlService) {}

  ngOnInit(): void {
    this.xmlService
      .parseXmlFile('assets/bazaCunostinte.xml')
      .then((data) => {
        // Parse the JSON string
        const jsonObject = JSON.parse(data);

        // Now, jsonObject is a JavaScript object
        this.medicalInformation = jsonObject.informatii_medicale;

        this.patients = this.medicalInformation.pacienti;
        console.log(this.patients);

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

  // returns how many patients are under 20 years old, how many are between 20 and 30
  // how many are between 30 and 40 and how many are over 40 years old
  calculatePatientsAge(): void {
    this.under20 = 0;
    this.between20and30 = 0;
    this.between30and40 = 0;
    this.over40 = 0;

    for (let i = 0; i < this.patients.pacient.length; i++) {
      const age = parseInt(this.patients.pacient[i].varsta._text, 10);
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

    this.chartPatientsAge = {
      animationEnabled: true,
      title: {
        text: 'Statistica varsta pacienti',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{name}: {y} pacient(i)',
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

  // returns how many patients had appointments at cardiology,
  // how many patients had appointments at dentistry
  // and how many patients had appointments at neurology
  calculateMedicalSpecialty(): void {
    this.cardiologyPatients = 0;
    this.dentistryPatients = 0;
    this.neurologyPatients = 0;

    // create a list of medical specialities
    const medicalSpecialities: string[] = [];
    for (let i = 0; i < this.doctors.doctor.length; i++) {
      const specializare = this.doctors.doctor[i].specializare._text;
      if (!medicalSpecialities.includes(specializare)) {
        medicalSpecialities.push(specializare);
      }
    }

    // calculate the number of patients that had appointments at a certain speciality
    const patientsPerSpeciality: { [key: string]: number } = {};
    for (let i = 0; i < medicalSpecialities.length; i++) {
      const medicalSpeciality = medicalSpecialities[i];
      patientsPerSpeciality[medicalSpeciality] = 0;
    }

    for (let i = 0; i < this.appointments.consultatie.length; i++) {
      const numeDoctor = this.appointments.consultatie[i].nume_doctor._text;

      for (let j = 0; j < this.doctors.doctor.length; j++) {
        if (this.doctors.doctor[j].nume._text === numeDoctor) {
          patientsPerSpeciality[this.doctors.doctor[j].specializare._text]++;
        }
      }
    }

    // Afiseaza rezultatele
    console.log('Numar pacienti pe specializare:', patientsPerSpeciality);
    this.cardiologyPatients = patientsPerSpeciality['Cardiologie'];
    this.dentistryPatients = patientsPerSpeciality['Stomatologie'];
    this.neurologyPatients = patientsPerSpeciality['Neurologie'];

    this.chartMedicalSpecialities = {
      animationEnabled: true,
      title: {
        text: 'Statistica pacienti si specializarile la care au avut programari:',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{name}: {y} pacienti',
          dataPoints: [
            { name: 'Cardiologie', y: this.cardiologyPatients },
            { name: 'Stomatologie', y: this.dentistryPatients },
            { name: 'Neurologie', y: this.neurologyPatients },
          ],
        },
      ],
    };
  }

  // returns how many appointments took place in each season
  calculateAppointmentsBasedOnSeason(): void {
    this.springApp = 0;
    this.summerApp = 0;
    this.autumnApp = 0;
    this.winterApp = 0;

    let date1 = new Date();

    for (let i = 0; i < this.appointments.consultatie.length; i++) {
      const appDate = this.appointments.consultatie[i].data_consultatiei._text;
      const dateParts = appDate.split('.');
      const transformedDate = new Date(
        `${dateParts[1]}.${dateParts[0]}.${dateParts[2]}`
      );
      const formattedDateString = `${
        transformedDate.getMonth() + 1
      }.${transformedDate.getDate()}.${transformedDate.getFullYear()}`;

      if (this.getSeason(formattedDateString) === 'spring') {
        this.springApp++;
      }

      if (this.getSeason(formattedDateString) === 'summer') {
        this.summerApp++;
      }

      if (this.getSeason(formattedDateString) === 'autumn') {
        this.autumnApp++;
      }

      if (this.getSeason(formattedDateString) === 'winter') {
        this.winterApp++;
      }
    }

    this.chartSeasonApp = {
      animationEnabled: true,
      title: {
        text: 'Statistica programari in functie de anotimp',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{name}: {y} programari',
          dataPoints: [
            { name: 'Vara', y: this.summerApp },
            { name: 'Primavara', y: this.springApp },
            { name: 'Toamna', y: this.autumnApp },
            { name: 'Iarna', y: this.winterApp },
          ],
        },
      ],
    };
  }

  // method that returns in which season is the date given as an input
  getSeason(dateString: string): string {
    const dateParts = dateString.split('.');
    const month = parseInt(dateParts[0], 10);
    const day = parseInt(dateParts[1], 10);

    if (
      (month === 12 && day >= 1) ||
      month === 1 ||
      (month === 2 && day < 30)
    ) {
      return 'winter';
    } else if (
      (month === 3 && day >= 1) ||
      month === 4 ||
      (month === 5 && day < 32)
    ) {
      return 'spring';
    } else if (
      (month === 6 && day >= 1) ||
      month === 7 ||
      (month === 8 && day < 32)
    ) {
      return 'summer';
    } else if (
      (month === 9 && day >= 1) ||
      month === 10 ||
      (month === 11 && day < 31)
    ) {
      return 'autumn';
    } else {
      return 'Date is not valid';
    }
  }

  // method that returns the number of patients based on the doctor
  calculatePatientsBasedOnDoctor(): void {
    this.popescuPatients = 0;
    this.dumitruPatients = 0;
    this.ionescuPatients = 0;
    this.tomaPatients = 0;
    this.adamPatients = 0;

    for (let i = 0; i < this.appointments.consultatie.length; i++) {
      const doctorName = this.appointments.consultatie[i].nume_doctor._text;
      if (doctorName === 'Popescu Daniela') this.popescuPatients++;
      if (doctorName === 'Dumitru Stefan') this.dumitruPatients++;
      if (doctorName === 'Ionescu Lavinia') this.ionescuPatients++;
      if (doctorName === 'Toma Razvan') this.tomaPatients++;
      if (doctorName === 'Adam Miruna') this.adamPatients++;

      this.chartPatientsBasedOnDoctors = {
        animationEnabled: true,
        title: {
          text: 'Statistica pacienti in functie de doctorul la care au fost',
        },
        data: [
          {
            type: 'pie',
            indexLabel: '{name}: {y} pacienti',
            dataPoints: [
              {
                name: 'Pacienti care au fost la Popescu Daniela',
                y: this.popescuPatients,
              },
              {
                name: 'Pacienti care au fost la Dumitru Stefan',
                y: this.dumitruPatients,
              },
              {
                name: 'Pacienti care au fost la Ionescu Lavinia',
                y: this.ionescuPatients,
              },
              {
                name: 'Pacienti care au fost la Toma Razvan',
                y: this.tomaPatients,
              },
              {
                name: 'Pacienti care au fost la Adam Miruna',
                y: this.adamPatients,
              },
            ],
          },
        ],
      };
    }
  }

  // method that returns the number of hospitals that has a capacity over 1500 places
  // and the number of hospitals that has a capacity under 1500 places
  calculateHospitalCapacity(): void {
    this.hospitalCapacityOver1500 = 0;
    this.hospitalCapacityUnder1500 = 0;

    for (let i = 0; i < this.hospitals.spital.length; i++) {
      const capacity = parseInt(this.hospitals.spital[i].capacitate._text, 10);
      if (capacity >= 1500) this.hospitalCapacityOver1500++;
      if (capacity < 1500) this.hospitalCapacityUnder1500++;

      this.chartHospitalCapacity = {
        animationEnabled: true,
        title: {
          text: 'Statistica capacitate spitale',
        },
        data: [
          {
            type: 'pie',
            indexLabel: '{name}: {y} spitale',
            dataPoints: [
              {
                name: 'Spitale cu o capacitate mai mare de 1500',
                y: this.hospitalCapacityOver1500,
              },
              {
                name: 'Spitale cu o capacitate mai mica de 1500',
                y: this.hospitalCapacityUnder1500,
              },
            ],
          },
        ],
      };
    }
  }

  // methid that checks if a doctor exists or not
  verifyDoctor(): void {
    this.buttonCliked = true;
    this.doctorExists = false;
    const doctorNames: string[] = [];
    for (let i = 0; i < this.doctors.doctor.length; i++) {
      const name = this.doctors.doctor[i].nume._text;
      if (!doctorNames.includes(name)) {
        doctorNames.push(name);
      }
    }

    for (let j = 0; j < this.doctors.doctor.length; j++) {
      if (this.doctorName === this.doctors.doctor[j].nume._text) {
        this.doctorExists = true;
      }
    }
  }

  // method that calculates the number of patients
  calculateNumberOfPatients(): void {
    this.numberOfPatients = this.patients.pacient.length;
  }
}
