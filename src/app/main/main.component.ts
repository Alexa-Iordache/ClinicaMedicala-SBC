import { Component, OnInit } from '@angular/core';
import { XmlService } from './main.service';
import { InformatiiMedicale } from './main.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  medicalInformation: any;

  constructor(private xmlService: XmlService) {}

  ngOnInit(): void {
    this.xmlService
      .parseXmlFile('assets/bazaCunostinte.xml')
      .then((data) => {
        // console.log(data);
        const jsonString =
          '{"informatii_medicale":{"pacient":{"nume":{"_text":"Andrei"},"varsta":{"_text":"20"}}}}';

        // Parse the JSON string
        const jsonObject = JSON.parse(data);

        // Now, jsonObject is a JavaScript object
        console.log(jsonObject.informatii_medicale);
      })
      .catch((error) => {
        console.error('Error parsing XML:', error);
      });
  }
}
