## Algoritmo A*

La proyecto está hecho sólo con ficheros estáticos: HTML, CSS y Javascript en parte cliente (con librerías como JQuery, Three ...).

1.- Planteamiento y restricciones

```
a) El espacio de navegación se plantea como una cuadrícula de dimensión MxN, cuyas celdas son los
nodos.
b) Dicha cuadrícula tendrá nodos inalcanzables, por diferentes motivos: inaccesibles, peligrosos, etc.
c) Se parte de un punto inicial y se debe tratar de llegar al objetivo por la ruta óptima obtenida por el
algoritmo A*.
d) Las celdas marcadas con el aspa roja son prohibidas, lo que significa que las mismas no formarán
parte del proceso de expansión de los nodos.
e) Las celdas se pueden atravesar en vertical, horizontal y diagonal.
f) A* utiliza como función de evaluación f(n) = h(n) + g(n); donde h(n) es la distancia (coste) al nodo n
(actual) y g(n) es la distancia (coste) al nodo meta.
g) Selección del nodo sucesor de uno dado: se elige el de menor coste total f(n).
h) Cálculo de las distancias: la distancia entre dos nodos se determina calculando la distancia en línea
recta entre dos nodos. Esto podría no ser totalmente correcto debido a que existen obstáculos que
deben ser rodeados. No obstante está demostrado que el algoritmo nunca sobreestima la distancia
actual y por tanto la propiedad de admisibilidad del algoritmo se mantiene.
i) Si se tiene idea de la posición del objetivo, determinadas expansiones pueden evitarse. Por ejemplo si
el objetivo está a la derecha del nodo inicial, los nodos situados a la izquierda de éste pueden
obviarse.
```

2.- Algoritmo A*

```
1. Colocar el nodo de comienzo en la lista ABIERTA y calcular la función de coste f(n), siendo ahora
    g(n) = 0 y h(n) la distancia entre la posición actual y la meta.
2. Los obstáculos se incluyen directamente en la lista CERRADA.
3. Eliminar de la lista ABIERTA el nodo con la función de coste de mínimo valor y colocarla en
    CERRADA. Este es el nodo n. Si se produce empate entre dos nodos elegir uno de ellos
    aleatoriamente. Si uno de los nodos en ABIERTA es el nodo meta, entonces seleccionarlo, recuperar
    los punteros de los antecesores y generar la solución. Actualizar el coste para alcanzar el nodo padre
    con el fin de poder calcular posteriormente la nueva función de coste h(n). En caso contrario
    continuar en el punto 4.
4. Determinar todos los nodos sucesores de n y calcular la función de coste para cada sucesor que NO
    está en la lista CERRADA.
5. Asociar con cada sucesor que NO está ni en ABIERTA ni CERRADA el coste calculado, f(n), y
    poner esos sucesores en la lista ABIERTA. Asignar punteros a n (n es el nodo padre).
6. Con cualquiera de los sucesores que ya estaban en ABIERTA calcular el menor coste de entre el que
    ya tenía y el recién calculado: min(nuevo f(n), viejo f(n)).
7. Ir al paso 3
```

3.- Funcionamiento

1. La página consta de cuatro zonas

![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/initpage.PNG)

- La cabecera: Contiene pestañas que saltan a otras páginas, donde la pestaña Documentación se especifica las herramientas y páginas usadas para el proyecto.

- La zona de los iconos

![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/iconbar.PNG)

- La zona de configuraciones, para ver más configuraciones hay que arrastrar con el ratón

![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/toolbar.PNG)

- La mapa: Se dibuja el plano el cual se realiza el algoritmo, existen dos perspectivas de vista.

![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/samplemap.PNG)

![alt text](https://zrekoj.github.io/A-search-algorithm/resources/readme/execution.PNG)



