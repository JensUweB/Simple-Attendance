
export class Helper {

    /**
     * Creates & returns an unique 20 characters long identifier
     */
    public static uuid() {
        return 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0;
            // tslint:disable-next-line:no-bitwise
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
