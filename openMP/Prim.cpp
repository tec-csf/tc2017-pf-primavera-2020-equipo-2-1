/*
----------------------- ALGORITMO de Prim -----------------------
    Paralelización en C++
-----------------------------------------------------------------
Para el algoritmo Prim la paralelización resulta posible en aquellos
ciclos en donde los procesos no dependen de un resultado anterior. 
De esta manera, los ciclos "for" en donde sus operaciones se 
pudieron realizar de manera independiente fueron paralelizados, 
tomando en cuenta sus respectivas regiones críticas. 
-----------------------------------------------------------------
*/
#include <omp.h>
#include <limits.h> 
#include <stdio.h> 

// Número de vértices en el grafo
#define V 14

//Grafo en representación de matriz de ayacencia
int graph[V][V]; 

// AGregar vértices con pesos al grafo
void addEdge(int origin, int destination, int weight) {
    graph[origin-1][destination-1] = weight; 
}

//Obtener peso mínimo para la siguiente iteración
int minDistance(int dist[], bool sptSet[]) { 
	int min = INT_MAX, min_index; 

	for (int v = 0; v < V; v++) 
		if (sptSet[v] == false && dist[v] <= min) 
			min = dist[v], min_index = v; 

	return min_index; 
} 

// Imprimir la solución por fuera de la función principal (evitar inhibision del paralelismo)
int printSolution(int dist[], int n) { 
	printf("Prim: distancia a los nodos desde el nodo padre: \n"); 
	for (int i = 0; i < V; i++) 
		printf("%d: %d\n", i+1, dist[i]); 
} 

/* Función de algoritmo Prim implementada en C++
    * @param src: nodo de origen tomado por el algoritmo
    */
void prim(int src) 
{ 
    src--; 
	int dist[V]; // Distancias mínimas actuales
	bool sptSet[V]; // Vertices que son parte del camino

    #pragma omp parallel for 
	for (int i = 0; i < V; i++) {
		dist[i] = INT_MAX, sptSet[i] = false; //Inicializar como falso el arreglo
    }
	// Distancia del nodo de origen = 1
	dist[src] = 0; 

    //For no paralelizable por que cada iteración depende de la anterior
	for (int count = 0; count < V - 1; count++) { 
		int u = minDistance(dist, sptSet); //Elegir el nodo con la distancia mímina
		sptSet[u] = true; 

        //Este for puede ser paralelizado por que los pasos son independientes
        #pragma omp parallel num_threads(4)
        {
            for (int v = 0; v < V; v++) {
                #pragma omp critical //Región critica, la lectura de los pesos acutales y su respectiva actualización
                {
                    if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && graph[u][v] < dist[v]) {
                        dist[v] = graph[u][v]; 
                    }
                }
            }
        }
	} 

	// Imprimir la solución
	printSolution(dist, V); 
} 

int main() { 
    addEdge(3, 2, 1);
    addEdge(3, 7, 2);
    addEdge(2, 8, 8);
    addEdge(2, 1, 6);
    addEdge(7, 6, 4);
    addEdge(7, 8, 3);
    addEdge(7, 14, 2);
    addEdge(8, 10, 6);
    addEdge(8, 6, 2);
    addEdge(1, 4, 7);
    addEdge(1, 5, 9);
    addEdge(6, 9, 9);
    addEdge(14, 10, 4);
    addEdge(10, 12, 7);
    addEdge(10, 11, 8);
    addEdge(5, 11, 9);
    addEdge(9, 8, 9);
    addEdge(11, 13, 2);

	prim(3); 

	return 0; 
} 