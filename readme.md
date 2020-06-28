# NEO-CLI


## what and why
This is a demonstration of [FLP (functional light programming)](https://github.com/getify/Functional-Light-JS) coined by [Kyle Simpson](https://twitter.com/getify) paired with the pattern [Functional Core, Imperative Shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell) coined by [Gary Bernhardt](https://twitter.com/garybernhardt). This can be a good approach to developing software in a number of different cases. Forexample when developing (micro)services in distributed systems or components in domain partitioned architectures (like the modular monolith).


NEO-CLI is a small CLI application consuming the [Asteroids - NeoWs API from NASA](https://api.nasa.gov/). 
Built with [Deno](https://deno.land/) and typescript.  
The only dependency in this application is the [Deno std library](https://deno.land/std).

## structure
the entrypoint is mod.ts which only runs the cli app  

**shell/** this is our imperative shell, this is where we deal with side-effects (i.e Network IO, Database calls etc)  
**core/**  this is our FLP code where we only have pure functions and immutable data etc...  

Read more about this setup here (*link to blog post coming soon*)

## run
First you need to install [Deno](https://deno.land/) then you can do one of the following:  

* clone this repository and run:  
``` deno run --allow-env --allow-net --allow-read --allow-write mod.ts --between-dates 2020-08-01 2020-08-01 ```  
(Perhaps create a start script)  
* With Deno you can also execute remote scripts, to do that run:  
``` left to do ```   
(Also checkout the Deno install functionality)  

## test
run tests with ```deno test```