## INGENIERÍA DEL CONOCIMIENTO

La proyecto está hecho sólo con ficheros estáticos: HTML, CSS y Javascript en parte cliente (con librerías como JQuery, Three ...).
En el siguiente enlace se localiza el proyecto:

### https://zrekoj.github.io/A-search-algorithm/

# Práctica 1: Implementación del Algoritmo A*

1.- Preliminares

Se trata de implementar una versión reducida del algoritmo A*. Se toma como referencia el tutorial
propuesto por Paul Premakumar en Matlab Central. Se incluye como material para la práctica el conjunto de
programas que constituyen la demo propuesta por dicho autor.

El objetivo consiste en simular la navegación de un vehículo (terrestre, aéreo o marítimo) en un espacio
determinado hacia la consecución de un objetivo (target).

2.- Planteamiento y restricciones

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
Consideremos la figura mostrada, en la que la posición de inicio es (1,1). El único nodo sucesor en este
caso es (1,2), no existe otra posibilidad de elección. Esto ocurre hasta que el vehículo alcanza la posición
(2,5).

Llegados a la posición (2,5), existen dos posibles sucesores de (2,5), que son (3,4) y (3,5). Evaluemos las
funciones f(n) para cada uno de ellos suponiendo que las dimensiones de los cuadrados son 1x1.

```
a) Nodo (3,4):
g(n) = dist((1,1),(1,2)) + dist((1,2),(1,3)) + dist((1,3),(1,4)) + dist((1,4),(2,5)) + dist((2,5),(3,4)) =
1 + 1 + 1 + 1.41 + 1.41= 5.
h(n) = dist((3,4),(5,2)) = sqrt((5-3)^2+(2-4) ^2) = sqrt(8) = 2.
f(n) = 5.82 + 2.82 = 8.
```

```
b) Nodo (3,5):
g(n) = dist((1,1),(1,2)) + dist((1,2),(1,3)) + dist((1,3),(1,4)) + dist((1,4),(2,5)) + dist((2,5),(3,5)) =
1 + 1 + 1 + 1.41 + 1= 5.
h(n) = dist((3,5),(5,2)) = sqrt((5-3)^2+( 2 - 5 ) ^2) = sqrt( 13 ) = 3.
f(n) = 5.41 + 3.61 = 9. 02
```
En el caso anterior, el nodo elegido sería el (3,4) como el sucesor del (2,4)

3.- Algoritmo A* simplificado

```
Se pretende implementar una versión simplificada como sigue:
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
1 2 3 4 5
```
```
1
```
```
2
```
```
3
```
```
4
```
```
5
```

4.- Aplicaciones

```
Vehículo caminando por un terreno, avión volando de un punto a otro.
```
5 .- Posibilidades de ampliación y mejora de la práctica

```
a) Realizar un recorrido por distintas posiciones predeterminadas denominadas “way points”
```
```
b) Incluir un mapa del terreno con información de situaciones del terreno con diferentes alturas para
simular celdas inaccesibles.
```
```
c) Suponer que una vez planificada la ruta, surge una situación imprevista, que necesita
replanificación de la ruta (por ejemplo una tormenta en el vuelo de un avión).
```
```
d) Suponer que determinadas celdas son relativamente peligrosas, pero que pueden atravesarse
asumiendo un cierto riesgo. En este caso es necesario introducir un factor de corrección en la
función de evaluación heurística.
```
```
e) Contemplar la posibilidad de varios vehículos en colaboración, en los que si una celda ha sido ya
ocupada por uno quede prohibida para otro evitando colisiones. El problema de las colisiones
incluye mayor complejidad que lo aquí expresado con multitud de casos a considerar.
```
6.- Entregables

```
Se entregará una memoria de la práctica consistente en:
```
```
a) Describir el sistema mediante una tarea de Planificación según la metodología
CommonKADS. Se tendrá en cuenta que al tratarse de una simulación no se considerarán los
requisitos “hard” que estarían relacionados con el tipo de vehículo y sus características
técnicas. En cuanto a requisitos “soft” se pueden contemplar algunos tales como: “sistema
rápido”, “sistema robusto”, etc.
```
```
b) Describir los detalles de implementación propios, tales como: lenguaje utilizado,
procedimiento seguido para su implementación, ampliaciones realizadas y todos aquellos
elementos considerados de interés.
```
```
c) Código ejecutable
```
```
d) Breve manual de usuario para poder ejecutar la práctica.
```
