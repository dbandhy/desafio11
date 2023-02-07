function randomCalculo(n){
    const randoms = Array.from({length : n}, () => Math.floor(Math.random()* 100000))
    const res = {}
    for (const num of randoms){
        res[num] = res[num] ? res[num]+1 : 1
    }
    return res
}
process.on('message', n => {
    const res = randomCalculo(n)
    process.send(res)
})