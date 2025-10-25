import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";

@Component({
    selector: 'app-course-learn',
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
    templateUrl: './course-learn.component.html',
    styleUrls: ['./course-learn.component.scss']
})
export class CourseLearnComponent {

    panelOpenState = false;

    constructor() {}

}