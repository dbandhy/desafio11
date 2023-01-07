import { randomUUID as generarId } from 'crypto'

export class Sistema {
    constructor(enviadorDeMails) {
        this.enviadorDeMails = enviadorDeMails,
        this.usuarios = {};
    }

    obtenerDeuda(idUsuario) {
        let montoTotal = 0;
        this.usuarios[idUsuario].gastos.forEach(gasto => {
            montoTotal += gasto.monto;
        });
        return montoTotal;
    }

    cargarUsuario(nombreUsuario) {
        const usuario = { id: generarId(), nombre: nombreUsuario, gastos: [] };
        this.usuarios[usuario.id] = usuario;
        
        return usuario;
    }

    cargarGasto({ monto, descripcion, participantes }) {
        const cantParticipantes = participantes.length
        const montoIndividual = monto / cantParticipantes
        for (const idParticipante of participantes) {
            const gasto = { monto: montoIndividual, descripcion }
            this.usuarios[idParticipante].gastos.push(gasto)
        }
    }
}

// import {randomUUID as generarId} from "crypto"

// export class Sistema {
//     constructor() {
//         this.usuarios = {};
//     }
    
//     obtenerDeuda(idUsuario) {
//         let montoTotal = 0;
//         this.usuarios[idUsuario].gastos.forEach(gasto => {
//             montoTotal += gasto.monto;
//         });
//         return montoTotal;
//     }

//     cargarUsuario(nombreUsuario) {
//         const usuario = {id: generarId(),nombre: nombreUsuario, gastos: []};
//         this.usuarios[usuario.id] = usuario;
//         return usuario;
//     }
    
//     cargarGasto({ monto, descripcion, participantes }) {
 
//         const cantParticipantes = participantes.lenght
//         const montoIndividual = monto / cantParticipantes
//         for (const idParticipante of participantes) {
//             const gasto = {monto: montoIndividual, descripcion }
//             this.usuarios[idParticipante].gastos.push(gasto)
//         }

//     }
// }
 