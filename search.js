const axios = require('axios');
var randomNumbers = []; //usaremos para tener los inputs automaticos
var datosCache = []; //aca almacenamos los tiempos con cache para los graficos
var datosSinCache = []; //aca almacenamos los tiempos sin cache para los graficos

/* LRU */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.head = null;
        this.tail = null;
        this.cache = new Map();
    }

    get(key1, key2) {
        const key = key1 + '|' + key2;
        const node = this.cache.get(key);
        if (!node) {
            return null;
        }
        this.moveToHead(node);
        return node.value;
    }

    put(key1, key2, value) {
        const key = key1 + '|' + key2;
        let node = this.cache.get(key);

        if (!node) {
            node = { key1, key2, value, prev: null, next: null };
            this.cache.set(key, node);
            this.addToHead(node);
            this.size++;
            if (this.size > this.capacity) {
                this.removeTail();
                this.size--;
            }
        } else {
            node.value = value;
            this.moveToHead(node);
        }
    }

    addToHead(node) {
        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
    }

    removeNode(node) {
        if (node === this.head) {
            this.head = node.next;
        } else if (node === this.tail) {
            this.tail = node.prev;
        } else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
    }

    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }

    removeTail() {
        const oldTail = this.tail;
        this.removeNode(oldTail);
        this.cache.delete(oldTail.key1 + '|' + oldTail.key2);
    }
}
const cache = new LRUCache(50);
/* generamos el random para los inputs */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Genera 1000 números aleatorios */
async function get1000inputs() {
    for (let i = 0; i < 1000; i++) {
        randomNumbers.push(getRandomIntInclusive(1, 6));
    }
}

/* Obtención de información del item */

async function getDataSinCache() {
    try {
        const url = 'http://acnhapi.com/v1/';
        var category;
        var find;
        get1000inputs();
        for (var i = 0; i < randomNumbers.length; i++) {
            if (randomNumbers[i] === "1") {
                category = 'fish/';
                find = getRandomIntInclusive(1, 79);
            } else if (randomNumbers[i] == '2') {
                category = 'sea/';
                find = getRandomIntInclusive(1, 40);
            } else if (randomNumbers[i] == '3') {
                category = 'bugs/';
                find = getRandomIntInclusive(1, 80);
            } else if (randomNumbers[i] == '4') {
                category = 'villagers/';
                find = getRandomIntInclusive(1, 391);
            } else if (randomNumbers[i] == '5') {
                category = 'songs/';
                find = getRandomIntInclusive(1, 95);
            } else if (randomNumbers[i] == '6') {
                category = 'art/';
                find = getRandomIntInclusive(1, 43);
            }
            let startTime = performance.now();
            let response = await axios.get(url + category + find);
            let endTime = performance.now();
            let executionTime = endTime - startTime;
            datosSinCache.push(executionTime);
            console.log(executionTime);
        }
       
    } catch (error) {
        console.log(error);
    }
}

async function getDataConCache() {
    try {
        const url = 'http://acnhapi.com/v1/';
        var category;
        var find;
        get1000inputs();
        for (var i = 0; i < randomNumbers.length; i++) {
            if (randomNumbers[i] === "1") {
                category = 'fish/';
                find = getRandomIntInclusive(1, 79);
            } else if (randomNumbers[i] == '2') {
                category = 'sea/';
                find = getRandomIntInclusive(1, 40);
            } else if (randomNumbers[i] == '3') {
                category = 'bugs/';
                find = getRandomIntInclusive(1, 80);
            } else if (randomNumbers[i] == '4') {
                category = 'villagers/';
                find = getRandomIntInclusive(1, 391);
            } else if (randomNumbers[i] == '5') {
                category = 'songs/';
                find = getRandomIntInclusive(1, 95);
            } else if (randomNumbers[i] == '6') {
                category = 'art/';
                find = getRandomIntInclusive(1, 43);
            }
            let startTime = performance.now();
            if (cache.get(randomNumbers[i], find) == null) {
                let response = await axios.get(url + category + find);
                cache.put(randomNumbers[i], find, response)
            } else {
                cache.get(randomNumbers[i], find)
            }

            let endTime = performance.now();
            let executionTime = endTime - startTime;
            datosCache.push(executionTime);
            console.log(executionTime);
        }
        
    } catch (error) {
        console.log(error);
    }
}

getDataConCache();
getDataSinCache();