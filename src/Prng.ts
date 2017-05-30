export class Prng {
	protected Qc: Uint32Array
	protected i: number

	constructor( seed: number = 42, prev?: Prng ) {
		if ( prev === undefined || prev.i === 0 ) {
			const Qc = new Uint32Array( 4097 )

			if ( prev === undefined ) {
				Qc[4096] = seed
				for ( let i = 0; i < 4096; i++ ) {
					Qc[4096] *= 129749
					Qc[4096] *= 8505
					Qc[4096] += 12345
					Qc[i] = Qc[4096]
				}
				Qc[4096] *= 129749
				Qc[4096] *= 8505
				Qc[4096] += 12345
				Qc[4096] %= 809430660
			}

			const prevQc = prev === undefined ? Qc : prev.Qc
			let c = prevQc[4096]
			for ( let i = 1; i < 4096; i++ ) {
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
			}
			Qc[4096] = c
			this.Qc = Qc
			this.i = 1
		} else {
			this.Qc = prev.Qc
			this.i = (prev.i + 1) % 4096
		}
	}

	get value() {
		return this.Qc[this.i]
	}

	random( min: number = 0.0, max: number = 1.0 ): number {
		if ( min >= max ) {
			return min
		} else {
			return min + (max - min) * (this.value / 4294967296.0)
		}
	}

	random64( min: number = 0.0, max: number = 1.0 ): number {
		if ( min > max ) {
			return min
		} else {
			const a = Math.floor(this.value / 32)
			const b = Math.floor((this.Qc[(this.i === 0) ? 4095 : this.i-1]) / 64)
			return min + (a * 67108864.0 + b) * (max - min) / 9007199254740992.0
		}
	}

	next(): Prng {
		return new Prng( 0, this )
	}
}
