## Algoritmo A*

La proyecto está hecho sólo con ficheros estáticos: HTML, CSS y Javascript en parte cliente (con librerías como JQuery, Three ...).

1. Planteamiento y restricciones

    1. El espacio de navegación se plantea como una cuadrícula de dimensión MxN, cuyas celdas son los nodos.
    2. Dicha cuadrícula tendrá nodos inalcanzables, por diferentes motivos: inaccesibles, peligrosos, etc.
    3. Se parte de un punto inicial y se debe tratar de llegar al objetivo por la ruta óptima obtenida por el algoritmo A*.
    4. Las celdas marcadas con el aspa roja son prohibidas, lo que significa que las mismas no formarán parte del proceso de expansión de los nodos.
    5. Las celdas se pueden atravesar en vertical, horizontal y diagonal.
    6. A* utiliza como función de evaluación f(n) = h(n) + g(n); donde h(n) es la distancia (coste) al nodo n (actual) y g(n) es la distancia (coste) al nodo meta.
    7. Selección del nodo sucesor de uno dado: se elige el de menor coste total f(n).
    8. Cálculo de las distancias: la distancia entre dos nodos se determina calculando la distancia en línea recta entre dos nodos. Esto podría no ser totalmente correcto debido a que existen obstáculos que deben ser rodeados. No obstante está demostrado que el algoritmo nunca sobreestima la distancia actual y por tanto la propiedad de admisibilidad del algoritmo se mantiene.
    9. Si se tiene idea de la posición del objetivo, determinadas expansiones pueden evitarse. Por ejemplo si el objetivo está a la derecha del nodo inicial, los nodos situados a la izquierda de éste pueden obviarse.

2. Algoritmo A*

    1. Colocar el nodo de comienzo en la lista ABIERTA y calcular la función de coste f(n), siendo ahora g(n) = 0 y h(n) la distancia entre la posición actual y la meta.
    2. Los obstáculos se incluyen directamente en la lista CERRADA.
    3. Eliminar de la lista ABIERTA el nodo con la función de coste de mínimo valor y colocarla en CERRADA. Este es el nodo n. Si se produce empate entre dos nodos elegir uno de ellos aleatoriamente. Si uno de los nodos en ABIERTA es el nodo meta, entonces seleccionarlo, recuperar los punteros de los antecesores y generar la solución. Actualizar el coste para alcanzar el nodo padre con el fin de poder calcular posteriormente la nueva función de coste h(n). En caso contrario continuar en el punto 4.
    4. Determinar todos los nodos sucesores de n y calcular la función de coste para cada sucesor que NO está en la lista CERRADA.
    5. Asociar con cada sucesor que NO está ni en ABIERTA ni CERRADA el coste calculado, f(n), y poner esos sucesores en la lista ABIERTA. Asignar punteros a n (n es el nodo padre).
    6. Con cualquiera de los sucesores que ya estaban en ABIERTA calcular el menor coste de entre el que ya tenía y el recién calculado: min(nuevo f(n), viejo f(n)).
    7. Ir al paso 3

3. Funcionamiento

    1 La página consta de cuatro zonas

    ![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/initpage.PNG)

    2 La cabecera: Contiene pestañas que saltan a otras páginas, donde la pestaña Documentación se especifica las herramientas y páginas usadas para el proyecto.
    3 La zona de los iconos, se selecciona y mediante botón izquierdo se asigna sobre el mapa:
        
        * None: Para quitar iconos sobre el mapa.
        * Bloques: Para establecer bloqueos dentro del mapa.
        * Avatar: Son los inicios del recorrido, se pueden poner varios.
        * Banderas: Son los finales del recorrido, los avatares recorrerán por las banderas según el orden que se puso.
        * Advertencias: Son bloques donde se le suma un coste al pasar por ella, por lo que si se puede evitar se evitarán.

    ![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/iconbar.PNG)

    4 La zona de configuraciones, para ver más configuraciones hay que arrastrar con el ratón:
        
        * Altura: Altura del mapa.
        * Anchura: Anchura del mapa.
        * Reset: Limpieza de objetos sobre el mapa.
        * Vista: Cambio de vista del mapa, hay perspectiva y aérea.
        * Ejecutar: Calcula los recorridos y después se simula la ejecución.
        * Zoom: Mediante el scroll del ratón, se puede hacer zoom in y zoom out, el valor especifica la relación del zoom a realizar.
        * Desplazamiento: Mediante las teclas de flechas o botón derecho del ratón, el valor especifica la relación del desplazamiento.
        * Velocidad: Velocidad de la simulación del recorrido.
        * Peligro: Es el coste asociado al icono de advertencia.
        * Seleccionar archivo: Cargar el fichero con mapa (por la capacidad que tiene un navegador, reducir el tamaño de la imagen a menor de 100px).

    ![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/toolbar.PNG)

    5 La mapa: Se dibuja el plano el cual se realiza el algoritmo:
        
        * Cubos rojos: Son los bloqueos sobre los recorridos
        * Cubos verdes: Son los inicios de los recorridos
        * Cubos blancos: Son los finales de los recorridos
        * Cubos amarillos: Son los bloques el cual si se pasan sobre ellas hay un coste extra.
        * Círculos: Son los recorridos
        
    ![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/samplemap.PNG)

    6 Ejemplo de una ejecución:

    ![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/executionmap.PNG)



