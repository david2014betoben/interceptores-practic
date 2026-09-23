2. Timeout: cuando se dispara el 408, ¿el setTimeout de 4.5 s del servicio se cancela de verdad, o solo dejamos de esperarlo? ¿Qué implicaría eso con una consulta real a una base de datos?

R.- en este caso el TimeoutInterceptor tiene un limite de 3 seg, mientras que el generateHeavyReport() tarda aprox 4.5 seg. cuando pasan los 3 seg, nos da el 408, pero el setTimeout de 4.5 seg no se cancela realmente, simplemente ya no esperamos su resultado.
