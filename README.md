Persistent PRNG
===============

Persistent Pseudorandom Number Generator. Internally it uses [CMWC4096 alogrithm
by George Marsaglia](https://en.wikipedia.org/wiki/Multiply-with-carry). This
algorithm gives good statistical results and quite performant. 

This library implements persistent PRNG which means it doesn't mutate internal 
state, it just returns new state. So it's perfectlly ok to use for example 
in [Redux reducers](http://redux.js.org/docs/basics/Reducers.html).

new( seed: number )
-------------------

Create new PRNG instance. Initialization procedure is based on [LCG](
https://en.wikipedia.org/wiki/Linear_congruential_generator) and is borrowed
from [libtcod](http://roguecentral.org/doryen/libtcod/) sources.

value: number
-------------

Returns current pseudorandom number from stored table. Value itself is 
unsigned 32bit integer.

random( min: number = 0.0, max: number = 1.0 ): number
------------------------------------------------------

Returns current pseudorandom number which uniformly distributed in [min,max).
By default min = 0 and max = 1, which mimics `Math.random()`. Note that the
number has only 32-bit precision. If `min >= max` returns `min`.

random64( min: number = 0.0, max: number = 1.0 ): number
------------------------------------------------------

Same as `random` but uses 2 numbers to form 64-bit precision float. Uses current
and previous pseudorandom value, so don't forget to do `next()` twice before
use this function.

next(): Prng
------------

Generates next pseudorandom number for use by `value` or `random`. Returns
new generator.

Performance
===========

Naive benchmarking gave me on Node 7.9.0 on MacOSX x2.5-x3 perfomance drop
compared to native `Math.random`.



