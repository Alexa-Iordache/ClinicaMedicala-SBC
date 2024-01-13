import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { XmlParserComponent } from './xml-parser/xml-parser.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    XmlParserComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
