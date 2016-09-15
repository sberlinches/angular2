import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgLocalization } from "@angular/common";
// Models
import { UserModel } from './../models/user.model';
// Services
import { UserService } from './../services/user.service';

class TimeLocalization extends NgLocalization {
    getPluralCategory(value: any) {
        if(value < 0) {
            return '<0';
        }
        if(value > 1) {
            return '>1';
        }
    }
}

@Component({
    selector: 'user-list',
    templateUrl: 'app/user/views/user-list.component.html',
    providers: [
        { provide: NgLocalization, useClass: TimeLocalization }
    ]
})

export class UserListComponent implements OnInit {

    errorMessage: string;
    users: UserModel[];
    selectedUser: UserModel;
    todayDate: Date = new Date();
    ageFormat: string = 'toYears';
    // TODO: External config file
    timeMapping: any = {
        '<0': '# years',
        '=-1': '# year',
        '=0': 'Less than a year',
        '=1': '# year',
        '>1': '# years'
    };

    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(): void {
        this.userService
            .getUsers()
            .subscribe(
                data => this.users = data,
                error => this.errorMessage = <any>error
            );
    }

    onSelect(user: UserModel): void {
        this.selectedUser = user;
    }

    goToUserEdit(): void {
        let link = ['/user/edit', this.selectedUser.id];
        this.router.navigate(link);
    }

    deleteUser(): void {
        let userId: number = this.selectedUser.id;
        this.userService
            .deleteUser(userId)
            .subscribe(
                data => this.getUsers(),
                error => this.errorMessage = <any>error
            );
    }
}