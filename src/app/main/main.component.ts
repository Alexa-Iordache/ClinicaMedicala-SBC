import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  xmlData: any;

  // constructor(private xmlService: XmlService) {}

  // ngOnInit(): void {
  //   this.xmlService.parseXmlFile('path/to/your/xml/file.xml')
  //     .then((data: any) => {
  //       this.xmlData = data;
  //     })
  //     .catch((error: any) => {
  //       console.error('Error parsing XML:', error);
  //     });
  // }
}
