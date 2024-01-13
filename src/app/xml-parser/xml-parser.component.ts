import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-xml-parser',
  templateUrl: './xml-parser.component.html',
  styleUrls: ['./xml-parser.component.scss'],
})
export class XmlParserComponent {
  constructor(private http: HttpClient) {}

  parseXmlFile(xmlFilePath: string): Promise<any> {
    return this.http.get(xmlFilePath, { responseType: 'text' })
      .toPromise()
      .then((xmlData: any) => {
        return this.parseXmlString(xmlData);
      });
  }

  parseXmlString(xmlString: string): Promise<any> {
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    return new Promise((resolve, reject) => {
      parser.parseString(xmlString, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
