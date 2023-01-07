
import assert from 'assert'
import { faker } from '@faker-js/faker'
faker.locale = 'es'
import { Sistema } from '../src/Sistema.js'
// import EnviadorDeMailsMock from '../src/EnviadorDeMailsMock.js'
// import EnviadorDeMailsGmail from '../src/EnviadorDeMailsGmail.js'

// const enviador = new EnviadorDeMailsMock()
// const enviador = new EnviadorDeMailsGmail()

const sistema = new Sistema()

//=============================================================

// al cargar un usuario, comienza sin deuda

const usuario1 = sistema.cargarUsuario(faker.name.firstName())

// verificacion: 
assert.strictEqual(sistema.obtenerDeuda(usuario1.id), 0)

//=============================================================

// si cargo un gasto, se le asigna a su usuario

sistema.cargarGasto({
    monto: 1000,
    descripcion: faker.commerce.productName(),
    participantes: [usuario1.id]
})

// verificacion: 
assert.strictEqual(sistema.obtenerDeuda(usuario1.id), 1000)

//=============================================================

const usuario2 = sistema.cargarUsuario(faker.name.firstName()) // { id: 2, nombre: 'Luis' }

sistema.cargarGasto({
    monto: 1000,
    descripcion: faker.commerce.productName(),
    participantes: [usuario1.id, usuario2.id]
})

// verificacion: 
assert.strictEqual(sistema.obtenerDeuda(usuario1.id), 1500)
assert.strictEqual(sistema.obtenerDeuda(usuario2.id), 500)


// import assert from "assert"
// import { faker } from "@faker-js/faker";
// faker.locale = "es"
// import { Sistema } from "../src/Sistema.js";
// const sistema = new Sistema()


// const usuario1 = sistema.cargarUsuario(faker.name.firstName())

// assert.strictEqual(sistema.obtenerDeuda(usuario1.id), 0)

//  const usuario2 = sistema.cargarUsuario(faker.name.firstName())

// // sistema.CargarParticipante(viaje.id, usuario1.id)
// // sistema.CargarParticipante(viaje.id, usuario2.id)


//  assert.strictEqual(sistema.obtenerDeuda(usuario2.id), 0)

// //const viaje = sistema.CargarViaje("Cusco")


// sistema.cargarGasto({
//     monto: 1000 ,
//     descripcion: faker.commerce.productName(),
//     participantes: [usuario1.id]   

// })

// assert.strictEqual(sistema.obtenerDeuda(usuario1.id), 1000)
//  //assert.strictEqual(sistema.obtenerDeuda(usuario2.id), 0)

// sistema.cargarGasto({
//     idViaje: viaje.id,
//     monto: 1000,
//     descripcion: faker.commerce.productName(),
//     participantes: [usuario1.id, usuario2.id ]

// })


// assert.strictEqual(sistema.verDeuda(usuario1.id), 1500)
// assert.strictEqual(sistema.obtenerDeuda(usuario2.id), 500)


// for (const idUsuario in sistema.usuarios){
     console.log(sistema.usuarios)

//     // if (Object.hasOwnProperty.call(object, idUsuario)) {
//     //     const element = object[idUsuario]
//     // }
// }
