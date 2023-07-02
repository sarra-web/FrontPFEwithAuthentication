import { Component, OnInit } from '@angular/core';
import { LogService } from '../../_services/log.service';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  files: { name: string }[] = []; // Replace this with your actual file data structure
  fileData: string[];
  elements: string[] = [];

  constructor(private fileService: LogService) { }
  ngOnInit(): void {
    this.fileService.getFile2('application.csv')
    .then(data => {
      this.elements = data.split(' '); // Split the data by spaces

    console.log(data)
    })
    .catch(error => {
      console.error('Error fetching file data:', error);
    });
}

  downloadFile(file: { name: string }) {
    this.fileService.getFile(file.name)
      .then(blob => {
        // Perform any necessary operations with the downloaded file
        // For example, you can create a URL for the blob and open it in a new window
        const url = URL.createObjectURL(blob);
        window.open(url);
      })
      .catch(error => {
        // Handle any error that occurred during the file download
        console.error('Error downloading file:', error);
      });
  }
  getFileData(filename: string) {
    this.fileService.getFile2(filename)
      .then(data => {
        this.fileData = data.split('\n'); // Supposons que les données du fichier sont séparées par des sauts de ligne
      })
      .catch(error => {
        console.error('Error fetching file data:', error);
      });
  }
}
