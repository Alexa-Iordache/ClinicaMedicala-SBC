import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xmljs from 'xml-js';

@Injectable({
  providedIn: 'root',
})
export class XmlService {
  constructor(private http: HttpClient) {}

  parseXmlFile(xmlFilePath: string): Promise<any> {
    return this.http.get(xmlFilePath, { responseType: 'text' })
      .toPromise()
      .then((xmlData) => {
        if (xmlData) {
          return this.parseXmlString(xmlData);
        } else {
          throw new Error('XML data is undefined');
        }
      });
  }

  parseXmlString(xmlString: string): any {
    return xmljs.xml2json(xmlString, { compact: true, spaces: 2 });
  }
}
