import { Component, OnInit } from '@angular/core';
import { XmlService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  parsedData: any;

  constructor(private xmlService: XmlService) {}

  ngOnInit(): void {
    this.xmlService
      .parseXmlFile('assets/bazaCunostinte.xml')
      .then((data) => {
        this.parsedData = data;
        console.log(this.parsedData);
      })
      .catch((error) => {
        console.error('Error parsing XML:', error);
      });
  }
}
