import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'padStart'})
export class PadStartPipe implements PipeTransform {
    transform(value: any, maxLength: number, padString: string): any {
        const str = value.toString();
        return str.padStart(maxLength, padString);
    }
}
