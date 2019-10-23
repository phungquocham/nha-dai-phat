import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ConvertDatetimePipe } from './convert-datetime.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ConvertDatetimePipe
    ],
    exports: [
        ConvertDatetimePipe
    ]
})
export class PipesModule { }
