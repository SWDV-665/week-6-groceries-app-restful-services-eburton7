import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  apiUrl = 'http://localhost:3000/api/groceries';
  groceryItems: string[] = [];

  newItem: string = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private nativeStorage: NativeStorage
  ) {
    this.loadGroceryItems();
    this.initDatabase();
    this.fetchGroceryItems();
  }
  loadGroceryItems() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (response) => {
        if (response) {
          this.groceryItems = response.map((item) => item.name);
        }
      },
      (error) => {
        console.error('Error fetching grocery items:', error);
      }
    )
  }
  
  async initDatabase() {
    try {
    } catch (error) {
      console.error('Error opening database', error);
    }
  }

  async fetchGroceryItems() {
    try {
      const response = await this.http.get<any[]>(this.apiUrl).toPromise();
      
      if (response && Array.isArray(response)) {
        this.groceryItems = response.map(item => item.name);
    
        this.nativeStorage.setItem('groceryItems', this.groceryItems).then(
          () => {},
          (error) => {
            console.error('Error storing grocery items in Native Storage', error);
          }
        );
      }
    } catch (error) {
      console.error('Error fetching grocery items from API', error);
    }
  }

  async addItem() {
    if (this.newItem.trim() !== '') {
      try {

        this.groceryItems.push(this.newItem.trim());
        this.newItem = '';

        this.nativeStorage.setItem('groceryItems', this.groceryItems).then(
          () => {},
          (error) => {
            console.error('Error storing grocery items in Native Storage', error);
          }
        );
      } catch (error) {
        console.error('Error inserting item into database', error);
      }
    }
  }

  async deleteItem(item: string) {
    try {

      const index = this.groceryItems.indexOf(item);
      if (index !== -1) {
        this.groceryItems.splice(index, 1);
      }

      this.nativeStorage.setItem('groceryItems', this.groceryItems).then(
        () => {},
        (error) => {
          console.error('Error storing grocery items in Native Storage', error);
        }
      );
    } catch (error) {
      console.error('Error deleting item from database', error);
    }
  }
}
