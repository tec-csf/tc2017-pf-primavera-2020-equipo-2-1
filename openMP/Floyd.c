/* 
-----------------ALGORITMO FloydWarshall -------------------------
                Paralelización en C
-----------------------------------------------------------------
A continuacion se plantea una posible solución utilizando 
programacion paralela para ejecutar el algoritmo de floydWarshall
Debido a que una iteración es dependiente de la anterior en el 
mayor de los casos, la opción parallel for no mejora en todos los 
casos el algoritmo. Teniendo en cuenta que cada hilo debe esperar
 al anterior para poder iniciar.
 -----------------------------------------------------------------
*/

#include <omp.h>
#include <unistd.h>
#include<time.h> 
#include<stdio.h>
#include <stdlib.h> 


//NUmero de vertices
#define V 1000

#define INF 99999 

// Imprime la solucion 
void printSolution(int dist[][V]); 

/**
 *@ graph: Matriz de adyacencia del grafo a analizar
*/
void floydWarshall (int graph[][V]) 
{ 

	int dist[V][V], i, j, k; 

	/* Copia la matriz de adyacencia a la de nuevas soluciones */
	#pragma omp parallel for
	for (i = 0; i < V; i++) 
		for (j = 0; j < V; j++) 
			dist[i][j] = graph[i][j]; 

	int tid;
	clock_t start=clock();
	for (k = 0; k < V; k++) 
	{ 
		#pragma omp parallel for 
			for (i = 0; i < V; i++) 
			{ 
				//tid=omp_get_thread_num(); VERIFICAR PARALELISMO
				 //printf("Soy el hilo = %d\n", tid); 
				for (j = 0; j < V; j++) 
				{ 
					// Define si el nodo intermedio mejora el peso actual en la matriz  
					if (dist[i][k] + dist[k][j] < dist[i][j]) 
						dist[i][j] = dist[i][k] + dist[k][j]; 
				} 
			} 
		
	} 
	
	//printSolution(dist); 
	//printf("Tiempo de ejecucion %f\n",((double)clock()-start)); Mediciones del tiempo 
} 

/* A utility function to print solution */
void printSolution(int dist[][V]) 
{ 
	printf ("Matriz de adyacencia"
			" con los pesos minimos \n"); 
	for (int i = 0; i < V; i++) 
	{ 
		for (int j = 0; j < V; j++) 
		{ 
			if (dist[i][j] == INF) 
				printf("%7s", "INF"); 
			else
				printf ("%7d", dist[i][j]); 
		} 
		printf("\n"); 
	} 
} 

int main() 
{ 
	srand(time(NULL));
	

	int graph[V][V];

	for(int i=0;i<V;i++){
		for(int j=0;j<V;j++){
			if(i==j){
			graph[i][j]=0;
			}
			else{
			graph[i][j]=rand() % 11 +1;
			}

		}
	}
	//printSolution(graph); Mostrar matriz inicial

	// Print the solution 
	floydWarshall(graph); 
	return 0; 
} 
