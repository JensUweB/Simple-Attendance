import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'padEnd'})
export class PadEndPipe implements PipeTransform {
    transform(value: any, maxLength: number, padString: string): any {
        const str = value.toString();
        return str.padEnd(maxLength, padString);
    }
}
