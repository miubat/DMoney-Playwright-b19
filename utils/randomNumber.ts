 export function generateRandomNumber(min: number, max: number): number {
    // Random whole number between min and max (both included)
    return Math.floor(Math.random() * (max - min + 1)) + min;

}
