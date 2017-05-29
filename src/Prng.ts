const LAG = 1024

export class Prng {
	protected Q: Uint32Array[]
	constructor( 
		protected c: number = 2207,
		protected _value: number = 0,
		Q?: Uint32Array[],
		protected i: number = LAG - 1
	) {
		if ( Q === undefined ) {
			this.Q = new Array<Uint32Array>(32)
			for ( let i = 0; i < 32; i++ ) {
				this.Q[i] = new Uint32Array(32)
			}
		} else {
			this.Q = Q
		}
	}

	get value() {
		return this._value
	}

	random( min: number = 0.0, max: number = 1.0 ): number {
		if ( min >= max ) {
			return min
		} else {
			return min + (max - min) * (this.value / 4294967296.0)
		}
	}

	next(): Prng {
		const newI = ( this.i + 1 ) % LAG
		const t = 18782 * this.value + this.c
		let newC = t >> 32
		let x = (t + newC) % 0xffffffff
		let newValue = 0xfffffffe - x
		if ( x < newC ) {
			newValue--
			newC++
		}
		const ii = newI >> 5
		const jj = newI & 31
		const newQ = new Array<Uint32Array>( 32 )
		const oldq = this.Q[ii]
		const q = new Uint32Array( 32 )
		for ( let i = 0; i < 32; i++ ) {
			newQ[i] = this.Q[i]
			q[i] = oldq[i]
		}
		q[jj] = newValue
		newQ[ii] = q
		return new Prng( newC, newValue, newQ, newI )
	}
}
