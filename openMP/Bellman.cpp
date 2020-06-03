/*
-----------------ALGORITMO Bellman Ford -------------------------
                Paralelización en C++
-----------------------------------------------------------------
Para el algoritmo Bellman se puede implementar una paralelizacion
parcial, ya que al ser un algoritmo que basicamente utiliza 
programación dinámica, depende de lo que haya en la estructura
en cada iteración, sin embargo aun es posible paralelizar la
inicializacion del grafo. Además se puede paralelizar por hilo
el recorrido que se hace de cada nodo hacia todos los demas, puesto
que al momento de comparar solo importa si es mayor o menor al peso
actual en la matriz del respectivo nodo y destino.
Las mejoras pueden ser mas significativas si se aumenta la cantidad
de nodos y aristas en el grafo, si son pocas la mejor opcion será
la programacion secuencial
-----------------------------------------------------------------
*/
#include <bits/stdc++.h> 
#include <omp.h>
#include <unistd.h>
#include<time.h> 
#include<stdio.h>
#include <stdlib.h> 

/* Estructura de Arista*/
struct Edge { 
	int src, dest, weight; 
}; 

/* Estructura de Grafo*/
struct Graph { 
	//Numero de vertices V y numero de aristas E
	int V, E; 

	/* Estructura de Arista*/
	struct Edge* edge; 
}; 

    /* Funcion de estructura que crea el grafo
    * @param V: nodos
    * @param E: aristas
    */ 
struct Graph* createGraph(int V, int E) 
{ 
	struct Graph* graph = new Graph; 
	graph->V = V; 
	graph->E = E; 
	graph->edge = new Edge[E]; 
	return graph; 
} 

    /* Función dque imprime el resultado
    * @param dist: Matriz con pesos
    * @param n: numero de nodos
    */ 
void printArr(int dist[], int n) 
{ 
	printf("Vertex Distance from Source\n"); 
	for (int i = 0; i < n; ++i) 
		printf("%d \t\t %d\n", i, dist[i]); 
} 

    /* Función de algoritmo Bellman-Ford implementada en C++
    * @param graph: Grafo que se analizara
    * @param src: Nodo inicial
    */
void BellmanFord(struct Graph* graph, int src) 
{ 
	int V = graph->V; 
	int E = graph->E; 
	int dist[V]; 
    clock_t start=clock();
	// Se paraleliza el llenado de la matriz
    #pragma omp parallel for 
	for (int i = 0; i < V; i++) 
		dist[i] = INT_MAX; 
	dist[src] = 0; 

	// Se paraleliza la busqueda de los caminos por cada nodo
    #pragma omp parallel
    {
	for (int i = 1; i <= V - 1; i++) { 
		for (int j = 0; j < E; j++) { 
			int u = graph->edge[j].src; 
			int v = graph->edge[j].dest; 
			int weight = graph->edge[j].weight; 
			if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) 
				dist[v] = dist[u] + weight; 
		} 
	} 
    }

	// Se paraleliza la ultima iteracion para el chequeo deciclos negativos dentro del grafo
    #pragma omp parallel
    {
	for (int i = 0; i < E; i++) { 
		int u = graph->edge[i].src; 
		int v = graph->edge[i].dest; 
		int weight = graph->edge[i].weight; 
		if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) { 
			printf("Graph contains negative weight cycle"); 
			 // If negative cycle is detected, simply return 
		} 
	} 
    }

	printArr(dist, V);
    //printf("Tiempo de ejecucion %f\n",((double)clock()-start)); Prueba tiempos de ejecucion

	return; 
} 

// Driver program to test above functions 
int main() 
{ 
	/* Let us create the graph given in above example */
	int V = 5; // Number of vertices in graph 
	int E = 8; // Number of edges in graph 
	struct Graph* graph = createGraph(V, E); 

	// add edge 0-1 (or A-B in above figure) 
	graph->edge[0].src = 0; 
	graph->edge[0].dest = 1; 
	graph->edge[0].weight = -1; 

	// add edge 0-2 (or A-C in above figure) 
	graph->edge[1].src = 0; 
	graph->edge[1].dest = 2; 
	graph->edge[1].weight = 4; 

	// add edge 1-2 (or B-C in above figure) 
	graph->edge[2].src = 1; 
	graph->edge[2].dest = 2; 
	graph->edge[2].weight = 3; 

	// add edge 1-3 (or B-D in above figure) 
	graph->edge[3].src = 1; 
	graph->edge[3].dest = 3; 
	graph->edge[3].weight = 2; 

	// add edge 1-4 (or A-E in above figure) 
	graph->edge[4].src = 1; 
	graph->edge[4].dest = 4; 
	graph->edge[4].weight = 2; 

	// add edge 3-2 (or D-C in above figure) 
	graph->edge[5].src = 3; 
	graph->edge[5].dest = 2; 
	graph->edge[5].weight = 5; 

	// add edge 3-1 (or D-B in above figure) 
	graph->edge[6].src = 3; 
	graph->edge[6].dest = 1; 
	graph->edge[6].weight = 1; 

	// add edge 4-3 (or E-D in above figure) 
	graph->edge[7].src = 4; 
	graph->edge[7].dest = 3; 
	graph->edge[7].weight = -3; 

	BellmanFord(graph, 0); 

	return 0; 
} 
