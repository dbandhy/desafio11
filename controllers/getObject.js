//export
const getObject = () => {
    let cant = process.env.CANT_BUCLE;
    if (!cant){
        cant = 100000000;
    }
    let arr = [];
    let data = {};

    // numeros a calcular
    for (let i = 0; i <= 1000; i++) {
        arr[i] = 0;
    }

    // math random para escoger numero aleatorio
    for (let i = 0; i <= cant; i++) {
        let numRandom = Math.floor((Math.random() * (1001 - 1) + 1));
        arr[numRandom]++;
    }

    //object output
    for (let i = 0; i <= arr.length - 1; i++) {
        data[i] = {
            vecesQueAparece: arr[i]
        }
    }

    
    return (data);
}
export const objectAleatorio = getObject();

process.send(objectAleatorio);
