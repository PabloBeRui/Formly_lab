import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * ?Servicio de datos simulado para opciones de select en Formly.
 * Este servicio actúa como nuestro "Backend" simulado.
 * En Formly, las opciones de un select pueden ser un Array [] o un Observable $.
 * Usar un servicio permite centralizar las llamadas a API y gestionar
 * el flujo de datos de forma asíncrona.
 */

@Injectable({
  providedIn: 'root',
})
export class Data {
  /**
   * @method getCountries
   * @description Simula una llamada a API que devuelve una lista de países.
   * Usa 'of()' para convertir un array en un Observable y 'delay()' para
   * simular la espera de red (latencia).
   */

  getCountries(): Observable<any> {
    const countries = [
      { label: 'España', value: 'es' },
      { label: 'México', value: 'mx' },
      { label: 'Argentina', value: 'ar' },
    ];

    // Simulamos que el servidor tarda 1.5 segundos en responder
    return of(countries).pipe(delay(1000));
  }

  /**
   * @method getProvinces
   * @param countryId - El código del país para filtrar los resultados.
   * @description Este es el motor de los "Selects Dependientes".
   * Solo devuelve las provincias que pertenecen al país seleccionado.
   */
  getProvinces(countryId: string): Observable<any[]> {
    const allProvinces: any = {
      es: [
        { label: 'Madrid', value: 'md' },
        { label: 'Barcelona', value: 'bc' },
      ],
      mx: [
        { label: 'CDMX', value: 'cdmx' },
        { label: 'Jalisco', value: 'jal' },
      ],
      ar: [
        { label: 'Buenos Aires', value: 'ba' },
        { label: 'Córdoba', value: 'cor' },
      ],
    };

    const provinces = allProvinces[countryId] || [];
    return of(provinces).pipe(delay(1000));
  }

  //? Usado en field de username para validar si el nombre de usuario ya está en uso.
  /**
   * Simula una consulta a la base de datos para verificar disponibilidad.
   * @param username Nombre a buscar.
   * @returns Observable que emite null si está libre o un objeto de error si está ocupado.
   */

  checkUsername(username: string): Observable<any> {
    const takeUsernames = ['admin', 'user', 'test'];
    const isTaken = takeUsernames.includes(username.toLowerCase());

    // Simula latencia
    return of(isTaken ? { usernameTaken: true } : null).pipe(delay(1000));

    //si fuese un servicio exclusivo para formly
    // return of(!isTaken)
  }


  //?field company_id

  /**
   * Verifica si un CIF está en la lista negra del sistema.
   * @param cif Código de identificación fiscal a validar.
   * @returns Observable que emite null si no existe o un objeto de error si ya está registrado.
   */

  checkBlackLIstCIF(cif: string): Observable<any> {
    const blackListCIFs = ['A123', 'B123', 'C123'];
    const isBlacklisted = blackListCIFs.includes(cif.toUpperCase());

    // Simula latencia
   return of(isBlacklisted ? { cifBlacklist: true } : null).pipe(delay(1000));
  }

  /**
   * Verifica si un CIF ya existe en el sistema para evitar duplicados.
   * @param cif Código de identificación fiscal a validar.
   * @returns Observable que emite null si no existe o un objeto de error si ya está registrado.
   */

  checkRegisteredCIF(cif: string): Observable<any> {
    const registeredCIFs = ['D123', 'E123', 'F123'];
    const isRegistered = registeredCIFs.includes(cif.toUpperCase());

    // Simula latencia
    return of(isRegistered ? { cifUnique: true } : null).pipe(delay(1000));
  }
}




//? Formly es "Async-Aware"
// Cuando asignamos un Observable directamente a la propiedad options de un campo, Formly utiliza internamente el Pipe Async o una lógica equivalente. Esto significa que Formly:

// *Se suscribe automáticamente cuando el campo se inicializa.

//* Se desuscribe automáticamente cuando el campo se destruye o el formulario se desmonta.

// 2. Observables de una sola emisión (of, http.get)
// La mayoría de las llamadas a servicios (como las de este DataService que usan of()) emiten un valor y luego envían una señal de "Complete".

// Una vez que un flujo se completa, la suscripción se cierra sola.

// Incluso si el flujo fuera infinito, Formly corta al destruir el componente.

// 3. Ventajas de este patrón
// Código más limpio: No es encesario llenar componente de Subject, takeUntil, ni lógica de ciclo de vida extra.

// Seguridad: Elimina el riesgo de dejar suscripciones abiertas que consuman RAM o causen comportamientos erráticos en segundo plano.

//? Regla de oro: Siempre que puedas, pasa el Observable directamente a Formly y deja que la librería gestione el ciclo de vida. Solo usa .subscribe() manual si necesitas realizar una lógica de negocio compleja fuera del formulario.



//* Aunque técnicamente Formly lo acabará convirtiendo a booleano, mantener el objeto { clave: valor } te permite:

// Seguir los estándares oficiales de Angular.

// Poder reutilizar ese mismo servicio en otros formularios que no usen Formly (donde quizás sí necesites saber exactamente qué error ocurrió).

// Claridad: En el código, null siempre grita "Sin errores", mientras que cualquier otra cosa grita "¡Problema!".
