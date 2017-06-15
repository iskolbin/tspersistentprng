export interface DataNative {
	kind: 'Native'
	Qc: number[]
	i: number
}

export interface DataUint32 {
	kind: 'Uint32'
	Qc: Uint32Array
	i: number
}

export type Data = DataNative | DataUint32

export function make( seed: number = 42, uint32 = false ): Data {
	const kind = uint32 ? 'Uint32' : 'Native'
	let newData: Data
	if ( kind === 'Native' ) {
		newData = { kind, Qc: new Array<number>( 4097 ), i: 0 }
	} else {
		newData = { kind, Qc: new Uint32Array( 4097 ), i: 0 }
	}
	const Qc = newData.Qc
	Qc[4096] = seed
	for ( let i = 0; i < 4096; i++ ) {
		Qc[4096] *= 129749
		Qc[4096] %= 0x100000000
		Qc[4096] *= 8505
		Qc[4096] += 12345
		Qc[4096] %= 0x100000000
		Qc[i] = Qc[4096]
	}
	Qc[4096] *= 129749
	Qc[4096] %= 0x100000000
	Qc[4096] *= 8505
	Qc[4096] += 12345
	Qc[4096] %= 0x100000000
	Qc[4096] %= 809430660
	return newData
}

export function srand( data: Data ): Data {
	const {kind} = data
	let newData: Data
	if ( kind === 'Native' ) {
		newData = { kind, Qc: new Array<number>( 4097 ), i: 0 }
	} else {
		newData = { kind, Qc: new Uint32Array( 4097 ), i: 0 }
	}
	const Qc = newData.Qc
	const prevQc = data.Qc
	let c = prevQc[4096]
	for ( let i = 0; i < 4096; i++ ) {
		let t = 18782 * prevQc[i] + c
		c = (t / 4294967296) | 0
		let x = (t + c) % 0x100000000
		if ( x < c ) {
			x++
			c++
		}
		if( x === 0xffffffff ) {
			c++
			x = 0
		}
		Qc[i] = 0xfffffffe - x
		if ( Qc[i] < 0 ) {
			Qc[i] += 0x100000000
		}
	}
	Qc[4096] = c
	return newData
}

export function rand( data: Data ): number {
	return data.Qc[data.i]
}

export function random( data: Data, min: number = 0.0, max: number = 1.0 ): number {
	if ( min >= max ) {
		return min
	} else {
		return min + (max - min) * (rand( data ) / 4294967296.0)
	}
}

export function random64( data: Data, min: number = 0.0, max: number = 1.0 ): number {
	if ( min > max ) {
		return min
	} else {
		const a = Math.floor(rand(data) / 32)
		const b = Math.floor((data.Qc[(data.i === 0) ? 4095 : data.i-1]) / 64)
		return min + (a * 67108864.0 + b) * (max - min) / 9007199254740992.0
	}
}

export function next( data: Data ): Data {
	const {i} = data
	if ( i < 4095 ) {
		return { ...data, i: i+1 }
	} else {
		return srand( data )
	}
}

export class Prng {
	data: Data

	constructor( seed: number = 42, uint32 = true ) {
		this.data = srand( make( seed, uint32 ))
	}

	rand() {
		return rand( this.data )
	}

	random( min: number = 0.0, max: number = 1.0 ): number {
		return random( this.data, min, max )
	}

	random64( min: number = 0.0, max: number = 1.0 ): number {
		return random64( this.data, min, max )
	}

	next(): Prng {
		const result = Object.create( Object.getPrototypeOf( this ))
		result.data = next( this.data )
		return result
	}
}
